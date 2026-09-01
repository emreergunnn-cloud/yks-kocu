"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useOnboarding } from "../../hooks/useOnboarding";
import { completeOnboarding } from "../../services/onboardingService";
import { OnboardingNavigation } from "../../components/onboarding/page/OnboardingNavigation";
import { OnboardingProgress } from "../../components/onboarding/page/OnboardingProgress";
import { OnboardingStepContent } from "../../components/onboarding/page/OnboardingStepContent";

const TOTAL_STEPS = 7;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, refreshUserProfile } = useAuth();
  const onboarding = useOnboarding();
  const [saving, setSaving] = useState(false);

  const finishOnboarding = async () => {
    if (!user) { alert("Oturum bulunamadı. Lütfen tekrar giriş yapın."); return; }
    if (saving) return;
    setSaving(true);
    try {
      await completeOnboarding(user.uid, {
        ...onboarding.data,
        hedefSiralama: Number(onboarding.hedefSiralama), diplomaGrade: Number(onboarding.diplomaNotu), obp: onboarding.obp,
        currentTYT: Number(onboarding.currentTYT), currentAYT: Number(onboarding.currentAYT), studyDays: Number(onboarding.studyDays),
        studyHours: Number(onboarding.studyHours), targetTYT: onboarding.targetTYT, targetAYT: onboarding.targetAYT,
        recommendedStudyHours: onboarding.recommendedStudyHours, examYear: Number(onboarding.examYear),
      });
      await refreshUserProfile();
      router.replace("/dashboard");
    } catch (error) {
      console.error("Onboarding kayıt hatası:", error);
      alert("Bilgiler kaydedilemedi. Lütfen tekrar deneyin.");
    } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <OnboardingProgress step={onboarding.step} total={TOTAL_STEPS} />
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-900 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
          <OnboardingStepContent onboarding={onboarding} displayName={user?.displayName} />
          <OnboardingNavigation step={onboarding.step} total={TOTAL_STEPS} saving={saving} onBack={onboarding.prev} onNext={onboarding.next} onFinish={finishOnboarding} />
        </div>
      </div>
    </div>
  );
}
