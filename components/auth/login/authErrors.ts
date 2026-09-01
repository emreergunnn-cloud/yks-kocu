import type { AuthMode } from "./types";

export function mapAuthError(message: string, mode: AuthMode): string {
  if (message.includes("email-already-in-use")) {
    return "Bu e-posta adresi zaten kullanımda.";
  }
  if (message.includes("wrong-password") || message.includes("invalid-credential")) {
    return "E-posta adresi veya şifre hatalı.";
  }
  if (message.includes("user-not-found")) {
    return mode === "forgot"
      ? "Bu e-posta adresiyle kayıtlı bir hesap bulunamadı."
      : "Kullanıcı bulunamadı.";
  }
  if (message.includes("weak-password")) {
    return "Şifre en az 6 karakter olmalıdır.";
  }
  if (message.includes("invalid-email")) {
    return "Geçersiz e-posta adresi.";
  }
  if (message.includes("too-many-requests")) {
    return "Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.";
  }
  if (message.includes("network-request-failed")) {
    return "Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.";
  }
  if (mode === "forgot") {
    return "Şifre sıfırlama e-postası gönderilemedi. Lütfen tekrar deneyin.";
  }
  return "Bir hata oluştu. Lütfen tekrar deneyin.";
}
