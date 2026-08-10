"use client";

import { Card } from "../ui/Card";

interface Props {
  report: any;
}

export function CoachReport({ report }: Props) {
  if (!report) {
    return null;
  }

  return (
    <Card className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          🤖 AI Koç Raporu
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Mevcut performansınıza göre kişisel değerlendirme
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-slate-500">
            Hedefe Ulaşma Olasılığı
          </p>

          <p className="text-3xl font-bold text-blue-600">
            %{report.targetProbability}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Risk
          </p>

          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {report.risk}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Hedef TYT
          </p>

          <p className="text-2xl font-semibold text-slate-900 dark:text-white">
            {report.targetTYT}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Hedef AYT
          </p>

          <p className="text-2xl font-semibold text-slate-900 dark:text-white">
            {report.targetAYT}
          </p>
        </div>
      </div>

      {report.todayTasks &&
        report.todayTasks.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 text-slate-900 dark:text-white">
              Bugünkü Görevler
            </h3>

            <ul className="space-y-2">
              {report.todayTasks.map(
                (task: any, index: number) => (
                  <li
                    key={index}
                    className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-sm"
                  >
                    <div className="font-medium text-slate-900 dark:text-white">
                      {task.title}
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      {task.duration} dakika
                    </div>
                  </li>
                )
              )}
            </ul>
          </div>
        )}

      <div className="rounded-xl bg-blue-50 dark:bg-slate-800 p-4">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Koç raporunuz deneme sonuçlarınız ve hedef
          bilgileriniz üzerinden otomatik olarak
          oluşturulmaktadır.
        </p>
      </div>
    </Card>
  );
}