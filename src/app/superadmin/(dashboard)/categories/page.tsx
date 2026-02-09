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

export default function SuperAdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [infoModal, setInfoModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' }>({
        isOpen: false,
        title: "",
        message: "",
        type: "success"
    });
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
            setInfoModal({
                isOpen: true,
                title: "Gagal",
                message: "Gagal menghapus kategori: " + error.message,
                type: "error"
            });
            setDeleteModal({ isOpen: false, id: null, loading: false });
        } else {
            setCategories((prev) => prev.filter((c) => c.id !== deleteModal.id));
            setInfoModal({
                isOpen: true,
                title: "Berhasil",
                message: "Kategori berhasil dihapus",
                type: "success"
            });
            setDeleteModal({ isOpen: false, id: null, loading: false });
        }
    };

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6 max-w-[1400px] mx-auto">
                <div>
                    <h1 className="text-2xl font-bold text-white">Kelola Kategori</h1>
                    <p className="text-sm text-[#ad92c9]">Atur kategori untuk artikel di website HIMA PSTI.</p>
                </div>
                <Link href="/superadmin/categories/create" className="px-4 py-2 bg-primary-purple text-white text-sm font-bold rounded-lg hover:bg-[#56298b] transition-colors flex items-center gap-2 shadow-lg shadow-primary-purple/20">
                    <span className="material-symbols-outlined text-xl">add</span>
                    Tambah Kategori
                </Link>
            </div>

            <div className="max-w-[1400px] mx-auto bg-surface-super-dark rounded-xl shadow-sm border border-[#362348] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#1e1528] border-b border-[#362348]">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-[#ad92c9]">Nama Kategori</th>
                                <th className="px-6 py-3 font-semibold text-[#ad92c9]">Slug</th>
                                <th className="px-6 py-3 font-semibold text-[#ad92c9]">Deskripsi</th>
                                <th className="px-6 py-3 font-semibold text-[#ad92c9]">Ikon</th>
                                <th className="px-6 py-3 text-right font-semibold text-[#ad92c9]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#362348]">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-[#ad92c9]">Memuat data...</td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-[#ad92c9]">Belum ada kategori.</td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-[#2a1f36] transition-colors">
                                        <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                            <span className="material-symbols-outlined text-primary-purple bg-primary-purple/10 p-1.5 rounded-lg">{category.icon || "category"}</span>
                                            {category.title}
                                        </td>
                                        <td className="px-6 py-4 text-[#ad92c9]">{category.slug}</td>
                                        <td className="px-6 py-4 text-[#ad92c9] truncate max-w-xs">{category.description}</td>
                                        <td className="px-6 py-4 text-[#ad92c9]">{category.icon}</td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <Link href={`/superadmin/categories/edit/${category.id}`} className="p-1.5 text-[#ad92c9] hover:text-primary-purple transition-colors rounded-md hover:bg-primary-purple/10">
                                                <span className="material-symbols-outlined text-xl">edit</span>
                                            </Link>
                                            <button
                                                onClick={() => confirmDelete(category.id)}
                                                className="p-1.5 text-[#ad92c9] hover:text-red-400 transition-colors rounded-md hover:bg-red-500/10"
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

            <ConfirmationModal
                isOpen={infoModal.isOpen}
                onClose={() => setInfoModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={() => setInfoModal(prev => ({ ...prev, isOpen: false }))}
                title={infoModal.title}
                message={infoModal.message}
                confirmText="Tutup"
                cancelText="" // Hide cancel button
                isDestructive={infoModal.type === 'error'}
            />
        </main>
    );
}
