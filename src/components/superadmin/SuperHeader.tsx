"use client";

import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/common/ThemeToggle';

interface SuperHeaderProps {
    onMenuClick?: () => void;
}

export default function SuperHeader({ onMenuClick }: SuperHeaderProps) {
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, email')
                    .eq('id', authUser.id)
                    .single();

                if (profile) {
                    setUser({ name: profile.full_name, email: profile.email });
                }
            }
        };
        fetchUser();
    }, []);

    return (
        <header className="h-16 md:h-20 border-b border-border-light dark:border-[#362348] px-4 md:px-8 flex items-center justify-between shrink-0 bg-surface-light/95 dark:bg-bg-super-dark/95 backdrop-blur-sm sticky top-0 z-20 md:hidden">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden text-text-main dark:text-white hover:bg-black/5 dark:hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h1 className="text-lg md:text-xl font-bold text-text-main dark:text-white tracking-tight truncate max-w-[150px] xs:max-w-[200px] sm:max-w-none">Superadmin Panel</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-6">
                <ThemeToggle />
            </div>
        </header>
    )
}
