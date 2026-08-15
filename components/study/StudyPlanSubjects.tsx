import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { SubjectProgressMap } from "@/services/topicService";
import { YKS_SUBJECTS } from "@/lib/constants/subjects";
import { computeSubjectStats } from "@/services/topicService";

interface StudyPlanSubjectsProps {
  progressMap: SubjectProgressMap;
}

export function StudyPlanSubjects({
  progressMap,
}: StudyPlanSubjectsProps) {
  const subjectStats = YKS_SUBJECTS.map((subject) => {
    const stats = computeSubjectStats(
      subject.id,
      subject.topics.map((topic) => topic.id),
      progressMap
    );

    return {
      ...subject,
      stats,
    };
  });

  const overallCompleted = subjectStats.reduce(
    (total, subject) =>
      total + subject.stats.completed,
    0
  );

  const overallTotal = subjectStats.reduce(
    (total, subject) =>
      total + subject.stats.total,
    0
  );

  const overallPercent =
    overallTotal > 0
      ? Math.round(
          (overallCompleted / overallTotal) * 100
        )
      : 0;

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
          (subject) => {
            if (subject.category === category) {
              return true;
            }

            

            return false;
          }
        );

        return (
          <div key={category}>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1">
              {category}
            </h3>

            <div className="space-y-2">
              {subjects.map((subject) => (
                <div
                  key={`${category}-${subject.id}`}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        category === "TYT"
                          ? "bg-blue-500"
                          : "bg-purple-500"
                      }`}
                    />

                    <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {subject.name}
                    </span>

                    <span className="text-xs text-slate-400">
                      {subject.stats.completed}/
                      {subject.stats.total}
                    </span>

                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      %{subject.stats.progressPct}
                    </span>
                  </div>

                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{
                        width: `${subject.stats.progressPct}%`,
                      }}
                    />
                  </div>

                  <div className="flex gap-3 mt-1.5 text-[10px] text-slate-400">
                    {subject.stats.studying > 0 && (
                      <span>
                        {subject.stats.studying} çalışılıyor
                      </span>
                    )}

                    {subject.stats.needsReview > 0 && (
                      <span className="text-violet-500">
                        {subject.stats.needsReview} tekrar
                      </span>
                    )}

                    {subject.stats.notStarted > 0 && (
                      <span>
                        {subject.stats.notStarted} başlanmadı
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <Link
        href="/subjects"
        className="flex items-center justify-center gap-1.5 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        Konuları Düzenle
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}