"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function SuperAdminEditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("");

    useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("categories")
                    .select("*")
                    .eq("id", params.id)
                    .single();

                if (error) throw error;
                if (data) {
                    setTitle(data.title);
                    setSlug(data.slug);
                    setDescription(data.description || "");
                    setIcon(data.icon || "");
                }
            } catch (err: any) {
                setError(err.message || "Gagal memuat kategori");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchCategory();
        }
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const { error: updateError } = await supabase
                .from("categories")
                .update({
                    title,
                    slug,
                    description,
                    icon,
                })
                .eq("id", params.id);

            if (updateError) throw updateError;

            router.push("/superadmin/categories");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Gagal menyimpan kategori");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-[#ad92c9]">Memuat kategori...</div>;

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link href="/superadmin/categories" className="text-sm text-[#ad92c9] hover:text-white mb-2 inline-block transition-colors">
                        &larr; Kembali ke Daftar Kategori
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Edit Kategori</h1>
                </div>

                <div className="bg-[#1e1528] rounded-xl shadow-sm border border-[#362348] p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-900/20 text-red-400 text-sm rounded-lg border border-red-900/30">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#ad92c9] mb-1">Nama Kategori</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-[#362348] rounded-lg bg-[#2a1f36] text-white focus:outline-none focus:ring-2 focus:ring-primary-purple/50 placeholder-gray-500"
                                placeholder="Nama kategori..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#ad92c9] mb-1">Slug URL</label>
                            <input
                                type="text"
                                required
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full px-4 py-2 border border-[#362348] rounded-lg bg-[#2a1f36] text-white focus:outline-none focus:ring-2 focus:ring-primary-purple/50 placeholder-gray-500"
                                placeholder="slug-url"
                            />
                            <p className="text-xs text-[#ad92c9] mt-1">Gunakan huruf kecil dan pisahkan dengan tanda hubung (-).</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#ad92c9] mb-1">Deskripsi Singkat</label>
                            <textarea
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 border border-[#362348] rounded-lg bg-[#2a1f36] text-white focus:outline-none focus:ring-2 focus:ring-primary-purple/50 placeholder-gray-500"
                                placeholder="Jelaskan tentang kategori ini..."
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#ad92c9] mb-1">Nama Ikon (Material Symbols)</label>
                            <input
                                type="text"
                                required
                                value={icon}
                                onChange={(e) => setIcon(e.target.value)}
                                className="w-full px-4 py-2 border border-[#362348] rounded-lg bg-[#2a1f36] text-white focus:outline-none focus:ring-2 focus:ring-primary-purple/50 placeholder-gray-500"
                                placeholder="Contoh: security"
                            />
                            <p className="text-xs text-[#ad92c9] mt-1">
                                Lihat daftar ikon di <a href="https://fonts.google.com/icons" target="_blank" className="text-primary-purple hover:underline hover:text-[#d0bcff]">Google Fonts Icons</a>
                            </p>
                        </div>
                        <div className="pt-4 flex justify-end gap-3 border-t border-[#362348] mt-6">
                            <Link href="/superadmin/categories" className="px-4 py-2 border border-[#362348] rounded-lg text-white hover:bg-[#362348] transition-colors font-medium text-sm">
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-primary-purple text-white rounded-lg font-bold hover:bg-[#56298b] transition-colors text-sm disabled:opacity-70 shadow-lg shadow-primary-purple/20"
                            >
                                {saving ? "Menyimpan..." : "Simpan Perubahan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
