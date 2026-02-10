import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleShareButton from "@/components/articles/ArticleShareButton";
import ArticleFeedback from "@/components/articles/ArticleFeedback";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const supabase = await createClient();
    const { slug } = await params;

    const { data: article } = await supabase
        .from("articles")
        .select("title")
        .eq("id", slug)
        .single();

    if (!article) {
        return {
            title: "Artikel Tidak Ditemukan",
        };
    }

    return {
        title: article.title,
    };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const supabase = await createClient();
    const { slug } = await params;

    // Fetch Article
    const { data: article } = await supabase
        .from("articles")
        .select(`
            *,
            categories (
                title,
                slug
            )
        `)
        .eq("id", slug)
        .single();

    if (!article) {
        notFound();
    }

    // Function to render HTML content
    const renderContent = (content: string) => {
        if (!content) return '';
        // Replace non-breaking spaces with regular spaces for proper text wrapping
        return content.replace(/&nbsp;/g, ' ');
    };

    const relatedLinks = article.related_links as { label: string; url: string }[] | null;

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            <Navbar />
            <main className="flex-grow pt-24 pb-16">
                <article className="max-w-4xl mx-auto px-4 md:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center text-sm text-text-sub dark:text-gray-400 mb-8">
                        <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
                        <span className="mx-2">/</span>
                        <Link href={`/kategori/${(article.categories as any)?.slug}`} className="hover:text-primary transition-colors">{(article.categories as any)?.title}</Link>
                        <span className="mx-2">/</span>
                        <span className="text-text-main dark:text-gray-200 truncate max-w-[200px]">{article.title}</span>
                    </nav>



                    {/* Header */}
                    <header className="mb-10">
                        <h1 className="text-3xl md:text-5xl font-black text-text-main dark:text-white mb-6 leading-tight">
                            {article.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-4 text-sm text-text-sub dark:text-gray-400">
                                <div className="flex items-center gap-1 bg-surface-light dark:bg-surface-dark px-3 py-1 rounded-full border border-border-light dark:border-border-dark">
                                    <span className="material-symbols-outlined text-base">calendar_today</span>
                                    {new Date(article.created_at).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    })}
                                </div>

                            </div>
                            <ArticleShareButton title={article.title} />
                        </div>
                    </header>

                    {/* Content */}
                    <div
                        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary-dark prose-img:rounded-xl prose-p:leading-relaxed prose-li:leading-relaxed prose-strong:text-text-main dark:prose-strong:text-white prose-em:text-text-main dark:prose-em:text-gray-300"
                        style={{ overflowWrap: 'break-word', wordWrap: 'break-word' }}
                        dangerouslySetInnerHTML={{ __html: renderContent(article.content) }}
                    />

                    {/* Related Links */}
                    {relatedLinks && relatedLinks.length > 0 && (
                        <div className="mt-12 mb-8">
                            <h4 className="text-lg font-bold text-text-main dark:text-white mb-4">Link Terkait</h4>
                            <div className="flex flex-wrap gap-4">
                                {relatedLinks.map((link, idx) => (
                                    <a
                                        key={idx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md"
                                    >
                                        {link.label}
                                        <span className="material-symbols-outlined text-lg">open_in_new</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Feedback Section */}
                    <ArticleFeedback
                        slug={slug}
                        initialLikes={article.likes || 0}
                        initialDislikes={article.dislikes || 0}
                    />
                </article>
            </main>
            <Footer />
        </div>
    );
}
