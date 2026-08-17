import type { ExamSectionConfig, ScoreInput } from "./types";

interface Props {
  section: ExamSectionConfig;
  score: ScoreInput;
  net: number;
  onChange: (field: keyof ScoreInput, value: string) => void;
}

export function ExamScoreInput({
  section,
  score,
  net,
  onChange,
}: Props) {
  return (
    <div className="space-y-2 rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 dark:border-slate-800/80 dark:bg-slate-900/60">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          {section.label}
          <span className="ml-1 font-normal text-slate-400">
            ({section.max} S)
          </span>
        </span>

        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-black text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          {net} Net
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <NumberField
          label="Doğru"
          max={section.max}
          value={score.dogru}
          onChange={(value) => onChange("dogru", value)}
        />

        <NumberField
          label="Yanlış"
          max={section.max}
          value={score.yanlis}
          onChange={(value) => onChange("yanlis", value)}
        />
      </div>
    </div>
  );
}

function NumberField({
  label,
  max,
  value,
  onChange,
}: {
  label: string;
  max: number;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-0.5 block text-[11px] text-slate-500">
        {label}
      </label>

      <input
        type="number"
        min="0"
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs dark:border-slate-800 dark:bg-slate-950"
      />
    </div>
  );
}
