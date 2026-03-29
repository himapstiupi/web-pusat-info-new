import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import AnimateOnScroll from "@/components/common/AnimateOnScroll";
import Link from "next/link";
import { getMahasiswaBaruContent, getArticlesByCategories } from "@/actions/pages";
import CountdownClient from "./CountdownClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mahasiswa Baru PSTI",
  description:
    "Informasi lengkap untuk mahasiswa baru Program Studi Pendidikan Sistem dan Teknologi Informasi (PSTI) UPI.",
};

export default async function MahasiswaBaruPage() {
  const c = await getMahasiswaBaruContent();
  const recommendedArticles = await getArticlesByCategories(c.recommended_category_ids);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-primary-dark py-12 md:py-28">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 md:w-96 h-64 md:h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 md:w-96 h-64 md:h-96 bg-white/10 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 text-center">
            <AnimateOnScroll>
              <span className="inline-block mb-3 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold tracking-wide backdrop-blur-sm border border-white/30">
                🎓 Halo Mahasiswa Baru!
              </span>
              <h1 className="text-[1.6rem] leading-[1.25] sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mt-2">
                {c.hero.title}
              </h1>
              <p className="mt-3 md:mt-6 text-sm md:text-xl text-white/85 max-w-xl mx-auto leading-relaxed">
                {c.hero.subtitle}
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ── Countdown ────────────────────────────────────────────── */}
        <section className="bg-slate-50 dark:bg-slate-900/60 py-8 md:py-20">
          <div className="max-w-5xl mx-auto px-5 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-6 md:mb-10">
                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-text-main dark:text-white">
                  Hitung Mundur Pengumuman
                </h2>
                <p className="mt-1.5 text-slate-500 dark:text-slate-400 text-sm">
                  Yuk pantau waktu pengumuman hasil seleksi setiap jalur nya!
                </p>
              </div>
            </AnimateOnScroll>
            <CountdownClient
              snbp={c.countdowns.snbp}
              snbt={c.countdowns.snbt}
              mandiri={c.countdowns.mandiri}
            />
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        {c.faq.length > 0 && (
          <section className="py-8 md:py-20">
            <div className="max-w-5xl mx-auto px-5 sm:px-6">
              <AnimateOnScroll>
                <div className="text-center mb-6 md:mb-10">
                  <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-text-main dark:text-white">
                    Pertanyaan Umum
                  </h2>
                  <p className="mt-1.5 text-slate-500 dark:text-slate-400 text-sm">
                    Pertanyaan yang sering ditanyakan kepada kami.
                  </p>
                </div>
              </AnimateOnScroll>
              <div className="space-y-2.5 md:space-y-4">
                {c.faq.map((item, i) => (
                  <AnimateOnScroll key={i} stagger={((i % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6}>
                    <FaqAccordion question={item.question} answer={item.answer} />
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Recommended Articles ─────────────────────────────────── */}
        {recommendedArticles.length > 0 && (
          <section className="bg-slate-50 dark:bg-slate-900/60 py-8 md:py-20">
            <div className="max-w-5xl mx-auto px-5 sm:px-6">
              <AnimateOnScroll>
                <div className="flex items-center gap-2 mb-5 md:mb-8">
                  <span className="material-symbols-outlined text-primary text-xl">recommend</span>
                  <h2 className="text-lg sm:text-2xl font-bold text-text-main dark:text-white">
                    Artikel Rekomendasi
                  </h2>
                </div>
              </AnimateOnScroll>
              {/* Mobile: horizontal scroll list; sm+: grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {recommendedArticles.map((article, i) => (
                  <AnimateOnScroll key={article.id} stagger={((i % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6} variant="scale-up">
                    <Link
                      href={`/informasi/${article.category_slug}/${article.id}`}
                      className="group flex flex-row sm:flex-col h-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    >
                      {/* Thumbnail — side on mobile, top on sm+ */}
                      {article.image_url ? (
                        <div className="w-24 shrink-0 sm:w-full h-auto sm:h-40 overflow-hidden">
                          <img
                            src={`/api/img-proxy?url=${encodeURIComponent(article.image_url)}`}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="w-24 shrink-0 sm:w-full h-auto sm:h-40 bg-primary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-3xl text-primary/40">article</span>
                        </div>
                      )}
                      <div className="flex-1 p-3 md:p-5">
                        <h3 className="font-semibold text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-2 sm:line-clamp-3 text-sm md:text-base leading-snug">
                          {article.title}
                        </h3>
                        <span className="mt-2 inline-flex items-center gap-1 text-primary text-xs font-semibold">
                          Baca
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </span>
                      </div>
                    </Link>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Contact Persons ──────────────────────────────────────── */}
        {c.contact_persons.length > 0 && (
          <section className="py-8 md:py-20">
            <div className="max-w-5xl mx-auto px-5 sm:px-6">
              <AnimateOnScroll variant="scale-up">
                <div className="bg-primary rounded-2xl md:rounded-3xl p-6 md:p-14 text-white relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 md:w-48 h-32 md:h-48 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-12 -left-12 w-32 md:w-48 h-32 md:h-48 bg-white/10 rounded-full" />
                  <div className="relative z-10 text-center">
                    <span className="material-symbols-outlined text-3xl md:text-4xl mb-2 block">support_agent</span>
                    <h2 className="text-xl md:text-3xl font-bold">{c.contact_section.title}</h2>
                    <p className="mt-2 text-white/80 text-sm max-w-sm mx-auto leading-relaxed">
                      {c.contact_section.description}
                    </p>
                    <div className="mt-5 md:mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-2.5 md:gap-3">
                      {c.contact_persons.map((cp, i) => (
                        <a
                          key={i}
                          href={cp.href}
                          target={cp.href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-primary font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-sm text-sm"
                        >
                          <span className="material-symbols-outlined text-lg">{cp.icon}</span>
                          {cp.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

// ── FAQ Accordion ───────────────────────────────────────────────────────────────
function FaqAccordion({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
      <summary className="flex items-center justify-between gap-3 px-4 py-3.5 md:py-4 cursor-pointer select-none list-none font-semibold text-text-main dark:text-white hover:text-primary dark:hover:text-primary transition-colors text-sm md:text-base">
        <span className="leading-snug">{question}</span>
        <span className="material-symbols-outlined shrink-0 transition-transform duration-300 group-open:rotate-180 text-primary text-xl">
          expand_more
        </span>
      </summary>
      <div className="px-4 pb-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-3">
        {answer}
      </div>
    </details>
  );
}
