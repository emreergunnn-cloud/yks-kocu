import { Target } from "lucide-react";
import type { UserSettings } from "@/services/settingsService";

interface Props { settings: UserSettings; onChange: (values: Partial<UserSettings>) => void; }
const GOALS = [
  { key: "dailyGoalHours", label: "Günlük Saat", suffix: "sa", min: 1, max: 16 },
  { key: "dailyGoalQuestions", label: "Günlük Soru", suffix: "soru", min: 10, max: 500 },
  { key: "weeklyGoalExams", label: "Haftalık Deneme", suffix: "deneme", min: 1, max: 14 },
] as const;

export function DailyGoalsSection({ settings, onChange }: Props) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300"><Target className="h-4 w-4" />Günlük Hedefler</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {GOALS.map((goal) => (
          <div key={goal.key} className="space-y-1">
            <label className="text-xs text-slate-500">{goal.label}</label>
            <div className="flex items-center gap-2">
              <input
                type="number" min={goal.min} max={goal.max} value={settings[goal.key]}
                onChange={(event) => onChange({ [goal.key]: Number(event.target.value) || goal.min })}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              />
              <span className="text-xs text-slate-400">{goal.suffix}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
