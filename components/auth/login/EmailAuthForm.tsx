import type { FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import type { AuthMode } from "./types";

interface Props {
  mode: AuthMode;
  name: string;
  email: string;
  password: string;
  showPassword: boolean;
  loading: boolean;
  error: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (event: FormEvent) => void;
}

export function EmailAuthForm(props: Props) {
  const {
    mode,
    name,
    email,
    password,
    showPassword,
    loading,
    error,
    onNameChange,
    onEmailChange,
    onPasswordChange,
    onTogglePassword,
    onSubmit,
  } = props;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === "register" && (
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            required
            placeholder="Ad Soyad"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
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
          onChange={(e) => onEmailChange(e.target.value)}
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
            onChange={(e) => onPasswordChange(e.target.value)}
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
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
  );
}
