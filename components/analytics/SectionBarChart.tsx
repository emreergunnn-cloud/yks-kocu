import React from "react";
import { SectionAverage } from "../../services/analyticsService";

interface SectionBarChartProps {
  data: SectionAverage[];
}

export const SectionBarChart: React.FC<SectionBarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-xs text-slate-400 p-4 text-center">Bölüm verisi bulunamadı.</div>;
  }

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.name} className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
            <span className="text-slate-900 dark:text-white font-mono">
              {item.avgNet} <span className="text-slate-400 font-normal">/ {item.maxScore} Net (%{item.percentage})</span>
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                item.percentage >= 70
                  ? "bg-emerald-500"
                  : item.percentage >= 45
                  ? "bg-blue-500"
                  : item.percentage >= 25
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
              style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
