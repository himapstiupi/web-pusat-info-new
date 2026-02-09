"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import CreateAdminModal from "@/components/superadmin/CreateAdminModal";
import ResetPasswordModal from "@/components/superadmin/ResetPasswordModal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { deleteAdmin } from "./actions";

type Profile = {
    id: string;
    email: string;
    full_name: string;
    role: string;
    status: string;
    created_at: string;
};

export default function SuperAdminManageAdmins() {
    const [admins, setAdmins] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [resetPasswordUserId, setResetPasswordUserId] = useState<string | null>(null);
    const [infoModal, setInfoModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' }>({
        isOpen: false,
        title: "",
        message: "",
        type: "success"
    });
    const supabase = createClient();

    const fetchAdmins = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("role", "admin") // Fetch only admins
            .order("created_at", { ascending: false });

        if (!error && data) {
            setAdmins(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
        const { error } = await supabase
            .from("profiles")
            .update({ status: newStatus })
            .eq("id", id);

        if (!error) {
            setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
            setInfoModal({
                isOpen: true,
                title: "Berhasil",
                message: `Status berhasil diperbarui menjadi ${newStatus}`,
                type: "success"
            });
        } else {
            setInfoModal({
                isOpen: true,
                title: "Gagal",
                message: "Gagal memperbarui status",
                type: "error"
            });
        }
    };

    const [confirmStatusModal, setConfirmStatusModal] = useState<{ isOpen: boolean; id: string | null; name: string; status: 'approved' | 'rejected' | null; loading: boolean }>({
        isOpen: false,
        id: null,
        name: "",
        status: null,
        loading: false
    });

    const openStatusConfirm = (id: string, name: string, status: 'approved' | 'rejected') => {
        setConfirmStatusModal({ isOpen: true, id, name, status, loading: false });
    };

    const handleStatusUpdate = async () => {
        if (!confirmStatusModal.id || !confirmStatusModal.status) return;

        setConfirmStatusModal(prev => ({ ...prev, loading: true }));
        await updateStatus(confirmStatusModal.id, confirmStatusModal.status);
        setConfirmStatusModal({ isOpen: false, id: null, name: "", status: null, loading: false });
    };

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null; name: string; loading: boolean }>({
        isOpen: false,
        id: null,
        name: "",
        loading: false
    });

    const confirmDelete = (id: string, name: string) => {
        setDeleteModal({ isOpen: true, id, name, loading: false });
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;

        setDeleteModal(prev => ({ ...prev, loading: true }));
        const result = await deleteAdmin(deleteModal.id);

        if (result?.error) {
            setInfoModal({
                isOpen: true,
                title: "Gagal",
                message: result.error,
                type: "error"
            });
            setDeleteModal({ isOpen: false, id: null, name: "", loading: false });
        } else {
            setAdmins((prev) => prev.filter((a) => a.id !== deleteModal.id));
            setInfoModal({
                isOpen: true,
                title: "Berhasil",
                message: "Admin berhasil dihapus",
                type: "success"
            });
            setDeleteModal({ isOpen: false, id: null, name: "", loading: false });
        }
    };

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
            <div className="max-w-[1400px] mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-white text-3xl font-black tracking-tight mb-2">Manajemen Admin</h2>
                        <p className="text-[#ad92c9] font-medium">Kelola akses dan status administrator.</p>
                    </div>
                    <div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-primary-purple hover:bg-primary-purple/90 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-primary-purple/20 transition-all flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">person_add</span>
                            Tambah Admin
                        </button>
                    </div>
                </div>

                <div className="bg-surface-super-dark rounded-2xl border border-[#362348] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#1e1528] text-[#ad92c9]">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Nama</th>
                                    <th className="px-6 py-3 font-medium">Email</th>
                                    <th className="px-6 py-3 font-medium">Tanggal Daftar</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#362348]">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-[#ad92c9]">Memuat data...</td>
                                    </tr>
                                ) : admins.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-[#ad92c9]">Tidak ada data admin.</td>
                                    </tr>
                                ) : (
                                    admins.map((admin) => (
                                        <tr key={admin.id} className="hover:bg-[#2a1f36] transition-colors">
                                            <td className="px-6 py-4 text-white font-medium">{admin.full_name || "Tanpa Nama"}</td>
                                            <td className="px-6 py-4 text-[#ad92c9]">{admin.email}</td>
                                            <td className="px-6 py-4 text-[#ad92c9]">
                                                {new Date(admin.created_at).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric"
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${admin.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                                    admin.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {admin.status?.toUpperCase() || "UNKNOWN"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                                                {admin.status === 'approved' && (
                                                    <button
                                                        onClick={() => setResetPasswordUserId(admin.id)}
                                                        className="inline-flex items-center px-3 py-1.5 rounded-lg border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 transition-colors text-xs font-bold"
                                                        title="Reset Password"
                                                    >
                                                        <span className="material-symbols-outlined text-sm md:mr-1">lock_reset</span>
                                                        <span className="hidden md:inline">Reset</span>
                                                    </button>
                                                )}
                                                {admin.status !== 'approved' && (
                                                    <button
                                                        onClick={() => openStatusConfirm(admin.id, admin.full_name, 'approved')}
                                                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#0bda73] text-[#191022] hover:bg-[#0aa859] transition-colors text-xs font-bold"
                                                        title="Setujui"
                                                    >
                                                        <span className="material-symbols-outlined text-sm md:mr-1">check</span>
                                                        <span className="hidden md:inline">Setujui</span>
                                                    </button>
                                                )}
                                                {admin.status !== 'rejected' && (
                                                    <button
                                                        onClick={() => openStatusConfirm(admin.id, admin.full_name, 'rejected')}
                                                        className="inline-flex items-center px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-xs font-bold"
                                                        title={admin.status === 'approved' ? 'Blokir' : 'Tolak'}
                                                    >
                                                        <span className="material-symbols-outlined text-sm md:mr-1">
                                                            {admin.status === 'approved' ? 'block' : 'close'}
                                                        </span>
                                                        <span className="hidden md:inline">{admin.status === 'approved' ? 'Blokir' : 'Tolak'}</span>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => confirmDelete(admin.id, admin.full_name)}
                                                    className="inline-flex items-center px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-xs font-bold"
                                                    title="Hapus Permanen"
                                                >
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isCreateModalOpen && (
                <CreateAdminModal
                    onClose={() => {
                        setIsCreateModalOpen(false);
                        fetchAdmins();
                    }}
                />
            )}

            {resetPasswordUserId && (
                <ResetPasswordModal
                    userId={resetPasswordUserId}
                    onClose={() => setResetPasswordUserId(null)}
                />
            )}

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleDelete}
                title="Hapus Admin"
                message={`Apakah Anda yakin ingin menghapus admin "${deleteModal.name}" secara permanen? Tindakan ini tidak dapat dibatalkan.`}
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
            <ConfirmationModal
                isOpen={confirmStatusModal.isOpen}
                onClose={() => setConfirmStatusModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleStatusUpdate}
                title={confirmStatusModal.status === 'approved' ? "Setujui Admin" : "Blokir/Tolak Admin"}
                message={`Apakah Anda yakin ingin ${confirmStatusModal.status === 'approved' ? 'menyetujui' : 'memblokir/menolak'} admin "${confirmStatusModal.name}"?`}
                confirmText={confirmStatusModal.status === 'approved' ? "Ya, Setujui" : "Ya, Blokir/Tolak"}
                isDestructive={confirmStatusModal.status === 'rejected'}
                isLoading={confirmStatusModal.loading}
            />
        </main>
    );
}
