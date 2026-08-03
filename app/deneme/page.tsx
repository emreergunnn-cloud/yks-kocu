"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { AppLayout } from "../../components/layout/AppLayout";
import { ExamResult, ExamType } from "../../types/exam";
import { getExamResults, deleteExamResult } from "../../services/examService";
import { ExamCard } from "../../components/deneme/ExamCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export default function DenemeHistoryPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"ALL" | ExamType>("ALL");

  const fetchExams = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getExamResults(user.uid);
      setExams(data);
    } catch (err) {
      console.error("Fetch exams error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [user]);

  const handleDeleteExam = async (id: string) => {
    await deleteExamResult(id);
    setExams((prev) => prev.filter((e) => e.id !== id));
  };

  const filteredExams = exams.filter((e) => {
    if (filterType === "ALL") return true;
    return e.denemeTipi === filterType || e.denemeTipi === "TYT+AYT";
  });

  const avgTyt = exams.length
    ? (exams.reduce((acc, e) => acc + (e.tytToplamNet || 0), 0) / exams.length).toFixed(1)
    : "0.0";
  const avgAyt = exams.length
    ? (exams.reduce((acc, e) => acc + (e.aytToplamNet || 0), 0) / exams.length).toFixed(1)
    : "0.0";

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Deneme Sınav Geçmişi
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Girdiğiniz tüm TYT ve AYT deneme sınavlarının net sonuçları ve istatistikleri.
            </p>
          </div>
          <Link
            href="/deneme/ekle"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-all text-sm shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Deneme Ekle
          </Link>
        </div>

        {/* Quick Stats Grid */}
        {exams.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Toplam Deneme</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {exams.length} <span className="text-xs font-normal text-slate-400">Adet</span>
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ortalama TYT Net</span>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {avgTyt} <span className="text-xs font-normal text-slate-400">/ 120</span>
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ortalama AYT Net</span>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {avgAyt} <span className="text-xs font-normal text-slate-400">/ 80</span>
              </p>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        {exams.length > 0 && (
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <button
              onClick={() => setFilterType("ALL")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterType === "ALL"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              Tüm Denemeler ({exams.length})
            </button>
            <button
              onClick={() => setFilterType("TYT")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterType === "TYT"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              TYT Denemeleri
            </button>
            <button
              onClick={() => setFilterType("AYT")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterType === "AYT"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              AYT Denemeleri
            </button>
          </div>
        )}

        {/* Exam List Content */}
        {loading ? (
          <LoadingSpinner text="Deneme sınavları yükleniyor..." />
        ) : filteredExams.length === 0 ? (
          <EmptyState
            title="Henüz Deneme Kaydı Yok"
            description="Çalışma performansınızı ve net gelişiminizi takip etmek için ilk deneme sınavı sonucunuzu girin."
            actionText="İlk Denemeni Ekle"
            actionHref="/deneme/ekle"
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} onDelete={handleDeleteExam} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}