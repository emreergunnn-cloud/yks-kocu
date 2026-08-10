"use client";

import Link from "next/link";
import { ExamCard } from "../deneme/ExamCard";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Card } from "../ui/Card";

interface Props {
  loading: boolean;
  exams: any[];
  totalExams: number;
}

export function RecentExams({
  loading,
  exams,
  totalExams,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Son Girilen Deneme Sınavları
        </h2>

        <Link
          href="/deneme"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Tüm Denemeleri Gör ({totalExams}) →
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : exams.length === 0 ? (
        <Card className="p-8 text-center text-slate-500 text-sm">
          Henüz deneme sınavı girilmedi.
          <br />
          İlk denemenizi ekleyerek gelişiminizi takip edin!
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {exams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
            />
          ))}
        </div>
      )}
    </div>
  );
}