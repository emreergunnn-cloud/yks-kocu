"use client";

import { useState } from "react";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageContainer } from "@/components/ui/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { NumberInput } from "@/components/ui/NumberInput";
import { Select } from "@/components/ui/Select";

import { RankingResultCard } from "@/components/calculator/RankingResultCard";
import { calculateEstimatedRanking, RankingCalculatorResult } from "@/services/rankingCalculator";

export default function RankingCalculatorPage() {
  const [alan, setAlan] = useState<"Sayısal" | "Eşit Ağırlık" | "Sözel" | "Dil">("Sayısal");

  const [tyt, setTyt] = useState<number | "">("");
  const [ayt, setAyt] = useState<number | "">("");
  const [obp, setObp] = useState<number | "">("");

  const [error, setError] = useState("");
  
  const [results, setResults] = useState<{
    2024: RankingCalculatorResult;
    2025: RankingCalculatorResult;
    2026: RankingCalculatorResult;
    summary: {
      obpContribution: number;
      tytPercentage: number;
      aytPercentage: number;
    }
  } | null>(null);

  const handleCalculate = () => {
    setError("");

    const parsedObp = Number(obp);
    const parsedTyt = Number(tyt);
    const parsedAyt = Number(ayt);

    if (obp === "" || parsedObp < 50 || parsedObp > 100) {
      setError("Geçerli bir OBP değeri giriniz (50 - 100 arası).");
      return;
    }

    if (tyt === "" || parsedTyt < 0 || parsedTyt > 120) {
      setError("Geçerli bir TYT neti giriniz (0 - 120 arası).");
      return;
    }

    const maxAyt = alan === "Dil" ? 80 : 80; // In YDT max is 80, in AYT max is 80 (since user selects a single area)
    if (ayt === "" || parsedAyt < 0 || parsedAyt > maxAyt) {
      setError(`Geçerli bir ${alan === "Dil" ? "YDT" : "AYT"} neti giriniz (0 - ${maxAyt} arası).`);
      return;
    }

    const result2024 = calculateEstimatedRanking({
      alan,
      year: 2024,
      tyt: parsedTyt,
      ayt: parsedAyt,
      obp: parsedObp,
    });

    const result2025 = calculateEstimatedRanking({
      alan,
      year: 2025,
      tyt: parsedTyt,
      ayt: parsedAyt,
      obp: parsedObp,
    });

    const result2026 = calculateEstimatedRanking({
      alan,
      year: 2026,
      tyt: parsedTyt,
      ayt: parsedAyt,
      obp: parsedObp,
    });

    // Roughly calculate weight contributions (YKS format)
    const obpContribution = Math.round(parsedObp * 0.6); // Max 60
    
    // In placement score, TYT is ~40%, AYT is ~60% (excluding OBP). 
    let tytWeight = 0.40;
    let aytWeight = 0.60;
    if (alan === "Eşit Ağırlık") { tytWeight = 0.45; aytWeight = 0.55; }
    else if (alan === "Sözel") { tytWeight = 0.50; aytWeight = 0.50; }
    else if (alan === "Dil") { tytWeight = 0.35; aytWeight = 0.65; }

    setResults({
      2024: result2024,
      2025: result2025,
      2026: result2026,
      summary: {
        obpContribution,
        tytPercentage: tytWeight * 100,
        aytPercentage: aytWeight * 100,
      }
    });
  };

  return (
    <AppLayout>
      <PageContainer>
        <PageHeader
          title="📊 Sıralama Hesaplayıcı"
          subtitle="TYT, AYT ve OBP bilgilerini girerek geçmiş yıllara göre tahmini başarı sıralamanı hesaplayabilirsin."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <h2 className="text-xl font-bold mb-4">Sınav Bilgileri</h2>
              <div className="space-y-4">
                <Select
                  label="Alan"
                  value={alan}
                  onChange={(e) =>
                    setAlan(
                      e.target.value as "Sayısal" | "Eşit Ağırlık" | "Sözel" | "Dil"
                    )
                  }
                >
                  <option value="Sayısal">Sayısal</option>
                  <option value="Eşit Ağırlık">Eşit Ağırlık</option>
                  <option value="Sözel">Sözel</option>
                  <option value="Dil">Dil</option>
                </Select>

                <NumberInput
                  label="Diploma Notu (OBP)"
                  value={obp}
                  onChange={(e) => setObp(e.target.value === "" ? "" : Number(e.target.value))}
                  min={50}
                  max={100}
                />

                <NumberInput
                  label="Toplam TYT Neti"
                  value={tyt}
                  onChange={(e) => setTyt(e.target.value === "" ? "" : Number(e.target.value))}
                  min={0}
                  max={120}
                />

                <NumberInput
                  label={alan === "Dil" ? "Toplam YDT Neti" : "Toplam AYT Neti"}
                  value={ayt}
                  onChange={(e) => setAyt(e.target.value === "" ? "" : Number(e.target.value))}
                  min={0}
                  max={80}
                />

                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                    {error}
                  </p>
                )}

                <button
                  onClick={handleCalculate}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  Hesapla
                </button>
              </div>
            </Card>

            {results && (
              <Card>
                <h3 className="text-lg font-bold mb-3">Hesaplama Özeti</h3>
                <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span>OBP Yerleştirme Puanı Katkısı:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">+{results.summary.obpContribution} Puan</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span>TYT Ağırlığı ({alan}):</span>
                    <span className="font-semibold">% {results.summary.tytPercentage}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span>{alan === "Dil" ? "YDT" : "AYT"} Ağırlığı ({alan}):</span>
                    <span className="font-semibold">% {results.summary.aytPercentage}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RankingResultCard
                year={2024}
                result={results?.[2024]}
              />

              <RankingResultCard
                year={2025}
                result={results?.[2025]}
              />
            </div>
            
            <div className="w-full">
              <RankingResultCard
                year={2026}
                result={results?.[2026]}
              />
            </div>

            <Card>
              <h2 className="text-xl font-bold mb-4">
                💡 Bilgilendirme
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Bu hesaplama sadece geçmiş yıllara ait veriler baz alınarak oluşturulmuş tahmini bir başarı sıralaması sunar. 
                Sadece toplam TYT ve AYT netlerinizi girerek hesaplama yaptığınızdan test bazlı (Matematik, Fen vb.) katsayı farklılıkları tam olarak hesaba katılamaz. 
                Gerçek YKS sonuçları, sınavın o yılki zorluk seviyesine, adayların genel performansına, standart sapmalara ve ÖSYM'nin değerlendirmelerine göre büyük farklılıklar gösterebilir.
                <br /><br />
                <strong>2026 Sonuçları:</strong> Henüz gerçekleşmemiş bir sınava ait olduğu için geçmiş eğilimlere göre hesaplanan ve geniş bir aralık olarak sunulan bir gelecek tahminidir.
              </p>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppLayout>
  );
}