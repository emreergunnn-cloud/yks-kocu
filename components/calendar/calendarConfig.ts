export const WEEKDAY_LABELS = [
  "Pzt",
  "Sal",
  "Çar",
  "Per",
  "Cum",
  "Cmt",
  "Paz",
];

export const MONTH_NAMES = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

export const TYPE_CONFIG = {
  exam: {
    label: "Deneme",
    color: "bg-violet-500",
    textColor:
      "text-violet-600 dark:text-violet-400",
    bg:
      "bg-violet-50 dark:bg-violet-950/40",
    border:
      "border-violet-200 dark:border-violet-800",
  },

  study: {
    label: "Çalışma",
    color: "bg-blue-500",
    textColor:
      "text-blue-600 dark:text-blue-400",
    bg:
      "bg-blue-50 dark:bg-blue-950/40",
    border:
      "border-blue-200 dark:border-blue-800",
  },

  goal: {
    label: "Hedef",
    color: "bg-emerald-500",
    textColor:
      "text-emerald-600 dark:text-emerald-400",
    bg:
      "bg-emerald-50 dark:bg-emerald-950/40",
    border:
      "border-emerald-200 dark:border-emerald-800",
  },
} as const;