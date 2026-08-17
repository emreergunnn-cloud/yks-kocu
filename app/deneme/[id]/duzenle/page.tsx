"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "../../../../components/layout/AppLayout";
import { ExamForm } from "../../../../components/deneme/ExamForm";
import type { ExamResult } from "../../../../types/exam";
import { getExamById } from "../../../../services/examService";
import { LoadingSpinner } from "../../../../components/ui/LoadingSpinner";
import { useAuth } from "../../../../context/AuthContext";

export default function EditExamPage() {
  const params = useParams();
  const { user } = useAuth();
  const examId = params?.id as string;

  const [exam, setExam] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId || !user) return;

    const uid = user.uid;
    let active = true;

    async function load() {
      setLoading(true);
      const data = await getExamById(examId, uid);

      if (active) {
        setExam(data);
        setLoading(false);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [examId, user]);

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Deneme Sınavını Düzenle</h1>
          <p className="mt-1 text-sm text-slate-500">
            Deneme sınavının doğru ve yanlış bilgilerini güncelleyin.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Sınav bilgileri yükleniyor..." />
        ) : !exam ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">
            Sınav bulunamadı veya bu kayda erişim izniniz yok.
          </div>
        ) : (
          <ExamForm initialData={exam} isEdit />
        )}
      </div>
    </AppLayout>
  );
}
