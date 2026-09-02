"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, KeyRound } from "lucide-react";
import type { User } from "firebase/auth";
import { sendPasswordReset } from "@/services/auth/emailService";
import {
  hasGoogleProvider,
  hasPasswordProvider,
  linkPasswordToUser,
} from "@/services/auth/passwordService";
import { PasswordInput } from "./PasswordInput";

interface Props {
  user: User;
}

function mapPasswordError(error: unknown): string {
  const message = (error as { message?: string })?.message ?? "";

  if (message.includes("weak-password")) return "Şifre en az 6 karakter olmalıdır.";
  if (message.includes("requires-recent-login")) {
    return "Güvenlik için Google ile tekrar giriş yapıp yeniden deneyin.";
  }
  if (message.includes("credential-already-in-use")) {
    return "Bu e-posta başka bir şifreli hesapta kullanılıyor.";
  }
  if (message.includes("provider-already-linked")) {
    return "Bu hesapta şifre ile giriş zaten aktif.";
  }
  return "İşlem tamamlanamadı. Lütfen tekrar deneyin.";
}

export function AccountSecurity({ user }: Props) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [linked, setLinked] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const isGoogleUser = hasGoogleProvider(user);
  const passwordEnabled = linked || hasPasswordProvider(user);

  async function handleCreatePassword(event: FormEvent) {
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
      await linkPasswordToUser(user, password);
      setLinked(true);
      setPassword("");
      setConfirm("");
    } catch (submitError) {
      setError(mapPasswordError(submitError));
    } finally {
      setSaving(false);
    }
  }

  async function handleResetPassword() {
    if (!user.email) return;
    setError("");
    setSaving(true);
    try {
      await sendPasswordReset(user.email);
      setResetSent(true);
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
          Şifre Güvenliği
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          E-posta ve şifre ile giriş seçeneğinizi yönetin.
        </p>
      </div>

      {passwordEnabled ? (
        <PasswordEnabled
          resetSent={resetSent}
          saving={saving}
          onReset={() => void handleResetPassword()}
        />
      ) : isGoogleUser ? (
        <form onSubmit={handleCreatePassword} className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Google hesabınıza bir şifre ekleyerek e-posta ve şifreyle de giriş yapabilirsiniz.
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
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Şifre oluşturuluyor..." : "Şifre Oluştur"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-slate-500">Bu hesap için şifre ile giriş yöntemi bulunamadı.</p>
      )}

      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </section>
  );
}

interface EnabledProps {
  resetSent: boolean;
  saving: boolean;
  onReset: () => void;
}

function PasswordEnabled({ resetSent, saving, onReset }: EnabledProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        E-posta ve şifre ile giriş aktif.
      </div>
      {resetSent ? (
        <p className="text-sm text-emerald-600">Şifre yenileme e-postası gönderildi.</p>
      ) : (
        <button
          type="button"
          disabled={saving}
          onClick={onReset}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Şifre Yenileme E-postası Gönder
        </button>
      )}
    </div>
  );
}
