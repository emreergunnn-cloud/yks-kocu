import type { Metadata } from "next";
import { SettingsPage } from "../../components/settings/SettingsPage";
import { AppLayout } from "../../components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Ayarlar | YKS Koçu",
  description: "Uygulama tercihlerinizi yönetin.",
};

export default function SettingsRoute() {
  return (
    <AppLayout>
      <SettingsPage />
    </AppLayout>
  );
}
