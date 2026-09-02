"use client";

import { useEffect, useState } from "react";
import { applyNewPassword, verifyResetCode } from "@/services/auth/passwordResetActionService";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { ResetPasswordHeader } from "./ResetPasswordHeader";
import {
  ResetPasswordInvalid,
  ResetPasswordLoading,
  ResetPasswordSuccess,
} from "./ResetPasswordState";
import { mapResetPasswordError } from "./resetPasswordErrors";

type Status = "loading" | "ready" | "invalid" | "success";

export function ResetPasswordPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const actionCode = params.get("oobCode") ?? "";
    const mode = params.get("mode");

    if (!actionCode || (mode && mode !== "resetPassword")) {
      setError("Şifre sıfırlama bağlantısı eksik veya geçersiz.");
      setStatus("invalid");
      return;
    }

    setCode(actionCode);
    verifyResetCode(actionCode)
      .then((verifiedEmail) => {
        setEmail(verifiedEmail);
        setStatus("ready");
      })
      .catch((verifyError) => {
        setError(mapResetPasswordError(verifyError));
        setStatus("invalid");
      });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      await applyNewPassword(code, password);
      setStatus("success");
    } catch (submitError) {
      setError(mapResetPasswordError(submitError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md space-y-6">
        <ResetPasswordHeader />
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          {status === "loading" && <ResetPasswordLoading />}
          {status === "invalid" && <ResetPasswordInvalid message={error} />}
          {status === "success" && <ResetPasswordSuccess />}
          {status === "ready" && (
            <ResetPasswordForm
              email={email}
              password={password}
              confirm={confirm}
              showPassword={showPassword}
              saving={saving}
              error={error}
              onPasswordChange={setPassword}
              onConfirmChange={setConfirm}
              onTogglePassword={() => setShowPassword((value) => !value)}
              onSubmit={handleSubmit}
            />
          )}
        </section>
      </div>
    </main>
  );
}
