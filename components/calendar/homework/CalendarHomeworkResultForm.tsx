"use client";

import {
  StudyTaskNumberField,
} from "@/components/study/progress/StudyTaskNumberField";

interface Props {
  questionCount: number;

  solved: string;
  correct: string;
  wrong: string;

  saving: boolean;
  error: string;

  setSolved:
    (value: string) => void;

  setCorrect:
    (value: string) => void;

  setWrong:
    (value: string) => void;

  onSubmit: () => void;
  onCancel: () => void;
}

export function CalendarHomeworkResultForm({
  questionCount,
  solved,
  correct,
  wrong,
  saving,
  error,
  setSolved,
  setCorrect,
  setWrong,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <div className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-900/50">
      <p className="text-xs font-semibold">
        {questionCount}
        {" soruluk ödev"}
      </p>

      <div className="grid grid-cols-3 gap-2">
        <StudyTaskNumberField
          label="Çözdüm"
          value={solved}
          max={questionCount}
          onChange={setSolved}
        />

        <StudyTaskNumberField
          label="Doğru"
          value={correct}
          max={questionCount}
          onChange={setCorrect}
        />

        <StudyTaskNumberField
          label="Yanlış"
          value={wrong}
          max={questionCount}
          onChange={setWrong}
        />
      </div>

      {error && (
        <p className="text-[11px] text-red-500">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          disabled={saving}
          onClick={onSubmit}
          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          {saving
            ? "Kaydediliyor..."
            : "Kaydet"}
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={onCancel}
          className="rounded-lg border px-3 py-2 text-xs"
        >
          Vazgeç
        </button>
      </div>
    </div>
  );
}