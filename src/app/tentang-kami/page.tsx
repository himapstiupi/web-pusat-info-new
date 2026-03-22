import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Link from "next/link";
import ProgramKerjaClient from "@/components/tentang-kami/ProgramKerjaClient";
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
        {/* Hero Section — full image like homepage */}
        <section className="relative h-[300px] md:h-[420px] w-full overflow-hidden bg-primary/10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent z-10"></div>
          {c.sejarah.image_url && (
            <img
              alt="Tentang Kami"
              className="h-full w-full object-cover"
              src={`/api/img-proxy?url=${encodeURIComponent(c.sejarah.image_url)}`}
            />
          )}
          <div className="absolute inset-0 z-20 flex flex-col justify-center">
            <div className="max-w-6xl mx-auto w-full px-6 lg:px-8">
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-2xl">
                {c.hero.title}
              </h1>
              <p className="mt-4 text-base md:text-lg text-white/90 max-w-xl">{c.hero.description}</p>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 space-y-24">
          {/* Sejarah — full width text only */}
          <section>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 relative inline-block">
              Sejarah
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              {c.sejarah.paragraf1.split(/\n\n+/).filter(Boolean).map((p, i) => (
                <p key={i}>{p.trim()}</p>
              ))}
              {c.sejarah.paragraf2 && <p>{c.sejarah.paragraf2}</p>}
            </div>
          </section>

          {/* Nama Kabinet */}
          {(c.kabinet?.nama || c.kabinet?.deskripsi || c.kabinet?.image_url) && (
            <section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 space-y-6">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white relative inline-block">
                    {c.kabinet.nama || "Nama Kabinet"}
                    <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
                  </h2>
                  <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg whitespace-pre-line">
                    {c.kabinet.deskripsi}
                  </div>
                </div>
                
                {c.kabinet.image_url && (
                  <div className="order-1 lg:order-2">
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 dark:bg-slate-800 shadow-lg">
                      <img 
                        src={c.kabinet.image_url} 
                        alt={c.kabinet.nama} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Visi & Misi */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
            <ProgramKerjaClient programs={c.program_kerja} />
          </section>

          {/* CTA */}
          <section className="bg-primary rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
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
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
