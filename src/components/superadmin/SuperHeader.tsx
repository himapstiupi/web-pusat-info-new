"use client";

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'

interface SuperHeaderProps {
    onMenuClick?: () => void;
}

export default function SuperHeader({ onMenuClick }: SuperHeaderProps) {
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
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
        <header className="h-20 border-b border-[#362348] px-8 flex items-center justify-between shrink-0 bg-bg-super-dark/95 backdrop-blur-sm sticky top-0 z-20 md:hidden">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h1 className="text-xl font-bold text-white tracking-tight">Superadmin Panel</h1>
            </div>
            <div className="flex items-center gap-6">
                {/* Profile removed as requested */}
            </div>
        </header>
    )
}
