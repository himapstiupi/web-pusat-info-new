"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ProgramKerjaItem } from "@/lib/tentang-kami";

interface Props {
  programs: ProgramKerjaItem[];
}

function getPerView() {
  if (typeof window === "undefined") return 1;
  if (window.innerWidth >= 1024) return 4;
  if (window.innerWidth >= 768) return 3;
  if (window.innerWidth >= 560) return 2;
  return 1;
}

export default function ProgramKerjaClient({ programs }: Props) {
  const [selectedProgram, setSelectedProgram] = useState<ProgramKerjaItem | null>(null);
  const [mounted, setMounted] = useState(false);

  // Carousel state
  const [current, setCurrent] = useState(0);
  const [perView, setPerView] = useState(1);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const update = () => setPerView(getPerView());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Clamp current when perView changes
  const total = Math.ceil(programs.length / perView);
  useEffect(() => {
    setCurrent((c) => Math.min(c, Math.max(0, total - 1)));
  }, [perView, total]);

  const safe = Math.min(current, Math.max(0, total - 1));
  const canPrev = safe > 0;
  const canNext = safe < total - 1;

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(
    () => setCurrent((c) => Math.min(total - 1, c + 1)),
    [total]
  );

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const diff = touchX.current - e.changedTouches[0].clientX;
    if (diff > 40) next();
    else if (diff < -40) prev();
    touchX.current = null;
  };

  // Prevent scrolling when modal is open
  const closeModal = () => setSelectedProgram(null);
  useEffect(() => {
    document.body.style.overflow = selectedProgram ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedProgram]);

  return (
    <>
      {/* ── Carousel ───────────────────────────────────────────────── */}
      <div className="relative">
        {/* Track */}
        <div
          className="overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${safe * 100}%)` }}
          >
            {programs.map((item, i) => (
              <div
                key={i}
                className="flex-none px-2 sm:px-3"
                style={{ width: `${100 / perView}%` }}
              >
                <div
                  className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col h-full cursor-pointer"
                  onClick={() => setSelectedProgram(item)}
                >
                  {/* Icon / Image */}
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:bg-primary group-hover:text-white mb-5 transition-all overflow-hidden shrink-0 mx-auto">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 group-hover:text-white transition-colors">
                        {item.icon}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed flex-1">
                    {item.desc}
                  </p>

                  <div className="pt-4 flex items-center justify-center text-sm font-semibold text-primary gap-1 border-t border-slate-100 dark:border-slate-800">
                    Lihat selengkapnya
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow buttons — desktop */}
        {canPrev && (
          <button
            onClick={prev}
            aria-label="Sebelumnya"
            className="hidden md:flex absolute left-0 top-[40%] -translate-y-1/2 -translate-x-5 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
          >
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </button>
        )}
        {canNext && (
          <button
            onClick={next}
            aria-label="Berikutnya"
            className="hidden md:flex absolute right-0 top-[40%] -translate-y-1/2 translate-x-5 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
          >
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </button>
        )}

        {/* Dots + mobile arrows */}
        {total > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              disabled={!canPrev}
              aria-label="Sebelumnya"
              className="md:hidden flex w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-500 disabled:opacity-30 hover:bg-primary hover:text-white hover:border-primary transition-all"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>

            <div className="flex gap-2">
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Ke halaman ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === safe
                      ? "bg-primary w-6 h-2"
                      : "bg-slate-300 dark:bg-slate-600 w-2 h-2 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              disabled={!canNext}
              aria-label="Berikutnya"
              className="md:hidden flex w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-500 disabled:opacity-30 hover:bg-primary hover:text-white hover:border-primary transition-all"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Modal ──────────────────────────────────────────────────── */}
      {mounted && selectedProgram && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-surface-dark w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
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
