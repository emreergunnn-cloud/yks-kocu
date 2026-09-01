import { Card } from "@/components/ui/Card";
import type { CalculatorAlan, CalculatorResults } from "./types";
export function CalculatorSummary({ alan, results }: { alan: CalculatorAlan; results: CalculatorResults }) {
  return <Card><h3 className="mb-3 text-lg font-bold">Hesaplama Özeti</h3><div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
    <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800"><span>OBP Yerleştirme Puanı Katkısı:</span><span className="font-semibold text-blue-600 dark:text-blue-400">+{results.summary.obpContribution} Puan</span></div>
    <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-800"><span>TYT Ağırlığı ({alan}):</span><span className="font-semibold">% {results.summary.tytPercentage}</span></div>
    <div className="flex justify-between pb-2"><span>{alan === "Dil" ? "YDT" : "AYT"} Ağırlığı ({alan}):</span><span className="font-semibold">% {results.summary.aytPercentage}</span></div>
  </div></Card>;
}
