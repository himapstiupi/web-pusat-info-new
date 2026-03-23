"use client";

import { OrganizationUnit } from "@/lib/struktur-organisasi";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function UnitCardClient({ unit }: { unit: OrganizationUnit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Tiny delay so CSS transition is registered
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const t = setTimeout(() => {
        document.body.style.overflow = "";
      }, 300);
      return () => clearTimeout(t);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => setIsOpen(false);

  const modalContent = mounted ? createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      style={{
        pointerEvents: isOpen ? "auto" : "none",
        visibility: isOpen || visible ? "visible" : "hidden",
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      />

      {/* Modal Box */}
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] transition-all duration-[400ms]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.94) translateY(16px)",
          filter: visible ? "blur(0)" : "blur(6px)",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-40 p-2.5 bg-slate-200/50 hover:bg-slate-300 dark:bg-black/50 dark:hover:bg-black/80 text-slate-800 dark:text-white rounded-full transition-colors flex items-center justify-center backdrop-blur-sm shadow-sm"
        >
          <span className="material-symbols-outlined text-xl sm:text-2xl">close</span>
        </button>

        {/* Left - Image */}
        <div className="w-full md:w-[45%] bg-slate-100 dark:bg-slate-800 overflow-hidden relative shrink-0 h-[220px] sm:h-[280px] md:h-auto min-h-[300px] md:min-h-[500px]">
          {unit.image_url ? (
            <img src={unit.image_url} alt={unit.nama} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-7xl text-slate-300 dark:text-slate-600">domain</span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 z-10">
            <h3 className="text-white text-2xl sm:text-3xl font-black drop-shadow-lg leading-tight">{unit.nama}</h3>
          </div>
        </div>

        {/* Right - Staff List */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-[#150d1c] flex flex-col h-[50vh] md:h-auto">
          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-base sm:text-lg">groups</span>
            </div>
            Daftar Pengurus ({unit.staff.length})
          </h4>
          <ul className="space-y-3 sm:space-y-4">
            {unit.staff.map((s, i) => (
              <li
                key={i}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#1a1025] border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(12px)",
                  transitionDelay: visible ? `${0.15 + i * 0.05}s` : "0s",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionProperty: "opacity, transform",
                  transitionDuration: "0.45s",
                }}
              >
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full group">
        {/* Foto */}
        <div className="aspect-square w-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
          {unit.image_url ? (
            <img src={unit.image_url} alt={unit.nama} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
              <span className="hidden leading-tight sm:inline">Lihat Selengkapnya</span>
              <span className="inline leading-tight sm:hidden">Detail</span>
              <span className="material-symbols-outlined text-base">visibility</span>
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
