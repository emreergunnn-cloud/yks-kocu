import type {
  TopicStatus,
} from "@/types/topic";

export type SubjectTab =
  | "all"
  | "TYT"
  | "AYT";

export type StatusFilter =
  | "all"
  | TopicStatus;

export const TOPIC_STATUSES:
  TopicStatus[] = [
    "Başlanmadı",
    "Çalışılıyor",
    "Tamamlandı",
    "Tekrar Edilecek",
  ];

export const STATUS_CONFIG:
  Record<
    TopicStatus,
    {
      label: string;
      color: string;
      bg: string;
      border: string;
    }
  > = {
    "Başlanmadı": {
      label: "Başlanmadı",
      color: "text-slate-400",
      bg: "bg-slate-100 dark:bg-slate-800",
      border:
        "border-slate-200 dark:border-slate-700",
    },

    "Çalışılıyor": {
      label: "Çalışılıyor",
      color:
        "text-amber-600 dark:text-amber-400",
      bg:
        "bg-amber-50 dark:bg-amber-950/50",
      border:
        "border-amber-200 dark:border-amber-800",
    },

    "Tamamlandı": {
      label: "Tamamlandı",
      color:
        "text-emerald-600 dark:text-emerald-400",
      bg:
        "bg-emerald-50 dark:bg-emerald-950/50",
      border:
        "border-emerald-200 dark:border-emerald-800",
    },

    "Tekrar Edilecek": {
      label: "Tekrar",
      color:
        "text-violet-600 dark:text-violet-400",
      bg:
        "bg-violet-50 dark:bg-violet-950/50",
      border:
        "border-violet-200 dark:border-violet-800",
    },
  };

export function getNextTopicStatus(
  current:
    TopicStatus = "Başlanmadı"
) {
  const index =
    TOPIC_STATUSES.indexOf(
      current
    );

  return TOPIC_STATUSES[
    (index + 1) %
      TOPIC_STATUSES.length
  ];
}
