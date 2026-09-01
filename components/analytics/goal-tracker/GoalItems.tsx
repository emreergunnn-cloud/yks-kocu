import { CheckCircle2 } from "lucide-react";
import type { GoalItemData } from "./types";
const COLORS: Record<string, { bar: string; icon: string; text: string }> = {
  blue: { bar: "bg-blue-500", icon: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400", text: "text-blue-600 dark:text-blue-400" },
  violet: { bar: "bg-violet-500", icon: "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400", text: "text-violet-600 dark:text-violet-400" },
  emerald: { bar: "bg-emerald-500", icon: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400", text: "text-emerald-600 dark:text-emerald-400" },
  amber: { bar: "bg-amber-500", icon: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400", text: "text-amber-600 dark:text-amber-400" },
};
export function GoalItems({ goals }: { goals: GoalItemData[] }) {
  return <div className="space-y-3">{goals.map((goal) => {
    const pct = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
    const colors = COLORS[goal.color]; const done = pct >= 100;
    return <div key={goal.id} className="space-y-2 rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 dark:border-slate-800/80 dark:bg-slate-950/50">
      <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${colors.icon}`}>{done ? <CheckCircle2 className="h-4 w-4" /> : goal.icon}</div><span className="text-xs font-bold text-slate-800 dark:text-slate-200">{goal.title}</span></div><span className={`font-mono text-xs font-bold ${done ? "text-emerald-600 dark:text-emerald-400" : colors.text}`}>{goal.current} / {goal.target} {goal.unit}</span></div>
      <div className="flex items-center gap-2"><div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className={`h-full rounded-full transition-all duration-500 ${done ? "bg-emerald-500" : colors.bar}`} style={{ width: `${pct}%` }} /></div><span className="w-8 shrink-0 text-right text-[10px] font-semibold text-slate-500 dark:text-slate-400">%{pct}</span></div>
    </div>;
  })}</div>;
}
