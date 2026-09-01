import type { TabType } from "./types";
const labels: Record<TabType, string> = { daily: "Günlük", weekly: "Haftalık", monthly: "Aylık" };
export function GoalTabs({ active, onChange }: { active: TabType; onChange: (tab: TabType) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      {(Object.keys(labels) as TabType[]).map((tab) => <button key={tab} onClick={() => onChange(tab)} className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${active === tab ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"}`}>{labels[tab]}</button>)}
    </div>
  );
}
