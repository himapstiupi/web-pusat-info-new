"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import Link from "next/link";

function SuperAdminLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const errorType = searchParams.get("error");
        if (errorType === "account_suspended") {
            setError("Akun Anda telah dinonaktifkan. Silakan hubungi pemilik website.");
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
                    .select("role")
                    .eq("id", user.id)
                    .single();

                if (profile && profile.role === "superadmin") {
                    router.push("/superadmin/dashboard");
                } else {
                    await supabase.auth.signOut();
                    setError("Akses Ditolak: Anda bukan Superadmin.");
                }
            }
        } catch (err: any) {
            setError(err.message || "Gagal masuk");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[440px] flex flex-col items-center px-4">
            <div className="flex flex-col items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
                <div className="size-14 sm:size-16 rounded-2xl bg-gradient-to-br from-[#660fbd] to-purple-900 flex items-center justify-center shadow-2xl shadow-[#660fbd]/30">
                    <span className="material-symbols-outlined text-white text-3xl sm:text-4xl">admin_panel_settings</span>
                </div>
                <div className="text-center">
                    <h1 className="text-white text-2xl sm:text-3xl font-black tracking-tight leading-none">Login Superadmin</h1>
                    <p className="text-[#ad92c9] text-xs sm:text-sm font-medium mt-2">Masukan informasi akun untuk melanjutkan</p>
                </div>
            </div>

            <div className="w-full rounded-3xl p-6 sm:p-8 md:p-10" style={{
                background: "rgba(35, 22, 48, 0.45)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(102, 15, 189, 0.2)",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.8)"
            }}>


                <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
                    {error && (
                        <div className="p-3 bg-red-900/50 text-red-200 text-xs sm:text-sm rounded-lg border border-red-800">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#ad92c9] uppercase tracking-wider ml-1" htmlFor="email">Email</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#ad92c9] text-lg sm:text-xl group-focus-within:text-[#660fbd] transition-colors">person</span>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-black/40 border border-[#362348] rounded-xl py-3 sm:py-3.5 pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm text-white placeholder-[#5d447a] focus:ring-0 focus:outline-none transition-all"
                                placeholder="Masukan email anda"
                                style={{ boxShadow: "none" }}
                                onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 15px rgba(102, 15, 189, 0.4)"; e.currentTarget.style.borderColor = "#a855f7"; }}
                                onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#362348"; }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#ad92c9] uppercase tracking-wider ml-1" htmlFor="password">Password</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#ad92c9] text-lg sm:text-xl group-focus-within:text-[#660fbd] transition-colors">lock_open</span>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-black/40 border border-[#362348] rounded-xl py-3 sm:py-3.5 pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm text-white placeholder-[#5d447a] focus:ring-0 focus:outline-none transition-all"
                                placeholder="••••••••"
                                style={{ boxShadow: "none" }}
                                onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 15px rgba(102, 15, 189, 0.4)"; e.currentTarget.style.borderColor = "#a855f7"; }}
                                onBlur={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#362348"; }}
                            />
                        </div>
                    </div>

                    {/* Authenticator Code section removed as requested */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#660fbd] hover:bg-[#660fbd]/90 text-white font-bold py-3 sm:py-4 rounded-xl shadow-lg shadow-[#660fbd]/30 transition-all flex items-center justify-center gap-2 group mt-4 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                        <span>{loading ? "Memverifikasi..." : "Masuk ke Panel Kontrol"}</span>
                        {!loading && <span className="material-symbols-outlined text-lg sm:text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                    </button>
                </form>


            </div>
        </div>
    );
}

export default function SuperAdminLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 selection:bg-[#660fbd] selection:text-white font-sans" style={{ background: "radial-gradient(circle at center, #1e0b36 0%, #0a060e 100%)" }}>
            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <SuperAdminLoginForm />
            </Suspense>
        </div>
    );
}
