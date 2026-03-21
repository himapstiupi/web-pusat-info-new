"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ProgramKerjaItem } from "@/lib/tentang-kami";

interface Props {
  programs: ProgramKerjaItem[];
}

export default function ProgramKerjaClient({ programs }: Props) {
  const [selectedProgram, setSelectedProgram] = useState<ProgramKerjaItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Close modal handler
  const closeModal = () => setSelectedProgram(null);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedProgram) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProgram]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {programs.map((item, i) => (
          <div
            key={i}
            className="group p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col h-full cursor-pointer"
            onClick={() => setSelectedProgram(item)}
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:bg-primary group-hover:text-white mb-6 transition-all overflow-hidden shrink-0 mx-auto">
              {item.image_url ? (
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 group-hover:text-white transition-colors">
                  {item.icon}
                </span>
              )}
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight">{item.title}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
              {item.desc}
            </p>
            
            <div className="mt-auto pt-4 flex items-center justify-center text-sm font-semibold text-primary group-hover:text-primary-dark transition-colors gap-1 border-t border-slate-100 dark:border-slate-800">
              Lihat selengkapnya
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Popup using Portal to guarantee viewport adherence */}
      {mounted && selectedProgram && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={closeModal}>
          <div 
            className="bg-white dark:bg-surface-dark w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors z-10"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="p-8 text-center sm:text-left max-h-[85vh] overflow-y-auto">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 shadow-sm mx-auto sm:mx-0 overflow-hidden shrink-0">
                {selectedProgram.image_url ? (
                  <img src={selectedProgram.image_url} alt={selectedProgram.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-4xl text-primary">
                    {selectedProgram.icon}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-snug">
                {selectedProgram.title}
              </h3>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                  {selectedProgram.desc}
                </p>
              </div>
            </div>
            <div className="px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-right shrink-0">
              <button 
                onClick={closeModal}
                className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
