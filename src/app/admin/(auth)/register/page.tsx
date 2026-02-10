"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            const confirmPassword = formData.get("confirm-password") as string;
            const fullName = formData.get("fullname") as string;

            if (password !== confirmPassword) {
                throw new Error("Password tidak cocok");
            }

            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();

            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: 'admin', // Default role for standard registration
                    },
                },
            });

            if (signUpError) throw signUpError;

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Gagal mendaftar");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
                <div className="max-w-md w-full text-center space-y-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="material-symbols-outlined text-2xl sm:text-3xl">check</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-text-main dark:text-white">Pendaftaran Berhasil!</h2>
                    <p className="text-sm sm:text-base text-text-sub dark:text-gray-400">
                        Akun Anda telah dibuat dan sedang dalam proses verifikasi oleh Departemen Kominfo.
                        Silahkan coba login jika akun Anda telah disetujui.
                    </p>
                    <Link href="/admin/login" className="inline-block px-5 sm:px-6 py-2 sm:py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                        Kembali ke Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header removed for clean layout */}
            <main className="flex-grow flex flex-col items-center justify-center w-full py-8 sm:py-12 md:py-20 px-4">
                <div className="fixed inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 10% 20%, rgba(19, 91, 236, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(19, 91, 236, 0.08) 0%, transparent 40%)" }}></div>
                <div className="w-full max-w-md relative z-10">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl border border-border-light dark:border-border-dark overflow-hidden p-6 sm:p-8 md:p-10">
                        <div className="text-center mb-6 sm:mb-8">
                            <h2 className="text-xl sm:text-2xl font-bold text-text-main dark:text-white tracking-tight mb-2">Buat Akun Baru</h2>
                            <p className="text-text-sub dark:text-gray-400 text-xs sm:text-sm">Bergabunglah untuk mengakses pusat bantuan lengkap.</p>
                        </div>
                        <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-3 bg-red-50 text-red-500 text-xs sm:text-sm rounded-lg border border-red-100">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <label className="block text-xs sm:text-sm font-semibold text-text-main dark:text-gray-200" htmlFor="fullname">
                                    Nama Lengkap
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <span className="material-symbols-outlined text-lg sm:text-[20px]">person</span>
                                    </div>
                                    <input className="block w-full pl-10 pr-3 py-2.5 text-sm border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-main dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" id="fullname" name="fullname" placeholder="Contoh: Budi Santoso" required type="text" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs sm:text-sm font-semibold text-text-main dark:text-gray-200" htmlFor="email">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <span className="material-symbols-outlined text-lg sm:text-[20px]">mail</span>
                                    </div>
                                    <input className="block w-full pl-10 pr-3 py-2.5 text-sm border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-main dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" id="email" name="email" placeholder="nama@email.com" required type="email" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs sm:text-sm font-semibold text-text-main dark:text-gray-200" htmlFor="password">
                                    Kata Sandi
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <span className="material-symbols-outlined text-lg sm:text-[20px]">lock</span>
                                    </div>
                                    <input className="block w-full pl-10 pr-3 py-2.5 text-sm border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-main dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" id="password" name="password" placeholder="Minimal 8 karakter" required type="password" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs sm:text-sm font-semibold text-text-main dark:text-gray-200" htmlFor="confirm-password">
                                    Konfirmasi Kata Sandi
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <span className="material-symbols-outlined text-lg sm:text-[20px]">lock_reset</span>
                                    </div>
                                    <input className="block w-full pl-10 pr-3 py-2.5 text-sm border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-main dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" id="confirm-password" name="confirm-password" placeholder="Ulangi password anda" required type="password" />
                                </div>
                            </div>

                            <button className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 mt-2" type="submit" disabled={isLoading}>
                                {isLoading ? "Mendaftar..." : "Daftar Akun"}
                            </button>
                        </form>

                        <div className="mt-6 sm:mt-8 text-center">
                            <p className="text-xs sm:text-sm text-text-sub dark:text-gray-400">
                                Sudah punya akun?
                                <Link className="font-bold text-primary hover:text-primary-dark transition-colors ml-1" href="/admin/login">Masuk</Link>
                            </p>
                        </div>
                    </div>
                    <p className="mt-4 sm:mt-6 text-center text-xs text-text-sub dark:text-gray-500">
                        © 2026 Departemen Kominfo - HIMA PSTI.
                    </p>
                </div>
            </main>
        </div>
    );
}
