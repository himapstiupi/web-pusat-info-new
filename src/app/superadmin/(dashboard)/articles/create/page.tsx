"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/editor/RichTextEditor";

type Category = {
    id: number;
    title: string;
};

export default function SuperAdminCreateArticlePage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState<number | "">("");
    const [content, setContent] = useState("");
    const [isPublished, setIsPublished] = useState(true);
    const [postingMode, setPostingMode] = useState<"auto" | "custom">("auto");
    const [customDate, setCustomDate] = useState("");
    const [relatedLinks, setRelatedLinks] = useState<{ label: string; url: string }[]>([{ label: "", url: "" }]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from("categories").select("id, title");
            if (data) setCategories(data);
        };
        fetchCategories();
    }, []);

    const convertTitleToSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/^-+|-+$/g, "");
    };


    // Link Handlers
    const handleLinkChange = (index: number, field: "label" | "url", value: string) => {
        const newLinks = [...relatedLinks];
        newLinks[index][field] = value;
        setRelatedLinks(newLinks);
    };

    const addLink = () => {
        if (relatedLinks.length < 3) {
            setRelatedLinks([...relatedLinks, { label: "", url: "" }]);
        }
    };

    const removeLink = (index: number) => {
        const newLinks = relatedLinks.filter((_, i) => i !== index);
        setRelatedLinks(newLinks);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Auto-generate slug from title
        const slug = convertTitleToSlug(title);

        // Handle Posting Time
        let createdAt = new Date().toISOString();
        if (postingMode === "custom" && customDate) {
            createdAt = new Date(customDate).toISOString();
        }

        // Handle Links
        const validLinks = relatedLinks.filter(l => l.label && l.url);

        try {
            const { error: insertError } = await supabase.from("articles").insert({
                id: slug,
                title,
                content,
                category_id: categoryId ? Number(categoryId) : null,
                is_published: isPublished,
                created_at: createdAt,
                related_links: validLinks
            });

            if (insertError) throw insertError;

            router.push("/superadmin/articles");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Gagal membuat artikel");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href="/superadmin/articles" className="text-sm text-[#ad92c9] hover:text-primary-purple mb-2 inline-block transition-colors">
                        &larr; Kembali ke Daftar Artikel
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Tulis Artikel Baru</h1>
                </div>

                <div className="bg-surface-super-dark rounded-xl shadow-sm border border-[#362348] p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-1">Judul Artikel</label>
                                    <input
                                        type="text"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-2 border border-[#362348] rounded-lg bg-[#150d1c] text-white focus:outline-none focus:ring-2 focus:ring-primary-purple/50 placeholder-[#ad92c9]/50"
                                        placeholder="Judul artikel yang menarik..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white mb-1">Kategori</label>
                                    <select
                                        required
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(Number(e.target.value))}
                                        className="w-full px-4 py-2 border border-[#362348] rounded-lg bg-[#150d1c] text-white focus:outline-none focus:ring-2 focus:ring-primary-purple/50"
                                    >
                                        <option value="" className="bg-[#150d1c]">Pilih Kategori</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id} className="bg-[#150d1c]">
                                                {cat.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Publish Toggle */}
                            <div className="bg-primary-purple/10 border border-primary-purple/30 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary-purple">public</span>
                                        <div>
                                            <label htmlFor="publish-toggle" className="block text-sm font-semibold text-white cursor-pointer">
                                                Status Publikasi
                                            </label>
                                            <p className="text-xs text-[#ad92c9]">
                                                {isPublished ? "Artikel akan terlihat oleh publik" : "Artikel disembunyikan dari publik"}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        id="publish-toggle"
                                        onClick={() => setIsPublished(!isPublished)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-offset-2 focus:ring-offset-[#150d1c] ${isPublished ? 'bg-primary-purple' : 'bg-gray-600'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublished ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-3">Konten Artikel</label>
                            <RichTextEditor
                                value={content}
                                onChange={setContent}
                                placeholder="Tulis konten artikel di sini..."
                            />
                        </div>

                        {/* Related Links Section */}
                        <div className="border-t border-[#362348] pt-6 mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-[#ad92c9]">
                                    Link Terkait (Opsional, Maksimal 3)
                                </label>
                                {relatedLinks.length < 3 && (
                                    <button
                                        type="button"
                                        onClick={addLink}
                                        className="text-xs text-primary-purple hover:text-[#d0bcff] font-medium flex items-center gap-1 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-base">add</span>
                                        Tambah Link
                                    </button>
                                )}
                            </div>
                            <div className="space-y-3">
                                {relatedLinks.map((link, index) => (
                                    <div key={index} className="flex gap-3 items-start">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                value={link.label}
                                                onChange={(e) => handleLinkChange(index, "label", e.target.value)}
                                                placeholder="Label Tombol"
                                                className="w-full px-3 py-2 border border-[#362348] rounded-lg bg-[#2a1f36] text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-purple placeholder-gray-500"
                                            />
                                            <input
                                                type="url"
                                                value={link.url}
                                                onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                                                placeholder="URL (https://...)"
                                                className="w-full px-3 py-2 border border-[#362348] rounded-lg bg-[#2a1f36] text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-purple placeholder-gray-500"
                                            />
                                        </div>
                                        {relatedLinks.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => removeLink(index)}
                                                className="p-2 text-[#ad92c9] hover:text-red-400 rounded hover:bg-red-900/20"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Posting Time Section */}
                        <div className="border-t border-[#362348] pt-6 mt-6">
                            <label className="block text-sm font-medium text-[#ad92c9] mb-2">Waktu Posting</label>
                            <div className="flex flex-col gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="postingMode"
                                        value="auto"
                                        checked={postingMode === "auto"}
                                        onChange={() => setPostingMode("auto")}
                                        className="text-primary-purple focus:ring-primary-purple bg-[#2a1f36] border-[#362348]"
                                    />
                                    <span className="text-sm text-white">Otomatis (Saat ini)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="postingMode"
                                        value="custom"
                                        checked={postingMode === "custom"}
                                        onChange={() => setPostingMode("custom")}
                                        className="text-primary-purple focus:ring-primary-purple bg-[#2a1f36] border-[#362348]"
                                    />
                                    <span className="text-sm text-white">Atur Tanggal & Waktu</span>
                                </label>
                            </div>

                            {postingMode === "custom" && (
                                <div className="mt-3">
                                    <input
                                        type="datetime-local"
                                        required={postingMode === "custom"}
                                        value={customDate}
                                        onChange={(e) => setCustomDate(e.target.value)}
                                        className="px-4 py-2 border border-[#362348] rounded-lg bg-[#150d1c] text-white focus:outline-none focus:ring-2 focus:ring-primary-purple/50 text-sm"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="pt-4 flex justify-end gap-3 border-t border-[#362348] mt-6">
                            <Link href="/superadmin/articles" className="px-4 py-2 border border-[#362348] rounded-lg text-white hover:bg-[#362348]/50 transition-colors font-medium text-sm">
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-primary-purple text-white rounded-lg font-bold hover:bg-[#56298b] transition-colors text-sm disabled:opacity-70 shadow-lg shadow-primary-purple/20"
                            >
                                {loading ? "Menerbitkan..." : "Terbitkan Artikel"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
