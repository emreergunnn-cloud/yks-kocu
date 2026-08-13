import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface UserSettings {
  theme: "system" | "light" | "dark";
  pomodoroLength: number;
  breakLength: number;
  longBreakLength: number;
  notificationsEnabled: boolean;
  dailyGoalQuestions: number;
  dailyGoalHours: number;
  weeklyGoalExams: number;
  yksQuoteNotificationEnabled: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: "system",
  pomodoroLength: 25,
  breakLength: 5,
  longBreakLength: 15,
  notificationsEnabled: true,
  dailyGoalQuestions: 150,
  dailyGoalHours: 4,
  weeklyGoalExams: 3,
  yksQuoteNotificationEnabled: true,
};

export async function getUserSettings(uid: string): Promise<UserSettings> {
  try {
    const ref = doc(db, "users", uid, "settings", "preferences");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { ...DEFAULT_SETTINGS, ...(snap.data() as Partial<UserSettings>) };
    }
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveUserSettings(uid: string, settings: Partial<UserSettings>): Promise<void> {
  const ref = doc(db, "users", uid, "settings", "preferences");
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, settings as Record<string, unknown>);
  } else {
    await setDoc(ref, { ...DEFAULT_SETTINGS, ...settings });
  }
}
