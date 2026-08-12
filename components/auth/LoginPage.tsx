"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
  BookOpen,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

type AuthMode = "login" | "register" | "forgot";

interface LoginPageProps {
  /** Set the initial form mode. Defaults to "login". */
  initialMode?: AuthMode;
}

/** Map Firebase Auth error codes to Turkish user-facing messages */
function mapAuthError(message: string, mode: AuthMode): string {
  if (message.includes("email-already-in-use"))
    return "Bu e-posta adresi zaten kullanımda.";
  if (message.includes("wrong-password") || message.includes("invalid-credential"))
    return "E-posta adresi veya şifre hatalı.";
  if (message.includes("user-not-found")) {
    if (mode === "forgot") return "Bu e-posta adresiyle kayıtlı bir hesap bulunamadı.";
    return "Kullanıcı bulunamadı.";
  }
  if (message.includes("weak-password")) return "Şifre en az 6 karakter olmalıdır.";
  if (message.includes("invalid-email")) return "Geçersiz e-posta adresi.";
  if (message.includes("too-many-requests"))
    return "Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.";
  if (message.includes("network-request-failed"))
    return "Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.";
  if (mode === "forgot") return "Şifre sıfırlama e-postası gönderilemedi. Lütfen tekrar deneyin.";
  return "Bir hata oluştu. Lütfen tekrar deneyin.";
}

export const LoginPage: React.FC<LoginPageProps> = ({ initialMode = "login" }) => {
  const router = useRouter();
  const { user, signInWithGoogle, signInWithEmail, registerWithEmail, sendPasswordReset } =
    useAuth();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResetSent(false);

    if (mode === "register" && !name.trim()) {
      setError("Ad Soyad zorunludur.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
router.replace("/dashboard");
      } else if (mode === "register") {
        await registerWithEmail(name, email, password);
router.replace("/onboarding");
      } else {
        // Forgot password — sendPasswordResetEmail throws on unknown emails
        await sendPasswordReset(email);
        setResetSent(true);
      }
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "";
      setError(mapAuthError(msg, mode));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError("");
    setResetSent(false);
  };

  const handleGoogleSignIn = async () => {
  setError("");
  setLoading(true);

  try {
    const needsOnboarding =
      await signInWithGoogle();

    if (needsOnboarding) {
      router.replace("/onboarding");
    } else {
      router.replace("/dashboard");
    }
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "";
      if (msg.includes("popup-closed-by-user") || msg.includes("cancelled-popup-request")) {
        // User closed the popup — not an error worth showing
      } else {
        setError("Google ile giriş yapılamadı. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-blue-500/30">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">YKS Koçu</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {mode === "login" && "Hesabınıza giriş yapın"}
              {mode === "register" && "Yeni hesap oluşturun"}
              {mode === "forgot" && "Şifrenizi sıfırlayın"}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">

          {/* ── Forgot-password success screen ── */}
          {mode === "forgot" && resetSent ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">E-posta gönderildi</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  <strong>{email}</strong> adresine şifre sıfırlama bağlantısı gönderildi. Gelen
                  kutunuzu ve spam klasörünüzü kontrol edin.
                </p>
              </div>
              <button
                onClick={() => { setResetSent(false); switchMode("login"); }}
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Giriş sayfasına dön
              </button>
            </div>
          ) : (
            <>
              {/* Google Sign-In */}
              {mode !== "forgot" && (
                <>
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium py-2.5 px-4 rounded-xl transition-all text-sm disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                    </svg>
                    Google ile {mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                    <span className="text-xs text-slate-400">veya</span>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                  </div>
                </>
              )}

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Ad Soyad"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="E-posta adresi"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete={mode === "register" ? "email" : "username"}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                {mode !== "forgot" && (
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Şifre"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={mode === "register" ? "new-password" : "current-password"}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                )}

                {error && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-3 rounded-xl">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/20 transition-all text-sm disabled:opacity-50"
                >
                  {loading
                    ? "İşleniyor…"
                    : mode === "login"
                    ? "Giriş Yap"
                    : mode === "register"
                    ? "Hesap Oluştur"
                    : "Şifre Sıfırlama E-postası Gönder"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              {/* Mode switcher links */}
              <div className="space-y-2 text-center text-xs">
                {mode === "login" && (
                  <>
                    <button
                      onClick={() => switchMode("forgot")}
                      className="text-blue-600 dark:text-blue-400 hover:underline block w-full"
                    >
                      Şifremi Unuttum
                    </button>
                    <p className="text-slate-500">
                      Hesabın yok mu?{" "}
                      <button
                        onClick={() => switchMode("register")}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        Kayıt Ol
                      </button>
                    </p>
                  </>
                )}
                {mode === "register" && (
                  <p className="text-slate-500">
                    Zaten hesabın var mı?{" "}
                    <button
                      onClick={() => switchMode("login")}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      Giriş Yap
                    </button>
                  </p>
                )}
                {mode === "forgot" && (
                  <button
                    onClick={() => switchMode("login")}
                    className="flex items-center justify-center gap-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 w-full"
                  >
                    <RotateCcw className="w-3 h-3" /> Giriş sayfasına dön
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
