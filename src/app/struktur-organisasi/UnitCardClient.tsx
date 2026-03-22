"use client";

import { OrganizationUnit } from "@/lib/struktur-organisasi";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function UnitCardClient({ unit }: { unit: OrganizationUnit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const modalContent = isOpen && mounted ? createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      ></div>
      
      {/* Modal Box */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-enter flex flex-col md:flex-row max-h-[90vh]">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-40 p-2.5 bg-slate-200/50 hover:bg-slate-300 dark:bg-black/50 dark:hover:bg-black/80 text-slate-800 dark:text-white rounded-full transition-colors flex items-center justify-center backdrop-blur-sm shadow-sm"
        >
          <span className="material-symbols-outlined text-xl sm:text-2xl">close</span>
        </button>
        
        {/* Modal Left Side - Image */}
        <div className="w-full md:w-[45%] bg-slate-100 dark:bg-slate-800 overflow-hidden relative shrink-0 h-[220px] sm:h-[280px] md:h-auto min-h-[300px] md:min-h-[500px]">
           {unit.image_url ? (
             <img src={unit.image_url} alt={unit.nama} className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full flex items-center justify-center">
               <span className="material-symbols-outlined text-7xl text-slate-300 dark:text-slate-600">domain</span>
             </div>
           )}
           {/* Gradient overlay for text legibility */}
           <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>
           <div className="absolute bottom-6 left-6 right-6 z-10">
             <h3 className="text-white text-2xl sm:text-3xl font-black drop-shadow-lg leading-tight">{unit.nama}</h3>
           </div>
        </div>

        {/* Modal Right Side - Scrollable Staff List */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-[#150d1c] flex flex-col h-[50vh] md:h-auto">
           <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
             <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-base sm:text-lg">groups</span>
             </div>
             Daftar Staff ({unit.staff.length})
           </h4>
           <ul className="space-y-3 sm:space-y-4">
             {unit.staff.map((s, i) => (
               <li key={i} className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#1a1025] border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow group">
                 <span className="text-slate-900 dark:text-white font-semibold text-sm md:text-base mr-3 line-clamp-1 group-hover:text-primary transition-colors">{s.nama}</span>
                 <span className="text-xs sm:text-sm font-bold px-3 py-1.5 bg-primary/10 text-primary dark:text-[#ad92c9] rounded-lg shrink-0 text-right group-hover:bg-primary/20 transition-colors">
                    {s.jabatan || "Staff"}
                 </span>
               </li>
             ))}
           </ul>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
        {/* Foto */}
        <div className="aspect-square w-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
          {unit.image_url ? (
            <img src={unit.image_url} alt={unit.nama} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">person</span>
            </div>
          )}
        </div>
        {/* Info */}
        <div className="p-4 flex flex-col flex-1 justify-between text-center gap-4">
          <h4 className="text-slate-900 dark:text-white font-bold text-sm line-clamp-2 my-auto">{unit.nama}</h4>
          {unit.staff.length > 0 ? (
            <button
              onClick={() => setIsOpen(true)}
              className="mt-auto w-full py-2.5 bg-primary/10 hover:bg-primary/20 text-primary dark:text-blue-400 font-semibold rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              Lihat Selengkapnya
              <span className="material-symbols-outlined text-sm">visibility</span>
            </button>
          ) : (
            <div className="mt-auto w-full py-2.5 flex items-center justify-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
               Belum ada data pengurus
            </div>
          )}
        </div>
      </div>

      {modalContent}
    </>
  );
}
