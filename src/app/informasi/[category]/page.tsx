import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { category: string } }) {
    const supabase = await createClient();
    const { category } = await params;

    const { data: cat } = await supabase
        .from("categories")
        .select("title")
        .eq("slug", category)
        .single();

    if (!cat) {
        return {
            title: "Kategori Tidak Ditemukan",
        };
    }

    return {
        title: cat.title,
    };
}

export default async function CategoryPage({ 
    params,
    searchParams 
}: { 
    params: { category: string },
    searchParams: Promise<{ page?: string }>
}) {
    const supabase = await createClient();
    const { category } = await params;
    
    // Pagination logic
    const resolvedSearchParams = await searchParams;
    const page = parseInt(resolvedSearchParams.page || "1", 10);
    const limit = 15;
    const offset = (page - 1) * limit;

    // Fetch Category
    const { data: cat } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", category)
        .single();

    if (!cat) {
        notFound();
    }

    // Fetch count of Articles in Category
    const { count } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("category_id", cat.id);

    const totalPages = Math.ceil((count || 0) / limit);

    // Fetch Articles in Category
    const { data: articles } = await supabase
        .from("articles")
        .select("*")
        .eq("category_id", cat.id)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow bg-background-light dark:bg-background-dark">
                {/* Header Section */}
                <section className="relative overflow-hidden bg-primary/5 dark:bg-primary/10 pt-16 pb-20 md:pt-24 md:pb-28 border-b border-primary/10">
                    <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                        <Link href="/informasi" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-surface-dark shadow-sm border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:border-primary/30 transition-colors mb-8">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Kembali ke Pusat Informasi
                        </Link>
                        
                        <div className="mx-auto w-20 h-20 bg-white dark:bg-surface-dark shadow-md rounded-2xl flex items-center justify-center text-primary mb-6 border border-primary/10 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                            <span className="material-symbols-outlined text-4xl">{cat.icon}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white capitalize mb-6 leading-tight tracking-tight">
                            {cat.title}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            {cat.description}
                        </p>
                    </div>
                </section>

                {/* Content / Article List */}
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24">
                    <div className="mb-10 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">article</span>
                            Daftar Artikel
                        </h2>
                        <span className="text-sm font-medium px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
                            {count || 0} Artikel
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {articles && articles.length > 0 ? (
                            articles.map((article) => (
                                <Link 
                                    key={article.id} 
                                    href={`/informasi/${cat.slug}/${article.id}`} 
                                    className="group relative bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 flex flex-col h-full overflow-hidden"
                                >
                                    {/* Decorative Top Border on Hover */}
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    <div className="flex justify-between items-start gap-4 mb-4">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug">
                                            {article.title}
                                        </h3>
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white text-slate-400 transition-colors duration-300">
                                            <span className="material-symbols-outlined text-sm">arrow_outward</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-auto pt-6 flex items-center text-sm text-slate-500 dark:text-slate-400 gap-2 font-medium border-t border-slate-100 dark:border-slate-800">
                                        <span className="material-symbols-outlined text-base text-primary/70">event</span>
                                        {new Date(article.created_at).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center text-center py-24 bg-slate-50 dark:bg-surface-dark/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
                                <div className="w-20 h-20 mb-6 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">post_add</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Belum Ada Artikel</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md">Kategori ini masih kosong. Silakan kembali lagi nanti untuk melihat pembaruan informasi.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-16 flex items-center justify-center gap-2">
                            {page > 1 ? (
                                <Link 
                                    href={`/informasi/${cat.slug}?page=${page - 1}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:border-primary/30 transition-all"
                                >
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                    Sebelumnya
                                </Link>
                            ) : (
                                <button disabled className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-surface-dark/50 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium text-slate-400 dark:text-slate-500 cursor-not-allowed">
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                    Sebelumnya
                                </button>
                            )}
                            
                            <div className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                                Halaman <span className="text-slate-900 dark:text-white font-bold">{page}</span> dari <span className="text-slate-900 dark:text-white font-bold">{totalPages}</span>
                            </div>

                            {page < totalPages ? (
                                <Link 
                                    href={`/informasi/${cat.slug}?page=${page + 1}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:border-primary/30 transition-all"
                                >
                                    Selanjutnya
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </Link>
                            ) : (
                                <button disabled className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-surface-dark/50 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium text-slate-400 dark:text-slate-500 cursor-not-allowed">
                                    Selanjutnya
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
