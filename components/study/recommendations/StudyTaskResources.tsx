"use client";

import {
  BookOpen,
  ExternalLink,
  PlayCircle,
  TrendingUp,
} from "lucide-react";

import type {
  TaskRecommendation,
} from "@/types/recommendation";

import {
  openExternalUrl,
} from "@/lib/native/openExternalUrl";

const LEVEL_LABEL = {
  beginner: "Başlangıç",
  intermediate: "Orta",
  advanced: "İleri",
};

interface Props {
  recommendation:
    TaskRecommendation;
}

export function StudyTaskResources({
  recommendation,
}: Props) {
  const {
    level,
    trend,
    books,
    video,
    reason,
  } = recommendation;

  async function handleVideoOpen() {
    try {
      await openExternalUrl(
        video.url
      );
    } catch (error) {
      console.error(
        "YouTube bağlantısı açılamadı:",
        error
      );
    }
  }

  return (
    <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-3 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex items-center gap-2 flex-wrap">
        <TrendingUp className="w-4 h-4 text-emerald-500" />

        <span className="text-xs font-semibold">
          Kaynak seviyesi:{" "}
          {LEVEL_LABEL[level]}
        </span>

        <span className="text-[10px] text-slate-400">
          {trend.initial.toFixed(1)}
          {" → "}
          {trend.current.toFixed(1)}
          {" net"}
        </span>
      </div>

      <p className="text-[11px] text-slate-500">
        {reason}
      </p>

      {books.map((book) => (
        <div
          key={book.id}
          className="flex items-start gap-2"
        >
          <BookOpen className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />

          <div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {book.publisher}
              {" — "}
              {book.title}
            </p>

            <p className="text-[10px] text-slate-400">
              Önerilen kitap
            </p>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          void handleVideoOpen()
        }
        className="flex items-center gap-2 text-left text-xs font-medium text-red-600 dark:text-red-400"
      >
        <PlayCircle className="w-4 h-4 shrink-0" />

        <span>
          {video.channel}
          {" — "}
          {video.title}
        </span>

        <ExternalLink className="w-3 h-3 shrink-0" />
      </button>
    </div>
  );
}