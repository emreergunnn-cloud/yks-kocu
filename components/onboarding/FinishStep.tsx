"use client";

import React from "react";

interface FinishStepProps {
  alan: string;
  sinif: string;
  currentTYT: string;
  currentAYT: string;
  obp: number;
  hedefUniversite: string;
  hedefBolum: string;
  hedefSiralama: string;
  recommendedStudyHours: number;
  targetTYT: number;
  targetAYT: number;
  totalCurrentNet: number;
}

export default function FinishStep({
  alan,
  sinif,
  currentTYT,
  currentAYT,
  obp,
  hedefUniversite,
  hedefBolum,
  hedefSiralama,
  recommendedStudyHours,
  targetTYT,
  targetAYT,
  totalCurrentNet,
}: FinishStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Hazırsın 🎉
        </h1>

        <p className="text-slate-700 dark:text-slate-300 mt-2">
          Artık sana özel çalışma programı
          oluşturabiliriz.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <InfoCard label="Alan" value={alan} />
        <InfoCard label="Sınıf" value={sinif} />
        <InfoCard label="TYT" value={currentTYT} />
        <InfoCard label="AYT" value={currentAYT} />
        <InfoCard label="Hedef" value={hedefUniversite} />
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <StatCard
          label="Önerilen Günlük Çalışma"
          value={`${recommendedStudyHours} Saat`}
          className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900"
        />

        <StatCard
          label="Hedef TYT"
          value={String(targetTYT)}
          className="bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-900"
        />

        <StatCard
          label="Hedef AYT"
          value={String(targetAYT)}
          className="bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900"
        />
      </div>

      <div className="rounded-2xl bg-slate-900 dark:bg-slate-800 text-white p-8">
        <h2 className="text-2xl font-bold">
          🤖 AI Koç İlk Analizi
        </h2>

        <ul className="space-y-3 mt-6">
          <li>
            🎓 Üniversite:
            <strong className="ml-1">
              {hedefUniversite}
            </strong>
          </li>

          <li>
            📚 Bölüm:
            <strong className="ml-1">
              {hedefBolum}
            </strong>
          </li>

          <li>
            📈 Hedef Sıralama:
            <strong className="ml-1">
              {hedefSiralama}
            </strong>
          </li>

          <li>
            🕐 Günlük önerilen çalışma:
            <strong className="ml-1">
              {recommendedStudyHours} saat
            </strong>
          </li>
        </ul>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <b className="text-slate-900 dark:text-white">{value}</b>
    </div>
  );
}

function StatCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className: string;
}) {
  return (
    <div className={`rounded-xl p-5 ${className}`}>
      <p className="text-sm opacity-70">
        {label}
      </p>

      <p className="text-4xl font-bold">
        {value}
      </p>
    </div>
  );
}
