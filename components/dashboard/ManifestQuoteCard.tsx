"use client";

import React, { useState, useEffect } from "react";
import { MANIFEST_QUOTES, ManifestQuote } from "@/lib/constants/manifestQuotes";
import { Quote, Sparkles } from "lucide-react";

const SEEN_QUOTES_KEY = "manifest_seen_quotes";

export const ManifestQuoteCard: React.FC = () => {
  const [quote, setQuote] = useState<ManifestQuote | null>(null);

  useEffect(() => {
    try {
      let seenIds: string[] = [];
      const stored = localStorage.getItem(SEEN_QUOTES_KEY);
      if (stored) {
        seenIds = JSON.parse(stored);
      }

      // If all quotes are seen, reset the list
      if (seenIds.length >= MANIFEST_QUOTES.length) {
        seenIds = [];
      }

      // Filter unseen quotes
      const unseenQuotes = MANIFEST_QUOTES.filter((q) => !seenIds.includes(q.id));
      
      // Fallback in case something goes wrong
      const validQuotes = unseenQuotes.length > 0 ? unseenQuotes : MANIFEST_QUOTES;

      // Pick random quote
      const randomIndex = Math.floor(Math.random() * validQuotes.length);
      const selectedQuote = validQuotes[randomIndex];

      setQuote(selectedQuote);

      // Save to localStorage
      seenIds.push(selectedQuote.id);
      localStorage.setItem(SEEN_QUOTES_KEY, JSON.stringify(seenIds));
    } catch (error) {
      console.error("Manifest quote error:", error);
      // Fallback if localStorage fails
      setQuote(MANIFEST_QUOTES[0]);
    }
  }, []);

  if (!quote) {
    return (
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 min-h-[100px] animate-pulse" />
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="absolute top-4 right-4 text-slate-100 dark:text-slate-800">
        <Quote className="w-16 h-16 opacity-50" />
      </div>
      
      <div className="relative z-10 flex flex-col gap-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
          <Sparkles className="w-4 h-4" />
          Günün Manifesti
        </div>
        
        <p className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-200 leading-relaxed max-w-3xl">
          "{quote.text}"
        </p>
      </div>
    </div>
  );
};
