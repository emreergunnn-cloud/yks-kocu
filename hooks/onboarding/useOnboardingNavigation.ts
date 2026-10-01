"use client";

import { useState } from "react";
import { gradeRequiresAlan, isSchoolGrade } from "@/lib/constants/curriculum/config";
import type { OnboardingData } from "./types";

export function useOnboardingNavigation(data: OnboardingData) {
  const [step, setStep] = useState(1);

  const next = () => {
    if (step === 2 && !data.sinif) {
      alert("Sınıf seçiniz.");
      return false;
    }
    if (step === 2 && gradeRequiresAlan(data.sinif) && !data.alan) {
      alert(data.sinif === "11" ? "11. sınıf için Sayısal veya Eşit Ağırlık seçiniz." : "Alan seçiniz.");
      return false;
    }
    if (step === 3) {
      const hasAnyGoal = Boolean(data.hedefUniversite || data.hedefBolum || data.hedefSiralama);
      const hasCompleteGoal = Boolean(data.hedefUniversite && data.hedefBolum && data.hedefSiralama);
      if (!isSchoolGrade(data.sinif) && !hasCompleteGoal) {
        alert("Hedef bilgilerini doldurun.");
        return false;
      }
      if (isSchoolGrade(data.sinif) && hasAnyGoal && !hasCompleteGoal) {
        alert("Hedef bilgilerini tamamlayın veya bu adımı atlayın.");
        return false;
      }
    }
    if (step === 4 && !data.diplomaNotu) { alert("Diploma notunu gir."); return false; }
    if (step === 5 && (!data.currentTYT || !data.currentAYT)) { alert("Netlerini gir."); return false; }
    if (step === 6 && (!data.studyDays || !data.studyHours)) { alert("Çalışma planını gir."); return false; }
    setStep((current) => Math.min(7, current + 1));
    return true;
  };

  const prev = () => setStep((current) => Math.max(1, current - 1));
  return { step, setStep, next, prev };
}
