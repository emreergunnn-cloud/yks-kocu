"use client";

import { useState } from "react";
import type { OnboardingData } from "./types";

export function useOnboardingNavigation(data: OnboardingData) {
  const [step, setStep] = useState(1);
  const next = () => {
    if (step === 2 && (!data.sinif || !data.alan)) { alert("Sınıf ve alan seçiniz."); return false; }
    if (step === 3 && (!data.hedefUniversite || !data.hedefBolum || !data.hedefSiralama)) { alert("Hedef bilgilerini doldurun."); return false; }
    if (step === 4 && !data.diplomaNotu) { alert("Diploma notunu gir."); return false; }
    if (step === 5 && (!data.currentTYT || !data.currentAYT)) { alert("Netlerini gir."); return false; }
    if (step === 6 && (!data.studyDays || !data.studyHours)) { alert("Çalışma planını gir."); return false; }
    setStep((current) => Math.min(7, current + 1));
    return true;
  };
  const prev = () => setStep((current) => Math.max(1, current - 1));
  return { step, setStep, next, prev };
}
