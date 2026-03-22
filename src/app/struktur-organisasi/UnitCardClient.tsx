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
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-enter flex flex-col max-h-[90vh]">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
        
        {/* Modal Header Image */}
        <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative shrink-0">
           {unit.image_url ? (
             <img src={unit.image_url} alt={unit.nama} className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full flex items-center justify-center">
               <span className="material-symbols-outlined text-7xl text-slate-300 dark:text-slate-600">domain</span>
             </div>
           )}
           {/* Gradient overlay for text legibility */}
           <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent"></div>
           <div className="absolute bottom-5 left-6 right-6">
             <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-black drop-shadow-md leading-tight">{unit.nama}</h3>
           </div>
        </div>

        {/* Modal Content - Scrollable Staff List */}
        <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900 flex-1">
           <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-sm">groups</span>
             </div>
             Daftar Anggota ({unit.staff.length})
           </h4>
           <ul className="space-y-3">
             {unit.staff.map((s, i) => (
               <li key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow transition-shadow">
                 <span className="text-slate-900 dark:text-white font-semibold text-sm sm:text-base mr-3 line-clamp-1">{s.nama}</span>
                 <span className="text-xs sm:text-sm font-bold px-3 py-1.5 bg-primary/10 text-primary dark:text-blue-400 rounded-lg shrink-0 text-right">
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
               Belum ada data anggota
            </div>
          )}
        </div>
      </div>

      {modalContent}
    </>
  );
}
