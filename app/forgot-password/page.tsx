import type { Metadata } from "next";
import { LoginPage } from "../../components/auth/LoginPage";

export const metadata: Metadata = {
  title: "Şifremi Unuttum",
  description: "YKS Koçu şifrenizi sıfırlayın.",
};

export default function ForgotPasswordRoute() {
  return <LoginPage />;
}
