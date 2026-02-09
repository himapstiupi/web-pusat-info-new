import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
    try {
        const { supabase, response, user } = await updateSession(request);
        const url = request.nextUrl.clone();

        // Auth Routes - if logged in, redirect to dashboard
        if (url.pathname.startsWith('/admin/login') || url.pathname.startsWith('/admin/register') || url.pathname.startsWith('/superadmin/login')) {
            // Check if there is an error param (e.g. account_suspended), if so, allow access to login page
            const hasError = url.searchParams.has('error');

            if (user && !hasError) {
                // Check role to redirect correctly
                // Use maybeSingle to avoid 406/JSON errors if multiple rows (shouldn't happen but good practice)
                const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();

                if (profile?.role === 'superadmin') {
                    return NextResponse.redirect(new URL('/superadmin/dashboard', request.url));
                } else if (profile?.role === 'admin') {
                    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
                }
            }
            return response; // Allow access to login/register if not logged in OR if there is an error
        }

        // Protected Routes - Admin
        if (url.pathname.startsWith('/admin') && !url.pathname.startsWith('/admin/login') && !url.pathname.startsWith('/admin/register')) {
            if (!user) {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }

            const { data: profile } = await supabase.from('profiles').select('role, status').eq('id', user.id).maybeSingle();
            if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
                // If not admin/superadmin, redirect to home or unauthorized page
                return NextResponse.redirect(new URL('/', request.url));
            }

            if (profile.status !== 'approved') {
                // Redirect suspended/pending admins to login with error
                return NextResponse.redirect(new URL('/admin/login?error=account_suspended', request.url));
            }
        }

        // Protected Routes - Superadmin
        if (url.pathname.startsWith('/superadmin') && !url.pathname.startsWith('/superadmin/login')) {
            if (!user) {
                return NextResponse.redirect(new URL('/superadmin/login', request.url));
            }

            const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
            if (!profile || profile.role !== 'superadmin') {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url)); // Fallback for regular admins trying to access superadmin
            }
        }

        return response;
    } catch (e) {
        console.error("MIDDLEWARE ERROR:", e);
        // Return a pass-through response so the site doesn't break
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
