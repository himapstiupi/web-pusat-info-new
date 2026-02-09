"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SuperAdminCreateCategoryPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const slug = formData.get("slug") as string;
        const description = formData.get("description") as string;
        const icon = formData.get("icon") as string;

        try {
            const { error: insertError } = await supabase.from("categories").insert({
                title,
                slug,
                description,
                icon,
            });

            if (insertError) throw insertError;

            router.push("/superadmin/categories");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Gagal membuat kategori");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link href="/superadmin/categories" className="text-sm text-[#ad92c9] hover:text-primary-purple mb-2 inline-block transition-colors">
                        &larr; Kembali ke Daftar Kategori
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Tambah Kategori Baru</h1>
                </div>

                <div className="bg-surface-super-dark rounded-xl shadow-sm border border-[#362348] p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Nama Kategori</label>
                            <input
                                name="title"
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-[#362348] rounded-lg bg-[#150d1c] text-white focus:outline-none focus:ring-2 focus:ring-primary-purple/50 placeholder-[#ad92c9]/50"
                                placeholder="Contoh: Akun & Keamanan"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Slug URL</label>
                            <input
                                name="slug"
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-[#362348] rounded-lg bg-[#150d1c] text-white focus:outline-none focus:ring-2 focus:ring-primary-purple/50 placeholder-[#ad92c9]/50"
                                placeholder="Contoh: akun-keamanan"
                            />
                            <p className="text-xs text-[#ad92c9] mt-1">Gunakan huruf kecil dan pisahkan dengan tanda hubung (-).</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Deskripsi Singkat</label>
                            <textarea
                                name="description"
                                rows={3}
                                className="w-full px-4 py-2 border border-[#362348] rounded-lg bg-[#150d1c] text-white focus:outline-none focus:ring-2 focus:ring-primary-purple/50 placeholder-[#ad92c9]/50"
                                placeholder="Jelaskan tentang kategori ini..."
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Nama Ikon (Material Symbols)</label>
                            <input
                                name="icon"
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-[#362348] rounded-lg bg-[#150d1c] text-white focus:outline-none focus:ring-2 focus:ring-primary-purple/50 placeholder-[#ad92c9]/50"
                                placeholder="Contoh: security"
                            />
                            <p className="text-xs text-[#ad92c9] mt-1">
                                Lihat daftar ikon di <a href="https://fonts.google.com/icons" target="_blank" className="text-primary-purple hover:underline">Google Fonts Icons</a>
                            </p>
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                            <Link href="/superadmin/categories" className="px-4 py-2 border border-[#362348] rounded-lg text-white hover:bg-[#362348]/50 transition-colors font-medium text-sm">
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-primary-purple text-white rounded-lg font-bold hover:bg-[#56298b] transition-colors text-sm disabled:opacity-70 shadow-lg shadow-primary-purple/20"
                            >
                                {loading ? "Menyimpan..." : "Simpan Kategori"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
