import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient();
    const { slug } = await params;

    // Fetch Category
    const { data: category } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!category) {
        notFound();
    }

    // Fetch Articles in Category
    const { data: articles } = await supabase
        .from("articles")
        .select("*")
        .eq("category_id", category.id)
        .order("created_at", { ascending: false });

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow bg-background-light dark:bg-background-dark">
                {/* Header */}
                <header className="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark py-12 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 md:px-10 text-center">
                        <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                            <span className="material-symbols-outlined text-4xl">{category.icon}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-text-main dark:text-white capitalize mb-4 leading-tight">{category.title}</h1>
                        <p className="text-lg text-text-sub dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">{category.description}</p>
                    </div>
                </header>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles && articles.length > 0 ? (
                            articles.map((article) => (
                                <Link key={article.id} href={`/articles/${article.id}`} className="group bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
                                    <h3 className="text-xl font-bold text-text-main dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                        {article.title}
                                    </h3>
                                    <div className="mt-auto pt-4 flex items-center text-sm text-text-sub dark:text-gray-500 gap-4">

                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-base">calendar_today</span>
                                            {new Date(article.created_at).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric"
                                            })}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4 block">post</span>
                                <p className="text-text-sub dark:text-gray-500 text-lg">Belum ada artikel di kategori ini.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
