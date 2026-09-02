import type { Metadata } from "next";
import { AppLayout } from "../../components/layout/AppLayout";
import { AccountPage } from "../../components/account/AccountPage";

export const metadata: Metadata = {
  title: "Hesap ve Güvenlik | YKS Koçu",
  description: "Giriş yöntemlerinizi ve hesap güvenliğinizi yönetin.",
};

export default function AccountRoute() {
  return (
    <AppLayout>
      <AccountPage />
    </AppLayout>
  );
}
