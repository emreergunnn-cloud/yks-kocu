"use client";

import React from "react";
import {
  getAlanOptions,
  normalizeAlanForGrade,
} from "@/lib/constants/curriculum/config";
import type { AlanOption, SinifOption } from "@/types/user";

interface EducationStepProps {
  sinif: SinifOption | "";
  setSinif: (value: SinifOption | "") => void;
  alan: AlanOption | "";
  setAlan: (value: AlanOption | "") => void;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60";

export default function EducationStep({ sinif, setSinif, alan, setAlan }: EducationStepProps) {
  const alanOptions = getAlanOptions(sinif);

  const changeGrade = (value: SinifOption | "") => {
    setSinif(value);
    setAlan(normalizeAlanForGrade(value, alan));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Eğitim Bilgileri</h2>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Sınıf</label>
        <select
          value={sinif}
          onChange={(event) => changeGrade(event.target.value as SinifOption | "")}
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

      {alanOptions.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            {sinif === "11" ? "Alan" : "YKS Alanı"}
          </label>
          <select
            value={alan}
            onChange={(event) => setAlan(event.target.value as AlanOption | "")}
            className={inputClass}
          >
            <option value="">Seçiniz</option>
            {alanOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {sinif === "11" && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              11. sınıf konu ve çalışma planı seçtiğin alana göre düzenlenir.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
