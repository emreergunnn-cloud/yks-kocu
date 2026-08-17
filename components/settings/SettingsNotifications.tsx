import {
  Bell,
} from "lucide-react";

import {
  Switch,
} from "@/components/ui/Switch";

import type {
  UserSettings,
} from "@/services/settingsService";

interface Props {
  settings:
    UserSettings;

  onChange:
    (
      values:
        Partial<UserSettings>
    ) => void;
}

export function SettingsNotifications({
  settings,
  onChange,
}: Props) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
        <Bell className="h-4 w-4" />
        Genel Bildirimler
      </h2>

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">
            Bildirimleri Etkinleştir
          </p>

          <p className="mt-0.5 text-xs text-slate-400">
            Çalışma ve sınav hatırlatmaları
          </p>
        </div>

        <Switch
          checked={
            settings
              .notificationsEnabled
          }
          onChange={(
            checked
          ) =>
            onChange({
              notificationsEnabled:
                checked,
            })
          }
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">
            YKS + Günlük Söz Bildirimleri
          </p>

          <p className="mt-0.5 text-xs text-slate-400">
            YKS sayacı ve günlük söz bildirimleri
          </p>
        </div>

        <Switch
          checked={
            settings
              .yksQuoteNotificationEnabled
          }
          onChange={(
            checked
          ) =>
            onChange({
              yksQuoteNotificationEnabled:
                checked,
            })
          }
        />
      </div>
    </section>
  );
}
