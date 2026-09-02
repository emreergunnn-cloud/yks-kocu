export function mapResetPasswordError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? "";

  if (code.includes("expired-action-code")) {
    return "Bu şifre sıfırlama bağlantısının süresi dolmuş. Yeni bir bağlantı isteyin.";
  }

  if (code.includes("invalid-action-code")) {
    return "Bu şifre sıfırlama bağlantısı geçersiz veya daha önce kullanılmış.";
  }

  if (code.includes("user-disabled")) {
    return "Bu kullanıcı hesabı devre dışı bırakılmış.";
  }

  if (code.includes("user-not-found")) {
    return "Bu bağlantıya ait kullanıcı hesabı bulunamadı.";
  }

  if (code.includes("weak-password")) {
    return "Şifre en az 6 karakter olmalıdır.";
  }

  return "İşlem tamamlanamadı. Lütfen yeni bir şifre sıfırlama bağlantısı isteyin.";
}
