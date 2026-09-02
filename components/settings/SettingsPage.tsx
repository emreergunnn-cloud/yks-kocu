"use client";

import { SettingsAppearance } from "./SettingsAppearance";
import { SettingsGoals } from "./SettingsGoals";
import { SettingsHeader } from "./SettingsHeader";
import { SettingsNotifications } from "./SettingsNotifications";
import { SettingsPomodoro } from "./SettingsPomodoro";
import { useSettingsForm } from "./useSettingsForm";

export function SettingsPage() {
  const form = useSettingsForm();

  if (form.loading) {
    return (
      <div className="space-y-4 p-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 p-4 md:p-6">
      <SettingsHeader
        saving={form.saving}
        saved={form.saved}
        error={form.error}
        onSave={() => void form.save()}
      />

      <SettingsAppearance
        theme={form.settings.theme}
        onChange={(theme) => form.update({ theme })}
      />

      <SettingsPomodoro settings={form.settings} onChange={form.update} />
      <SettingsGoals settings={form.settings} onChange={form.update} />
      <SettingsNotifications settings={form.settings} onChange={form.update} />
    </div>
  );
}
