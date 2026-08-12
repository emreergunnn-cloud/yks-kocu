"use client";

import React from "react";

interface StudyPlanStepProps {
  studyDays: string;
  setStudyDays: (value: string) => void;
  studyHours: string;
  setStudyHours: (value: string) => void;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60";

export default function StudyPlanStep({
  studyDays,
  setStudyDays,
  studyHours,
  setStudyHours,
}: StudyPlanStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
        Çalışma Düzenin
      </h2>

      <div>
        <label className="text-sm font-medium block mb-2 text-slate-700 dark:text-slate-200">
          Haftada kaç gün çalışabilirsin?
        </label>

        <select
          value={studyDays}
          onChange={(e) => setStudyDays(e.target.value)}
          className={inputClass}
        >
          <option value="">Seç</option>

          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium block mb-2 text-slate-700 dark:text-slate-200">
          Günde kaç saat çalışabilirsin?
        </label>

        <input
          type="number"
          min="1"
          max="16"
          value={studyHours}
          onChange={(e) => setStudyHours(e.target.value)}
          className={inputClass}
          placeholder="5"
        />
      </div>

      <div className="rounded-xl bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-100 dark:border-yellow-900 p-5">
        <p className="text-slate-700 dark:text-slate-300">
          🤖 Bu bilgilere göre sana günlük çalışma
          programı hazırlanacak.
        </p>
      </div>
    </div>
  );
}
