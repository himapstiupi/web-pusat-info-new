"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Announcement } from '@/actions/announcements';

// Helper to check wildcard path match
function matchPath(path: string, pattern: string) {
    if (pattern === '*') return true;
    if (pattern.endsWith('/*')) {
        const prefix = pattern.slice(0, -2);
        return path === prefix || path.startsWith(prefix + '/');
    }
    return path === pattern;
}

export default function GlobalAnnouncementsClient({ announcements }: { announcements: Announcement[] }) {
    const pathname = usePathname() || '';
    const [mounted, setMounted] = useState(false);
    const [closedPopups, setClosedPopups] = useState<string[]>([]);

    useEffect(() => {
        setMounted(true);
        // Load closed popups from session storage
        try {
            const stored = sessionStorage.getItem('closed_announcements');
            if (stored) {
                setClosedPopups(JSON.parse(stored));
            }
        } catch (e) { }
    }, []);

    // HARDCODE EXCLUSION for admin/superadmin
    if (pathname.startsWith('/admin') || pathname.startsWith('/superadmin')) {
        return null;
    }

    if (!mounted || announcements.length === 0) return null;

    // Filter valid announcements for this path
    const activeForPath = announcements.filter(a => {
        // Exclude check first
        for (const exclude of a.exclude_pages) {
            if (matchPath(pathname, exclude)) return false;
        }

        // Include check
        for (const include of a.show_on_pages) {
            if (matchPath(pathname, include)) return true;
        }

        return false;
    });

    const runningTexts = activeForPath.filter(a => a.type === 'running_text');

    // Create a unique key for the popup based on ID and when it was last updated
    const getPopupKey = (a: Announcement) => {
        if (!a.id) return '';
        const timeKey = a.updated_at ? new Date(a.updated_at).getTime() : '';
        return `${a.id}_${timeKey}`;
    };

    const popups = activeForPath.filter(a => {
        if (a.type !== 'popup' || !a.id) return false;
        const key = getPopupKey(a);
        return !closedPopups.includes(key);
    });

    const handleClosePopup = (a: Announcement) => {
        const key = getPopupKey(a);
        const updated = [...closedPopups, key];
        setClosedPopups(updated);
        sessionStorage.setItem('closed_announcements', JSON.stringify(updated));
    };

    // Calculate running text speed dynamically based on total characters and selected mode
    const totalChars = runningTexts.reduce((acc, rt) => acc + rt.content.length, 0);
    const primarySpeedSetting = runningTexts[0]?.button_label || 'normal';
    const baseDuration = Math.max(15, totalChars * 0.15); // Base formula: 15s min, +0.15s per char
    
    const speedMapping: Record<string, number> = {
        'lambat': baseDuration * 1.5,
        'normal': baseDuration,
        'cepat': baseDuration * 0.6,
        'sangat_cepat': baseDuration * 0.3
    };
    const calculatedDuration = `${speedMapping[primarySpeedSetting] || baseDuration}s`;

    return (
        <>
            {/* 1. Running Text (Top-level) */}
            {runningTexts.length > 0 && (
                <div className="bg-red-600 text-white text-xs md:text-sm font-semibold overflow-hidden flex items-center h-10 shrink-0">
                    <div 
                        className="whitespace-nowrap flex items-center animate-[marquee_20s_linear_infinite] px-4 w-fit"
                        style={{ animationDuration: calculatedDuration }}
                    >
                        {runningTexts.map((rt, idx) => (
                            <div key={rt.id || idx} className="mx-8 flex items-center shrink-0">
                                <span className="material-symbols-outlined text-sm mr-2 opacity-80">campaign</span>
                                <span>{rt.content}</span>
                                {rt.button_link && rt.button_label && rt.button_label !== 'lambat' && rt.button_label !== 'normal' && rt.button_label !== 'cepat' && rt.button_label !== 'sangat_cepat' && (
                                    <Link 
                                      href={rt.button_link} 
                                      className="ml-3 underline decoration-white/50 hover:decoration-white transition-all text-white font-bold"
                                    >
                                        {rt.button_label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 2. Popups */}
            {popups.length > 0 && popups.map((popup) => (
                <div key={popup.id} className="fixed inset-0 min-h-screen z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#1a1025] w-full max-w-[30rem] max-h-[90vh] flex flex-col rounded-3xl shadow-2xl shadow-indigo-500/10 overflow-hidden relative animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-[#362348]">
                        
                        {/* Decorative background glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                        {/* Close Button */}
                        <button 
                            onClick={() => handleClosePopup(popup)}
                            className="absolute top-4 right-4 z-[110] w-8 h-8 flex items-center justify-center rounded-full bg-slate-100/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-all backdrop-blur-sm"
                        >
                            <span className="material-symbols-outlined text-sm font-bold">close</span>
                        </button>

                        {/* Header Section */}
                        <div className="flex-shrink-0 px-8 pt-10 pb-4 text-center relative z-10 w-full flex flex-col items-center">
                            {/* Icon Container with elegant look */}
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 dark:opacity-40 animate-pulse rounded-full w-16 h-16 pointer-events-none"></div>
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 transform hover:scale-110 transition-transform duration-300 relative z-10">
                                    <span className="material-symbols-outlined text-3xl">info</span>
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
                                {popup.title}
                            </h3>
                            
                            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                        </div>

                        {/* Scrollable Body Section */}
                        <div className="flex-1 overflow-y-auto px-8 py-4 text-center relative z-10 custom-scrollbar">
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-[15px]">
                                {popup.content}
                            </p>
                        </div>

                        {/* Footer Section */}
                        <div className="flex-shrink-0 px-8 py-6 text-center relative z-10 bg-white/50 dark:bg-[#1a1025]/50 backdrop-blur-md border-t border-slate-100/50 dark:border-white/5 w-full">
                            {popup.button_link && popup.button_label ? (
                                <Link 
                                    href={popup.button_link}
                                    onClick={() => handleClosePopup(popup)}
                                    className="block w-full text-center relative group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
                                >
                                    <div className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full -translate-x-full transition-transform duration-500 ease-in-out skew-x-12"></div>
                                    <div className="px-8 py-[14px] relative z-10 flex items-center justify-center gap-2">
                                        <span>{popup.button_label}</span>
                                        <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </div>
                                </Link>
                            ) : (
                                <button 
                                    onClick={() => handleClosePopup(popup)}
                                    className="w-full px-8 py-[14px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-xl transition-colors text-[15px]"
                                >
                                    Tutup
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(100vw); }
                    100% { transform: translateX(-100%); }
                }
            `}</style>
        </>
    );
}
