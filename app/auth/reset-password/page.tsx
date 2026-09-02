import type { Metadata } from "next";
import { ResetPasswordPage } from "@/components/auth/reset-password/ResetPasswordPage";

export const metadata: Metadata = {
  title: "Yeni Şifre Belirle",
  description: "YKS Koçu hesabınız için yeni şifre belirleyin.",
};

export default function ResetPasswordRoute() {
  return <ResetPasswordPage />;
}
