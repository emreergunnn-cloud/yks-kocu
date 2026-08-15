import {
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import type {
  StudyTaskRole,
} from "@/types/studyPlan";

interface Props {
  role?: StudyTaskRole;

  previousAssignments?: number;
}

export function ReinforcementBadge({
  role,
  previousAssignments = 0,
}: Props) {
  if (
    !role ||
    role === "main"
  ) {
    return null;
  }

  if (
    role === "reinforcement"
  ) {
    return (
      <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-cyan-50 px-2 py-1 text-[10px] font-semibold text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300">
        <RefreshCw className="h-3 w-3" />

        Takviye çalışması

        {previousAssignments > 0 && (
          <span className="font-normal opacity-70">
            · {previousAssignments + 1}. çalışma
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
      <ShieldCheck className="h-3 w-3" />

      Bakım çalışması

      <span className="font-normal opacity-70">
        · açık kapanana kadar
      </span>
    </div>
  );
}