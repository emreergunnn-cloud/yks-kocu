"use client";

import { useMemo } from "react";
import { calculateObp, calculateStudyHours, calculateTargetAYT, calculateTargetTYT } from "./onboarding/calculations";
import { useOnboardingFormState } from "./onboarding/useOnboardingFormState";
import { useOnboardingNavigation } from "./onboarding/useOnboardingNavigation";

export type { OnboardingData } from "./onboarding/types";

export function useOnboarding() {
  const form = useOnboardingFormState();
  const navigation = useOnboardingNavigation(form.data);
  const totalCurrentNet = useMemo(() => (Number(form.currentTYT) || 0) + (Number(form.currentAYT) || 0), [form.currentTYT, form.currentAYT]);
  const obp = useMemo(() => calculateObp(form.diplomaNotu), [form.diplomaNotu]);
  const recommendedStudyHours = useMemo(() => calculateStudyHours(form.hedefSiralama, form.studyHours), [form.hedefSiralama, form.studyHours]);
  const targetTYT = useMemo(() => calculateTargetTYT(form.alan, form.hedefSiralama), [form.alan, form.hedefSiralama]);
  const targetAYT = useMemo(() => calculateTargetAYT(form.alan, form.hedefSiralama), [form.alan, form.hedefSiralama]);
  return { ...navigation, ...form, obp, totalCurrentNet, recommendedStudyHours, targetTYT, targetAYT };
}
