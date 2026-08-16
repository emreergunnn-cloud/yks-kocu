import {
  CheckCircle2,
} from "lucide-react";

import type {
  StudyTaskResultSummary,
} from "@/types/studyTaskProgress";

interface Props {
  result:
    StudyTaskResultSummary;
}

export function CalendarHomeworkResultSummary({
  result,
}: Props) {
  const percent =
    Math.round(
      result.accuracy *
        100
    );

  return (
    <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/20">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />

        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
          Ödev sonucu girildi
        </p>
      </div>

      <p className="mt-2 text-[11px] text-slate-600 dark:text-slate-300">
        {result.solvedQuestions}
        {" / "}
        {result.assignedQuestions}
        {" soru çözüldü · "}

        {result.correct}
        {" doğru · "}

        {result.wrong}
        {" yanlış · "}

        {result.blank}
        {" boş"}
      </p>

      <p className="mt-1 text-[11px] text-slate-500">
        Başarı: %{percent}
      </p>

      {result.remainingQuestions >
      0 ? (
        <div className="mt-2 rounded-lg bg-amber-100 px-2.5 py-2 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
          {result.remainingQuestions}
          {" soru eksik kaldı. "}

          Sonraki ödevinde bu
          {" "}
          {result.remainingQuestions}
          {" soru da eklenecek."}
        </div>
      ) : (
        <p className="mt-2 text-[11px] font-medium text-emerald-600">
          Bu ödevde eksik soru
          kalmadı.
        </p>
      )}
    </div>
  );
}