"use client";

import React from "react";

interface CurrentLevelStepProps {
  currentTYT: string;
  setCurrentTYT: (value: string) => void;
  currentAYT: string;
  setCurrentAYT: (value: string) => void;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60";

export default function CurrentLevelStep({
  currentTYT,
  setCurrentTYT,
  currentAYT,
  setCurrentAYT,
}: CurrentLevelStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Mevcut Netlerin
        </h2>

        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Şu anki seviyeni yaklaşık olarak belirt. Bu bilgiler
          sana uygun hedefler oluşturmak için kullanılacaktır.
        </p>
      </div>

      <div>
        <label className="text-sm font-medium block mb-2 text-slate-700 dark:text-slate-200">
          TYT Netin
        </label>

        <input
          type="number"
          min="0"
          max="120"
          step="0.01"
          value={currentTYT}
          onChange={(e) => setCurrentTYT(e.target.value)}
          className={inputClass}
          placeholder="Örn: 70"
        />

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          TYT'deki yaklaşık toplam netini gir.
        </p>
      </div>

      <div>
        <label className="text-sm font-medium block mb-2 text-slate-700 dark:text-slate-200">
          AYT Netin
        </label>

        <input
          type="number"
          min="0"
          max="80"
          step="0.01"
          value={currentAYT}
          onChange={(e) => setCurrentAYT(e.target.value)}
          className={inputClass}
          placeholder="Örn: 45"
        />

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          AYT'deki alanına uygun yaklaşık toplam netini gir.
        </p>
      </div>

      <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 Bu değerler mevcut seviyeni belirlemek ve sana
          uygun çalışma hedefleri oluşturmak için kullanılacaktır.
        </p>
      </div>
    </div>
  );
}
