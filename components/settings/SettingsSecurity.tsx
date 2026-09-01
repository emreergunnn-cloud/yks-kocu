"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, Eye, EyeOff, KeyRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  hasGoogleProvider,
  hasPasswordProvider,
  linkPasswordToUser,
} from "@/services/auth/passwordService";

function mapPasswordError(error: unknown): string {
  const message = (error as { message?: string })?.message ?? "";

  if (message.includes("weak-password")) {
    return "Şifre en az 6 karakter olmalıdır.";
  }

  if (message.includes("requires-recent-login")) {
    return "Güvenlik için Google ile tekrar giriş yapıp yeniden deneyin.";
  }

  if (message.includes("credential-already-in-use")) {
    return "Bu e-posta başka bir şifreli hesapta kullanılıyor.";
  }

  if (message.includes("provider-already-linked")) {
    return "Bu hesapta şifre ile giriş zaten aktif.";
  }

  return "Şifre oluşturulamadı. Lütfen tekrar deneyin.";
}

export function SettingsSecurity() {
  const { user } = useAuth();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [linked, setLinked] = useState(false);

  const isGoogleUser = useMemo(
    () => Boolean(user && hasGoogleProvider(user)),
    [user]
  );

  const passwordEnabled = Boolean(
    linked || (user && hasPasswordProvider(user))
  );

  if (!user || !isGoogleUser) {
    return null;
  }

  const currentUser = user;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    if (password !== confirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setSaving(true);

    try {
      await linkPasswordToUser(currentUser, password);

      setLinked(true);
      setPassword("");
      setConfirm("");
    } catch (submitError) {
      setError(mapPasswordError(submitError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
          <KeyRound className="h-4 w-4" />
          Hesap ve Güvenlik
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Google hesabınızın e-postası: {currentUser.email}
        </p>
      </div>

      {passwordEnabled ? (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

          <span>
            Artık Google dışında e-posta ve şifrenizle de giriş
            yapabilirsiniz.
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            İsterseniz bu hesaba bir şifre ekleyerek e-posta ve şifre ile
            de giriş yapabilirsiniz.
          </p>

          <PasswordInput
            value={password}
            placeholder="Yeni şifre"
            show={show}
            onChange={setPassword}
            onToggle={() => setShow((value) => !value)}
          />

          <PasswordInput
            value={confirm}
            placeholder="Yeni şifre tekrar"
            show={show}
            onChange={setConfirm}
          />

          {error && (
            <p className="text-xs font-medium text-rose-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Şifre oluşturuluyor..." : "Şifre Oluştur"}
          </button>
        </form>
      )}
    </section>
  );
}

interface PasswordInputProps {
  value: string;
  placeholder: string;
  show: boolean;
  onChange: (value: string) => void;
  onToggle?: () => void;
}

function PasswordInput({
  value,
  placeholder,
  show,
  onChange,
  onToggle,
}: PasswordInputProps) {
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        minLength={6}
        required
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="new-password"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-slate-950"
      />

      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          aria-label={show ? "Şifreyi gizle" : "Şifreyi göster"}
        >
          {show ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
}