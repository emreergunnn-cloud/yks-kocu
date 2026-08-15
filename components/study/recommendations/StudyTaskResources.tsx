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

  return (
    <div className="mt-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-3 space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <TrendingUp className="w-4 h-4 text-emerald-500" />

        <span className="text-xs font-semibold">
          Kaynak seviyesi:
          {" "}
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
          <BookOpen className="w-4 h-4 mt-0.5 text-blue-500" />

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

      <a
        href={video.url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-medium"
      >
        <PlayCircle className="w-4 h-4" />

        <span>
          {video.channel}
          {" — "}
          {video.title}
        </span>

        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}