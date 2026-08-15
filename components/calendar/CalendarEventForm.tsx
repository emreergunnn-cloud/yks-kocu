"use client";

import {
  useState,
} from "react";

import {
  TYPE_CONFIG,
} from "./calendarConfig";

import type {
  CreateDayEventInput,
} from "./hooks/useCalendarController";

interface Props {
  onSave:
    (
      input:
        CreateDayEventInput
    ) => Promise<void>;

  onCancel:
    () => void;
}

export function CalendarEventForm({
  onSave,
  onCancel,
}: Props) {
  const [title, setTitle] =
    useState("");

  const [type, setType] =
    useState<
      "study" | "goal"
    >("study");

  const [notes, setNotes] =
    useState("");

  const [duration, setDuration] =
    useState(60);

  const [saving, setSaving] =
    useState(false);

  async function handleSave() {
    if (
      !title.trim() ||
      saving
    ) {
      return;
    }

    setSaving(true);

    try {
      await onSave({
        title:
          title.trim(),

        type,

        notes,

        durationMinutes:
          duration,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <input
        value={title}
        onChange={(event) =>
          setTitle(
            event.target.value
          )
        }
        placeholder="Başlık"
        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
      />

      <div className="flex gap-2">
        {(
          [
            "study",
            "goal",
          ] as const
        ).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() =>
              setType(item)
            }
            className={`flex-1 py-2 rounded-lg text-xs font-medium ${
              type === item
                ? `${TYPE_CONFIG[item].color} text-white`
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            {
              TYPE_CONFIG[
                item
              ].label
            }
          </button>
        ))}
      </div>

      <div>
        <label className="text-xs text-slate-500 mb-1 block">
          Süre (dakika)
        </label>

        <input
          type="number"
          min={5}
          max={480}
          value={duration}
          onChange={(event) =>
            setDuration(
              Math.max(
                5,
                Number(
                  event.target.value
                ) || 5
              )
            )
          }
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
        />
      </div>

      <textarea
        value={notes}
        onChange={(event) =>
          setNotes(
            event.target.value
          )
        }
        rows={3}
        placeholder="Not"
        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm resize-none"
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={
            handleSave
          }
          disabled={
            saving ||
            !title.trim()
          }
          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium"
        >
          {saving
            ? "Kaydediliyor..."
            : "Kaydet"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
        >
          İptal
        </button>
      </div>
    </div>
  );
}