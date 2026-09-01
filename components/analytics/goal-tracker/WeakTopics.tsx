import { Zap } from "lucide-react";
import { YKS_SUBJECTS } from "../../../lib/constants/subjects";
import type { MasteryResult } from "../../../services/masteryEngine";

const COLORS: Record<string, { bar: string; text: string; bg: string }> = {
  "Kritik Eksik": { bar: "bg-red-500", text: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" },
  "Geliştirilmeli": { bar: "bg-orange-500", text: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20" },
  Orta: { bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
  İyi: { bar: "bg-blue-500", text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
  Güçlü: { bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
};

export function WeakTopics({ masteries }: { masteries?: Record<string, MasteryResult> }) {
  if (!masteries || !Object.keys(masteries).length) return null;
  const names: Record<string, string> = {};
  YKS_SUBJECTS.forEach((subject) => subject.topics.forEach((topic) => { names[topic.id] = topic.name; }));
  const items = Object.values(masteries).sort((a, b) => a.score - b.score).slice(0, 3).filter((item) => item.score < 80);
  if (!items.length) return null;
  return <div className="mt-4 space-y-2"><div className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-500" /><p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Konu Gücü — Geliştirilmesi Gerekenler</p></div><div className="space-y-2">{items.map((item) => {
    const colors = COLORS[item.level] || COLORS.İyi;
    return <div key={item.topicId} className={`space-y-1.5 rounded-xl border border-slate-200/60 p-3 dark:border-slate-800/60 ${colors.bg}`}><div className="flex items-center justify-between gap-2"><span className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">{names[item.topicId] || item.topicId}</span><div className="flex shrink-0 items-center gap-1.5"><span className={`text-[10px] font-bold ${colors.text}`}>{item.level}</span><span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">{item.score}/100</span></div></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"><div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${item.score}%` }} /></div></div>;
  })}</div></div>;
}
