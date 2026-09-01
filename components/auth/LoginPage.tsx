"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { AuthHeader } from "./login/AuthHeader";
import { AuthModeSwitcher } from "./login/AuthModeSwitcher";
import { EmailAuthForm } from "./login/EmailAuthForm";
import { ForgotPasswordSuccess } from "./login/ForgotPasswordSuccess";
import { GoogleSignInSection } from "./login/GoogleSignInSection";
import { mapAuthError } from "./login/authErrors";
import type { AuthMode, LoginPageProps } from "./login/types";

export const LoginPage: React.FC<LoginPageProps> = ({
  initialMode = "login",
}) => {
  const router = useRouter();
  const {
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
    sendPasswordReset,
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError("");
    setResetSent(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
        await sendPasswordReset(email);
        setResetSent(true);
      }
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message ?? "";
      setError(mapAuthError(message, mode));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      const needsOnboarding = await signInWithGoogle();
      router.replace(needsOnboarding ? "/onboarding" : "/dashboard");
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message ?? "";
      const cancelled =
        message.includes("popup-closed-by-user") ||
        message.includes("cancelled-popup-request");

      if (!cancelled) {
        setError("Google ile giriş yapılamadı. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md space-y-6">
        <AuthHeader mode={mode} />

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          {mode === "forgot" && resetSent ? (
            <ForgotPasswordSuccess
              email={email}
              onBack={() => switchMode("login")}
            />
          ) : (
            <>
              <GoogleSignInSection
                mode={mode}
                loading={loading}
                onGoogleSignIn={handleGoogleSignIn}
              />
              <EmailAuthForm
                mode={mode}
                name={name}
                email={email}
                password={password}
                showPassword={showPassword}
                loading={loading}
                error={error}
                onNameChange={setName}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onTogglePassword={() => setShowPassword((value) => !value)}
                onForgotPassword={() => switchMode("forgot")}
                onSubmit={handleSubmit}
              />
              <AuthModeSwitcher mode={mode} onSwitch={switchMode} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
