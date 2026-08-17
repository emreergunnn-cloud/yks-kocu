import {
  Capacitor,
  registerPlugin,
} from "@capacitor/core";

import {
  Preferences,
} from "@capacitor/preferences";

import type {
  UserSettings,
} from "./settingsService";

export type YksDateSource =
  | "official"
  | "manual"
  | "none";

export interface YksDateResult {
  year: number;
  date: string | null;
  officialDate: string | null;
  source: YksDateSource;
}

interface WidgetPlugin {
  refresh(): Promise<void>;
}

const YksWidget =
  registerPlugin<WidgetPlugin>(
    "YksWidget"
  );

export async function fetchOfficialYksDate(
  year: number
): Promise<string | null> {
  try {
    const response =
      await fetch(
        `/api/yks-date?year=${year}`,
        {
          cache: "no-store",
        }
      );

    if (!response.ok) {
      return null;
    }

    const data =
      (await response.json()) as {
        officialDate?: string | null;
      };

    return data.officialDate ?? null;
  } catch {
    return null;
  }
}

export async function resolveYksDate(
  settings: UserSettings
): Promise<YksDateResult> {
  let officialDate:
    string | null = null;

  if (
    settings
      .yksUseOfficialDate
  ) {
    officialDate =
      await fetchOfficialYksDate(
        settings.yksExamYear
      );
  }

  if (officialDate) {
    return {
      year:
        settings.yksExamYear,
      date:
        officialDate,
      officialDate,
      source:
        "official",
    };
  }

  if (
    settings.yksManualDate
  ) {
    return {
      year:
        settings.yksExamYear,
      date:
        `${settings.yksManualDate}T10:15:00+03:00`,
      officialDate: null,
      source:
        "manual",
    };
  }

  return {
    year:
      settings.yksExamYear,
    date: null,
    officialDate: null,
    source: "none",
  };
}

export async function syncNativeYksWidget(
  result: YksDateResult
): Promise<void> {
  if (
    !Capacitor.isNativePlatform()
  ) {
    return;
  }

  await Preferences.set({
    key: "yksExamYear",
    value:
      String(result.year),
  });

  await Preferences.set({
    key: "yksEffectiveDate",
    value:
      result.date ?? "",
  });

  await Preferences.set({
    key: "yksDateSource",
    value:
      result.source,
  });

  try {
    await YksWidget.refresh();
  } catch {
    // Widget mevcut değilse uygulamayı etkilemez.
  }
}