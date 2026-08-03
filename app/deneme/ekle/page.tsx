"use client";

import React from "react";
import { AppLayout } from "../../../components/layout/AppLayout";
import { ExamForm } from "../../../components/deneme/ExamForm";

export default function AddExamPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Yeni Deneme Sınavı Ekle
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Girdiğiniz TYT ve AYT denemesinin doğru ve yanlış sayılarını girin. Netleriniz otomatik hesaplanacaktır.
          </p>
        </div>

        <ExamForm />
      </div>
    </AppLayout>
  );
}
