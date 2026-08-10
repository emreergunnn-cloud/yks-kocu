"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";

export function RankingCalculatorBanner() {
  return (
    <Link href="/calculator" className="block">
      <Card className="group cursor-pointer overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Yeni Özellik
            </p>

            <h2 className="mt-2 text-2xl font-black group-hover:text-blue-600 transition">
              📊 Sıralama Hesaplayıcı
            </h2>

            <p className="mt-3 text-slate-500 dark:text-slate-400 leading-7">
              TYT, AYT ve OBP bilgilerini girerek
              2024, 2025 ve 2026 yılları için
              tahmini başarı sıralamanı hesapla.
            </p>

            <div className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold group-hover:bg-blue-700 transition">
              Hesaplayıcıyı Aç →
            </div>
          </div>

          <div className="hidden md:block text-7xl opacity-20 group-hover:opacity-40 transition">
            📈
          </div>
        </div>
      </Card>
    </Link>
  );
}