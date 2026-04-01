"use client";

import { useEffect, useState } from "react";
import { Announcement, getAdminAnnouncements, deleteAnnouncement, toggleAnnouncementStatus, upsertAnnouncement } from "@/actions/announcements";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import toast from "react-hot-toast";

export default function SuperAdminAnnouncementsClient() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null; loading: boolean }>({ isOpen: false, id: null, loading: false });
    const [formModal, setFormModal] = useState<{ isOpen: boolean; data: Partial<Announcement>; loading: boolean }>({ isOpen: false, data: {}, loading: false });

    const fetchAnnouncements = async () => {
        setLoading(true);
        const data = await getAdminAnnouncements();
        setAnnouncements(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        setDeleteModal(prev => ({ ...prev, loading: true }));
        const res = await deleteAnnouncement(deleteModal.id);
        if (res.success) {
            toast.success("Pengumuman dihapus");
            fetchAnnouncements();
        } else {
            toast.error(res.error || "Gagal menghapus");
        }
        setDeleteModal({ isOpen: false, id: null, loading: false });
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        const res = await toggleAnnouncementStatus(id, currentStatus);
        if (res.success) {
            toast.success("Status diubah");
            fetchAnnouncements();
        } else {
            toast.error(res.error || "Gagal mengubah status");
        }
    };

    const openCreateForm = () => {
        setFormModal({
            isOpen: true,
            loading: false,
            data: {
                title: "",
                type: "running_text",
                content: "",
                button_label: "",
                button_link: "",
                show_on_pages: ["*"],
                exclude_pages: ["/admin*", "/superadmin*"],
                is_active: true
            }
        });
    };

    const openEditForm = (item: Announcement) => {
        setFormModal({
            isOpen: true,
            loading: false,
            data: { ...item }
        });
    };

    const handleSaveForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormModal(prev => ({ ...prev, loading: true }));
        
        const payload = { ...formModal.data } as Announcement;
        if (payload.type === 'running_text') {
            payload.title = payload.title || 'Info Berjalan'; // Provide a default title for the DB since it's NOT NULL
            payload.button_label = payload.button_label || 'normal'; // Use button_label to store speed
            payload.button_link = null;
        }

        const res = await upsertAnnouncement(payload);
        if (res.success) {
            toast.success("Pengumuman disimpan");
            setFormModal({ isOpen: false, data: {}, loading: false });
            fetchAnnouncements();
        } else {
            toast.error(res.error || "Gagal menyimpan pengumuman");
            setFormModal(prev => ({ ...prev, loading: false }));
        }
    };

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6 max-w-[1400px] mx-auto">
                <div>
                    <h1 className="text-2xl font-bold text-text-main dark:text-white">Kelola Pengumuman</h1>
                    <p className="text-sm text-text-sub dark:text-[#ad92c9]">Buat informasi penting untuk pembaca dalam bentuk Running Text atau Popup.</p>
                </div>
                <button onClick={openCreateForm} className="px-4 py-2 bg-primary-purple text-white text-sm font-bold rounded-lg hover:bg-[#56298b] transition-colors flex items-center gap-2 shadow-lg shadow-primary-purple/20">
                    <span className="material-symbols-outlined text-xl">add</span>
                    Tambah Pengumuman
                </button>
            </div>

            <div className="max-w-[1400px] mx-auto bg-surface-light dark:bg-surface-super-dark rounded-xl shadow-sm border border-border-light dark:border-[#362348] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-background-light dark:bg-[#1e1528] border-b border-border-light dark:border-[#362348]">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-text-sub dark:text-[#ad92c9]">Status</th>
                                <th className="px-6 py-3 font-semibold text-text-sub dark:text-[#ad92c9]">Judul / Info</th>
                                <th className="px-6 py-3 font-semibold text-text-sub dark:text-[#ad92c9]">Tipe</th>
                                <th className="px-6 py-3 font-semibold text-text-sub dark:text-[#ad92c9]">Target Rute</th>
                                <th className="px-6 py-3 text-right font-semibold text-text-sub dark:text-[#ad92c9]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-[#362348]">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-4 text-center text-text-sub dark:text-[#ad92c9]">Memuat data...</td></tr>
                            ) : announcements.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-4 text-center text-text-sub dark:text-[#ad92c9]">Belum ada pengumuman.</td></tr>
                            ) : (
                                announcements.map((item) => (
                                    <tr key={item.id} className="hover:bg-black/5 dark:hover:bg-[#2a1f36] transition-colors">
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => handleToggle(item.id!, item.is_active)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${item.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500 dark:text-red-400'}`}
                                            >
                                                {item.is_active ? 'Aktif' : 'Nonaktif'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-text-main dark:text-white">
                                            {item.type === 'popup' ? item.title : 'Info Berjalan'}
                                            <div className="text-xs text-text-sub dark:text-[#ad92c9] font-normal truncate max-w-[200px] mt-1">{item.content}</div>
                                        </td>
                                        <td className="px-6 py-4 text-text-sub dark:text-[#ad92c9]">
                                            {item.type === 'running_text' ? 'Running Text' : 'Popup Modal'}
                                        </td>
                                        <td className="px-6 py-4 text-text-sub dark:text-[#ad92c9]">
                                            <div className="text-xs space-y-1">
                                                <div><span className="text-green-500 dark:text-green-400">Tampil:</span> {item.show_on_pages.join(", ")}</div>
                                                <div><span className="text-red-500 dark:text-red-400">Kecuali:</span> {item.exclude_pages.join(", ")}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <button onClick={() => openEditForm(item)} className="p-1.5 text-text-sub dark:text-[#ad92c9] hover:text-primary-purple dark:hover:text-primary-purple transition-colors rounded-md hover:bg-primary-purple/10 dark:hover:bg-primary-purple/10">
                                                <span className="material-symbols-outlined text-xl">edit</span>
                                            </button>
                                            <button onClick={() => setDeleteModal({ isOpen: true, id: item.id!, loading: false })} className="p-1.5 text-text-sub dark:text-[#ad92c9] hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-md hover:bg-red-100 dark:hover:bg-red-500/10">
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

            {/* FORM MODAL */}
            {formModal.isOpen && (
                <div className="fixed inset-0 min-h-screen z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-surface-light dark:bg-[#150d1c] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-border-light dark:border-[#362348] my-8 flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-border-light dark:border-[#362348] flex justify-between items-center bg-background-light dark:bg-[#1a1025] shrink-0">
                            <h2 className="text-xl font-bold text-text-main dark:text-white">{formModal.data.id ? 'Edit Pengumuman' : 'Tambah Pengumuman'}</h2>
                            <button onClick={() => setFormModal({ isOpen: false, data: {}, loading: false })} className="text-text-sub dark:text-[#ad92c9] hover:text-text-main dark:hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSaveForm} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                            <div className={`grid grid-cols-1 gap-4 ${formModal.data.type === 'popup' ? 'md:grid-cols-2' : ''}`}>
                                <div>
                                    <label className="block text-xs font-semibold text-text-sub dark:text-[#ad92c9] uppercase tracking-wider mb-2">Jenis Pengumuman</label>
                                    <select value={formModal.data.type || "running_text"} onChange={e => setFormModal(p => ({ ...p, data: { ...p.data, type: e.target.value as any } }))} className="w-full px-3 py-2 bg-surface-light dark:bg-[#1f1535] border border-border-light dark:border-[#3b2a6e] rounded-lg text-text-main dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple/50">
                                        <option value="running_text">Running Text</option>
                                        <option value="popup">Popup</option>
                                    </select>
                                </div>
                                {formModal.data.type === 'popup' && (
                                    <div>
                                        <label className="block text-xs font-semibold text-text-sub dark:text-[#ad92c9] uppercase tracking-wider mb-2">Judul</label>
                                        <input required type="text" value={formModal.data.title || ""} onChange={e => setFormModal(p => ({ ...p, data: { ...p.data, title: e.target.value } }))} className="w-full px-3 py-2 bg-surface-light dark:bg-[#1f1535] border border-border-light dark:border-[#3b2a6e] rounded-lg text-text-main dark:text-white placeholder-gray-400 dark:placeholder-[#7a6ba0] text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple/50" placeholder="Promo / Info Libur" />
                                    </div>
                                )}
                                {formModal.data.type === 'running_text' && (
                                    <div>
                                        <label className="block text-xs font-semibold text-text-sub dark:text-[#ad92c9] uppercase tracking-wider mb-2">Kecepatan Durasi Animasi</label>
                                        <select value={formModal.data.button_label || "normal"} onChange={e => setFormModal(p => ({ ...p, data: { ...p.data, button_label: e.target.value } }))} className="w-full px-3 py-2 bg-surface-light dark:bg-[#1f1535] border border-border-light dark:border-[#3b2a6e] rounded-lg text-text-main dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple/50">
                                            <option value="lambat">Lambat</option>
                                            <option value="normal">Standar (Normal)</option>
                                            <option value="cepat">Cepat</option>
                                            <option value="sangat_cepat">Sangat Cepat</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-text-sub dark:text-[#ad92c9] uppercase tracking-wider mb-2">Isi Pesan / Teks</label>
                                <textarea required rows={4} value={formModal.data.content || ""} onChange={e => setFormModal(p => ({ ...p, data: { ...p.data, content: e.target.value } }))} className="w-full px-3 py-2 bg-surface-light dark:bg-[#1f1535] border border-border-light dark:border-[#3b2a6e] rounded-lg text-text-main dark:text-white placeholder-gray-400 dark:placeholder-[#7a6ba0] text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple/50" placeholder="Tulis pengumuman di sini..." />
                            </div>

                            {formModal.data.type === 'popup' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-text-sub dark:text-[#ad92c9] uppercase tracking-wider mb-2">Teks Tombol (Opsional)</label>
                                        <input type="text" value={formModal.data.button_label || ""} onChange={e => setFormModal(p => ({ ...p, data: { ...p.data, button_label: e.target.value } }))} className="w-full px-3 py-2 bg-surface-light dark:bg-[#1f1535] border border-border-light dark:border-[#3b2a6e] rounded-lg text-text-main dark:text-white placeholder-gray-400 dark:placeholder-[#7a6ba0] text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple/50" placeholder="misal: Cek Sekarang" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-text-sub dark:text-[#ad92c9] uppercase tracking-wider mb-2">Link Tombol (Opsional)</label>
                                        <input type="text" value={formModal.data.button_link || ""} onChange={e => setFormModal(p => ({ ...p, data: { ...p.data, button_link: e.target.value } }))} className="w-full px-3 py-2 bg-surface-light dark:bg-[#1f1535] border border-border-light dark:border-[#3b2a6e] rounded-lg text-text-main dark:text-white placeholder-gray-400 dark:placeholder-[#7a6ba0] text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple/50" placeholder="https://..." />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4 border-t border-border-light dark:border-[#362348] pt-6">
                                <div>
                                    <label className="block text-xs font-semibold text-text-sub dark:text-[#ad92c9] uppercase tracking-wider mb-2">Target Tampil di URL</label>
                                    <input required type="text" value={(formModal.data.show_on_pages || []).join(", ")} onChange={e => setFormModal(p => ({ ...p, data: { ...p.data, show_on_pages: e.target.value.split(",").map(v => v.trim()).filter(Boolean) } }))} className="w-full px-3 py-2 bg-surface-light dark:bg-[#1f1535] border border-border-light dark:border-[#3b2a6e] rounded-lg text-text-main dark:text-white placeholder-gray-400 dark:placeholder-[#7a6ba0] text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple/50" placeholder="*, /tentang-kami, /informasi/*" />
                                    <p className="text-text-sub dark:text-[#ad92c9] text-xs mt-1">Gunakan koma (,) untuk memisah rute. <b>*</b> untuk semua halaman.</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-sub dark:text-[#ad92c9] uppercase tracking-wider mb-2">Pengecualian URL (Sembunyikan)</label>
                                    <input required type="text" value={(formModal.data.exclude_pages || []).join(", ")} onChange={e => setFormModal(p => ({ ...p, data: { ...p.data, exclude_pages: e.target.value.split(",").map(v => v.trim()).filter(Boolean) } }))} className="w-full px-3 py-2 bg-surface-light dark:bg-[#1f1535] border border-border-light dark:border-[#3b2a6e] rounded-lg text-text-main dark:text-white placeholder-gray-400 dark:placeholder-[#7a6ba0] text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple/50" placeholder="/admin*, /superadmin*" />
                                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">Halaman admin & superadmin SELALU DIKECUALIKAN oleh sistem.</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border-light dark:border-[#362348]">
                                <button type="button" onClick={() => setFormModal({ isOpen: false, data: {}, loading: false })} className="px-5 py-2 text-sm font-bold text-text-sub dark:text-[#ad92c9] hover:text-text-main dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#362348] rounded-lg transition-colors">Batal</button>
                                <button type="submit" disabled={formModal.loading} className="px-5 py-2 bg-primary-purple text-white text-sm font-bold rounded-lg hover:bg-[#56298b] transition-colors shadow-lg shadow-primary-purple/20 disabled:opacity-50">
                                    {formModal.loading ? 'Menyimpan...' : 'Simpan Pengumuman'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleDelete}
                title="Hapus Pengumuman"
                message="Apakah Anda yakin ingin menghapus pengumuman ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus"
                isDestructive={true}
                isLoading={deleteModal.loading}
            />
        </main>
    );
}
