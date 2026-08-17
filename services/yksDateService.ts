import { Capacitor, registerPlugin } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { MANIFEST_QUOTES } from "@/lib/constants/quotes";
import type { UserSettings } from "./settingsService";

export type YksDateSource = "official" | "manual" | "none";

export interface YksDateResult {
  year: number;
  date: string | null;
  officialDate: string | null;
  source: YksDateSource;
}

interface WidgetPlugin {
  refresh(): Promise<void>;
}

const YksWidget = registerPlugin<WidgetPlugin>("YksWidget");
const QUOTE_POOL_VERSION = "tr-365-v2";

export async function fetchOfficialYksDate(year: number): Promise<string | null> {
  try {
    const response = await fetch(`/api/yks-date?year=${year}`, { cache: "no-store" });
    if (!response.ok) return null;

    const data = (await response.json()) as {
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
  const officialDate = settings.yksUseOfficialDate
    ? await fetchOfficialYksDate(settings.yksExamYear)
    : null;

  if (officialDate) {
    return {
      year: settings.yksExamYear,
      date: officialDate,
      officialDate,
      source: "official",
    };
  }

  if (settings.yksManualDate) {
    return {
      year: settings.yksExamYear,
      date: `${settings.yksManualDate}T10:15:00+03:00`,
      officialDate: null,
      source: "manual",
    };
  }

  return {
    year: settings.yksExamYear,
    date: null,
    officialDate: null,
    source: "none",
  };
}

async function syncQuotePool() {
  const version = await Preferences.get({
    key: "yksQuotePoolVersion",
  });

  if (version.value === QUOTE_POOL_VERSION) return;

  const pool = MANIFEST_QUOTES.map(({ text, author }) => ({
    text,
    author,
  }));

  await Preferences.set({
    key: "yksQuotePool",
    value: JSON.stringify(pool),
  });

  await Preferences.set({
    key: "yksQuotePoolVersion",
    value: QUOTE_POOL_VERSION,
  });
}

export async function syncNativeYksWidget(
  result: YksDateResult
): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  await Preferences.set({
    key: "yksExamYear",
    value: String(result.year),
  });

  await Preferences.set({
    key: "yksEffectiveDate",
    value: result.date ?? "",
  });

  await Preferences.set({
    key: "yksDateSource",
    value: result.source,
  });

  await syncQuotePool();

  try {
    await YksWidget.refresh();
  } catch {
    // Widget yoksa uygulama calismaya devam eder.
  }
}
