import {
  Card,
} from "@/components/ui/Card";

import {
  ProgressDonut,
} from "./ProgressDonut";

interface Props {
  percentage: number;

  targetRanking?:
    string | number | null;

  targetDepartment?:
    string | null;
}

export function AnalyticsGoalCard({
  percentage,
  targetRanking,
  targetDepartment,
}: Props) {
  return (
    <Card className="flex flex-col justify-between space-y-6">
      <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Hedef Başarı Oranı
        </h3>

        <p className="text-xs text-slate-500">
          Mevcut performansının
          hedefine oranı.
        </p>
      </div>

      <ProgressDonut
        percentage={percentage}
        size={150}
      />

      <div className="rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-950/50">
        <GoalRow
          label="Hedef Derece"
          value={
            targetRanking
              ? `#${targetRanking}`
              : "Belirtilmedi"
          }
        />

        <GoalRow
          label="Hedef Bölüm"
          value={
            targetDepartment ||
            "Belirtilmedi"
          }
        />
      </div>
    </Card>
  );
}

function GoalRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-3 py-1 font-medium">
      <span className="text-slate-500">
        {label}:
      </span>

      <span className="text-right font-bold text-slate-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}