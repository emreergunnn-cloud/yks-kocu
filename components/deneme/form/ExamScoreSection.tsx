import { calculateNet } from "@/services/examService";
import type {
  ExamSectionConfig,
  ScoreFieldKey,
  ScoreInput,
  ScoreInputMap,
} from "./types";
import { ExamScoreInput } from "./ExamScoreInput";

interface Props {
  title: string;
  total: number;
  maxTotal: number;
  sections: ExamSectionConfig[];
  scores: ScoreInputMap;
  onChange: (
    key: ScoreFieldKey,
    field: keyof ScoreInput,
    value: string
  ) => void;
}

export function ExamScoreSection({
  title,
  total,
  maxTotal,
  sections,
  scores,
  onChange,
}: Props) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <h2 className="text-base font-bold">{title}</h2>

        <span className="text-sm font-black text-blue-600 dark:text-blue-400">
          Toplam: {total} / {maxTotal} Net
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => {
          const score = scores[section.key];
          const net = calculateNet(
            Number(score.dogru),
            Number(score.yanlis)
          );

          return (
            <ExamScoreInput
              key={section.key}
              section={section}
              score={score}
              net={net}
              onChange={(field, value) =>
                onChange(section.key, field, value)
              }
            />
          );
        })}
      </div>
    </section>
  );
}
