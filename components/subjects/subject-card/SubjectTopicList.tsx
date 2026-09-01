import { CheckCircle2, Circle, RotateCcw } from "lucide-react";
import type { SubjectProgressMap } from "@/services/topicService";
import type { SubjectWithTopics } from "@/lib/constants/subjects";
import type { TopicStatus } from "@/types/topic";
import { STATUS_CONFIG } from "../constants";

interface Props {
  subject: SubjectWithTopics;
  topics: SubjectWithTopics["topics"];
  progressMap: SubjectProgressMap;
  saving: Set<string>;
  onTopicClick: (subjectId: string, topicId: string) => void;
}

function StatusIcon({ status }: { status: TopicStatus }) {
  if (status === "Tamamlandı") return <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />;
  if (status === "Tekrar Edilecek") return <RotateCcw className="h-4 w-4 shrink-0 text-violet-500" />;
  return <Circle className={`h-4 w-4 shrink-0 ${status === "Çalışılıyor" ? "text-amber-500" : "text-slate-300"}`} />;
}

export function SubjectTopicList({ subject, topics, progressMap, saving, onTopicClick }: Props) {
  return (
    <div className="divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-800 dark:border-slate-800">
      {topics.map((topic) => {
        const status: TopicStatus = progressMap[subject.id]?.[topic.id] ?? "Başlanmadı";
        const config = STATUS_CONFIG[status];
        const isSaving = saving.has(`${subject.id}:${topic.id}`);
        return (
          <button key={topic.id} type="button" disabled={isSaving} onClick={() => onTopicClick(subject.id, topic.id)} className="group flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40">
            <StatusIcon status={status} />
            <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">{topic.name}</span>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${config.bg} ${config.color} ${config.border}`}>{config.label}</span>
            {isSaving && <div className="h-3 w-3 animate-spin rounded-full border border-slate-400 border-t-transparent" />}
          </button>
        );
      })}
    </div>
  );
}
