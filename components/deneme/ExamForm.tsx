"use client";

import type { ExamResult } from "@/types/exam";
import { getAytSections, TYT_SECTIONS } from "./form/config";
import { includesAyt, includesTyt } from "./form/examFormUtils";
import { ExamMetaFields } from "./form/ExamMetaFields";
import { ExamNotesActions } from "./form/ExamNotesActions";
import { ExamScoreSection } from "./form/ExamScoreSection";
import { useExamForm } from "./form/useExamForm";
import { WeakTopicsModal } from "./form/WeakTopicsModal";

interface Props {
  initialData?: ExamResult;
  isEdit?: boolean;
}

export function ExamForm({ initialData, isEdit = false }: Props) {
  const form = useExamForm(initialData, isEdit);
  const aytSections = getAytSections(form.meta.alan);

  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      {form.error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-400">
          {form.error}
        </div>
      )}

      <ExamMetaFields meta={form.meta} onChange={form.updateMeta} />

      {includesTyt(form.meta.denemeTipi) && (
        <ExamScoreSection
          title="TYT Bölüm Netleri"
          total={form.totals.tytToplamNet}
          maxTotal={120}
          sections={TYT_SECTIONS}
          scores={form.scores}
          onChange={form.updateScore}
        />
      )}

      {includesAyt(form.meta.denemeTipi) && (
        <ExamScoreSection
          title={`AYT Bölüm Netleri (${form.meta.alan})`}
          total={form.totals.aytToplamNet}
          maxTotal={80}
          sections={aytSections}
          scores={form.scores}
          onChange={form.updateScore}
        />
      )}

      <ExamNotesActions
        notes={form.meta.notlar}
        saving={form.saving}
        isEdit={isEdit}
        onNotesChange={(notlar) => form.updateMeta({ notlar })}
        onCancel={form.cancel}
      />

      <WeakTopicsModal
        open={form.showAnalysis}
        subjectIds={form.weakSubjectIds}
        selectedTopics={form.weakTopics}
        saving={form.saving}
        onToggle={form.toggleWeakTopic}
        onClose={() => form.setShowAnalysis(false)}
        onSkip={() => void form.saveAnalysis(false)}
        onSave={() => void form.saveAnalysis(true)}
      />
    </form>
  );
}
