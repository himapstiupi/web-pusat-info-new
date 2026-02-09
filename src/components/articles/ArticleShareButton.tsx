"use client";

import { useState, useEffect } from "react";
import ShareModal from "@/components/common/ShareModal";

interface ArticleShareButtonProps {
    title: string;
}

export default function ArticleShareButton({ title }: ArticleShareButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUrl, setCurrentUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentUrl(window.location.href);
        }
    }, []);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-all text-text-sub hover:text-primary dark:text-gray-400 dark:hover:text-primary"
            >
                <span className="material-symbols-outlined text-xl">share</span>
                <span className="text-sm font-medium">Bagikan</span>
            </button>

            <ShareModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                url={currentUrl}
                title={title}
            />
        </>
    );
}
