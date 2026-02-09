"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import ConfirmationModal from "@/components/common/ConfirmationModal";

type Profile = {
    id: string;
    email: string;
    full_name: string;
    role: string;
    status: string;
    created_at: string;
};

export default function AdminApprovalList() {
    const [admins, setAdmins] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [infoModal, setInfoModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'success' | 'error' }>({
        isOpen: false,
        title: "",
        message: "",
        type: "success"
    });
    const supabase = createClient();

    const fetchPendingAdmins = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("role", "admin")
            .eq("status", "pending")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setAdmins(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPendingAdmins();
    }, []);

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

    const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
        const { error } = await supabase
            .from("profiles")
            .update({ status: newStatus })
            .eq("id", id);

        if (!error) {
            // Remove from list
            setAdmins((prev) => prev.filter((admin) => admin.id !== id));
            setInfoModal({
                isOpen: true,
                title: "Berhasil",
                message: `Admin berhasil ${newStatus === 'approved' ? 'disetujui' : 'ditolak'}`,
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

    if (loading) return <div className="text-white">Loading request...</div>;

    if (admins.length === 0) {
        return (
            <div className="bg-surface-super-dark rounded-2xl p-6 border border-[#362348] text-center">
                <p className="text-[#ad92c9]">Tidak ada permintaan pendaftaran admin baru.</p>
            </div>
        );
    }

    return (
        <div className="bg-surface-super-dark rounded-2xl border border-[#362348] overflow-hidden">
            <div className="p-6 border-b border-[#362348]">
                <h3 className="text-white text-lg font-bold">Permintaan Pendaftaran Admin</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    {/* ... (table content) ... */}
                    <thead className="bg-[#1e1528] text-[#ad92c9]">
                        <tr>
                            <th className="px-6 py-3 font-medium">Nama</th>
                            <th className="px-6 py-3 font-medium">Email</th>
                            <th className="px-6 py-3 font-medium">Tanggal Request</th>
                            <th className="px-6 py-3 font-medium text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#362348]">
                        {admins.map((admin) => (
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
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => openStatusConfirm(admin.id, admin.full_name, 'rejected')}
                                        className="inline-flex items-center px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-xs font-bold"
                                    >
                                        Tolak
                                    </button>
                                    <button
                                        onClick={() => openStatusConfirm(admin.id, admin.full_name, 'approved')}
                                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#0bda73] text-[#191022] hover:bg-[#0aa859] transition-colors text-xs font-bold shadow-lg shadow-[#0bda73]/20"
                                    >
                                        Setujui
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
                title={confirmStatusModal.status === 'approved' ? "Setujui Admin" : "Tolak Admin"}
                message={`Apakah Anda yakin ingin ${confirmStatusModal.status === 'approved' ? 'menyetujui' : 'menolak'} admin "${confirmStatusModal.name}"?`}
                confirmText={confirmStatusModal.status === 'approved' ? "Ya, Setujui" : "Ya, Tolak"}
                isDestructive={confirmStatusModal.status === 'rejected'}
                isLoading={confirmStatusModal.loading}
            />
        </div>
    );
}
