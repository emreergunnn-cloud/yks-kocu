import { QUOTES1 } from "./quotes1";
import { QUOTES2 } from "./quotes2";
import { QUOTES3 } from "./quotes3";
import { QUOTES4 } from "./quotes4";
import type { ManifestQuote } from "./types";

export type { ManifestQuote } from "./types";

export const MANIFEST_QUOTES: ManifestQuote[] = [
  ...QUOTES1,
  ...QUOTES2,
  ...QUOTES3,
  ...QUOTES4,
];

function getDayOfYear(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const current = Date.UTC(year, month, day);
  const start = Date.UTC(year, 0, 0);

  return Math.floor((current - start) / 86_400_000);
}

export function getDailyManifestQuote(
  date = new Date()
): ManifestQuote {
  const day = getDayOfYear(date);
  const index = (day - 1) % MANIFEST_QUOTES.length;

  return MANIFEST_QUOTES[index];
}
