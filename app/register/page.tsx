import type { Metadata } from "next";
import { LoginPage } from "../../components/auth/LoginPage";

export const metadata: Metadata = {
  title: "Kayıt Ol",
  description: "YKS Koçu hesabı oluşturun.",
};

export default function RegisterRoute() {
  return <LoginPage initialMode="register" />;
}
