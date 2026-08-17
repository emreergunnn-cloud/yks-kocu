"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  Target,
} from "lucide-react";

import type {
  UserSettings,
} from "@/services/settingsService";

import {
  fetchOfficialYksDate,
} from "@/services/yksDateService";

interface Props {
  settings: UserSettings;

  onChange:
    (
      values:
        Partial<UserSettings>
    ) => void;
}

const GOALS = [
  {
    key: "dailyGoalHours",
    label: "Günlük Saat",
    suffix: "sa",
    min: 1,
    max: 16,
  },
  {
    key: "dailyGoalQuestions",
    label: "Günlük Soru",
    suffix: "soru",
    min: 10,
    max: 500,
  },
  {
    key: "weeklyGoalExams",
    label: "Haftalık Deneme",
    suffix: "deneme",
    min: 1,
    max: 14,
  },
] as const;

export function SettingsGoals({
  settings,
  onChange,
}: Props) {
  const [
    officialDate,
    setOfficialDate,
  ] =
    useState<string | null>(
      null
    );

  const [
    checking,
    setChecking,
  ] = useState(false);

  useEffect(() => {
    let active = true;

    async function check() {
      setChecking(true);

      const date =
        await fetchOfficialYksDate(
          settings.yksExamYear
        );

      if (!active) return;

      setOfficialDate(date);
      setChecking(false);
    }

    void check();

    return () => {
      active = false;
    };
  }, [settings.yksExamYear]);

  const currentYear =
    new Date().getFullYear();

  const years =
    Array.from(
      { length: 5 },
      (_, index) =>
        currentYear + index
    );

  return (
    <>
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
          <Target className="h-4 w-4" />
          Günlük Hedefler
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {GOALS.map((goal) => (
            <div
              key={goal.key}
              className="space-y-1"
            >
              <label className="text-xs text-slate-500">
                {goal.label}
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={goal.min}
                  max={goal.max}
                  value={
                    settings[
                      goal.key
                    ]
                  }
                  onChange={(event) =>
                    onChange({
                      [goal.key]:
                        Number(
                          event.target.value
                        ) ||
                        goal.min,
                    })
                  }
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                />

                <span className="text-xs text-slate-400">
                  {goal.suffix}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
          <CalendarDays className="h-4 w-4" />
          YKS Sayacı
        </h2>

        <div>
          <label className="mb-1 block text-xs text-slate-500">
            Hazırlandığın YKS
          </label>

          <select
            value={
              settings.yksExamYear
            }
            onChange={(event) =>
              onChange({
                yksExamYear:
                  Number(
                    event.target.value
                  ),
              })
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
          >
            {years.map((year) => (
              <option
                key={year}
                value={year}
              >
                {year} YKS
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
          <input
            type="checkbox"
            checked={
              settings
                .yksUseOfficialDate
            }
            onChange={(event) =>
              onChange({
                yksUseOfficialDate:
                  event.target.checked,
              })
            }
            className="mt-1"
          />

          <span>
            <span className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              ÖSYM tarihini otomatik kullan
            </span>

            <span className="text-xs text-slate-500">
              Resmî tarih açıklanırsa manuel tarihin yerine otomatik geçer.
            </span>
          </span>
        </label>

        <div className="rounded-xl border border-slate-200 p-3 text-xs dark:border-slate-800">
          {checking ? (
            <span className="text-slate-500">
              ÖSYM takvimi kontrol ediliyor...
            </span>
          ) : officialDate ? (
            <span className="font-medium text-emerald-600">
              Resmî TYT tarihi bulundu:{" "}
              {new Date(
                officialDate
              ).toLocaleDateString(
                "tr-TR"
              )}
            </span>
          ) : (
            <span className="text-amber-600">
              {settings.yksExamYear} YKS için resmî TYT tarihi henüz bulunamadı.
            </span>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-500">
            Tahmini / Manuel YKS Tarihi
          </label>

          <input
            type="date"
            value={
              settings.yksManualDate
            }
            onChange={(event) =>
              onChange({
                yksManualDate:
                  event.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
          />

          <p className="mt-1 text-xs text-slate-400">
            ÖSYM henüz tarihi açıklamadıysa sayaç bu tarihi kullanır.
          </p>
        </div>
      </section>
    </>
  );
}