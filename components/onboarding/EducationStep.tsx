"use client";

import React from "react";

interface EducationStepProps {
  sinif: string;
  setSinif: (value: string) => void;
  alan: string;
  setAlan: (value: string) => void;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60";

export default function EducationStep({
  sinif,
  setSinif,
  alan,
  setAlan,
}: EducationStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
        Eğitim Bilgileri
      </h2>

      <div>
        <label className="text-sm font-medium block mb-2 text-slate-700 dark:text-slate-200">
          Sınıf
        </label>

        <select
          value={sinif}
          onChange={(e) => setSinif(e.target.value)}
          className={inputClass}
        >
          <option value="">Seçiniz</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="Mezun">Mezun</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium block mb-2 text-slate-700 dark:text-slate-200">
          Alan
        </label>

        <select
          value={alan}
          onChange={(e) => setAlan(e.target.value)}
          className={inputClass}
        >
          <option value="">Seçiniz</option>
          <option value="Sayısal">Sayısal</option>
          <option value="Eşit Ağırlık">Eşit Ağırlık</option>
          <option value="Sözel">Sözel</option>
          <option value="Dil">Dil</option>
        </select>
      </div>
    </div>
  );
}
