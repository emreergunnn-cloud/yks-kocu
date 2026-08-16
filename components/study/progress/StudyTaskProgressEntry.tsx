"use client";

import {
  useState,
} from "react";

import {
  ClipboardCheck,
} from "lucide-react";

import type {
  StudyTask,
} from "@/types/studyPlan";

import {
  StudyTaskProgressForm,
} from "./StudyTaskProgressForm";

interface Props {
  uid: string;
  task: StudyTask;
}

export function StudyTaskProgressEntry({
  uid,
  task,
}: Props) {
  const [
    open,
    setOpen,
  ] = useState(false);

  if (open) {
    return (
      <StudyTaskProgressForm
        uid={uid}
        task={task}
        onClose={() =>
          setOpen(false)
        }
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() =>
        setOpen(true)
      }
      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400"
    >
      <ClipboardCheck className="w-4 h-4" />
      Ödev Sonucunu Gir
    </button>
  );
}