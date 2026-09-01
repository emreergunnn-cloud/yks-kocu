import type { TimeLeft } from "./useYksCountdown";
import type { YksDateSource } from "@/services/yksDateService";

interface Props { year: number; source: YksDateSource; timeLeft: TimeLeft; }

export function CountdownCard({ year, source, timeLeft }: Props) {
  const sourceText = source === "official" ? "Resmî tarih · ÖSYM" : "Tahmini tarih · Senin seçimin";
  const units: Array<[string, number]> = [
    ["Gün", timeLeft.days], ["Saat", timeLeft.hours], ["Dakika", timeLeft.minutes], ["Saniye", timeLeft.seconds],
  ];
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-6 text-white shadow-xl">
      <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-200">YKS {year}</div>
          <h3 className="text-xl font-black">Hedefine Ulaşmak İçin Kalan Süre</h3>
          <p className="text-xs text-blue-100/80">{sourceText}</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          {units.map(([label, value]) => (
            <div key={label} className="min-w-[65px] rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-center">
              <div className="text-2xl font-black">{String(value).padStart(2, "0")}</div>
              <div className="mt-1 text-[10px] font-bold uppercase text-blue-200">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
