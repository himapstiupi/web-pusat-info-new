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

export default function CreateArticlePage() {
    const router = useRouter();
    const supabase = createClient();

    // Restored state
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);

    // New state
    const [relatedLinks, setRelatedLinks] = useState<{ label: string; url: string }[]>([{ label: "", url: "" }]);
    const [content, setContent] = useState("");
    const [postingMode, setPostingMode] = useState<"auto" | "custom">("auto");
    const [customDate, setCustomDate] = useState("");
    const [isPublished, setIsPublished] = useState(true);

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

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const categoryId = formData.get("category_id");
        // content state is used instead of formData to ensure sync with toolbar updates

        const slug = convertTitleToSlug(title);

        // Filter valid links
        const validLinks = relatedLinks.filter(l => l.label && l.url);

        // Determine created_at
        let createdAt = new Date().toISOString();
        if (postingMode === "custom" && customDate) {
            createdAt = new Date(customDate).toISOString();
        }

        try {
            const { error: insertError } = await supabase.from("articles").insert({
                id: slug,
                title,
                content,
                category_id: categoryId ? parseInt(categoryId as string) : null,
                related_links: validLinks,
                created_at: createdAt,
                is_published: isPublished,
            });

            if (insertError) throw insertError;

            router.push("/admin/articles");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Gagal membuat artikel");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background-light dark:bg-background-dark p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href="/admin/articles" className="text-sm text-text-sub hover:text-primary mb-2 inline-block">
                        &larr; Kembali ke Daftar Artikel
                    </Link>
                </div>

                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">Judul Artikel</label>
                                    <input
                                        name="title"
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder="Judul artikel yang menarik..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">Kategori</label>
                                    <select
                                        name="category_id"
                                        required
                                        className="w-full px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Publish Toggle */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary">public</span>
                                        <div>
                                            <label htmlFor="publish-toggle" className="block text-sm font-semibold text-text-main dark:text-white cursor-pointer">
                                                Status Publikasi
                                            </label>
                                            <p className="text-xs text-text-sub dark:text-gray-400">
                                                {isPublished ? "Artikel akan terlihat oleh publik" : "Artikel disembunyikan dari publik"}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        id="publish-toggle"
                                        onClick={() => setIsPublished(!isPublished)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isPublished ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
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
                            <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-3">Konten Artikel</label>
                            <RichTextEditor
                                value={content}
                                onChange={setContent}
                                placeholder="Tulis konten artikel di sini..."
                            />
                        </div>

                        {/* Related Links Section */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-text-main dark:text-gray-200">
                                    Link Terkait (Opsional, Maksimal 3)
                                </label>
                                {relatedLinks.length < 3 && (
                                    <button
                                        type="button"
                                        onClick={addLink}
                                        className="text-xs text-primary hover:text-primary-dark font-medium flex items-center gap-1"
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
                                                placeholder="Label Tombol (Misal: Download PDF)"
                                                className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-main dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                            <input
                                                type="url"
                                                value={link.url}
                                                onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                                                placeholder="URL (https://...)"
                                                className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-main dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                        {relatedLinks.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => removeLink(index)}
                                                className="p-2 text-text-sub hover:text-danger rounded hover:bg-red-50 dark:hover:bg-red-900/10"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Posting Date Section */}
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-2">Waktu Posting</label>
                            <div className="flex flex-col gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="postingMode"
                                        value="auto"
                                        checked={postingMode === "auto"}
                                        onChange={() => setPostingMode("auto")}
                                        className="text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-text-main dark:text-white">Otomatis (Saat ini)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="postingMode"
                                        value="custom"
                                        checked={postingMode === "custom"}
                                        onChange={() => setPostingMode("custom")}
                                        className="text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-text-main dark:text-white">Atur Tanggal & Waktu</span>
                                </label>
                            </div>

                            {postingMode === "custom" && (
                                <div className="mt-3">
                                    <input
                                        type="datetime-local"
                                        required={postingMode === "custom"}
                                        value={customDate}
                                        onChange={(e) => setCustomDate(e.target.value)}
                                        className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="pt-4 flex justify-end gap-3 border-t border-border-light dark:border-border-dark mt-6">
                            <Link href="/admin/articles" className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm">
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors text-sm disabled:opacity-70"
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
