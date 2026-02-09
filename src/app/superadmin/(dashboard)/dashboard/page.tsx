import AdminApprovalList from "@/components/superadmin/AdminApprovalList";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

async function getStats() {
    const supabase = await createClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // 1. Total Admins (Active)
    const { count: totalAdmins } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin")
        .eq("status", "approved");

    const { count: newAdminsToday } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin")
        .eq("status", "approved")
        .gte("created_at", todayISO);

    // 2. Total Articles
    const { count: totalArticles } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true });

    const { count: newArticlesToday } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayISO);

    // 3. Total Categories
    const { count: totalCategories } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true });

    return {
        totalAdmins: totalAdmins || 0,
        newAdminsToday: newAdminsToday || 0,
        totalArticles: totalArticles || 0,
        newArticlesToday: newArticlesToday || 0,
        totalCategories: totalCategories || 0,
    };
}

async function getRecentActivity() {
    const supabase = await createClient();

    // Fetch recent articles
    const { data: articles } = await supabase
        .from("articles")
        .select(`
            title,
            created_at,
            profiles:author_id (
                full_name,
                email
            )
        `)
        .order("created_at", { ascending: false })
        .limit(5);

    // Fetch recent approved admins
    const { data: newAdmins } = await supabase
        .from("profiles")
        .select("full_name, email, created_at")
        .eq("role", "admin")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(5);

    // Normalize and merge
    const activityItems = [
        ...(articles?.map(a => ({
            type: 'article',
            title: a.title,
            user: (a.profiles as any)?.full_name || (a.profiles as any)?.email || "Unknown Author",
            time: new Date(a.created_at),
            description: "Published new article"
        })) || []),
        ...(newAdmins?.map(a => ({
            type: 'admin',
            title: "New Admin Joined",
            user: a.full_name || a.email,
            time: new Date(a.created_at),
            description: "Account approved"
        })) || [])
    ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 10);

    return activityItems;
}

export default async function SuperAdminDashboard() {
    const stats = await getStats();
    const activities = await getRecentActivity();

    return (
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-[1400px] mx-auto space-y-6">
                {/* Welcome */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-white text-3xl font-black tracking-tight mb-2">Selamat Datang, Superadmin</h2>
                        <p className="text-[#ad92c9] font-medium">Panel Kontrol Utama & Manajemen Admin</p>
                    </div>
                </div>

                {/* Admin Approval Section */}
                <AdminApprovalList />

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Stat Card 1 */}
                    <div className="bg-surface-super-dark rounded-2xl p-6 border border-[#362348] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-white">group</span>
                        </div>
                        <p className="text-[#ad92c9] text-sm font-medium mb-1">Total Admin Aktif</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-white text-3xl font-bold">{stats.totalAdmins}</h3>
                            {stats.newAdminsToday > 0 && (
                                <span className="text-[#0bda73] text-sm font-semibold bg-[#0bda73]/10 px-2 py-0.5 rounded">+{stats.newAdminsToday} new</span>
                            )}
                        </div>
                    </div>
                    {/* Stat Card 2 */}
                    <div className="bg-surface-super-dark rounded-2xl p-6 border border-[#362348] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-white">article</span>
                        </div>
                        <p className="text-[#ad92c9] text-sm font-medium mb-1">Total Artikel</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-white text-3xl font-bold">{stats.totalArticles}</h3>
                            {stats.newArticlesToday > 0 && (
                                <span className="text-[#0bda73] text-sm font-semibold bg-[#0bda73]/10 px-2 py-0.5 rounded">+{stats.newArticlesToday} today</span>
                            )}
                        </div>
                    </div>
                    {/* Stat Card 3 */}
                    <div className="bg-surface-super-dark rounded-2xl p-6 border border-[#362348] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-white">category</span>
                        </div>
                        <p className="text-[#ad92c9] text-sm font-medium mb-1">Total Kategori</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-white text-3xl font-bold">{stats.totalCategories}</h3>
                        </div>
                    </div>
                </div>

                {/* Activity Widget */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-surface-super-dark rounded-2xl border border-[#362348] p-6 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-white text-lg font-bold">Aktivitas Terkini</h3>
                            {/* <button className="text-[#ad92c9] hover:text-white transition-colors">
                                <span className="material-symbols-outlined">more_horiz</span>
                            </button> */}
                        </div>
                        <div className="flex flex-col gap-5 overflow-y-auto pr-2 max-h-[400px]">
                            {activities.length > 0 ? (
                                activities.map((activity, index) => (
                                    <div key={index} className="flex gap-3 items-start group">
                                        <div className={`size-10 rounded-full flex items-center justify-center shrink-0 border border-[#362348] group-hover:border-primary-purple transition-colors ${activity.type === 'article' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>
                                            <span className="material-symbols-outlined text-xl">
                                                {activity.type === 'article' ? 'article' : 'person_add'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className="text-white text-sm font-semibold truncate">{activity.user}</p>
                                                <span className="text-[#ad92c9] text-xs whitespace-nowrap">
                                                    {new Date(activity.time).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-[#ad92c9] text-sm leading-tight mt-0.5 group-hover:text-white transition-colors">
                                                {activity.description} <span className="text-primary-purple font-medium">{activity.title}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[#ad92c9] text-center py-4">Belum ada aktivitas terkini.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
