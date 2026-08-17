"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  DEFAULT_SETTINGS,
  getUserSettings,
  saveUserSettings,
  type UserSettings,
} from "@/services/settingsService";

import {
  subscribeToYksQuoteNotifications,
  unsubscribeFromYksQuoteNotifications,
} from "@/services/pwaService";

import {
  resolveYksDate,
  syncNativeYksWidget,
} from "@/services/yksDateService";

import {
  applyTheme,
} from "./theme";

export function useSettingsForm() {
  const { user } =
    useAuth();

  const [
    settings,
    setSettings,
  ] =
    useState<UserSettings>(
      DEFAULT_SETTINGS
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");

  const savedTimer =
    useRef<number | null>(
      null
    );

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const uid = user.uid;
    let active = true;

    async function load() {
      const data =
        await getUserSettings(
          uid
        );

      if (!active) return;

      setSettings(data);
      applyTheme(data.theme);
      setLoading(false);
    }

    void load();

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    return () => {
      if (savedTimer.current) {
        window.clearTimeout(
          savedTimer.current
        );
      }
    };
  }, []);

  function update(
    values:
      Partial<UserSettings>
  ) {
    setSettings(
      (previous) => ({
        ...previous,
        ...values,
      })
    );

    if (values.theme) {
      applyTheme(
        values.theme
      );
    }
  }

  async function save() {
    if (!user) return;

    setSaving(true);
    setError("");

    try {
      await saveUserSettings(
        user.uid,
        settings
      );

      const resolved =
        await resolveYksDate(
          settings
        );

      await syncNativeYksWidget(
        resolved
      );

      const wantsPush =
        settings.notificationsEnabled &&
        settings.yksQuoteNotificationEnabled;

      if (wantsPush) {
        await subscribeToYksQuoteNotifications(
          user.uid
        );
      } else {
        await unsubscribeFromYksQuoteNotifications(
          user.uid
        );
      }

      setSaved(true);

      if (savedTimer.current) {
        window.clearTimeout(
          savedTimer.current
        );
      }

      savedTimer.current =
        window.setTimeout(
          () => setSaved(false),
          2000
        );
    } catch (saveError) {
      console.error(
        saveError
      );

      setError(
        "Ayarlar kaydedilemedi."
      );
    } finally {
      setSaving(false);
    }
  }

  return {
    settings,
    loading,
    saving,
    saved,
    error,
    update,
    save,
  };
}
