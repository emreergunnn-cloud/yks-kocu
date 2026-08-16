"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  submitStudyTaskResult,
} from "@/services/studyTaskProgressService";

import type {
  StudyTask,
} from "@/types/studyPlan";

import {
  validateStudyTaskResult,
} from "./validateStudyTaskResult";

interface Options {
  uid: string;
  task: StudyTask;
}

export function useStudyTaskProgressForm({
  uid,
  task,
}: Options) {
  const [solved, setSolved] =
    useState("");

  const [correct, setCorrect] =
    useState("");

  const [wrong, setWrong] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const values =
    useMemo(() => {
      const solvedCount =
        Number(solved) || 0;

      const correctCount =
        Number(correct) || 0;

      const wrongCount =
        Number(wrong) || 0;

      return {
        solvedCount,
        correctCount,
        wrongCount,

        blank:
          solvedCount -
          correctCount -
          wrongCount,

        remaining:
          Math.max(
            0,
            task.questionCount -
              solvedCount
          ),
      };
    }, [
      solved,
      correct,
      wrong,
      task.questionCount,
    ]);

  async function submit():
    Promise<boolean> {
    const validationError =
      validateStudyTaskResult(
        task.questionCount,
        {
          solved:
            values.solvedCount,

          correct:
            values.correctCount,

          wrong:
            values.wrongCount,
        }
      );

    if (validationError) {
      setError(
        validationError
      );

      return false;
    }

    try {
      setSaving(true);
      setError("");

      await submitStudyTaskResult({
        uid,

        taskId:
          task.id,

        subjectId:
          task.subjectId,

        topicId:
          task.topicId,

        assignedQuestions:
          task.questionCount,

        solvedQuestions:
          values.solvedCount,

        correct:
          values.correctCount,

        wrong:
          values.wrongCount,

        expectedPreviousAttempts:
          task.previousAssignments ??
          0,
      });

      window.dispatchEvent(
        new Event(
          "study-progress-updated"
        )
      );

      return true;
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Sonuç kaydedilemedi."
      );

      return false;
    } finally {
      setSaving(false);
    }
  }

  return {
    solved,
    setSolved,

    correct,
    setCorrect,

    wrong,
    setWrong,

    saving,
    error,

    ...values,

    submit,
  };
}