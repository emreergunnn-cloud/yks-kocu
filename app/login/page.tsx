import type { Metadata } from "next";
import { LoginPage } from "../../components/auth/LoginPage";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description: "YKS Koçu hesabınıza giriş yapın.",
};

export default function LoginRoute() {
  return <LoginPage />;
}
