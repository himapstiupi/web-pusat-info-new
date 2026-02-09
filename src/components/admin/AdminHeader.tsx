"use client";

import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

interface AdminHeaderProps {
    onMenuClick?: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
    const pathname = usePathname();
    const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setUser({
                    name: user.user_metadata?.full_name || "Admin",
                    email: user.email || "",
                    avatar: user.user_metadata?.avatar_url || ""
                });
            }
        };
        fetchUser();
    }, []);

    const getPageTitle = (path: string) => {
        if (path === '/admin/dashboard') return 'Dashboard Overview';
        if (path === '/admin/articles') return 'Kelola Artikel';
        if (path === '/admin/articles/create') return 'Buat Artikel Baru';
        if (path.startsWith('/admin/articles/edit/')) return 'Edit Artikel';
        if (path === '/admin/categories') return 'Kelola Kategori';
        if (path === '/admin/categories/create') return 'Buat Kategori Baru';
        if (path.startsWith('/admin/categories/edit/')) return 'Edit Kategori';
        return 'Admin Panel';
    };

    return (
        <header className="h-16 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 text-text-sub hover:text-text-main dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h2 className="text-lg md:text-xl font-bold text-text-main dark:text-white truncate max-w-[200px] md:max-w-none">{getPageTitle(pathname)}</h2>
            </div>
            <div className="flex items-center gap-4 md:gap-6">
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-text-main dark:text-white">{user?.name || "Memuat..."}</p>
                        <p className="text-xs text-text-sub">{user?.email || ""}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                        {user?.avatar ? (
                            <img
                                alt="Admin Avatar"
                                className="w-full h-full object-cover"
                                src={user.avatar}
                            />
                        ) : (
                            <span className="material-symbols-outlined">person</span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
