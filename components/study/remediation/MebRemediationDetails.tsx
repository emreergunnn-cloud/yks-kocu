import {
  BookOpenCheck,
} from "lucide-react";

import {
  getMebResources,
} from "@/data/yks-resources/mebResources";

import type {
  StudyRemediation,
} from "@/types/remediation";

import {
  MebResourceButton,
} from "./MebResourceButton";

interface Props {
  subjectId: string;
  topicId: string;

  remediation:
    StudyRemediation;
}

export function MebRemediationDetails({
  subjectId,
  topicId,
  remediation,
}: Props) {
  const resources =
    getMebResources(
      subjectId,
      topicId
    );

  const percent =
    Math.round(
      remediation.accuracy *
        100
    );

  return (
    <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 dark:border-amber-900 dark:bg-amber-950/20">
      <div className="flex items-center gap-2">
        <BookOpenCheck className="h-4 w-4 text-amber-600" />

        <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
          Konuyu Pekiştir
        </p>
      </div>

      <p className="mt-2 text-[11px] text-slate-600 dark:text-slate-300">
        Son başarı:
        {" "}
        <strong>
          %{percent}
        </strong>

        {" · "}

        {remediation.wrongQuestions}
        {" yanlış"}
      </p>

      <p className="mt-2 text-[11px] text-slate-500">
        {remediation.message}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {resources.map(
          (resource) => (
            <MebResourceButton
              key={
                resource.kind
              }
              resource={
                resource
              }
            />
          )
        )}
      </div>
    </div>
  );
}