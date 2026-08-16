import type {
  StudyTask,
} from "@/types/studyPlan";

import {
  TASK_TYPE_CONFIG,
} from "./taskTypeConfig";

interface Props {
  task: StudyTask;
  index: number;
}

export function StudyTaskHeader({
  task,
  index,
}: Props) {
  const config =
    TASK_TYPE_CONFIG[
      task.type
    ];

  const Icon =
    config.icon;

  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-black ${config.number}`}
      >
        {index + 1}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {task.subject}
          </span>

          <span className="text-[10px] font-medium text-slate-400">
            {task.category}
          </span>

          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${config.badge}`}
          >
            <Icon className="w-3 h-3" />
            {config.label}
          </span>
        </div>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {task.topic}
        </p>
      </div>
    </div>
  );
}