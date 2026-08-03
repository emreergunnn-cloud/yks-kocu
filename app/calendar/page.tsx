import type { Metadata } from "next";
import { AppLayout } from "../../components/layout/AppLayout";
import { CalendarPage } from "../../components/calendar/CalendarPage";

export const metadata: Metadata = {
  title: "Takvim | YKS Koçu",
  description: "Çalışma planı ve etkinlik takibi.",
};

export default function CalendarRoute() {
  return (
    <AppLayout>
      <CalendarPage />
    </AppLayout>
  );
}
