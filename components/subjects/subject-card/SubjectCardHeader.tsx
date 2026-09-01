import { ChevronDown, ChevronRight } from "lucide-react";
import type { SubjectWithTopics } from "@/lib/constants/subjects";

interface Props {
  subject: SubjectWithTopics;
  completed: number;
  total: number;
  progressPct: number;
  open: boolean;
  onToggle: () => void;
}

export function SubjectCardHeader({ subject, completed, total, progressPct, open, onToggle }: Props) {
  return (
    <button type="button" onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${subject.category === "TYT" ? "bg-blue-500" : "bg-purple-500"}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{subject.name}</span>
          <span className="text-[10px] font-bold text-slate-400">{subject.category}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="text-[11px] text-slate-500">{completed}/{total}</span>
        </div>
      </div>
      {open ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
    </button>
  );
}
