"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "../../../../components/layout/AppLayout";
import { ExamForm } from "../../../../components/deneme/ExamForm";
import { ExamResult } from "../../../../types/exam";
import { getExamById } from "../../../../services/examService";
import { LoadingSpinner } from "../../../../components/ui/LoadingSpinner";

export default function EditExamPage() {
  const params = useParams();
  const examId = params?.id as string;

  const [exam, setExam] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (examId) {
      getExamById(examId)
        .then((data) => setExam(data))
        .finally(() => setLoading(false));
    }
  }, [examId]);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Deneme Sınavını Düzenle
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Girdiğiniz deneme sınavının doğru/yanlış net bilgilerini güncelleyin.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Sınav bilgileri yükleniyor..." />
        ) : !exam ? (
          <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            Sınav bulunamadı veya silinmiş.
          </div>
        ) : (
          <ExamForm initialData={exam} isEdit={true} />
        )}
      </div>
    </AppLayout>
  );
}
