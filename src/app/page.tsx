import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Link from "next/link";
import { getHomepageContent } from "@/actions/pages";
import AnimateOnScroll from "@/components/common/AnimateOnScroll";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Beranda",
};

export default async function Home() {
  const c = await getHomepageContent();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[300px] md:h-[400px] w-full overflow-hidden bg-primary/10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent z-10"></div>
          <img
            alt="Hero"
            className="h-full w-full object-cover scale-105 animate-[scaleIn_1.2s_cubic-bezier(0.16,1,0.3,1)_forwards]"
            src={`/api/img-proxy?url=${encodeURIComponent(c.hero.image_url)}`}
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center">
            <div className="mx-auto max-w-[1200px] w-full px-6">
              <div className="max-w-2xl">
                <h1
                  className="text-4xl md:text-5xl font-bold text-white leading-tight"
                  style={{ animation: "slideDown 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}
                >
                  {c.hero.title}
                </h1>
                <p
                  className="mt-4 text-lg text-white/90"
                  style={{ animation: "fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s both" }}
                >
                  {c.hero.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mx-auto max-w-[1200px] px-6 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <AnimateOnScroll variant="from-left">
              <div className="flex flex-col">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Visi &amp; Misi Kami</h2>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <span className="material-symbols-outlined">visibility</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Visi</h3>
                      <p className="mt-2 text-slate-600 dark:text-slate-400">{c.mission_vision.visi}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <span className="material-symbols-outlined">rocket_launch</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Misi</h3>
                      <ul className="mt-2 list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
                        {c.mission_vision.misi.map((m, i) => <li key={i}>{m}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll variant="from-right">
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  <img alt="Office" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" src={c.mission_vision.image_url} />
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Values */}
        <section className="bg-slate-50 dark:bg-slate-900/50 py-12 md:py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <AnimateOnScroll>
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-bold">Nilai &amp; Prinsip</h2>
                <p className="mt-4 text-slate-600 dark:text-slate-400">Nilai dan Prinsip yang menjadi pondasi HIMA PSTI.</p>
              </div>
            </AnimateOnScroll>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {c.values.map((v, i) => (
                <AnimateOnScroll key={i} stagger={((i % 6) + 1) as 1|2|3|4|5|6} variant="scale-up">
                  <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 h-full">
                    <span className="material-symbols-outlined text-4xl text-primary">{v.icon}</span>
                    <h3 className="mt-4 text-xl font-bold">{v.title}</h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">{v.desc}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-[1200px] px-6 py-12 md:py-20 text-center">
          <AnimateOnScroll variant="scale-up">
            <div className="bg-primary rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold">{c.cta.title}</h2>
                <p className="mt-4 text-white/80 max-w-xl mx-auto">{c.cta.description}</p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                  <Link href={c.cta.primary_href} target={c.cta.primary_href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-slate-100 transition-colors">
                    {c.cta.primary_label}
                  </Link>
                  <Link href={c.cta.secondary_href} className="px-8 py-3 border border-white/30 text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
                    {c.cta.secondary_label}
                  </Link>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </section>
      </main>
      <Footer />
    </div>
  );
}
