"use client";

import { useEffect, useState } from "react";
import { Quote, Sparkles } from "lucide-react";
import {
  getDailyManifestQuote,
  type ManifestQuote,
} from "@/lib/constants/manifestQuotes";

export function ManifestQuoteCard() {
  const [quote, setQuote] = useState<ManifestQuote | null>(null);

  useEffect(() => {
    setQuote(getDailyManifestQuote());
  }, []);

  if (!quote) {
    return (
      <div className="min-h-[130px] animate-pulse rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900" />
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <Quote className="absolute right-4 top-4 h-16 w-16 text-slate-100 opacity-60 dark:text-slate-800" />

      <div className="relative z-10 max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <Sparkles className="h-4 w-4" />
          Günün Sözü
        </div>

        <blockquote className="text-lg font-medium leading-relaxed text-slate-800 dark:text-slate-200 sm:text-xl">
          “{quote.text}”
        </blockquote>

        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          — {quote.author}
        </p>
      </div>
    </div>
  );
}
