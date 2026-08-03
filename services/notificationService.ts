import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
  where,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export type NotificationType =
  | "study_reminder"
  | "exam_reminder"
  | "revision_reminder"
  | "goal_reminder"
  | "motivation"
  | "streak"
  | "achievement";

export interface AppNotification {
  id?: string;
  uid: string;
  title: string;
  body: string;
  type: NotificationType;
  read: boolean;
  createdAt: any;
  link?: string;
}

/**
 * Fetch all notifications for a user (most recent first).
 */
export async function getNotifications(uid: string, limitCount = 20): Promise<AppNotification[]> {
  try {
    const q = query(
      collection(db, "users", uid, "notifications"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    const results: AppNotification[] = snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as AppNotification) }))
      .slice(0, limitCount);
    return results;
  } catch {
    return [];
  }
}

/**
 * Create a new notification for a user.
 */
export async function createNotification(
  uid: string,
  notification: Omit<AppNotification, "id" | "uid" | "createdAt" | "read">
): Promise<void> {
  try {
    await addDoc(collection(db, "users", uid, "notifications"), {
      uid,
      ...notification,
      read: false,
      createdAt: Timestamp.now(),
    });
  } catch {
    // silently fail
  }
}

/**
 * Mark a single notification as read.
 */
export async function markNotificationRead(uid: string, notificationId: string): Promise<void> {
  try {
    const ref = doc(db, "users", uid, "notifications", notificationId);
    await updateDoc(ref, { read: true });
  } catch {}
}

/**
 * Mark all notifications as read.
 */
export async function markAllNotificationsRead(uid: string): Promise<void> {
  try {
    const q = query(
      collection(db, "users", uid, "notifications"),
      where("read", "==", false)
    );
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach((d) => {
      batch.update(d.ref, { read: true });
    });
    await batch.commit();
  } catch {}
}

/**
 * Generate daily motivational notifications if none have been created today.
 * Call this once per login session.
 */
export async function ensureDailyNotifications(
  uid: string,
  studiedTopicsCount: number,
  examCount: number
): Promise<void> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  try {
    const q = query(
      collection(db, "users", uid, "notifications"),
      where("createdAt", ">=", Timestamp.fromDate(todayStart)),
      where("type", "==", "motivation")
    );
    const snap = await getDocs(q);
    if (!snap.empty) return; // Already sent today

    const messages = [
      "Bugün çalışmaya ne zaman başlayacaksın? 🎯",
      "Her gün bir adım, her adım bir başarı! 💪",
      "YKS'ye hazırlık bir maraton, bugün de koş! 🏃",
      "Hedefine ulaşmak için bugün da çalış! ⭐",
      "Başarı tesadüf değil, çalışmanın ürünüdür! 📚",
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];

    await createNotification(uid, {
      title: "Günlük Motivasyon",
      body: msg,
      type: "motivation",
      link: "/dashboard",
    });

    // Remind about topics if few completed
    if (studiedTopicsCount < 5) {
      await createNotification(uid, {
        title: "Konu Takibi",
        body: "Bugün bir konu daha tamamla! Konular sayfasından ilerleme kaydet.",
        type: "study_reminder",
        link: "/subjects",
      });
    }

    // Remind about exams if few
    if (examCount < 3) {
      await createNotification(uid, {
        title: "Deneme Hatırlatması",
        body: "Daha fazla deneme girerek gelişimini takip et!",
        type: "exam_reminder",
        link: "/deneme/ekle",
      });
    }
  } catch {}
}
