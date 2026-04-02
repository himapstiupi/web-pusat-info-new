import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Link from "next/link";

export const metadata = {
  title: "Aspirasi",
};

export default function AspirasiPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[300px] md:h-[420px] w-full overflow-hidden bg-primary/10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent z-10"></div>
          <div className="absolute inset-0 z-20 flex flex-col justify-center">
            <div className="max-w-6xl mx-auto w-full px-6 lg:px-8">
              <h1
                className="text-3xl md:text-5xl font-black text-white leading-tight max-w-2xl"
                style={{ animation: "slideDown 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}
              >
                Kotak Aspirasi
              </h1>
              <p
                className="mt-4 text-base md:text-lg text-white/90 max-w-xl"
                style={{ animation: "fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s both" }}
              >
                Suara Anda sangat berarti bagi kami. Sampaikan aspirasi, saran, dan masukan untuk kemajuan PSTI dan HIMA PSTI.
              </p>
            </div>
          </div>
        </section>

        {/* Benefit Section */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center mb-8 md:mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white px-4">
              Mengapa Perlu Menyampaikan Aspirasi?
            </h3>
            <p className="mt-3 md:mt-4 text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-2xl mx-auto px-4">
              Setiap aspirasi yang Anda berikan sangat berarti untuk kemajuan dan kualitas lingkungan kita bersama.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center pt-2 md:pt-4">
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 text-primary rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="material-symbols-outlined text-2xl md:text-3xl">trending_up</span>
              </div>
              <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4">Mendorong Perbaikan</h4>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed md:leading-relaxed">Membantu mengevaluasi kurikulum, layanan, dan kinerja himpunan agar terus berkembang menjadi lebih baik dari waktu ke waktu.</p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 text-primary rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="material-symbols-outlined text-2xl md:text-3xl">forum</span>
              </div>
              <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4">Membangun Komunikasi</h4>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed md:leading-relaxed">Menjadi sarana yang efektif untuk menjembatani ide dan pemikiran antara seluruh elemen mahasiswa dan program studi.</p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 text-primary rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="material-symbols-outlined text-2xl md:text-3xl">diversity_3</span>
              </div>
              <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4">Lingkungan Inklusif</h4>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed md:leading-relaxed">Menciptakan budaya positif dan inklusif di mana setiap suara dihargai untuk mewujudkan kesejahteraan bersama.</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pb-12 md:pb-20 space-y-8 md:space-y-12 text-center">
          <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-2xl md:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary/50 transition-all duration-300">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 md:mb-8">
              <span className="material-symbols-outlined text-3xl md:text-4xl">campaign</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6">
              Sampaikan Aspirasi Anda
            </h2>
            
            <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed mb-8 md:mb-10 max-w-2xl mx-auto">
              Halaman ini didedikasikan untuk menampung seluruh aspirasi, kritik, dan saran terkait Program Studi Pendidikan Sistem dan Teknologi Informasi (PSTI) maupun Himpunan Mahasiswa PSTI (HIMA PSTI). Kami berkomitmen untuk mendengar setiap masukan guna membangun lingkungan akademik dan organisasi yang lebih baik.
            </p>

            <Link
              href="https://forms.gle/UYqiQFi9ddhsttaQ7"
              className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <span>Isi Formulir Aspirasi</span>
              <span className="material-symbols-outlined text-xl md:text-2xl">arrow_forward</span>
            </Link>
            
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
              *Silakan klik tombol di atas untuk menuju ke link formulir aspirasi.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
