import Link from "next/link";
import { Bell, X } from "lucide-react";
import type { AppNotification } from "../../../services/notificationService";
import { timeAgo, TYPE_COLORS, TYPE_ICONS } from "./config";

interface Props { notifications: AppNotification[]; loading: boolean; unreadCount: number; onClose: () => void; onMarkRead: (item: AppNotification) => void; onMarkAllRead: () => void; }

function NotificationItem({ item, onMarkRead, onClose }: { item: AppNotification; onMarkRead: (item: AppNotification) => void; onClose: () => void }) {
  const content = (
    <div onClick={() => onMarkRead(item)} className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors ${item.read ? "bg-transparent" : "bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-950/20 dark:hover:bg-blue-950/30"}`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${TYPE_COLORS[item.type]}`}>{TYPE_ICONS[item.type]}</div>
      <div className="min-w-0 flex-1"><p className={`text-sm font-medium ${item.read ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-white"}`}>{item.title}</p><p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{item.body}</p><p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">{timeAgo(item.createdAt)}</p></div>
      {!item.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
    </div>
  );
  return item.link ? <Link href={item.link} onClick={() => { void onMarkRead(item); onClose(); }}>{content}</Link> : content;
}

export function NotificationPanel({ notifications, loading, unreadCount, onClose, onMarkRead, onMarkAllRead }: Props) {
  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800"><h3 className="text-sm font-bold text-slate-900 dark:text-white">Bildirimler{unreadCount > 0 && <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-[10px] font-bold text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">{unreadCount}</span>}</h3><div className="flex items-center gap-2">{unreadCount > 0 && <button onClick={onMarkAllRead} className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">Tümünü oku</button>}<button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X className="h-4 w-4" /></button></div></div>
      <div className="max-h-96 divide-y divide-slate-50 overflow-y-auto dark:divide-slate-800">
        {loading ? <div className="flex justify-center py-8"><div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" /></div> : notifications.length === 0 ? <div className="py-10 text-center"><Bell className="mx-auto mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" /><p className="text-sm text-slate-500 dark:text-slate-400">Bildirim yok</p></div> : notifications.map((item) => <NotificationItem key={item.id} item={item} onMarkRead={onMarkRead} onClose={onClose} />)}
      </div>
    </div>
  );
}
