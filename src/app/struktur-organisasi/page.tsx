import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { getStrukturOrganisasiContent } from "@/actions/pages";
import { OrganizationUnit } from "@/lib/struktur-organisasi";
import UnitCardClient from "./UnitCardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Struktur Organisasi",
};



export default async function StrukturOrganisasiPage() {
  const c = await getStrukturOrganisasiContent();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow px-4 md:px-10 lg:px-20 py-12">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {c.header.title}
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {c.header.description}
            </p>
          </div>

          {/* Badan Legislatif */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
              <div className="flex items-center gap-3 px-6 py-2 bg-primary/10 rounded-full">
                <span className="material-symbols-outlined text-primary text-lg">gavel</span>
                <h2 className="text-primary text-base font-bold uppercase tracking-widest">Badan Legislatif</h2>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 items-start">
              {c.legislatif.map((unit, i) => (
                <UnitCardClient key={i} unit={unit} />
              ))}
            </div>
          </section>

          {/* Badan Eksekutif */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
              <div className="flex items-center gap-3 px-6 py-2 bg-primary/10 rounded-full">
                <span className="material-symbols-outlined text-primary text-lg">settings</span>
                <h2 className="text-primary text-base font-bold uppercase tracking-widest">Badan Eksekutif</h2>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 items-start">
              {c.eksekutif.map((unit, i) => (
                <UnitCardClient key={i} unit={unit} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
