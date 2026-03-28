"use client";

import { useEffect, useState } from "react";

interface CountdownTarget {
  label: string;
  date: string; // ISO datetime string
  active: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

function CountdownBox({ item }: { item: CountdownTarget }) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!item.active) return;
    setMounted(true);
    setTimeLeft(getTimeLeft(item.date));
    const id = setInterval(() => setTimeLeft(getTimeLeft(item.date)), 1000);
    return () => clearInterval(id);
  }, [item.date, item.active]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 md:p-6 flex flex-col items-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="mb-3 md:mb-4 flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full shrink-0 ${item.active ? "bg-primary animate-pulse" : "bg-slate-300 dark:bg-slate-600"}`} />
        <span className="font-extrabold text-sm md:text-lg text-text-main dark:text-white tracking-tight text-center leading-tight">{item.label}</span>
      </div>

      {!item.active ? (
        /* ── Segera Hadir ── */
        <div className="flex flex-col items-center gap-2 py-3">
          <span className="material-symbols-outlined text-3xl md:text-4xl text-slate-300 dark:text-slate-600">schedule</span>
          <span className="text-xs md:text-base font-bold text-slate-400 dark:text-slate-500 tracking-wide">Segera Hadir</span>
        </div>
      ) : (
        /* ── Live Countdown ── */
        <>
          <div className="flex gap-1.5 md:gap-3 items-end">
            {[
              { value: mounted ? pad(timeLeft.days) : "00", unit: "Hari" },
              { value: mounted ? pad(timeLeft.hours) : "00", unit: "Jam" },
              { value: mounted ? pad(timeLeft.minutes) : "00", unit: "Menit" },
              { value: mounted ? pad(timeLeft.seconds) : "00", unit: "Detik" },
            ].map(({ value, unit }, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-primary/10 dark:bg-primary/20 rounded-lg md:rounded-xl px-1.5 md:px-3 py-1.5 md:py-2 min-w-[36px] md:min-w-[54px] text-center">
                  <span className="text-xl md:text-3xl font-black text-primary tabular-nums leading-none">{value}</span>
                </div>
                <span className="text-[9px] md:text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{unit}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface Props {
  snbp: CountdownTarget;
  snbt: CountdownTarget;
  mandiri: CountdownTarget;
}

export default function CountdownClient({ snbp, snbt, mandiri }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3 md:gap-6">
      <CountdownBox item={snbp} />
      <CountdownBox item={snbt} />
      <CountdownBox item={mandiri} />
    </div>
  );
}
