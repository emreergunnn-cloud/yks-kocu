import {
  CircleAlert,
} from "lucide-react";

import type {
  StudyTask,
} from "@/types/studyPlan";

interface Props {
  task: StudyTask;
}

export function CarryoverTaskNotice({
  task,
}: Props) {
  if (
    task.assignmentKind !==
    "carryover"
  ) {
    return null;
  }

  return (
    <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 dark:border-rose-900 dark:bg-rose-950/20">
      <div className="flex items-center gap-2">
        <CircleAlert className="h-4 w-4 text-rose-600" />

        <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
          Eksik Ödev
        </p>
      </div>

      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
        Önceki ödevden
        {" "}
        <strong>
          {task.questionCount}
          {" soru"}
        </strong>
        {" "}
        tamamlanmadı.
      </p>

      <p className="mt-1 text-[11px] font-medium text-rose-600 dark:text-rose-300">
        Bu çalışma diğer
        ödevlerden önce
        tamamlanmalıdır.
      </p>
    </div>
  );
}