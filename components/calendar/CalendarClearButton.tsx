"use client";

import {
  useState,
} from "react";

import {
  Loader2,
  Trash2,
  X,
} from "lucide-react";

interface Props {
  label: string;
  onConfirm:
    () => Promise<void>;
}

export function CalendarClearButton({
  label,
  onConfirm,
}: Props) {
  const [confirming, setConfirming] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  async function clear() {
    setLoading(true);

    try {
      await onConfirm();
      setConfirming(false);
    } finally {
      setLoading(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-rose-600 font-medium">
          Emin misin?
        </span>

        <button
          type="button"
          onClick={clear}
          disabled={loading}
          className="px-2.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold"
        >
          {loading && (
            <Loader2 className="inline w-3 h-3 mr-1 animate-spin" />
          )}

          Evet
        </button>

        <button
          type="button"
          onClick={() =>
            setConfirming(false)
          }
          disabled={loading}
          className="p-1.5 border rounded-lg"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() =>
        setConfirming(true)
      }
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 text-rose-600 text-xs font-medium hover:bg-rose-50"
    >
      <Trash2 className="w-4 h-4" />

      {label}
    </button>
  );
}