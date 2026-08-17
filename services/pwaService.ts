import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { getDailyManifestQuote } from "@/lib/constants/manifestQuotes";

const QUOTE_ID_START = 810000;
const ANDROID_DAYS = 365;
const IOS_DAYS = 60;

function notificationDate(daysAhead: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  date.setHours(8, 0, 0, 0);
  return date;
}

function daysToSchedule() {
  return Capacitor.getPlatform() === "ios"
    ? IOS_DAYS
    : ANDROID_DAYS;
}

async function requestPermission() {
  let permission = await LocalNotifications.checkPermissions();

  if (permission.display === "prompt") {
    permission = await LocalNotifications.requestPermissions();
  }

  return permission.display === "granted";
}

async function cancelQuoteNotifications() {
  const pending = await LocalNotifications.getPending();

  const quoteNotifications = pending.notifications
    .filter(
      (item) =>
        item.id >= QUOTE_ID_START &&
        item.id < QUOTE_ID_START + 500
    )
    .map((item) => ({ id: item.id }));

  if (quoteNotifications.length > 0) {
    await LocalNotifications.cancel({
      notifications: quoteNotifications,
    });
  }
}

export async function subscribeToYksQuoteNotifications(
  _uid: string
): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    const allowed = await requestPermission();

    if (!allowed) {
      return;
    }

    await cancelQuoteNotifications();

    const now = new Date();
    const firstDate = notificationDate(0);
    const startOffset = firstDate <= now ? 1 : 0;
    const count = daysToSchedule();

    const notifications = Array.from(
      { length: count },
      (_, index) => {
        const daysAhead = index + startOffset;
        const date = notificationDate(daysAhead);
        const quote = getDailyManifestQuote(date);

        return {
          id: QUOTE_ID_START + index,
          title: "Günün Sözü ✨",
          body: `“${quote.text}” — ${quote.author}`,
          largeBody: `“${quote.text}”\n\n— ${quote.author}`,
          schedule: {
            at: date,
            allowWhileIdle: true,
          },
          extra: {
            type: "daily_quote",
            path: "/dashboard",
          },
        };
      }
    );

    await LocalNotifications.schedule({
      notifications,
    });
  } catch (error) {
    console.error(
      "Günlük söz bildirimleri planlanamadı:",
      error
    );
  }
}

export async function unsubscribeFromYksQuoteNotifications(
  _uid: string
): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    await cancelQuoteNotifications();
  } catch (error) {
    console.error(
      "Günlük söz bildirimleri kaldırılamadı:",
      error
    );
  }
}
