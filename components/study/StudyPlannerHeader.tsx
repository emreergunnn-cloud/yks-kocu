import {
  Brain,
  RefreshCw,
} from "lucide-react";

import type { SinifOption } from "@/types/user";
import { isSchoolGrade } from "@/lib/constants/curriculum/config";

interface Props {
  onRefresh: () => void;
  sinif: SinifOption | "";
}

export function StudyPlannerHeader({
  onRefresh,
  sinif,
}: Props) {
  return (
    <header className="flex items-center justify-between gap-3">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold">
          <Brain className="w-5 h-5 text-blue-600" />
          Çalışma Planı
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {isSchoolGrade(sinif)
            ? `${sinif}. sınıf derslerini öğrenme, tekrar ve okul yazılılarına hazırlık planın.`
            : "Konu sırana, eksiklerine ve sınav riskine göre oluşturulan çalışma programı."}
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        className="p-2 border rounded-xl"
        title="Planı yenile"
      >
        <RefreshCw className="w-4 h-4" />
      </button>
    </header>
  );
}