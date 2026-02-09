"use client";

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import ConfirmationModal from '../common/ConfirmationModal'

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/admin/login');
        router.refresh();
    };

    // Periodic status check to handle revocation while active
    useEffect(() => {
        const checkStatus = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('status')
                    .eq('id', user.id)
                    .single();

                if (profile && profile.status !== 'approved') {
                    await supabase.auth.signOut();
                    router.push('/admin/login?error=account_suspended');
                    router.refresh();
                }
            }
        };

        checkStatus(); // Initial check
        const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, [router]);

    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(`${path}/`);
    };

    const linkClass = (path: string) => {
        const active = isActive(path);
        const baseClass = "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200";
        const activeClass = "bg-blue-50 dark:bg-primary/10 text-primary shadow-sm shadow-blue-100 dark:shadow-none";
        const inactiveClass = "text-text-sub dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-light/5 hover:text-text-main dark:hover:text-white";

        return `${baseClass} ${active ? activeClass : inactiveClass}`;
    };

    return (
        <>
            <aside className={`w-64 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex-col flex-shrink-0 transition-all duration-300
                ${isOpen ? 'fixed inset-y-0 left-0 z-50 flex h-full shadow-2xl' : 'hidden md:flex'}
            `}>
                {/* Mobile Close Button */}
                <div className="md:hidden absolute top-4 right-4 z-50">
                    <button onClick={onClose} className="text-text-sub hover:text-text-main dark:text-gray-400 dark:hover:text-white p-1">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="h-16 flex items-center gap-3 px-6 border-b border-border-light dark:border-border-dark bg-surface-light/50 dark:bg-surface-dark/50 backdrop-blur-sm">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden">
                        <img src="/hima-logo.png" alt="HIMA PSTI Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-text-main dark:text-white">HIMA PSTI</span>
                </div>
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <p className="px-4 text-xs font-bold text-text-sub/70 dark:text-gray-500 uppercase tracking-widest mb-3">
                        Menu Utama
                    </p>
                    <Link
                        href="/admin/dashboard"
                        className={linkClass("/admin/dashboard")}
                    >
                        <span className="material-symbols-outlined">dashboard</span>
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/categories"
                        className={linkClass("/admin/categories")}
                    >
                        <span className="material-symbols-outlined">category</span>
                        Kategori
                    </Link>
                    <Link
                        href="/admin/articles"
                        className={linkClass("/admin/articles")}
                    >
                        <span className="material-symbols-outlined">article</span>
                        Artikel
                    </Link>
                </nav>
                <div className="p-4 border-t border-border-light dark:border-border-dark bg-surface-light/30 dark:bg-surface-dark/30">
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-danger hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors duration-200"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Keluar
                    </button>
                </div>
            </aside>

            <ConfirmationModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
                title="Konfirmasi Keluar"
                message="Apakah Anda yakin ingin keluar dari halaman admin?"
                confirmText="Keluar"
                isDestructive={true}
                isLoading={isLoading}
            />
        </>
    )
}
