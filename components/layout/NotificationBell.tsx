"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Bell, X, Check, CheckCheck, BookOpen, ClipboardList, Target, Flame, Star, Trophy } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  AppNotification,
  NotificationType,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../services/notificationService";
import Link from "next/link";

const TYPE_ICONS: Record<NotificationType, React.ReactNode> = {
  study_reminder: <BookOpen className="w-4 h-4" />,
  exam_reminder: <ClipboardList className="w-4 h-4" />,
  revision_reminder: <CheckCheck className="w-4 h-4" />,
  goal_reminder: <Target className="w-4 h-4" />,
  motivation: <Star className="w-4 h-4" />,
  streak: <Flame className="w-4 h-4" />,
  achievement: <Trophy className="w-4 h-4" />,
};

const TYPE_COLORS: Record<NotificationType, string> = {
  study_reminder: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
  exam_reminder: "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400",
  revision_reminder: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
  goal_reminder: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
  motivation: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
  streak: "bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400",
  achievement: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400",
};

function timeAgo(ts: any): string {
  let date: Date;
  if (ts?.toDate) {
    date = ts.toDate();
  } else if (ts?.seconds) {
    date = new Date(ts.seconds * 1000);
  } else {
    date = new Date(ts);
  }
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "az önce";
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} sa önce`;
  return `${Math.floor(diff / 86400)} gün önce`;
}

export const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const data = await getNotifications(user.uid, 15);
    setNotifications(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleMarkRead = async (notification: AppNotification) => {
    if (!user || notification.read || !notification.id) return;
    await markNotificationRead(user.uid, notification.id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    await markAllNotificationsRead(user.uid);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  if (!user) return null;

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        aria-label="Bildirimler"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Bildirimler
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-[10px] font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Tümünü oku
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800">
            {loading ? (
              <div className="py-8 flex justify-center">
                <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Bildirim yok</p>
              </div>
            ) : (
              notifications.map((n) => {
                const iconBg = TYPE_COLORS[n.type];
                const content = (
                  <div
                    key={n.id}
                    onClick={() => handleMarkRead(n)}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                      n.read
                        ? "bg-transparent"
                        : "bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
                      {TYPE_ICONS[n.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${n.read ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-white"}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                        {n.body}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1" />
                    )}
                  </div>
                );

                return n.link ? (
                  <Link href={n.link} key={n.id} onClick={() => { handleMarkRead(n); setOpen(false); }}>
                    {content}
                  </Link>
                ) : (
                  <div key={n.id}>{content}</div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
