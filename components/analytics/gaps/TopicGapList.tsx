import type {
  AnalyticsGap,
} from "@/types/analyticsGap";

import {
  GapCard,
} from "./GapCard";

interface Props {
  gaps:
    AnalyticsGap[];
}

export function TopicGapList({
  gaps,
}: Props) {
  if (!gaps.length) {
    return (
      <p className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500 dark:bg-slate-950/50">
        Aktif konu eksiği
        bulunmuyor.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {gaps.map(
        (gap) => (
          <GapCard
            key={gap.taskId}
            gap={gap}
            kind="topic"
          />
        )
      )}
    </div>
  );
}