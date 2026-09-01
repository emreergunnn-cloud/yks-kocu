"use client";

import { Bell } from "lucide-react";
import { NotificationPanel } from "./notification/NotificationPanel";
import { useNotificationPanel } from "./notification/useNotificationPanel";

export function NotificationBell() {
  const panel = useNotificationPanel();
  if (!panel.user) return null;
  return (
    <div className="relative" ref={panel.panelRef}>
      <button onClick={() => panel.setOpen((open) => !open)} className="relative rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200" aria-label="Bildirimler">
        <Bell className="h-5 w-5" />
        {panel.unreadCount > 0 && <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">{panel.unreadCount > 9 ? "9+" : panel.unreadCount}</span>}
      </button>
      {panel.open && <NotificationPanel notifications={panel.notifications} loading={panel.loading} unreadCount={panel.unreadCount} onClose={() => panel.setOpen(false)} onMarkRead={panel.markRead} onMarkAllRead={panel.markAllRead} />}
    </div>
  );
}
