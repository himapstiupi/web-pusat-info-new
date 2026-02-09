"use client";

import { useState } from "react";
import SuperSidebar from "@/components/superadmin/SuperSidebar";
import SuperHeader from "@/components/superadmin/SuperHeader";

export default function SuperAdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="dark bg-bg-super-dark text-white font-display h-screen flex overflow-hidden selection:bg-primary-purple selection:text-white">
            <SuperSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-all"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <SuperHeader onMenuClick={() => setIsSidebarOpen(true)} />
                {children}
            </div>
        </div>
    );
}
