"use client";

import type { UserSettings } from "@/services/settingsService";
import { DailyGoalsSection } from "./goals/DailyGoalsSection";
import { YksCounterSection } from "./goals/YksCounterSection";
import { useOfficialYksDate } from "./goals/useOfficialYksDate";

interface Props { settings: UserSettings; onChange: (values: Partial<UserSettings>) => void; }

export function SettingsGoals({ settings, onChange }: Props) {
  const { officialDate, checking } = useOfficialYksDate(settings.yksExamYear);
  return (
    <>
      <DailyGoalsSection settings={settings} onChange={onChange} />
      <YksCounterSection settings={settings} onChange={onChange} officialDate={officialDate} checking={checking} />
    </>
  );
}
