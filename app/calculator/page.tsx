"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageContainer } from "@/components/ui/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { CalculatorForm } from "@/components/calculator/page/CalculatorForm";
import { CalculatorResultsPanel } from "@/components/calculator/page/CalculatorResults";
import { CalculatorSummary } from "@/components/calculator/page/CalculatorSummary";
import { useRankingCalculatorForm } from "@/components/calculator/page/useRankingCalculatorForm";

export default function RankingCalculatorPage() {
  const form = useRankingCalculatorForm();
  return <AppLayout><PageContainer><PageHeader title="📊 Sıralama Hesaplayıcı" subtitle="TYT, AYT ve OBP bilgilerini girerek geçmiş yıllara göre tahmini başarı sıralamanı hesaplayabilirsin." /><div className="grid grid-cols-1 gap-6 lg:grid-cols-3"><div className="space-y-6 lg:col-span-1"><CalculatorForm alan={form.alan} setAlan={form.setAlan} tyt={form.tyt} setTyt={form.setTyt} ayt={form.ayt} setAyt={form.setAyt} obp={form.obp} setObp={form.setObp} error={form.error} onCalculate={form.calculate} />{form.results && <CalculatorSummary alan={form.alan} results={form.results} />}</div><CalculatorResultsPanel results={form.results} /></div></PageContainer></AppLayout>;
}
