"use client";

interface Props {
  hours: number;
  onChange:
    (hours: number) => void;
}

export function StudyDurationSelector({
  hours,
  onChange,
}: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
      <div className="flex justify-between mb-3">
        <div>
          <p className="text-sm font-semibold">
            Günlük çalışma süresi
          </p>

          <p className="text-xs text-slate-400 mt-0.5">
            Süreye göre konu ve soru dağılımı yapılır.
          </p>
        </div>

        <strong className="text-lg text-blue-600">
          {hours} saat
        </strong>
      </div>

      <input
        type="range"
        min={1}
        max={12}
        step={0.5}
        value={hours}
        onChange={(event) =>
          onChange(
            Number(event.target.value)
          )
        }
        className="w-full accent-blue-600"
      />
    </div>
  );
}