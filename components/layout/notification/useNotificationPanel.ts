"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getNotifications, markAllNotificationsRead, markNotificationRead, type AppNotification } from "../../../services/notificationService";

export function useNotificationPanel() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((item) => !item.read).length;

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setNotifications(await getNotifications(user.uid, 15));
    setLoading(false);
  }, [user]);

  useEffect(() => { if (open) void load(); }, [open, load]);
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const markRead = async (notification: AppNotification) => {
    if (!user || notification.read || !notification.id) return;
    await markNotificationRead(user.uid, notification.id);
    setNotifications((previous) => previous.map((item) => item.id === notification.id ? { ...item, read: true } : item));
  };
  const markAllRead = async () => {
    if (!user) return;
    await markAllNotificationsRead(user.uid);
    setNotifications((previous) => previous.map((item) => ({ ...item, read: true })));
  };

  return { user, open, setOpen, notifications, loading, unreadCount, panelRef, markRead, markAllRead };
}
