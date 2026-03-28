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
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-primary-dark py-16 md:py-28">
          {/* Decorative blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-72 md:w-96 h-72 md:h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 md:w-96 h-72 md:h-96 bg-white/10 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <AnimateOnScroll>
              <span className="inline-block mb-4 px-3 py-1 rounded-full bg-white/20 text-white text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-sm border border-white/30">
                🎓 Halo Mahasiswa Baru!
              </span>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mt-3">
                {c.hero.title}
              </h1>
              <p className="mt-4 md:mt-6 text-sm sm:text-base md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
                {c.hero.subtitle}
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ── Countdown ────────────────────────────────────────────── */}
        <section className="bg-slate-50 dark:bg-slate-900/60 py-10 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-8 md:mb-10">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-main dark:text-white">
                  Hitung Mundur Penerimaan
                </h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm md:text-base">
                  Yuk pantau waktu penerimaan setiap jalur nya!
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
          <section className="py-10 md:py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <AnimateOnScroll>
                <div className="text-center mb-8 md:mb-10">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-main dark:text-white">
                    Pertanyaan Umum
                  </h2>
                  <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm md:text-base">
                    Pertanyaan yang sering ditanyakan kepada kami.
                  </p>
                </div>
              </AnimateOnScroll>
              <div className="space-y-3 md:space-y-4">
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
          <section className="bg-slate-50 dark:bg-slate-900/60 py-10 md:py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <AnimateOnScroll>
                <div className="flex items-center gap-2 mb-6 md:mb-8">
                  <span className="material-symbols-outlined text-primary text-xl md:text-2xl">recommend</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-text-main dark:text-white">
                    Artikel Rekomendasi
                  </h2>
                </div>
              </AnimateOnScroll>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {recommendedArticles.map((article, i) => (
                  <AnimateOnScroll key={article.id} stagger={((i % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6} variant="scale-up">
                    <Link
                      href={`/informasi/${article.category_slug}/${article.id}`}
                      className="group flex flex-col h-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                    >
                      {article.image_url ? (
                        <div className="w-full h-36 sm:h-44 overflow-hidden">
                          <img
                            src={`/api/img-proxy?url=${encodeURIComponent(article.image_url)}`}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-36 sm:h-44 bg-primary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-4xl text-primary/40">article</span>
                        </div>
                      )}
                      <div className="flex-1 p-4 md:p-5">
                        <h3 className="font-bold text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-3 text-sm md:text-base leading-snug">
                          {article.title}
                        </h3>
                        <span className="mt-3 inline-flex items-center gap-1 text-primary text-xs md:text-sm font-semibold">
                          Baca selengkapnya
                          <span className="material-symbols-outlined text-xs md:text-sm">arrow_forward</span>
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
          <section className="py-10 md:py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
              <AnimateOnScroll variant="scale-up">
                <div className="bg-primary rounded-2xl md:rounded-3xl p-7 md:p-14 text-white relative overflow-hidden">
                  <div className="absolute -top-16 -right-16 w-36 md:w-48 h-36 md:h-48 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-16 -left-16 w-36 md:w-48 h-36 md:h-48 bg-white/10 rounded-full" />
                  <div className="relative z-10">
                    <span className="material-symbols-outlined text-3xl md:text-4xl mb-2 md:mb-3 block">support_agent</span>
                    <h2 className="text-xl md:text-3xl font-bold">{c.contact_section.title}</h2>
                    <p className="mt-2 md:mt-3 text-white/80 text-sm md:text-base max-w-md mx-auto">
                      {c.contact_section.description}
                    </p>
                    <div className="mt-6 md:mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
                      {c.contact_persons.map((cp, i) => (
                        <a
                          key={i}
                          href={cp.href}
                          target={cp.href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-primary font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-sm hover:shadow-md text-sm md:text-base"
                        >
                          <span className="material-symbols-outlined text-lg md:text-xl">{cp.icon}</span>
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

// ── FAQ Accordion (server-compatible via details/summary) ──────────────────────
function FaqAccordion({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
      <summary className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 cursor-pointer select-none list-none font-semibold text-text-main dark:text-white hover:text-primary dark:hover:text-primary transition-colors text-sm md:text-base">
        <span>{question}</span>
        <span className="material-symbols-outlined shrink-0 transition-transform duration-300 group-open:rotate-180 text-primary text-xl">
          expand_more
        </span>
      </summary>
      <div className="px-4 sm:px-6 pb-4 md:pb-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-3 md:pt-4">
        {answer}
      </div>
    </details>
  );
}
