"use client";

import React from "react";

interface WelcomeStepProps {
  name?: string | null;
}

export default function WelcomeStep({
  name,
}: WelcomeStepProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        Hoş Geldin 👋
        {name ? ` ${name}` : ""}
      </h1>

      <p className="text-slate-600 dark:text-slate-400">
        Sana özel çalışma programı oluşturabilmemiz için
        birkaç bilgiye ihtiyacımız var.
      </p>

      <p className="text-slate-600 dark:text-slate-400">
        Bu işlem yaklaşık 2 dakika sürecek.
      </p>

      <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 p-5 text-blue-800 dark:text-blue-300">
        <p className="font-medium">
          🎯 Hedeflerini belirleyeceğiz,
        </p>
        <p className="mt-1 text-sm">
          ardından mevcut seviyene göre sana özel bir
          çalışma planı oluşturacağız.
        </p>
      </div>
    </div>
  );
}
