import type { Metadata } from "next";
import { StudyTimerPage } from "../../components/study/StudyTimerPage";
import { AppLayout } from "../../components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Çalışma Zamanlayıcı | YKS Koçu",
  description: "Pomodoro tekniğiyle odaklı çalışma seansları başlatın.",
};

export default function StudyRoute() {
  return (
    <AppLayout>
      <StudyTimerPage />
    </AppLayout>
  );
}
