"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    title: string;
}

export default function ShareModal({ isOpen, onClose, url, title }: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!isOpen || !mounted) return null;

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareLinks = [
        {
            name: "WhatsApp",
            icon: "chat",
            color: "bg-green-500",
            action: () => window.open(`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, '_blank')
        },
        {
            name: "Twitter",
            icon: "post",
            color: "bg-black",
            action: () => window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, '_blank')
        },
        {
            name: "Telegram",
            icon: "send",
            color: "bg-blue-500",
            action: () => window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`, '_blank')
        },
        {
            name: "Threads",
            icon: "alternate_email",
            color: "bg-black",
            action: () => window.open(`https://threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}`, '_blank')
        },
        {
            name: "Instagram",
            icon: "photo_camera",
            color: "bg-pink-600",
            action: () => copyLink("Instagram")
        },
        {
            name: "YouTube",
            icon: "play_arrow",
            color: "bg-red-600",
            action: () => copyLink("YouTube")
        },
        {
            name: "TikTok",
            icon: "music_note",
            color: "bg-black",
            action: () => copyLink("TikTok")
        }
    ];

    const copyLink = (platform?: string) => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const modal = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-surface-dark rounded-2xl w-full max-w-md p-6 shadow-xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-text-main dark:text-white">Bagikan Artikel</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <span className="material-symbols-outlined text-text-sub">close</span>
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                    {shareLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={link.action}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className={`${link.color} text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                                <span className="material-symbols-outlined">{link.icon}</span>
                            </div>
                            <span className="text-xs text-text-sub dark:text-gray-400 font-medium">{link.name}</span>
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-border-light dark:border-border-dark">
                        <span className="material-symbols-outlined text-text-sub">link</span>
                        <input
                            type="text"
                            readOnly
                            value={url}
                            className="flex-1 bg-transparent text-sm text-text-main dark:text-white outline-none"
                        />
                        <button
                            onClick={() => copyLink()}
                            className="px-3 py-1.5 bg-white dark:bg-gray-700 text-text-main dark:text-white text-xs font-bold rounded-md shadow-sm border border-border-light dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                            {copied ? "Disalin!" : "Salin"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}
