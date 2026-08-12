"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "../../context/AuthContext";
import { useOnboarding } from "../../hooks/useOnboarding";
import { completeOnboarding } from "../../services/onboardingService";

import WelcomeStep from "../../components/onboarding/WelcomeStep";
import EducationStep from "../../components/onboarding/EducationStep";
import GoalStep from "../../components/onboarding/GoalStep";
import DiplomaStep from "../../components/onboarding/DiplomaStep";
import CurrentLevelStep from "../../components/onboarding/CurrentLevelStep";
import StudyPlanStep from "../../components/onboarding/StudyPlanStep";
import FinishStep from "../../components/onboarding/FinishStep";

const TOTAL_STEPS = 7;

export default function OnboardingPage() {
  const router = useRouter();

  const {
    user,
    refreshUserProfile,
  } = useAuth();

  const onboarding = useOnboarding();

  const {
    step,
    data,

    sinif,
    setSinif,

    alan,
    setAlan,

    hedefUniversite,
    setHedefUniversite,

    hedefBolum,
    setHedefBolum,

    hedefSiralama,
    setHedefSiralama,

    examYear,
    setExamYear,

    diplomaNotu,
    setDiplomaNotu,

    currentTYT,
    setCurrentTYT,

    currentAYT,
    setCurrentAYT,

    studyDays,
    setStudyDays,

    studyHours,
    setStudyHours,

    obp,
    totalCurrentNet,
    recommendedStudyHours,
    targetTYT,
    targetAYT,

    next,
    prev,
  } = onboarding;

  const [saving, setSaving] = React.useState(false);

  const finishOnboarding = async () => {
    if (!user) {
      alert("Oturum bulunamadı. Lütfen tekrar giriş yapın.");
      return;
    }

    if (saving) return;

    setSaving(true);

    try {
      await completeOnboarding(user.uid, {
        ...data,

        hedefSiralama: Number(hedefSiralama),

        diplomaGrade: Number(diplomaNotu),
        obp,

        currentTYT: Number(currentTYT),
        currentAYT: Number(currentAYT),

        studyDays: Number(studyDays),
        studyHours: Number(studyHours),

        targetTYT,
        targetAYT,

        recommendedStudyHours,

        examYear: Number(examYear),
      });

      // Firebase'deki güncel profili AuthContext'e çek.
      await refreshUserProfile();

      // Profil güncellendikten sonra dashboard'a git.
      router.replace("/dashboard");
    } catch (error) {
      console.error("Onboarding kayıt hatası:", error);

      alert(
        "Bilgiler kaydedilemedi. Lütfen tekrar deneyin."
      );
    } finally {
      setSaving(false);
    }
  };

  const progress = Math.round(
    (step / TOTAL_STEPS) * 100
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto py-10 px-5">

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2 text-slate-600 dark:text-slate-400">
            <span>
              Adım {step} / {TOTAL_STEPS}
            </span>

            <span>
              %{progress}
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-8">

          {step === 1 && (
            <WelcomeStep
              name={user?.displayName}
            />
          )}

          {step === 2 && (
            <EducationStep
              sinif={sinif}
              setSinif={setSinif}
              alan={alan}
              setAlan={setAlan}
            />
          )}

          {step === 3 && (
            <GoalStep
              hedefUniversite={hedefUniversite}
              setHedefUniversite={setHedefUniversite}
              hedefBolum={hedefBolum}
              setHedefBolum={setHedefBolum}
              hedefSiralama={hedefSiralama}
              setHedefSiralama={setHedefSiralama}
              examYear={examYear}
              setExamYear={setExamYear}
            />
          )}

          {step === 4 && (
            <DiplomaStep
              diplomaNotu={diplomaNotu}
              setDiplomaNotu={setDiplomaNotu}
              obp={obp}
            />
          )}

          {step === 5 && (
            <CurrentLevelStep
              currentTYT={currentTYT}
              setCurrentTYT={setCurrentTYT}
              currentAYT={currentAYT}
              setCurrentAYT={setCurrentAYT}
            />
          )}

          {step === 6 && (
            <StudyPlanStep
              studyDays={studyDays}
              setStudyDays={setStudyDays}
              studyHours={studyHours}
              setStudyHours={setStudyHours}
            />
          )}

          {step === 7 && (
            <FinishStep
              alan={alan}
              sinif={sinif}
              currentTYT={currentTYT}
              currentAYT={currentAYT}
              obp={obp}
              hedefUniversite={hedefUniversite}
              hedefBolum={hedefBolum}
              hedefSiralama={hedefSiralama}
              recommendedStudyHours={recommendedStudyHours}
              targetTYT={targetTYT}
              targetAYT={targetAYT}
              totalCurrentNet={totalCurrentNet}
            />
          )}

          {/* Navigation */}
          <div className="mt-10 flex justify-between">

            <button
              type="button"
              onClick={prev}
              disabled={step === 1 || saving}
              className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40"
            >
              Geri
            </button>

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={next}
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Devam Et →
              </button>
            ) : (
              <button
                type="button"
                onClick={finishOnboarding}
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {saving
                  ? "Kaydediliyor..."
                  : "Başla 🚀"}
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}