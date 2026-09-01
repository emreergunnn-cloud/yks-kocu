"use client";

import { useState } from "react";
import { calculateEstimatedRanking } from "@/services/rankingCalculator";
import type { CalculatorAlan, CalculatorResults } from "./types";

function getWeights(alan: CalculatorAlan) {
  if (alan === "Eşit Ağırlık") return [0.45, 0.55] as const;
  if (alan === "Sözel") return [0.5, 0.5] as const;
  if (alan === "Dil") return [0.35, 0.65] as const;
  return [0.4, 0.6] as const;
}

export function useRankingCalculatorForm() {
  const [alan, setAlan] = useState<CalculatorAlan>("Sayısal");
  const [tyt, setTyt] = useState<number | "">("");
  const [ayt, setAyt] = useState<number | "">("");
  const [obp, setObp] = useState<number | "">("");
  const [error, setError] = useState("");
  const [results, setResults] = useState<CalculatorResults | null>(null);

  const calculate = () => {
    setError("");
    const parsedObp = Number(obp); const parsedTyt = Number(tyt); const parsedAyt = Number(ayt);
    if (obp === "" || parsedObp < 50 || parsedObp > 100) { setError("Geçerli bir OBP değeri giriniz (50 - 100 arası)."); return; }
    if (tyt === "" || parsedTyt < 0 || parsedTyt > 120) { setError("Geçerli bir TYT neti giriniz (0 - 120 arası)."); return; }
    if (ayt === "" || parsedAyt < 0 || parsedAyt > 80) { setError(`Geçerli bir ${alan === "Dil" ? "YDT" : "AYT"} neti giriniz (0 - 80 arası).`); return; }
    const build = (year: 2024 | 2025 | 2026) => calculateEstimatedRanking({ alan, year, tyt: parsedTyt, ayt: parsedAyt, obp: parsedObp });
    const [tytWeight, aytWeight] = getWeights(alan);
    setResults({
      2024: build(2024), 2025: build(2025), 2026: build(2026),
      summary: { obpContribution: Math.round(parsedObp * 0.6), tytPercentage: tytWeight * 100, aytPercentage: aytWeight * 100 },
    });
  };

  return { alan, setAlan, tyt, setTyt, ayt, setAyt, obp, setObp, error, results, calculate };
}
