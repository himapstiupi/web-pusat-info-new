import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Link from "next/link";
import { getTentangKamiContent } from "@/actions/pages";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tentang Kami",
};

export default async function TentangKamiPage() {
  const c = await getTentangKamiContent();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-primary/10 dark:bg-primary/5">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #135bec 1px, transparent 0)", backgroundSize: "40px 40px" }}></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-primary/10 text-primary rounded-full">{c.hero.badge}</span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">{c.hero.title}</h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium">{c.hero.description}</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent"></div>
        </section>

        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 space-y-24">
          {/* Sejarah */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 relative inline-block">
                Sejarah Kami
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                <p>{c.sejarah.paragraf1}</p>
                <p>{c.sejarah.paragraf2}</p>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img alt="Sejarah kami" className="w-full h-full object-cover aspect-video" src={c.sejarah.image_url} />
            </div>
          </section>

          {/* Visi & Misi */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">visibility</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Visi</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{c.visi_misi.visi}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">rocket_launch</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Misi</h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400 text-lg">
                {c.visi_misi.misi.map((m, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Program Kerja */}
          <section className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Program Kerja</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
              Program dan kegiatan unggulan yang kami jalankan untuk memberikan dampak nyata.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {c.program_kerja.map((item, i) => (
                <div key={i} className="group p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:bg-primary group-hover:text-white mb-6 transition-all overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 group-hover:text-white transition-colors">{item.icon}</span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-primary rounded-3xl p-12 text-center text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">{c.cta.title}</h2>
              <p className="mb-8 max-w-xl mx-auto opacity-90">{c.cta.description}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href={c.cta.primary_href} target={c.cta.primary_href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors">
                  {c.cta.primary_label}
                </Link>
                <Link href={c.cta.secondary_href} className="border border-white/20 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/20 transition-colors">
                  {c.cta.secondary_label}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
