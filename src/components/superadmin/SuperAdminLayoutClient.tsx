"use client";

import { useState } from "react";
import SuperSidebar from "@/components/superadmin/SuperSidebar";
import SuperHeader from "@/components/superadmin/SuperHeader";
import { Toaster } from "react-hot-toast";

export default function SuperAdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="dark bg-bg-super-dark text-white font-display h-screen flex overflow-hidden selection:bg-primary-purple selection:text-white">
            <Toaster position="top-right" toastOptions={{
                style: { background: '#1f1535', color: '#fff', border: '1px solid #3b2a6e' },
                success: { iconTheme: { primary: '#a980e8', secondary: '#fff' } }
            }} />

            <SuperSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-all"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
                <SuperHeader onMenuClick={() => setIsSidebarOpen(true)} />
                <div className="flex-1 p-6 md:p-8">
                    {children}
                </div>
            </div>

        </div>
    );
}
