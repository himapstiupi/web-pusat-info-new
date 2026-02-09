"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ConfirmationModal from "@/components/common/ConfirmationModal";

type Category = {
    id: number;
    title: string;
    slug: string;
    description: string;
    icon: string;
    count?: number; // Optional count of articles
};

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .order("id", { ascending: true });

        if (!error && data) {
            setCategories(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null; loading: boolean }>({
        isOpen: false,
        id: null,
        loading: false
    });

    const confirmDelete = (id: number) => {
        setDeleteModal({ isOpen: true, id, loading: false });
    };

    const handleDelete = async () => {
        if (deleteModal.id === null) return;

        setDeleteModal(prev => ({ ...prev, loading: true }));
        const { error } = await supabase.from("categories").delete().eq("id", deleteModal.id);

        if (error) {
            alert("Gagal menghapus kategori: " + error.message);
            setDeleteModal({ isOpen: false, id: null, loading: false });
        } else {
            setCategories((prev) => prev.filter((c) => c.id !== deleteModal.id));
            setDeleteModal({ isOpen: false, id: null, loading: false });
        }
    };

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background-light dark:bg-background-dark p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">

                <Link href="/admin/categories/create" className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">add</span>
                    Tambah Kategori
                </Link>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-text-main dark:text-white">Nama Kategori</th>
                                <th className="px-6 py-3 font-semibold text-text-main dark:text-white">Slug</th>
                                <th className="px-6 py-3 font-semibold text-text-main dark:text-white">Deskripsi</th>
                                <th className="px-6 py-3 font-semibold text-text-main dark:text-white">Ikon</th>
                                <th className="px-6 py-3 text-right font-semibold text-text-main dark:text-white">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-text-sub">Memuat data...</td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-text-sub">Belum ada kategori.</td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-text-main dark:text-white flex items-center gap-3">
                                            <span className="material-symbols-outlined text-primary bg-blue-50 dark:bg-primary/10 p-1.5 rounded-lg">{category.icon || "category"}</span>
                                            {category.title}
                                        </td>
                                        <td className="px-6 py-4 text-text-sub dark:text-gray-400">{category.slug}</td>
                                        <td className="px-6 py-4 text-text-sub dark:text-gray-400 truncate max-w-xs">{category.description}</td>
                                        <td className="px-6 py-4 text-text-sub dark:text-gray-400">{category.icon}</td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            {/* Edit Button (Placeholder link) */}
                                            <Link href={`/admin/categories/edit/${category.id}`} className="p-1.5 text-text-sub hover:text-primary transition-colors rounded-md hover:bg-blue-50 dark:hover:bg-primary/10">
                                                <span className="material-symbols-outlined text-xl">edit</span>
                                            </Link>
                                            <button
                                                onClick={() => confirmDelete(category.id)}
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
                title="Hapus Kategori"
                message="Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus"
                isDestructive={true}
                isLoading={deleteModal.loading}
            />
        </main>
    );
}
