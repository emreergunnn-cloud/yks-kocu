import {
  Brain,
  RefreshCw,
} from "lucide-react";

interface Props {
  onRefresh: () => void;
}

export function StudyPlannerHeader({
  onRefresh,
}: Props) {
  return (
    <header className="flex items-center justify-between gap-3">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold">
          <Brain className="w-5 h-5 text-blue-600" />
          Çalışma Planı
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Konu sırana, eksiklerine ve sınav
          riskine göre oluşturulan çalışma
          programı.
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