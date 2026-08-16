import {
  Brain,
  Clock,
} from "lucide-react";

import type {
  StudyTask,
} from "@/types/studyPlan";

interface Props {
  task: StudyTask;
}

export function StudyTaskMeta({
  task,
}: Props) {
  return (
    <div className="mt-2 flex items-center gap-4 text-[11px] text-slate-400">
      <span className="inline-flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {task.durationMinutes}
        {" dk"}
      </span>

      <span className="inline-flex items-center gap-1">
        <Brain className="w-3 h-3" />
        {task.questionCount}
        {" soru"}
      </span>
    </div>
  );
}