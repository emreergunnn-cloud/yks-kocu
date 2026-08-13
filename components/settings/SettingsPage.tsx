"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserSettings, saveUserSettings, UserSettings, DEFAULT_SETTINGS } from "@/services/settingsService";
import { Settings, Bell, Timer, Moon, Sun, Monitor, Target, Save, Check, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/Switch";
import { subscribeToYksQuoteNotifications, unsubscribeFromYksQuoteNotifications } from "@/services/pwaService";

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    getUserSettings(user.uid).then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;

    if (settings.yksQuoteNotificationEnabled) {
      subscribeToYksQuoteNotifications(user.uid);
    } else {
      unsubscribeFromYksQuoteNotifications(user.uid);
    }
  }, [settings.yksQuoteNotificationEnabled, user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await saveUserSettings(user.uid, settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const update = <K extends keyof UserSettings>(key: K, val: UserSettings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: val }));

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" /> Ayarlar
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Uygulama tercihlerinizi yönetin</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm transition-all disabled:opacity-50"
        >
          {saved ? <><Check className="w-4 h-4" />Kaydedildi</> : <><Save className="w-4 h-4" />{saving ? "Kaydediliyor..." : "Kaydet"}</>}
        </button>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Monitor className="w-4 h-4" /> Görünüm
        </h2>
        <div>
          <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">Tema</label>
          <div className="flex gap-2">
            {([
              { val: "light", icon: <Sun className="w-4 h-4" />, label: "Açık" },
              { val: "dark", icon: <Moon className="w-4 h-4" />, label: "Koyu" },
              { val: "system", icon: <Monitor className="w-4 h-4" />, label: "Sistem" },
            ] as const).map((t) => (
              <button
                key={t.val}
                onClick={() => update("theme", t.val)}
                className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${settings.theme === t.val ? "border-blue-500 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
              >
                {t.icon}{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pomodoro */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Timer className="w-4 h-4" /> Pomodoro
        </h2>
        {([
          { key: "pomodoroLength" as const, label: "Çalışma süresi (dakika)", min: 10, max: 120, step: 5 },
          { key: "breakLength" as const, label: "Kısa mola (dakika)", min: 1, max: 30, step: 1 },
          { key: "longBreakLength" as const, label: "Uzun mola (dakika)", min: 5, max: 60, step: 5 },
        ]).map(({ key, label, min, max, step }) => (
          <div key={key}>
            <div className="flex justify-between mb-1.5">
              <label className="text-sm text-slate-600 dark:text-slate-400">{label}</label>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{settings[key]} dk</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={settings[key] as number}
              onChange={(e) => update(key, parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        ))}
      </div>

      {/* Goals */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Target className="w-4 h-4" /> Günlük Hedefler
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {([
            { key: "dailyGoalHours" as const, label: "Günlük Saat", suffix: "sa", min: 1, max: 16 },
            { key: "dailyGoalQuestions" as const, label: "Günlük Soru", suffix: "soru", min: 10, max: 500 },
            { key: "weeklyGoalExams" as const, label: "Haftalık Deneme", suffix: "deneme", min: 1, max: 14 },
          ]).map(({ key, label, suffix, min, max }) => (
            <div key={key} className="space-y-1">
              <label className="text-xs text-slate-500 dark:text-slate-400">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={min}
                  max={max}
                  value={settings[key] as number}
                  onChange={(e) => update(key, parseInt(e.target.value) || min)}
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
                <span className="text-xs text-slate-400 shrink-0">{suffix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Bell className="w-4 h-4" /> Genel Bildirimler
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Bildirimleri Etkinleştir</p>
            <p className="text-xs text-slate-400 mt-0.5">Çalışma ve sınav hatırlatmaları</p>
          </div>
          <Switch
            checked={settings.notificationsEnabled}
            onChange={(checked) => update("notificationsEnabled", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">YKS + Günlük Söz Bildirimleri</p>
            <p className="text-xs text-slate-400 mt-0.5">YKS'ye kalan süreyi ve günün sözünü telefon bildirimlerinde göster.</p>
          </div>
          <Switch
            checked={settings.yksQuoteNotificationEnabled}
            onChange={(checked) => update("yksQuoteNotificationEnabled", checked)}
          />
        </div>

      </div>
    </div>
  );
};
