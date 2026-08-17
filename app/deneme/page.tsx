"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { AppLayout } from "../../components/layout/AppLayout";
import type { ExamResult, ExamType } from "../../types/exam";
import {
  deleteExamResult,
  getExamResults,
} from "../../services/examService";
import { ExamCard } from "../../components/deneme/ExamCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

function examAverage(
  exams: ExamResult[],
  type: "TYT" | "AYT"
): string {
  const relevant = exams.filter(
    (exam) => exam.denemeTipi === type || exam.denemeTipi === "TYT+AYT"
  );

  if (!relevant.length) return "0.0";

  const total = relevant.reduce(
    (sum, exam) =>
      sum + (type === "TYT" ? exam.tytToplamNet : exam.aytToplamNet),
    0
  );

  return (total / relevant.length).toFixed(1);
}

export default function DenemeHistoryPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"ALL" | ExamType>("ALL");

  useEffect(() => {
    if (!user) return;

    const uid = user.uid;
    let active = true;

    async function load() {
      setLoading(true);

      try {
        const data = await getExamResults(uid);
        if (active) setExams(data);
      } catch (error) {
        console.error("Fetch exams error:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [user]);

  const filteredExams = useMemo(
    () =>
      exams.filter(
        (exam) =>
          filterType === "ALL" ||
          exam.denemeTipi === filterType ||
          exam.denemeTipi === "TYT+AYT"
      ),
    [exams, filterType]
  );

  async function handleDeleteExam(id: string) {
    if (!user) return;

    await deleteExamResult(id, user.uid);
    setExams((prev) => prev.filter((exam) => exam.id !== id));
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">Deneme Sınav Geçmişi</h1>
            <p className="mt-1 text-sm text-slate-500">
              TYT ve AYT deneme sonuçlarınız ve net gelişiminiz.
            </p>
          </div>

          <Link
            href="/deneme/ekle"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white"
          >
            + Yeni Deneme Ekle
          </Link>
        </div>

        {exams.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Stat label="Toplam Deneme" value={`${exams.length} Adet`} />
            <Stat label="Ortalama TYT Net" value={`${examAverage(exams, "TYT")} / 120`} />
            <Stat label="Ortalama AYT Net" value={`${examAverage(exams, "AYT")} / 80`} />
          </div>
        )}

        {exams.length > 0 && (
          <div className="flex gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
            {(["ALL", "TYT", "AYT"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilterType(type)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold ${
                  filterType === type
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {type === "ALL" ? `Tüm Denemeler (${exams.length})` : `${type} Denemeleri`}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <LoadingSpinner text="Deneme sınavları yükleniyor..." />
        ) : filteredExams.length === 0 ? (
          <EmptyState
            title="Henüz Deneme Kaydı Yok"
            description="Net gelişiminizi takip etmek için ilk deneme sonucunuzu girin."
            actionText="İlk Denemeni Ekle"
            actionHref="/deneme/ekle"
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredExams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onDelete={handleDeleteExam}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}
