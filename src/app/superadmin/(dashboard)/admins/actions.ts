'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Note: This requires SUPABASE_SERVICE_ROLE_KEY in .env.local
// We use the supabase-js client directly for admin operations to bypass RLS and Auth restrictions
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

export async function createAdmin(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string

    if (!email || !password || !fullName) {
        return { error: 'Semua field harus diisi' }
    }

    try {
        // 1. Create the user in Supabase Auth
        const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto confirm email
            user_metadata: {
                full_name: fullName,
                role: 'admin' // Ensure trigger picks this up to set initial role if possible
            }
        })

        if (createError) throw createError

        if (user.user) {
            // 2. Update the profile role to 'admin' and status to 'approved'
            // Retry logic to handle race condition with DB trigger
            // The trigger might be slow to create the initial row, so we wait and retry.

            let retries = 3;
            let success = false;

            while (retries > 0 && !success) {
                // Try to update existing profile created by trigger
                const { data: updatedData, error: profileError } = await supabaseAdmin
                    .from('profiles')
                    .update({
                        full_name: fullName,
                        role: 'admin',
                        status: 'approved'
                    })
                    .eq('id', user.user.id)
                    .select(); // Select determines if a row was actually found and updated

                if (!profileError && updatedData && updatedData.length > 0) {
                    success = true;
                } else {
                    // Wait 1 second before retrying
                    console.log(`Profile update attempt failed (Row not found yet?), retrying... (${retries} left)`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    retries--;
                }
            }

            if (!success) {
                // If update fails after retries, try upserting as last resort
                console.warn('Profile update kept failing, forcing upsert.');
                const { error: upsertError } = await supabaseAdmin
                    .from('profiles')
                    .upsert({
                        id: user.user.id,
                        email: email,
                        full_name: fullName,
                        role: 'admin',
                        status: 'approved'
                    });

                if (upsertError) {
                    console.error('Failed to upsert profile for new admin:', upsertError)
                    return { error: `Gagal mengatur profil admin: ${upsertError.message}` }
                }
            }
        }

        revalidatePath('/superadmin/admins')
        return { success: true }
    } catch (error: any) {
        console.error('Create Admin Error:', error)
        return { error: error.message || 'Gagal membuat admin' }
    }
}

export async function resetAdminPassword(userId: string, formData: FormData) {
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!newPassword || !confirmPassword) {
        return { error: 'Password tidak boleh kosong' }
    }

    if (newPassword !== confirmPassword) {
        return { error: 'Password tidak cocok' }
    }

    if (newPassword.length < 6) {
        return { error: 'Password minimal 6 karakter' }
    }

    try {
        const { error } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            { password: newPassword }
        )

        if (error) throw error

        return { success: true }
    } catch (error: any) {
        console.error('Reset Password Error:', error)
        return { error: error.message || 'Gagal mereset password' }
    }
}

export async function deleteAdmin(userId: string) {
    if (!userId) {
        return { error: 'User ID tidak valid' }
    }

    try {
        // Delete user from Auth (this usually cascades to Profile if set up, but we'll trust Supabase Auth deletion)
        // If we need to manually delete profile, we can do that too, but Auth deletion is the primary action.
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

        if (error) throw error

        revalidatePath('/superadmin/admins')
        return { success: true }
    } catch (error: any) {
        console.error('Delete Admin Error:', error)
        return { error: error.message || 'Gagal menghapus admin' }
    }
}
