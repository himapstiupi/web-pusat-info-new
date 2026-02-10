"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const errorType = searchParams.get("error");
        if (errorType === "account_suspended") {
            setError("Akun Anda telah dinonaktifkan. Silakan hubungi Departemen Kominfo untuk informasi lebih lanjut.");
        } else if (errorType === "account_not_approved") {
            setError("Akun Anda belum disetujui. Harap tunggu persetujuan atau hubungi Departemen Kominfo.");
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const supabase = createClient();
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (signInError) throw signInError;

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role, status") // Fetch status
                    .eq("id", user.id)
                    .single();

                if (profile) {
                    // Check Status
                    if (profile.status === 'pending') {
                        await supabase.auth.signOut();
                        setError("Akun Anda masih menunggu persetujuan.");
                        return;
                    }
                    if (profile.status === 'rejected') {
                        await supabase.auth.signOut();
                        setError("Akun Anda telah dihapus aksesnya. Silahkan hubungi Departemen Kominfo untuk informasi lebih lanjut.");
                        return;
                    }

                    // Role based redirect
                    if (profile.role === "superadmin") {
                        router.push("/superadmin/dashboard");
                    } else if (profile.role === "admin") {
                        router.push("/admin/dashboard");
                    } else {
                        router.push("/");
                    }
                }
            }
        } catch (err: any) {
            setError(err.message || "Gagal masuk");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl border border-border-light dark:border-border-dark p-6 sm:p-8 md:p-10">
                <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center mb-4 w-20 h-20 sm:w-24 sm:h-24">
                        <img src="/hima-logo.png" alt="Logo HIMA PSTI" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-text-main dark:text-white tracking-tight">Login ke Akun</h1>
                    <p className="text-text-sub dark:text-gray-400 text-xs sm:text-sm mt-2">Masuk ke akun untuk mengelola website</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-500 text-xs sm:text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-medium text-text-main dark:text-gray-200" htmlFor="email">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-sub dark:text-gray-500">
                                <span className="material-symbols-outlined text-lg sm:text-xl">mail</span>
                            </div>
                            <input
                                autoComplete="email"
                                className="block w-full pl-10 pr-3 py-2.5 sm:py-3 text-sm border border-border-light dark:border-border-dark rounded-lg bg-white dark:bg-background-dark text-text-main dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                id="email"
                                name="email"
                                placeholder="nama@perusahaan.com"
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-medium text-text-main dark:text-gray-200" htmlFor="password">Kata Sandi</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-sub dark:text-gray-500">
                                <span className="material-symbols-outlined text-lg sm:text-xl">lock</span>
                            </div>
                            <input
                                autoComplete="current-password"
                                className="block w-full pl-10 pr-3 py-2.5 sm:py-3 text-sm border border-border-light dark:border-border-dark rounded-lg bg-white dark:bg-background-dark text-text-main dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed" type="submit" disabled={loading}>
                            {loading ? "Memuat..." : "Masuk"}
                        </button>
                    </div>
                </form>
                <div className="mt-6 sm:mt-8 text-center">
                    <p className="text-xs sm:text-sm text-text-sub dark:text-gray-400">
                        Belum punya akun? Daftar
                        <Link className="font-semibold text-primary hover:text-primary-dark transition-colors ml-1" href="/admin/register">di sini</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center overflow-hidden antialiased transition-colors duration-300 relative px-4">
            <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none" data-alt="Abstract soft blue gradient blobs for background atmosphere" style={{ backgroundImage: "radial-gradient(circle at 15% 50%, rgba(19, 91, 236, 0.15) 0%, transparent 40%), radial-gradient(circle at 85% 20%, rgba(19, 91, 236, 0.1) 0%, transparent 40%)" }}></div>
            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
