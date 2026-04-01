"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

interface ThemeToggleProps {
    placement?: "top" | "bottom";
}

export default function ThemeToggle({ placement = "bottom" }: ThemeToggleProps) {
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!mounted) {
        return <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 animate-pulse" />;
    }

    const currentTheme = theme === "system" ? systemTheme : theme;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-text-main hover:bg-black/5 dark:text-white dark:hover:bg-white/10 transition-colors"
                title="Pilih Tema"
                aria-label="Pilih Tema"
            >
                <span className="material-symbols-outlined">
                    {theme === 'system' ? 'desktop_windows' : currentTheme === "dark" ? "dark_mode" : "light_mode"}
                </span>
            </button>

            {isOpen && (
                <div className={`absolute right-0 ${placement === "bottom" ? "top-full mt-2" : "bottom-full mb-2"} w-[200px] rounded-xl bg-surface-light dark:bg-[#2a1f36] border border-border-light dark:border-[#362348] shadow-2xl p-2 z-[100] flex flex-col gap-1`}>
                    <button
                        onClick={() => { setTheme('light'); setIsOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${theme === 'light' ? 'bg-primary-purple/10 text-primary-purple font-bold' : 'text-text-main dark:text-[#d0bcff] hover:bg-black/5 dark:hover:bg-white/5 font-medium'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">light_mode</span>
                        Terang
                    </button>
                    <button
                        onClick={() => { setTheme('dark'); setIsOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${theme === 'dark' ? 'bg-primary-purple/10 text-primary-purple font-bold' : 'text-text-main dark:text-[#d0bcff] hover:bg-black/5 dark:hover:bg-white/5 font-medium'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">dark_mode</span>
                        Gelap
                    </button>
                    <div className="h-px w-full bg-border-light dark:bg-[#362348] my-1" />
                    <button
                        onClick={() => { setTheme('system'); setIsOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${theme === 'system' ? 'bg-primary-purple/10 text-primary-purple font-bold' : 'text-text-main dark:text-[#d0bcff] hover:bg-black/5 dark:hover:bg-white/5 font-medium'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">desktop_windows</span>
                        Berdasarkan Perangkat
                    </button>
                </div>
            )}
        </div>
    );
}
