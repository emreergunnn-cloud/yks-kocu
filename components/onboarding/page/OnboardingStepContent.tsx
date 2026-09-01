import WelcomeStep from "../WelcomeStep";
import EducationStep from "../EducationStep";
import GoalStep from "../GoalStep";
import DiplomaStep from "../DiplomaStep";
import CurrentLevelStep from "../CurrentLevelStep";
import StudyPlanStep from "../StudyPlanStep";
import FinishStep from "../FinishStep";
import type { ReturnTypeOfUseOnboarding } from "./types";

export function OnboardingStepContent({ onboarding, displayName }: { onboarding: ReturnTypeOfUseOnboarding; displayName?: string | null }) {
  const o = onboarding;
  if (o.step === 1) return <WelcomeStep name={displayName} />;
  if (o.step === 2) return <EducationStep sinif={o.sinif} setSinif={o.setSinif} alan={o.alan} setAlan={o.setAlan} />;
  if (o.step === 3) return <GoalStep hedefUniversite={o.hedefUniversite} setHedefUniversite={o.setHedefUniversite} hedefBolum={o.hedefBolum} setHedefBolum={o.setHedefBolum} hedefSiralama={o.hedefSiralama} setHedefSiralama={o.setHedefSiralama} examYear={o.examYear} setExamYear={o.setExamYear} />;
  if (o.step === 4) return <DiplomaStep diplomaNotu={o.diplomaNotu} setDiplomaNotu={o.setDiplomaNotu} obp={o.obp} />;
  if (o.step === 5) return <CurrentLevelStep currentTYT={o.currentTYT} setCurrentTYT={o.setCurrentTYT} currentAYT={o.currentAYT} setCurrentAYT={o.setCurrentAYT} />;
  if (o.step === 6) return <StudyPlanStep studyDays={o.studyDays} setStudyDays={o.setStudyDays} studyHours={o.studyHours} setStudyHours={o.setStudyHours} />;
  return <FinishStep alan={o.alan} sinif={o.sinif} currentTYT={o.currentTYT} currentAYT={o.currentAYT} obp={o.obp} hedefUniversite={o.hedefUniversite} hedefBolum={o.hedefBolum} hedefSiralama={o.hedefSiralama} recommendedStudyHours={o.recommendedStudyHours} targetTYT={o.targetTYT} targetAYT={o.targetAYT} totalCurrentNet={o.totalCurrentNet} />;
}
