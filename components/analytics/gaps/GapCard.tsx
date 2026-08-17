import type {
  AnalyticsGap,
} from "@/types/analyticsGap";

import {
  MebRemediationDetails,
} from "@/components/study/remediation/MebRemediationDetails";

interface Props {
  gap:
    AnalyticsGap;

  kind:
    "homework" |
    "topic";
}

export function GapCard({
  gap,
  kind,
}: Props) {
  const percent =
    Math.round(
      gap.accuracy * 100
    );

  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            {gap.subject}
          </p>

          <h4 className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">
            {gap.topic}
          </h4>
        </div>

        <StatusBadge
          kind={kind}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
        {kind ===
          "homework" && (
          <strong className="text-rose-600 dark:text-rose-400">
            {
              gap.remainingQuestions
            }{" "}
            soru eksik
          </strong>
        )}

        <span>
          Son başarı: %{percent}
        </span>

        <span>
          {gap.attemptCount}.
          çalışma
        </span>

        <span>
          {gap.wrong} yanlış
        </span>
      </div>

      {gap.remediation && (
        <MebRemediationDetails
          subjectId={
            gap.subjectId
          }
          topicId={
            gap.topicId
          }
          remediation={
            gap.remediation
          }
        />
      )}
    </div>
  );
}

function StatusBadge({
  kind,
}: {
  kind:
    "homework" |
    "topic";
}) {
  return (
    <span
      className={
        kind === "homework"
          ? "rounded-full bg-rose-100 px-2 py-1 text-[10px] font-bold text-rose-600 dark:bg-rose-950/40 dark:text-rose-300"
          : "rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-600 dark:bg-amber-950/40 dark:text-amber-300"
      }
    >
      {kind === "homework"
        ? "Eksik Ödev"
        : "Konu Eksiği"}
    </span>
  );
}