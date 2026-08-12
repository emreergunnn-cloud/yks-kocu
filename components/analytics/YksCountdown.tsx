"use client";

import React, { useState, useEffect } from "react";
import { APP_CONFIG } from "@/lib/constants/config";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const YksCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isPassed, setIsPassed] = useState(false);

  useEffect(() => {
    const targetDate = new Date(APP_CONFIG.YKS_DATE).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsPassed(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white rounded-2xl p-6 shadow-xl min-h-[140px] animate-pulse">
        <div className="bg-white/10 w-full h-full rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white rounded-2xl p-6 shadow-xl">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left w-full md:w-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-blue-200">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            YKS 2026
          </div>
          <h3 className="text-xl font-black tracking-tight text-white">
            {isPassed ? "YKS Tamamlandı!" : "Hedefine Ulaşmak İçin Kalan Süre"}
          </h3>
          <p className="text-xs text-blue-100/80 max-w-md mx-auto md:mx-0">
            {isPassed 
              ? "Sınav maratonunu geride bıraktın. Umarım her şey gönlünce olmuştur."
              : "Disiplinli her gün, hedefine bir adım daha yaklaştırır. Odaklan ve devam et!"}
          </p>
        </div>

        {!isPassed && (
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 w-full md:w-auto justify-center">
            {/* Days */}
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 sm:px-4 py-3 min-w-[70px] sm:min-w-[80px]">
              <span className="text-2xl sm:text-3xl font-black text-white">{timeLeft.days}</span>
              <span className="text-[10px] sm:text-xs font-bold text-blue-200 uppercase tracking-wider mt-1">Gün</span>
            </div>
            {/* Hours */}
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 sm:px-4 py-3 min-w-[70px] sm:min-w-[80px]">
              <span className="text-2xl sm:text-3xl font-black text-white">{timeLeft.hours.toString().padStart(2, '0')}</span>
              <span className="text-[10px] sm:text-xs font-bold text-blue-200 uppercase tracking-wider mt-1">Saat</span>
            </div>
            {/* Minutes */}
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 sm:px-4 py-3 min-w-[70px] sm:min-w-[80px]">
              <span className="text-2xl sm:text-3xl font-black text-white">{timeLeft.minutes.toString().padStart(2, '0')}</span>
              <span className="text-[10px] sm:text-xs font-bold text-blue-200 uppercase tracking-wider mt-1">Dakika</span>
            </div>
            {/* Seconds */}
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 sm:px-4 py-3 min-w-[70px] sm:min-w-[80px]">
              <span className="text-2xl sm:text-3xl font-black text-white">{timeLeft.seconds.toString().padStart(2, '0')}</span>
              <span className="text-[10px] sm:text-xs font-bold text-amber-200 uppercase tracking-wider mt-1">Saniye</span>
            </div>
          </div>
        )}
      </div>

      {/* Decorative Blur Effect */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};
