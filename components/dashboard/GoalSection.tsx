"use client";

import { GoalTracker } from "../analytics/GoalTracker";
import { Card } from "../ui/Card";

export function GoalSection() {
  return (
    <Card className="space-y-4">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Çalışma Hedefleri & İlerleme
        </h3>

        <p className="text-xs text-slate-500">
          Günlük, haftalık ve aylık çalışma hedefleriniz
        </p>
      </div>

      <GoalTracker />
    </Card>
  );
}