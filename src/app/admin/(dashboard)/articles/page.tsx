"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ConfirmationModal from "@/components/common/ConfirmationModal";

type Article = {
    id: string; // slug
    title: string;
    category_id: number;
    views: number;
    created_at: string;
    categories: {
        title: string;
    };
};

export default function AdminArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchArticles = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("articles")
            .select(`
                *,
                categories (
                    title
                )
            `)
            .order("created_at", { ascending: false });

        if (!error && data) {
            setArticles(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null; loading: boolean }>({
        isOpen: false,
        id: null,
        loading: false
    });

    const confirmDelete = (id: string) => {
        setDeleteModal({ isOpen: true, id, loading: false });
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;

        setDeleteModal(prev => ({ ...prev, loading: true }));
        const { error } = await supabase.from("articles").delete().eq("id", deleteModal.id);

        if (error) {
            alert("Gagal menghapus artikel: " + error.message);
            setDeleteModal({ isOpen: false, id: null, loading: false });
        } else {
            setArticles((prev) => prev.filter((a) => a.id !== deleteModal.id));
            setDeleteModal({ isOpen: false, id: null, loading: false });
        }
    };

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background-light dark:bg-background-dark p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">

                <Link href="/admin/articles/create" className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">add</span>
                    Buat Artikel Baru
                </Link>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-text-main dark:text-white">Judul</th>
                                <th className="px-6 py-3 font-semibold text-text-main dark:text-white">Kategori</th>
                                <th className="px-6 py-3 font-semibold text-text-main dark:text-white">Tanggal Dibuat</th>
                                <th className="px-6 py-3 text-right font-semibold text-text-main dark:text-white">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-text-sub">Memuat data...</td>
                                </tr>
                            ) : articles.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-text-sub">Belum ada artikel.</td>
                                </tr>
                            ) : (
                                articles.map((article) => (
                                    <tr key={article.id} className="hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-text-main dark:text-white max-w-sm truncate">
                                            {article.title}
                                        </td>
                                        <td className="px-6 py-4 text-text-sub dark:text-gray-400">
                                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-semibold">
                                                {article.categories?.title || "Umum"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-text-sub dark:text-gray-400">
                                            {new Date(article.created_at).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric"
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <Link href={`/admin/articles/edit/${article.id}`} className="p-1.5 text-text-sub hover:text-primary transition-colors rounded-md hover:bg-blue-50 dark:hover:bg-primary/10">
                                                <span className="material-symbols-outlined text-xl">edit</span>
                                            </Link>
                                            <button
                                                onClick={() => confirmDelete(article.id)}
                                                className="p-1.5 text-text-sub hover:text-danger transition-colors rounded-md hover:bg-red-50 dark:hover:bg-danger/10"
                                            >
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleDelete}
                title="Hapus Artikel"
                message="Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus"
                isDestructive={true}
                isLoading={deleteModal.loading}
            />
        </main>
    );
}
