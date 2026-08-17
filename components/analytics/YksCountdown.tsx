"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  getUserSettings,
} from "@/services/settingsService";

import {
  resolveYksDate,
  syncNativeYksWidget,
  type YksDateSource,
} from "@/services/yksDateService";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function YksCountdown() {
  const { user } =
    useAuth();

  const [
    targetDate,
    setTargetDate,
  ] =
    useState<string | null>(
      null
    );

  const [year, setYear] =
    useState<number | null>(
      null
    );

  const [
    source,
    setSource,
  ] =
    useState<YksDateSource>(
      "none"
    );

  const [
    timeLeft,
    setTimeLeft,
  ] =
    useState<TimeLeft | null>(
      null
    );

  useEffect(() => {
    if (!user) return;

    const uid = user.uid;
    let active = true;

    async function load() {
      const settings =
        await getUserSettings(
          uid
        );

      const resolved =
        await resolveYksDate(
          settings
        );

      if (!active) return;

      setYear(resolved.year);
      setTargetDate(
        resolved.date
      );
      setSource(
        resolved.source
      );

      await syncNativeYksWidget(
        resolved
      );
    }

    void load();

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft(null);
      return;
    }

    const target =
      new Date(
        targetDate
      ).getTime();

    function calculate() {
      const difference =
        target -
        Date.now();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      setTimeLeft({
        days:
          Math.floor(
            difference /
              86400000
          ),
        hours:
          Math.floor(
            (difference %
              86400000) /
              3600000
          ),
        minutes:
          Math.floor(
            (difference %
              3600000) /
              60000
          ),
        seconds:
          Math.floor(
            (difference %
              60000) /
              1000
          ),
      });
    }

    calculate();

    const timer =
      window.setInterval(
        calculate,
        1000
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, [targetDate]);

  if (!year) {
    return (
      <div className="min-h-[140px] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
    );
  }

  if (!targetDate) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-6 text-white shadow-xl">
        <p className="text-xs font-bold text-blue-200">
          YKS {year}
        </p>

        <h3 className="mt-2 text-xl font-black">
          Sayaç için tarih seç
        </h3>

        <p className="mt-1 text-sm text-blue-100">
          ÖSYM henüz tarih açıklamadıysa Ayarlar bölümünden tahmini YKS tarihini girebilirsin.
        </p>
      </div>
    );
  }

  if (!timeLeft) return null;

  const sourceText =
    source === "official"
      ? "Resmî tarih · ÖSYM"
      : "Tahmini tarih · Senin seçimin";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-6 text-white shadow-xl">
      <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-200">
            YKS {year}
          </div>

          <h3 className="text-xl font-black">
            Hedefine Ulaşmak İçin Kalan Süre
          </h3>

          <p className="text-xs text-blue-100/80">
            {sourceText}
          </p>
        </div>

        <div className="flex gap-2 sm:gap-3">
          {[
            ["Gün", timeLeft.days],
            ["Saat", timeLeft.hours],
            ["Dakika", timeLeft.minutes],
            ["Saniye", timeLeft.seconds],
          ].map(([label, value]) => (
            <div
              key={label}
              className="min-w-[65px] rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-center"
            >
              <div className="text-2xl font-black">
                {String(value).padStart(
                  2,
                  "0"
                )}
              </div>

              <div className="mt-1 text-[10px] font-bold uppercase text-blue-200">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
