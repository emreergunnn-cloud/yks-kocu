import {
  Brain,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface Props {
  minutes: number;
  topics: number;
  questions: number;
}

export function StudyPlanSummary({
  minutes,
  topics,
  questions,
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Card
        label="Çalışma"
        value={`${minutes} dk`}
        icon={<Clock className="w-4 h-4 text-blue-600" />}
      />

      <Card
        label="Konu"
        value={String(topics)}
        icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
      />

      <Card
        label="Soru hedefi"
        value={String(questions)}
        icon={<Brain className="w-4 h-4 text-violet-600" />}
      />
    </div>
  );
}

function Card({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
      {icon}

      <p className="text-[11px] text-slate-400 mt-2">
        {label}
      </p>

      <p className="text-xl font-black">
        {value}
      </p>
    </div>
  );
}