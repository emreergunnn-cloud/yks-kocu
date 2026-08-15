import {
  Flame,
  TrendingDown,
} from "lucide-react";

import type {
  StudyTaskExamImpact,
} from "@/types/examImpact";

const LABELS = {
  medium: "Orta",
  high: "Yüksek",
  "very-high": "Çok Yüksek",
};

interface Props {
  impact:
    StudyTaskExamImpact;
}

export function ExamImpactBadge({
  impact,
}: Props) {
  const {
    riskLevel,
    expectedQuestions,
    estimatedPointRisk,
    reason,
  } = impact;

  const questionLabel =
    expectedQuestions.min ===
    expectedQuestions.max
      ? `~${expectedQuestions.min} soru`
      : `~${expectedQuestions.min}-${expectedQuestions.max} soru`;

  const hasPointRisk =
    estimatedPointRisk.max > 0;

  const pointLabel =
    estimatedPointRisk.min ===
    estimatedPointRisk.max
      ? `≈ ${estimatedPointRisk.max.toFixed(1)} puan`
      : `≈ ${estimatedPointRisk.min.toFixed(1)}-${estimatedPointRisk.max.toFixed(1)} puan`;

  return (
    <div className="mt-3 rounded-xl border border-orange-200 bg-orange-50/70 p-3 dark:border-orange-900 dark:bg-orange-950/20">
      <div className="flex items-center gap-2">
        <Flame className="w-4 h-4 text-orange-500" />

        <span className="text-xs font-bold text-orange-700 dark:text-orange-300">
          {LABELS[riskLevel]}
          {" "}
          Sınav Riski
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
        <span>
          Sınav etkisi:
          {" "}
          <strong>
            {questionLabel}
          </strong>
        </span>

        {hasPointRisk && (
          <span className="inline-flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />

            Tahmini puan riski:
            {" "}
            <strong>
              {pointLabel}
            </strong>
          </span>
        )}
      </div>

      <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
        {reason}
      </p>

      {hasPointRisk && (
        <p className="mt-1 text-[9px] text-slate-400">
          * Puan değeri resmî ÖSYM konu puanı değil,
          sınav ağırlıkları üzerinden oluşturulan model tahminidir.
        </p>
      )}
    </div>
  );
}