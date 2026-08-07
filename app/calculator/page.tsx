"use client";

import { useMemo, useState } from "react";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageContainer } from "@/components/ui/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { NumberInput } from "@/components/ui/NumberInput";
import { Select } from "@/components/ui/Select";

import { RankingResultCard } from "@/components/calculator/RankingResultCard";
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
      <PageContainer>
        <PageHeader
          title="📊 Sıralama Hesaplayıcı"
          subtitle="TYT, AYT ve OBP bilgilerini girerek geçmiş yıllara göre tahmini başarı sıralamanı hesaplayabilirsin."
        />

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              label="Alan"
              value={alan}
              onChange={(e) =>
                setAlan(
                  e.target.value as
                    | "Sayısal"
                    | "Eşit Ağırlık"
                    | "Sözel"
                    | "Dil"
                )
              }
            >
              <option value="Sayısal">Sayısal</option>
              <option value="Eşit Ağırlık">Eşit Ağırlık</option>
              <option value="Sözel">Sözel</option>
              <option value="Dil">Dil</option>
            </Select>

            <NumberInput
              label="OBP"
              value={obp}
              onChange={(e) => setObp(Number(e.target.value))}
            />

            <NumberInput
              label="TYT Neti"
              value={tyt}
              onChange={(e) => setTyt(Number(e.target.value))}
            />

            <NumberInput
              label="AYT Neti"
              value={ayt}
              onChange={(e) => setAyt(Number(e.target.value))}
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RankingResultCard
            year={2024}
            result={result2024}
          />

          <RankingResultCard
            year={2025}
            result={result2025}
          />

          <RankingResultCard
            year={2026}
            result={result2026}
          />
        </div>

        <Card>
          <h2 className="text-xl font-bold mb-4">
            💡 Bilgilendirme
          </h2>

          <p className="text-slate-600 dark:text-slate-300 leading-8">
            Bu hesaplama geçmiş yıllara ait TYT, AYT ve OBP verileri
            kullanılarak oluşturulmuş tahmini bir başarı sıralamasıdır.
            Gerçek YKS sonuçları sınavın zorluk seviyesi,
            adayların performansı, standart sapma ve
            ÖSYM değerlendirmelerine göre farklılık gösterebilir.
          </p>
        </Card>
      </PageContainer>
    </AppLayout>
  );
}