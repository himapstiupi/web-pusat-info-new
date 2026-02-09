"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateCategoryPage() {
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

            router.push("/admin/categories");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Gagal membuat kategori");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background-light dark:bg-background-dark p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link href="/admin/categories" className="text-sm text-text-sub hover:text-primary mb-2 inline-block">
                        &larr; Kembali ke Daftar Kategori
                    </Link>

                </div>

                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">Nama Kategori</label>
                            <input
                                name="title"
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Contoh: Akun & Keamanan"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">Slug URL</label>
                            <input
                                name="slug"
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Contoh: akun-keamanan"
                            />
                            <p className="text-xs text-text-sub mt-1">Gunakan huruf kecil dan pisahkan dengan tanda hubung (-).</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">Deskripsi Singkat</label>
                            <textarea
                                name="description"
                                rows={3}
                                className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Jelaskan tentang kategori ini..."
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">Nama Ikon (Material Symbols)</label>
                            <input
                                name="icon"
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Contoh: security"
                            />
                            <p className="text-xs text-text-sub mt-1">
                                Lihat daftar ikon di <a href="https://fonts.google.com/icons" target="_blank" className="text-primary hover:underline">Google Fonts Icons</a>
                            </p>
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                            <Link href="/admin/categories" className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm">
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors text-sm disabled:opacity-70"
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
