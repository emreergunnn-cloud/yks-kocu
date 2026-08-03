import React from "react";

interface YksCountdownProps {
  daysRemaining: number;
}

export const YksCountdown: React.FC<YksCountdownProps> = ({ daysRemaining }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white rounded-2xl p-6 shadow-xl">
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-blue-200">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            YKS 2026 Geri Sayım
          </div>
          <h3 className="text-xl font-black tracking-tight text-white">
            Hedefine Ulaşmak İçin Kalan Süre
          </h3>
          <p className="text-xs text-blue-100/80 max-w-md">
            Disiplinli her gün, hedefine bir adım daha yaklaştırır. Netlerini artırmaya devam et!
          </p>
        </div>

        <div className="flex items-baseline gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 shrink-0 text-center">
          <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            {daysRemaining}
          </span>
          <span className="text-sm font-bold text-blue-200 uppercase tracking-wider">
            Gün
          </span>
        </div>
      </div>

      {/* Decorative Blur Effect */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};
