import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// --- Data (copied from client-side) ---

const YKS_EXAM_DATE = new Date('2027-06-19T00:00:00');
const MANIFEST_QUOTES = [
  { id: "mq_001", text: "Bugün gösterdiğin sabır, sınav gününde sana eşsiz bir özgüven verecek ve seni hayallerine kavuşturacak." },
  { id: "mq_002", text: "Her çözdüğün zor soru, hedeflerine bir adım daha yaklaşmanı sağlayacak." },
  { id: "mq_003", text: "Pes etmediğin her an, yarınki büyük başarılarının temelini oluşturuyor." },
  // Add more quotes... for brevity, we'll use a small sample.
];

function getDaysUntilYKS(): number {
  const today = new Date();
  // Set hours to 0 to compare dates only
  today.setHours(0, 0, 0, 0);
  const examDate = new Date(YKS_EXAM_DATE);
  examDate.setHours(0, 0, 0, 0);

  const diffTime = examDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

function getQuoteOfTheDay(): string {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).valueOf()) / 1000 / 60 / 60 / 24);
  const quoteIndex = dayOfYear % MANIFEST_QUOTES.length;
  return MANIFEST_QUOTES[quoteIndex].text;
}

// --- Scheduled Cloud Function ---

export const sendDailyYksQuoteNotification = functions.region('europe-west1').pubsub
  .schedule('every day 09:00')
  .timeZone('Europe/Istanbul')
  .onRun(async (context) => {
    const db = admin.firestore();
    const messaging = admin.messaging();

    const daysLeft = getDaysUntilYKS();
    const quote = getQuoteOfTheDay();

    const title = `YKS'ye ${daysLeft} gün kaldı`;
    const body = `"${quote}"`;

    // Query for users who have opted-in and have tokens
    const usersSnapshot = await db.collection('users')
      .where('yksQuoteNotificationEnabled', '==', true)
      .get();

    if (usersSnapshot.empty) {
      console.log("No users to send notifications to.");
      return null;
    }

    const promises: Promise<any>[] = [];
    usersSnapshot.forEach((doc) => {
      const user = doc.data();
      if (user.fcmTokens && user.fcmTokens.length > 0) {
        const payload: admin.messaging.MessagingPayload = {
          notification: {
            title: title,
            body: body,
            icon: '/icon-192.svg',
            badge: '/icon-192.svg' // For Android
          },
        };

        promises.push(messaging.sendToDevice(user.fcmTokens, payload));
      }
    });

    await Promise.all(promises);
    console.log(`Sent notifications to ${promises.length} users.`);
    return null;
  });
