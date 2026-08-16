"use client";

import type {
  StudyTask,
} from "@/types/studyPlan";

import {
  StudyTaskNumberField,
} from "./StudyTaskNumberField";

import {
  useStudyTaskProgressForm,
} from "./useStudyTaskProgressForm";

interface Props {
  uid: string;
  task: StudyTask;

  onClose: () => void;
}

export function StudyTaskProgressForm({
  uid,
  task,
  onClose,
}: Props) {
  const form =
    useStudyTaskProgressForm({
      uid,
      task,
    });

  async function handleSubmit() {
    const saved =
      await form.submit();

    if (saved) {
      onClose();
    }
  }

  return (
    <div className="mt-3 space-y-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <p className="text-xs font-semibold">
        {task.questionCount}
        {" soruluk ödev sonucu"}
      </p>

      <div className="grid grid-cols-3 gap-2">
        <StudyTaskNumberField
          label="Çözdüm"
          value={form.solved}
          max={task.questionCount}
          onChange={
            form.setSolved
          }
        />

        <StudyTaskNumberField
          label="Doğru"
          value={form.correct}
          max={task.questionCount}
          onChange={
            form.setCorrect
          }
        />

        <StudyTaskNumberField
          label="Yanlış"
          value={form.wrong}
          max={task.questionCount}
          onChange={
            form.setWrong
          }
        />
      </div>

      {form.solvedCount > 0 && (
        <p className="text-[11px] text-slate-500">
          Boş:{" "}
          {Math.max(
            0,
            form.blank
          )}
          {" · "}
          Eksik:{" "}
          <strong>
            {form.remaining}
          </strong>
        </p>
      )}

      {form.remaining > 0 &&
        form.solvedCount > 0 && (
          <p className="text-[11px] font-medium text-amber-600">
            {form.remaining}
            {" soru sonraki ödeve eklenecek."}
          </p>
        )}

      {form.error && (
        <p className="text-[11px] text-red-500">
          {form.error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          disabled={form.saving}
          onClick={() =>
            void handleSubmit()
          }
          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          {form.saving
            ? "Kaydediliyor..."
            : "Kaydet"}
        </button>

        <button
          type="button"
          disabled={form.saving}
          onClick={onClose}
          className="rounded-lg border px-3 py-2 text-xs"
        >
          Vazgeç
        </button>
      </div>
    </div>
  );
}