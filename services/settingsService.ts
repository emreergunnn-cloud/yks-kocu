import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase";

function defaultYksYear() {
  const now = new Date();
  const year = now.getFullYear();

  return now.getMonth() >= 6
    ? year + 1
    : year;
}

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

  yksExamYear: number;
  yksManualDate: string;
  yksUseOfficialDate: boolean;
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

  yksExamYear: defaultYksYear(),
  yksManualDate: "",
  yksUseOfficialDate: true,
};

export async function getUserSettings(
  uid: string
): Promise<UserSettings> {
  try {
    const ref = doc(
      db,
      "users",
      uid,
      "settings",
      "preferences"
    );

    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      return DEFAULT_SETTINGS;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...(snapshot.data() as Partial<UserSettings>),
    };
  } catch (error) {
    console.error(
      "Ayarlar alınamadı:",
      error
    );

    return DEFAULT_SETTINGS;
  }
}

export async function saveUserSettings(
  uid: string,
  settings: Partial<UserSettings>
): Promise<void> {
  const ref = doc(
    db,
    "users",
    uid,
    "settings",
    "preferences"
  );

  await setDoc(
    ref,
    settings,
    { merge: true }
  );
}