"use client";

import { useEffect, useState } from "react";

interface CountdownTarget {
  label: string;
  date: string;
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
    <div className="bg-primary rounded-2xl p-5 flex flex-col items-center shadow-md">
      {/* Label */}
      <div className="flex items-center justify-center mb-4">
        <span className="font-bold text-base text-white">{item.label}</span>
      </div>

      {!item.active ? (
        /* ── Segera Hadir ── */
        <div className="flex flex-col items-center gap-2 py-4">
          <span className="material-symbols-outlined text-4xl text-white/40">schedule</span>
          <span className="text-sm font-bold text-white/60">Segera Hadir</span>
        </div>
      ) : (
        /* ── Live Countdown ── */
        <div className="flex gap-2 sm:gap-3 items-end justify-center w-full">
          {[
            { value: mounted ? pad(timeLeft.days) : "00", unit: "Hari" },
            { value: mounted ? pad(timeLeft.hours) : "00", unit: "Jam" },
            { value: mounted ? pad(timeLeft.minutes) : "00", unit: "Menit" },
            { value: mounted ? pad(timeLeft.seconds) : "00", unit: "Detik" },
          ].map(({ value, unit }, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className="bg-white/20 rounded-xl w-full py-2.5 text-center">
                <span className="text-2xl sm:text-3xl font-black text-white tabular-nums leading-none">{value}</span>
              </div>
              <span className="text-[10px] sm:text-xs text-white/70 mt-1.5 font-medium">{unit}</span>
            </div>
          ))}
        </div>
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
      <CountdownBox item={snbp} />
      <CountdownBox item={snbt} />
      <CountdownBox item={mandiri} />
    </div>
  );
}
