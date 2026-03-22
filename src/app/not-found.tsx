"use client";

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[85vh] px-4 text-center overflow-hidden relative">
      {/* Dynamic CSS to hide global announcements on 404 page */}
      <style>{`
        #global-announcements-wrapper {
          display: none !important;
        }
      `}</style>
      
      {/* Background Ornaments */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="w-24 h-24 mx-auto bg-primary/10 dark:bg-primary/20 rounded-[2rem] flex items-center justify-center text-primary mb-8 shadow-inner transform rotate-12 hover:rotate-0 transition-transform duration-500">
          <span className="material-symbols-outlined text-[3rem] font-bold">search_off</span>
        </div>
        
        <h1 className="text-8xl md:text-9xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tighter drop-shadow-md">
          4<span className="text-primary">0</span>4
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          Halaman Tidak Ditemukan
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-10 text-[15px] leading-relaxed">
          Maaf, halaman yang Anda cari mungkin telah dihapus, dipindahkan, atau memang tidak pernah ada.
        </p>
        
        <Link 
          href="/" 
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 group"
        >
          <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">home</span>
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
