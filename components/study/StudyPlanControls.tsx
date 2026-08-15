"use client";

interface StudyPlanControlsProps {
  dailyHours: number;
  onChange: (hours: number) => void;
}

export function StudyPlanControls({
  dailyHours,
  onChange,
}: StudyPlanControlsProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Günlük çalışma süresi
          </p>

          <p className="text-xs text-slate-400 mt-0.5">
            Süreye göre gerçekçi konu ve soru dağılımı yapılır.
          </p>
        </div>

        <span className="text-lg font-black text-blue-600 dark:text-blue-400">
          {dailyHours} saat
        </span>
      </div>

      <input
        type="range"
        min={1}
        max={12}
        step={0.5}
        value={dailyHours}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="w-full accent-blue-600"
      />

      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
        <span>1 saat</span>
        <span>6 saat</span>
        <span>12 saat</span>
      </div>
    </div>
  );
}