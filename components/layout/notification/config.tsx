import type { ReactNode } from "react";
import { BookOpen, CheckCheck, ClipboardList, Flame, Star, Target, Trophy } from "lucide-react";
import type { NotificationType } from "../../../services/notificationService";

export const TYPE_ICONS: Record<NotificationType, ReactNode> = {
  study_reminder: <BookOpen className="h-4 w-4" />,
  exam_reminder: <ClipboardList className="h-4 w-4" />,
  revision_reminder: <CheckCheck className="h-4 w-4" />,
  goal_reminder: <Target className="h-4 w-4" />,
  motivation: <Star className="h-4 w-4" />,
  streak: <Flame className="h-4 w-4" />,
  achievement: <Trophy className="h-4 w-4" />,
};

export const TYPE_COLORS: Record<NotificationType, string> = {
  study_reminder: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
  exam_reminder: "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400",
  revision_reminder: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
  goal_reminder: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
  motivation: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
  streak: "bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400",
  achievement: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400",
};

export function timeAgo(ts: any): string {
  const date = ts?.toDate ? ts.toDate() : ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "az önce";
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} sa önce`;
  return `${Math.floor(diff / 86400)} gün önce`;
}
