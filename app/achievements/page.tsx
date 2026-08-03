import type { Metadata } from "next";
import { AchievementsPage } from "../../components/achievements/AchievementsPage";
import { AppLayout } from "../../components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Başarılar | YKS Koçu",
  description: "Rozetlerinizi, XP puanınızı ve koç önerilerinizi görün.",
};

export default function AchievementsRoute() {
  return (
    <AppLayout>
      <AchievementsPage />
    </AppLayout>
  );
}
