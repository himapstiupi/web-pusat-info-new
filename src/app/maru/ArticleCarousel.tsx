"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

interface Article {
  id: string | number;
  title: string;
  image_url?: string | null;
  category_slug: string;
}

interface Props {
  articles: Article[];
}

function getPerView() {
  if (typeof window === "undefined") return 1;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

export default function ArticleCarousel({ articles }: Props) {
  const [current, setCurrent] = useState(0);
  const [perView, setPerView] = useState(1); // start with 1 to match SSR
  const touchX = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Sync perView with window size after mount
  useEffect(() => {
    const update = () => setPerView(getPerView());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const total = Math.ceil(articles.length / perView);
  const safe = Math.min(current, Math.max(0, total - 1));

  // Reset to 0 if perView changes and current would be out of range
  useEffect(() => {
    setCurrent((c) => Math.min(c, Math.max(0, Math.ceil(articles.length / perView) - 1)));
  }, [perView, articles.length]);

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(
    () => setCurrent((c) => Math.min(Math.ceil(articles.length / perView) - 1, c + 1)),
    [articles.length, perView]
  );

  // Touch / swipe
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

  const canPrev = safe > 0;
  const canNext = safe < total - 1;

  return (
    <div className="relative">
      {/* ── Track ── */}
      <div
        className="overflow-hidden rounded-2xl"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={trackRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${safe * 100}%)` }}
        >
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex-none px-1.5 sm:px-2"
              style={{ width: `${100 / perView}%` }}
            >
              <Link
                href={`/informasi/${article.category_slug}/${article.id}`}
                className="group flex flex-col h-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Thumbnail */}
                {article.image_url ? (
                  <div className="w-full h-40 sm:h-44 overflow-hidden">
                    <img
                      src={`/api/img-proxy?url=${encodeURIComponent(article.image_url)}`}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 sm:h-44 bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-primary/30">article</span>
                  </div>
                )}
                {/* Content */}
                <div className="flex-1 p-4">
                  <h3 className="font-semibold text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-3 text-sm md:text-base leading-snug">
                    {article.title}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-primary text-xs font-semibold">
                    Baca selengkapnya
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ── Arrow Buttons (show on md+) ── */}
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

      {/* ── Mobile arrow row + Dots ── */}
      {total > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          {/* Prev — mobile only */}
          <button
            onClick={prev}
            disabled={!canPrev}
            aria-label="Sebelumnya"
            className="md:hidden flex w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-500 disabled:opacity-30 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>

          {/* Dots */}
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

          {/* Next — mobile only */}
          <button
            onClick={next}
            disabled={!canNext}
            aria-label="Berikutnya"
            className="md:hidden flex w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-500 disabled:opacity-30 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}
