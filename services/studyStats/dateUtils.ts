function startAtMidnight(date: Date) {
  date.setHours(0, 0, 0, 0);
  return date;
}

export function startOfDay() {
  return startAtMidnight(new Date());
}

export function startOfWeek() {
  const date = new Date();
  const day = date.getDay();
  date.setDate(date.getDate() - ((day + 6) % 7));
  return startAtMidnight(date);
}

export function startOfMonth() {
  const date = new Date();
  date.setDate(1);
  return startAtMidnight(date);
}

export function toDate(value: unknown): Date {
  if (value && typeof value === "object") {
    const timestamp = value as { toDate?: () => Date; seconds?: number };
    if (timestamp.toDate) return timestamp.toDate();
    if (typeof timestamp.seconds === "number") return new Date(timestamp.seconds * 1000);
  }
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") return new Date(value);
  return new Date(0);
}
