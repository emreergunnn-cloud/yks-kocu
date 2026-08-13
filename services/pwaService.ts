import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db, messaging, VAPID_KEY } from "@/lib/firebase";
import { getToken } from "firebase/messaging";

// --- YKS Date Calculation ---
const YKS_EXAM_DATE = new Date('2027-06-19T00:00:00');

function getDaysUntilYKS(): number {
  const today = new Date();
  const diffTime = YKS_EXAM_DATE.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

// --- Subscription Management ---

export async function subscribeToYksQuoteNotifications(uid: string): Promise<void> {
  if (!messaging) {
    console.warn("Firebase Messaging is not available.");
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (token) {
        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, {
          fcmTokens: arrayUnion(token)
        });
        console.log('FCM Token saved to user profile.');
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    }
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
  }
}

export async function unsubscribeFromYksQuoteNotifications(uid: string): Promise<void> {
  if (!messaging) return;
  try {
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (token) {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, {
        fcmTokens: arrayRemove(token)
      });
      console.log('FCM Token removed from user profile.');
    }
  } catch (error) {
    console.error('An error occurred while removing token. ', error);
  }
}
