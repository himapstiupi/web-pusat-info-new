import { createClient } from "@/lib/supabase/server";
import { stripHtml } from "@/lib/utils";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Link from "next/link";

export const dynamic = 'force-dynamic'; // Force dynamic rendering for search

export async function generateMetadata({ searchParams }: { searchParams: { q: string } }) {
    const { q } = await searchParams;
    const query = q || "Pencarian";
    return {
        title: `Pencarian: ${query}`,
    };
}

export default async function SearchPage({ searchParams }: { searchParams: { q: string } }) {
    const supabase = await createClient();
    const { q } = await searchParams;
    const query = q || "";

    // Fetch Search Results
    const { data: articles } = await supabase
        .from("articles")
        .select(`
            *,
            categories (
                title,
                slug
            )
        `)
        .eq("is_published", true)
        .ilike("title", `%${query}%`)
        .order("views", { ascending: false });

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow bg-background-light dark:bg-background-dark pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 md:px-8">
                    <header className="mb-8">
                        <p className="text-text-sub dark:text-gray-400 mb-2 leading-relaxed">Hasil pencarian untuk:</p>
                        <h1 className="text-3xl font-black text-text-main dark:text-white break-words leading-tight">"{query}"</h1>
                    </header>

                    <div className="space-y-4">
                        {articles && articles.length > 0 ? (
                            articles.map((article) => (
                                <Link key={article.id} href={`/articles/${article.id}`} className="block bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 hover:shadow-md hover:border-primary/50 transition-all group">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="bg-blue-50 dark:bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">
                                                    {(article.categories as any)?.title || "Umum"}
                                                </span>
                                                <span className="text-xs text-text-sub dark:text-gray-500">
                                                    {new Date(article.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-text-main dark:text-white mb-2 group-hover:text-primary transition-colors leading-snug">
                                                {article.title}
                                            </h3>
                                            <p className="text-text-sub dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
                                                {stripHtml(article.content).substring(0, 150)}...
                                            </p>
                                        </div>
                                        <div className="text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors mt-2">
                                            <span className="material-symbols-outlined text-2xl">chevron_right</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark border-dashed">
                                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">search_off</span>
                                <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">Tidak ditemukan hasil</h3>
                                <p className="text-text-sub dark:text-gray-400">Coba kata kunci lain atau periksa ejaan Anda.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
