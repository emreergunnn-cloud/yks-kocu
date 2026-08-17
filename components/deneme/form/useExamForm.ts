"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createExamResult, updateExamResult } from "@/services/examService";
import type { ExamResult } from "@/types/exam";
import type { ExamMetaForm, ScoreFieldKey, ScoreInput, ExamData } from "./types";
import {
  buildExamData,
  calculateExamTotals,
  createInitialScores,
  getScoreValidationError,
  getWeakSubjectIds,
} from "./examFormUtils";

export function useExamForm(initialData?: ExamResult, isEdit = false) {
  const router = useRouter();
  const { user, userProfile } = useAuth();

  const [meta, setMeta] = useState<ExamMetaForm>({
    yayinAdi: initialData?.yayinAdi ?? "",
    sinavAdi: initialData?.sinavAdi ?? "",
    denemeTipi: initialData?.denemeTipi ?? "TYT+AYT",
    alan: initialData?.alan || userProfile?.alan || "Sayısal",
    sinavTarihi:
      initialData?.sinavTarihi ?? new Date().toISOString().split("T")[0],
    notlar: initialData?.notlar ?? "",
  });

  const [scores, setScores] = useState(() => createInitialScores(initialData));
  const [weakTopics, setWeakTopics] = useState(initialData?.weakTopics ?? []);
  const [weakSubjectIds, setWeakSubjectIds] = useState<string[]>([]);
  const [pendingData, setPendingData] = useState<ExamData | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const profileAlan = userProfile?.alan;

    if (!initialData && profileAlan) {
      setMeta((prev) => ({
        ...prev,
        alan: profileAlan,
      }));
    }
  }, [initialData, userProfile?.alan]);

  const totals = useMemo(
    () => calculateExamTotals(scores, meta.denemeTipi, meta.alan),
    [scores, meta.denemeTipi, meta.alan]
  );

  function updateMeta(values: Partial<ExamMetaForm>) {
    setMeta((prev) => ({ ...prev, ...values }));
  }

  function updateScore(
    key: ScoreFieldKey,
    field: keyof ScoreInput,
    value: string
  ) {
    setScores((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  }

  function toggleWeakTopic(topicId: string, checked: boolean) {
    setWeakTopics((prev) =>
      checked
        ? Array.from(new Set([...prev, topicId]))
        : prev.filter((id) => id !== topicId)
    );
  }

  async function save(data: ExamData) {
    if (!user) return;

    setSaving(true);
    setError("");

    try {
      if (isEdit && initialData?.id) {
        await updateExamResult(initialData.id, user.uid, data);
      } else {
        await createExamResult(data);
      }

      setShowAnalysis(false);
      router.push("/deneme");
      router.refresh();
    } catch (saveError) {
      console.error("Exam submit error:", saveError);
      setError("Sınav kaydedilirken bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    const validationError = getScoreValidationError(
      scores,
      meta.denemeTipi,
      meta.alan
    );

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    const data = buildExamData(user.uid, meta, scores, initialData);
    const weakIds = getWeakSubjectIds(data, meta.denemeTipi, meta.alan);

    if (weakIds.length) {
      setPendingData(data);
      setWeakSubjectIds(weakIds);
      setShowAnalysis(true);
      return;
    }

    await save(data);
  }

  async function saveAnalysis(useTopics: boolean) {
    if (!pendingData) return;
    await save({
      ...pendingData,
      weakTopics: useTopics ? weakTopics : [],
    });
  }

  return {
    meta,
    scores,
    totals,
    weakTopics,
    weakSubjectIds,
    showAnalysis,
    saving,
    error,
    updateMeta,
    updateScore,
    toggleWeakTopic,
    setShowAnalysis,
    handleSubmit,
    saveAnalysis,
    cancel: () => router.back(),
  };
}

