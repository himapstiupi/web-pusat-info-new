"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";

type DashboardStats = {
    totalArticles: number;
    totalViews: number;
};

type ActivityLog = {
    id: string;
    title: string;
    author_name: string;
    created_at: string;
    author_avatar?: string;
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({ totalArticles: 0, totalViews: 0 });
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Total Articles
                const { count: articlesCount, error: countError } = await supabase
                    .from("articles")
                    .select("*", { count: "exact", head: true });

                if (countError) throw countError;

                // 2. Fetch Total Categories
                const { count: categoryCount, error: catError } = await supabase
                    .from("categories")
                    .select("*", { count: "exact", head: true });

                if (catError) throw catError;

                setStats({
                    totalArticles: articlesCount || 0,
                    totalViews: categoryCount || 0, // Using totalViews field for categories count temporarily
                });

                // 3. Fetch Recent Activity (Latest Articles)
                const { data: activityData, error: activityError } = await supabase
                    .from("articles")
                    .select(`
                        id,
                        title,
                        created_at,
                        profiles (
                            full_name,
                            email,
                            avatar_url
                        )
                    `)
                    .order("created_at", { ascending: false })
                    .limit(10);

                if (activityError) throw activityError;

                const formattedActivities: ActivityLog[] = activityData?.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    author_name: item.profiles?.full_name || item.profiles?.email || "Admin",
                    created_at: item.created_at,
                    author_avatar: item.profiles?.avatar_url
                })) || [];

                setActivities(formattedActivities);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " tahun yang lalu";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " bulan yang lalu";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " hari yang lalu";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " jam yang lalu";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " menit yang lalu";
        return Math.floor(seconds) + " detik yang lalu";
    };

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background-light dark:bg-background-dark p-4 md:p-8">


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-lg bg-blue-50 dark:bg-primary/20 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">article</span>
                        </div>
                    </div>
                    <p className="text-text-sub dark:text-gray-400 text-sm font-medium">Total Artikel</p>
                    <h3 className="text-3xl font-bold text-text-main dark:text-white mt-1">
                        {loading ? "..." : stats.totalArticles}
                    </h3>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <span className="material-symbols-outlined">category</span>
                        </div>
                    </div>
                    <p className="text-text-sub dark:text-gray-400 text-sm font-medium">Total Kategori</p>
                    <h3 className="text-3xl font-bold text-text-main dark:text-white mt-1">
                        {loading ? "..." : stats.totalViews.toLocaleString()}
                    </h3>
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-text-main dark:text-white">Riwayat Aktivitas Admin</h3>
                        <p className="text-sm text-text-sub dark:text-gray-400">Aktivitas terbaru dari para admin.</p>
                    </div>
                </div>
                <div className="divide-y divide-border-light dark:divide-border-dark">
                    {loading ? (
                        <div className="p-6 text-center text-text-sub">Memuat aktivitas...</div>
                    ) : activities.length === 0 ? (
                        <div className="p-6 text-center text-text-sub">Belum ada aktivitas.</div>
                    ) : (
                        activities.map((activity) => (
                            <div key={activity.id} className="p-6 hover:bg-background-light dark:hover:bg-background-dark/30 transition-colors flex gap-4 items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-primary/20 flex items-center justify-center text-primary overflow-hidden">
                                        {activity.author_avatar ? (
                                            <img src={activity.author_avatar} alt={activity.author_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="material-symbols-outlined text-lg">person</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-text-main dark:text-white font-medium">
                                        {timeAgo(activity.created_at)} admin <span className="font-bold text-primary">{activity.author_name}</span> menambahkan artikel <span className="font-bold text-text-main dark:text-white">"{activity.title}"</span>
                                    </p>
                                    <p className="text-xs text-text-sub dark:text-gray-500 mt-1">
                                        {new Date(activity.created_at).toLocaleString("id-ID", { dateStyle: 'full', timeStyle: 'short' })}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
