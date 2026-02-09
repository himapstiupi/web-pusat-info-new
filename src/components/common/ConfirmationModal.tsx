"use client";

import { useEffect, useState } from "react";

type ConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    isLoading?: boolean;
};

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Konfirmasi",
    cancelText = "Batal",
    isDestructive = false,
    isLoading = false,
}: ConfirmationModalProps) {
    const [show, setShow] = useState(isOpen);

    useEffect(() => {
        setShow(isOpen);
    }, [isOpen]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg w-full max-w-sm p-6 transform transition-all scale-100">
                <div className="flex flex-col items-center text-center">
                    <div className={`mb-4 p-3 rounded-full ${isDestructive ? "bg-red-50 text-red-500 dark:bg-red-900/20" : "bg-blue-50 text-blue-500 dark:bg-blue-900/20"}`}>
                        <span className="material-symbols-outlined text-3xl">
                            {isDestructive ? "warning" : "info"}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">
                        {title}
                    </h3>
                    <p className="text-sm text-text-sub dark:text-gray-400 mb-6">
                        {message}
                    </p>
                    <div className="flex gap-3 w-full">
                        {cancelText && (
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 border border-border-light dark:border-border-dark rounded-lg text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm disabled:opacity-50"
                            >
                                {cancelText}
                            </button>
                        )}
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 px-4 py-2 rounded-lg font-bold text-white transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-70 ${isDestructive
                                ? "bg-danger hover:bg-red-600"
                                : "bg-primary hover:bg-primary-dark"
                                }`}
                        >
                            {isLoading && (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            )}
                            {isLoading ? "Memproses..." : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
