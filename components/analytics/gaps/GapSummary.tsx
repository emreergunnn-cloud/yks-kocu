import type {
  AnalyticsGaps,
} from "@/types/analyticsGap";

interface Props {
  gaps:
    AnalyticsGaps;
}

export function GapSummary({
  gaps,
}: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <SummaryItem
        value={
          gaps.homework.length
        }
        label="Eksik ödev"
      />

      <SummaryItem
        value={
          gaps.totalRemainingQuestions
        }
        label="Tamamlanacak soru"
      />

      <SummaryItem
        value={
          gaps.topics.length
        }
        label="Konu eksiği"
      />
    </div>
  );
}

function SummaryItem({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/50">
      <p className="text-xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>

      <p className="text-[11px] text-slate-500">
        {label}
      </p>
    </div>
  );
}