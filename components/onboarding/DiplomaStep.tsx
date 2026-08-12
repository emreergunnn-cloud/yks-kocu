"use client";

import React from "react";

interface DiplomaStepProps {
  diplomaNotu: string;
  setDiplomaNotu: (value: string) => void;
  obp: number;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60";

export default function DiplomaStep({
  diplomaNotu,
  setDiplomaNotu,
  obp,
}: DiplomaStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
        Diploma Bilgisi
      </h2>

      <div>
        <label className="text-sm font-medium block mb-2 text-slate-700 dark:text-slate-200">
          Diploma Notun
        </label>

        <input
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={diplomaNotu}
          onChange={(e) => setDiplomaNotu(e.target.value)}
          className={inputClass}
          placeholder="92.50"
        />
      </div>

    </div>
  );
}
