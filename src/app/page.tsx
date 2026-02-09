import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import CategoryCard from "@/components/home/CategoryCard";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

import { Metadata } from "next";

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Beranda",
};

export default async function Home() {
  const supabase = await createClient();

  // Fetch Categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("id", { ascending: true });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex flex-col w-full">
        {/* Hero Section */}
        <section className="relative w-full bg-surface-light dark:bg-background-dark overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none" data-alt="Abstract soft blue gradient blobs for background atmosphere" style={{ backgroundImage: "radial-gradient(circle at 10% 20%, rgba(19, 91, 236, 0.1) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(19, 91, 236, 0.1) 0%, transparent 40%)" }}></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 py-16 md:py-24 flex flex-col items-center justify-center text-center">
            <div className="mb-8 space-y-4 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-text-main dark:text-white tracking-tight leading-tight">
                Apa yang bisa kami bantu?
              </h2>
              <p className="text-text-sub dark:text-gray-400 text-lg leading-relaxed">
                Temukan jawaban mengenai PSTI di sini.
              </p>
            </div>
            {/* Search Bar */}
            <form action="/search" method="get" className="w-full max-w-2xl relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-sub dark:text-gray-500 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                name="q"
                className="block w-full h-14 pl-12 pr-32 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-text-main dark:text-white shadow-lg shadow-gray-200/50 dark:shadow-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 text-base"
                placeholder="Cari topik, kata kunci, atau pertanyaan..."
                type="text"
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <button type="submit" className="bg-primary hover:bg-primary-dark text-white text-sm font-bold h-10 px-6 rounded-lg transition-colors">
                  Cari
                </button>
              </div>
            </form>
          </div>
        </section>
        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto w-full px-4 md:px-10 py-12 space-y-16">
          {/* Categories Grid */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">grid_view</span>
              <h3 className="text-2xl font-bold text-text-main dark:text-white tracking-tight leading-snug">Semua Kategori</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <CategoryCard key={cat.id} name={cat.title} slug={cat.slug} description={cat.description} icon={cat.icon} />
                ))
              ) : (
                <p className="text-text-sub col-span-full text-center py-8">Belum ada kategori tersedia.</p>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
