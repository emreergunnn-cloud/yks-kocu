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

export function HomeworkGapList({
  gaps,
}: Props) {
  if (!gaps.length) {
    return (
      <EmptyText text="Tamamlanmamış ödev bulunmuyor." />
    );
  }

  return (
    <div className="space-y-3">
      {gaps.map(
        (gap) => (
          <GapCard
            key={gap.taskId}
            gap={gap}
            kind="homework"
          />
        )
      )}
    </div>
  );
}

function EmptyText({
  text,
}: {
  text: string;
}) {
  return (
    <p className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500 dark:bg-slate-950/50">
      {text}
    </p>
  );
}