"use client";

import Link from 'next/link'
import NextImage from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import ConfirmationModal from '@/components/common/ConfirmationModal'

interface SuperSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function SuperSidebar({ isOpen = false, onClose }: SuperSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const [userProfile, setUserProfile] = useState<{ name: string, email: string } | null>(null);

    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(`${path}/`);
    };

    const linkClass = (path: string) => {
        const active = isActive(path);
        const baseClass = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200";
        const activeClass = "bg-primary-purple text-white shadow-md shadow-primary-purple/20 hover:bg-primary-purple/90";
        const inactiveClass = "text-[#ad92c9] hover:bg-[#362348]/50 hover:text-white";

        return `${baseClass} ${active ? activeClass : inactiveClass}`;
    };

    const handleLogout = () => {
        setShowLogoutModal(true)
    }

    const confirmLogout = async () => {
        setIsLoading(true)
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/superadmin/login')
        router.refresh()
    }

    // Periodic status check to handle revocation while active
    useEffect(() => {
        const checkStatus = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('status, full_name, email')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    if (profile.status !== 'approved') {
                        await supabase.auth.signOut();
                        router.push('/superadmin/login?error=account_suspended');
                        router.refresh();
                    } else {
                        setUserProfile({ name: profile.full_name, email: profile.email });
                    }
                }
            }
        };

        checkStatus(); // Initial check
        const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, [router]);

    return (
        <aside className={`w-72 bg-surface-super-dark/50 dark:bg-[#150d1c] border-r border-[#362348] flex-col justify-between shrink-0 transition-all duration-300
            ${isOpen ? 'fixed inset-y-0 left-0 z-50 flex h-full bg-[#150d1c] shadow-2xl' : 'hidden md:flex'}
        `}>
            {/* Mobile Close Button */}
            <div className="md:hidden absolute top-4 right-4 z-50">
                <button onClick={onClose} className="text-[#ad92c9] hover:text-white p-1">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
            <div className="flex flex-col gap-6 p-6">
                {/* Branding */}
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                        <NextImage
                            src="/hima-logo.png"
                            alt="HIMA PSTI Logo"
                            width={40}
                            height={40}
                            className="w-full h-full object-contain p-1"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-white text-lg font-bold leading-none tracking-tight">
                            HIMA PSTI
                        </h1>
                        <p className="text-[#ad92c9] text-xs font-medium mt-1">Superadmin</p>
                    </div>
                </div>
                {/* Navigation */}
                <nav className="flex flex-col gap-2">
                    <Link
                        href="/superadmin/dashboard"
                        className={linkClass("/superadmin/dashboard")}
                    >
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-sm font-semibold">Dashboard</span>
                    </Link>
                    <Link
                        href="/superadmin/admins"
                        className={linkClass("/superadmin/admins")}
                    >
                        <span className="material-symbols-outlined">supervisor_account</span>
                        <span className="text-sm font-medium">Manajemen Admin</span>
                    </Link>
                    <Link
                        href="/superadmin/categories"
                        className={linkClass("/superadmin/categories")}
                    >
                        <span className="material-symbols-outlined">category</span>
                        <span className="text-sm font-medium">Kategori</span>
                    </Link>
                    <Link
                        href="/superadmin/articles"
                        className={linkClass("/superadmin/articles")}
                    >
                        <span className="material-symbols-outlined">article</span>
                        <span className="text-sm font-medium">Artikel</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors mt-4 w-full text-left"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-sm font-medium">{isLoading ? 'Keluar...' : 'Keluar'}</span>
                    </button>
                </nav>
            </div>

            <div className="p-6 border-t border-[#362348] bg-[#1a1025]/50">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-white/10 flex items-center justify-center border-2 border-primary-purple shrink-0 text-white">
                        <span className="material-symbols-outlined">person</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <p className="text-white text-sm font-bold truncate">{userProfile?.name || "Loading..."}</p>
                        <p className="text-[#ad92c9] text-xs truncate max-w-[150px]">{userProfile?.email || "Superadmin"}</p>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={confirmLogout}
                title="Konfirmasi Keluar"
                message="Apakah Anda yakin ingin keluar dari Super Panel?"
                confirmText="Ya, Keluar"
                cancelText="Batal"
                isDestructive={true}
                isLoading={isLoading}
            />
        </aside>
    )
}
