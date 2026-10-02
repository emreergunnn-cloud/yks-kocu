"use client";

import { GoalDetailsFields } from "./goal-step/GoalDetailsFields";
import { ProgramField } from "./goal-step/ProgramField";
import { UniversityField } from "./goal-step/UniversityField";
import type { GoalStepProps } from "./goal-step/types";
import { mutedTextClass } from "./goal-step/utils";
import { useGoalStep } from "./goal-step/useGoalStep";

export default function GoalStep(props: GoalStepProps) {
  const state = useGoalStep(props);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Hedefini belirle</h2>
        <p className={`mt-2 text-sm ${mutedTextClass}`}>Hedef üniversiteni ve bölümünü seç. ÖSYM verisindeki başarı sıralaması otomatik olarak hedef sıralamana aktarılır.</p>
      </div>
      <div className="grid gap-5">
        <UniversityField value={state.universitySearch} loading={state.loading} selected={state.currentUniversity} results={state.filteredUniversities} onChange={state.changeUniversity} onSelect={state.selectUniversity} />
        <ProgramField universitySelected={Boolean(props.hedefUniversite)} value={state.programSearch} loading={state.loading} selected={state.selectedProgram} results={state.filteredPrograms} onChange={state.changeProgram} onSelect={state.selectProgram} />
        <GoalDetailsFields selectedProgram={state.selectedProgram} rank={props.hedefSiralama} setRank={props.setHedefSiralama} examYear={props.examYear} setExamYear={props.setExamYear} />
        {state.error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-400">{state.error}</div>}
      </div>
    </div>
  );
}
