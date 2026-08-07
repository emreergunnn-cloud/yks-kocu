"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useMemo, useState } from "react";
import { calculateEstimatedRanking } from "@/services/rankingCalculator";

export default function RankingCalculatorPage() {
  const [alan, setAlan] = useState<
    "Sayısal" | "Eşit Ağırlık" | "Sözel" | "Dil"
  >("Sayısal");

  const [tyt, setTyt] = useState(70);
  const [ayt, setAyt] = useState(40);
  const [obp, setObp] = useState(85);

  const result2024 = useMemo(
    () =>
      calculateEstimatedRanking({
        alan,
        year: 2024,
        tyt,
        ayt,
        obp,
      }),
    [alan, tyt, ayt, obp]
  );

  const result2025 = useMemo(
    () =>
      calculateEstimatedRanking({
        alan,
        year: 2025,
        tyt,
        ayt,
        obp,
      }),
    [alan, tyt, ayt, obp]
  );

  const result2026 = useMemo(
    () =>
      calculateEstimatedRanking({
        alan,
        year: 2026,
        tyt,
        ayt,
        obp,
      }),
    [alan, tyt, ayt, obp]
  );

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">

        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">
            📊 Sıralama Hesaplayıcı
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            TYT, AYT ve OBP bilgilerini girerek geçmiş yıllara göre tahmini
            başarı sıralamanı hesaplayabilirsin.
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 font-medium">
                Alan
              </label>

              <select
                value={alan}
                onChange={(e) =>
                  setAlan(e.target.value as any)
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white"
              >
                <option value="Sayısal">Sayısal</option>
                <option value="Eşit Ağırlık">Eşit Ağırlık</option>
                <option value="Sözel">Sözel</option>
                <option value="Dil">Dil</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                OBP
              </label>

              <input
                type="number"
                value={obp}
                onChange={(e) => setObp(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                TYT Neti
              </label>

              <input
                type="number"
                value={tyt}
                onChange={(e) => setTyt(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                AYT Neti
              </label>

              <input
                type="number"
                value={ayt}
                onChange={(e) => setAyt(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3"
              />
            </div>

          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {[
            { year: 2024, result: result2024 },
            { year: 2025, result: result2025 },
            { year: 2026, result: result2026 },
          ].map((item) => (
            <div
              key={item.year}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6"
            >

              <div className="flex items-center justify-between">

                <h2 className="text-2xl font-bold">
                  {item.year}
                </h2>

                <span className="rounded-full bg-blue-100 dark:bg-blue-900/40 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
                  Tahmini
                </span>

              </div>

              <div className="mt-6">

                <p className="text-sm text-slate-500">
                  Başarı Sıralaması
                </p>

                <p className="text-5xl font-black text-blue-600 mt-2">
                  {item.result.estimatedRank.toLocaleString("tr-TR")}
                </p>

              </div>

              <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-5 space-y-3">
                                <div className="flex items-center justify-between">
                  <span className="text-slate-500">
                    TYT Hedefi
                  </span>

                  <span className="font-semibold">
                    {item.result.target
                      ? `${item.result.target.tytMin} - ${item.result.target.tytMax}`
                      : "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">
                    AYT Hedefi
                  </span>

                  <span className="font-semibold">
                    {item.result.target
                      ? `${item.result.target.aytMin} - ${item.result.target.aytMax}`
                      : "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">
                    Güven Oranı
                  </span>

                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    %{item.result.confidence}
                  </span>
                </div>

              </div>

            </div>
          ))}

        </div>

        <div className="rounded-2xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-800 p-6">

          <h2 className="text-xl font-bold mb-4">
            💡 Bilgilendirme
          </h2>

          <p className="text-slate-600 dark:text-slate-300 leading-8">
            Bu hesaplama geçmiş yıllara ait TYT, AYT ve OBP verileri
            kullanılarak oluşturulmuş tahmini bir başarı sıralamasıdır.
            Gerçek YKS sonuçları;
            sınavın zorluk seviyesi,
            adayların performansı,
            standart sapma
            ve ÖSYM değerlendirmelerine göre farklılık gösterebilir.
          </p>

        </div>

      </div>
    </AppLayout>
  );
}