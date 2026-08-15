"use client";

import Link from "next/link";

import { ChevronRight } from "lucide-react";

interface StudyPlannerSubjectsProps {
  subjectStats: Array<{
    id: string;
    name: string;
    category: string;
    stats: {
      completed: number;
      total: number;
      progressPct: number;
      studying: number;
      needsReview: number;
      notStarted: number;
    };
  }>;
  overallCompleted: number;
  overallTotal: number;
  overallPercent: number;
}

export function StudyPlannerSubjects({
  subjectStats,
  overallCompleted,
  overallTotal,
  overallPercent,
}: StudyPlannerSubjectsProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-5">
        <p className="text-xs text-blue-100 uppercase tracking-wider font-bold">
          Müfredat ilerlemesi
        </p>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex-1">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{
                  width: `${overallPercent}%`,
                }}
              />
            </div>

            <p className="text-xs text-blue-100 mt-2">
              {overallCompleted} / {overallTotal} konu tamamlandı
            </p>
          </div>

          <strong className="text-3xl">
            %{overallPercent}
          </strong>
        </div>
      </div>

      {(["TYT", "AYT"] as const).map((category) => {
        const subjects = subjectStats.filter(
          (subject) =>
            subject.category === category
        );

        if (subjects.length === 0) {
          return null;
        }

        return (
          <div key={category}>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
              {category}
            </h3>

            <div className="space-y-2">
              {subjects.map((subject) => (
                <SubjectRow
                  key={subject.id}
                  subject={subject}
                  category={category}
                />
              ))}
            </div>
          </div>
        );
      })}

      <Link
        href="/subjects"
        className="flex items-center justify-center gap-1.5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-300"
      >
        Konuları Düzenle
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function SubjectRow({
  subject,
  category,
}: {
  subject: StudyPlannerSubjectsProps["subjectStats"][number];
  category: "TYT" | "AYT";
}) {
  const {
    completed,
    total,
    progressPct,
    studying,
    needsReview,
    notStarted,
  } = subject.stats;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            category === "TYT"
              ? "bg-blue-500"
              : "bg-purple-500"
          }`}
        />

        <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
          {subject.name}
        </span>

        <span className="text-xs text-slate-400">
          {completed}/{total}
        </span>

        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
          %{progressPct}
        </span>
      </div>

      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all"
          style={{
            width: `${progressPct}%`,
          }}
        />
      </div>

      <div className="flex gap-3 mt-1.5 text-[10px] text-slate-400">
        {studying > 0 && (
          <span>{studying} çalışılıyor</span>
        )}

        {needsReview > 0 && (
          <span className="text-violet-500">
            {needsReview} tekrar
          </span>
        )}

        {notStarted > 0 && (
          <span>{notStarted} başlanmadı</span>
        )}
      </div>
    </div>
  );
}