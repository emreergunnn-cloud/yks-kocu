import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Props {
  year: number;
  month: number;

  disabled?: boolean;

  onPrevious: () => void;
  onNext: () => void;
}

export function StudyPlanDatePickerHeader({
  year,
  month,
  disabled = false,
  onPrevious,
  onNext,
}: Props) {
  const label =
    new Date(
      year,
      month,
      1
    ).toLocaleDateString(
      "tr-TR",
      {
        month: "long",
        year: "numeric",
      }
    );

  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        disabled={disabled}
        onClick={onPrevious}
        className="rounded-lg p-1.5 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <p className="text-xs font-bold capitalize">
        {label}
      </p>

      <button
        type="button"
        disabled={disabled}
        onClick={onNext}
        className="rounded-lg p-1.5 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}