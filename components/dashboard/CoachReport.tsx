"use client";

import { Card } from "../ui/Card";
import { Sparkles, Brain, Clock, AlertCircle, Play } from "lucide-react";
import { CoachReport as CoachReportType } from "../../services/coachEngine";
import Link from "next/link";

interface Props {
  report: CoachReportType;
}

export function CoachReport({ report }: Props) {
  if (!report) {
    return null;
  }

  return (
    <Card className="space-y-6 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0 shadow-inner">
          <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            AI Koç Analizi <Sparkles className="w-4 h-4 text-amber-500" />
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Hedeflerin, deneme performansın ve konu ilerlemene dayalı kişisel öneriler
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/30 p-5 border border-indigo-100 dark:border-indigo-900/50">
        <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
          <strong className="text-indigo-700 dark:text-indigo-400 font-semibold">Koçun Notu: </strong>
          {report.coachMessage}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Hedef TYT
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {report.targetTYT}
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Güncel TYT
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {report.currentTYT.toFixed(1)}
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Hedefe Kalan
          </p>
          <p className="text-2xl font-black text-rose-600">
            {Math.max(0, report.targetTotal - report.currentTotal).toFixed(1)} <span className="text-sm font-semibold">Net</span>
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Kritik Ders
          </p>
          <p className={`text-sm mt-2 font-black ${report.weakestLesson ? 'text-amber-600' : 'text-emerald-500'}`}>
            {report.weakestLesson || "Eksik Yok"}
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Risk Durumu
          </p>
          <p className={`text-2xl font-black ${report.risk === "Yüksek" ? "text-rose-600" : report.risk === "Orta" ? "text-amber-500" : "text-emerald-500"}`}>
            {report.risk}
          </p>
        </div>
      </div>

      {report.todayTasks && report.todayTasks.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-3 text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-slate-400" />
            Öncelikli Görevler
          </h3>
          <ul className="space-y-3">
            {report.todayTasks.map((task, index) => (
              <li
                key={index}
                className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 transition-all hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {task.title}
                      </span>
                      {task.priority === "high" && (
                        <span className="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 text-[10px] uppercase px-2 py-0.5 rounded-full font-bold">
                          Yüksek Öncelik
                        </span>
                      )}
                      {task.priority === "medium" && (
                        <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 text-[10px] uppercase px-2 py-0.5 rounded-full font-bold">
                          Orta Öncelik
                        </span>
                      )}
                    </div>
                    {task.reason && (
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        {task.reason}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {task.estimatedMinutes || task.duration} dk
                  </div>
                </div>
                {task.subjectId && task.topicId && (
                  <div className="mt-4 flex justify-end">
                    <Link
                      href={`/study?subjectId=${task.subjectId}&topicId=${task.topicId}&duration=${task.estimatedMinutes || task.duration}`}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5" fill="currentColor" />
                      Çalışmaya Başla
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}