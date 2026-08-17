import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  RotateCcw,
} from "lucide-react";

import type {
  SubjectWithTopics,
} from "@/lib/constants/subjects";

import {
  computeSubjectStats,
  type SubjectProgressMap,
} from "@/services/topicService";

import type {
  TopicStatus,
} from "@/types/topic";

import {
  STATUS_CONFIG,
  type StatusFilter,
} from "./constants";

interface Props {
  subject:
    SubjectWithTopics;

  progressMap:
    SubjectProgressMap;

  statusFilter:
    StatusFilter;

  open: boolean;

  saving:
    Set<string>;

  onToggle: () => void;

  onTopicClick:
    (
      subjectId:
        string,
      topicId:
        string
    ) => void;
}

export function SubjectCard({
  subject,
  progressMap,
  statusFilter,
  open,
  saving,
  onToggle,
  onTopicClick,
}: Props) {
  const stats =
    computeSubjectStats(
      subject.id,
      subject.topics.map(
        (topic) =>
          topic.id
      ),
      progressMap
    );

  const topics =
    statusFilter ===
    "all"
      ? subject.topics
      : subject.topics.filter(
          (topic) =>
            (
              progressMap[
                subject.id
              ]?.[
                topic.id
              ] ??
              "Başlanmadı"
            ) ===
            statusFilter
        );

  if (!topics.length) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
      >
        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${
            subject.category ===
            "TYT"
              ? "bg-blue-500"
              : "bg-purple-500"
          }`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              {subject.name}
            </span>

            <span className="text-[10px] font-bold text-slate-400">
              {subject.category}
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{
                  width:
                    `${stats.progressPct}%`,
                }}
              />
            </div>

            <span className="text-[11px] text-slate-500">
              {stats.completed}/{stats.total}
            </span>
          </div>
        </div>

        {open ? (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {open && (
        <div className="divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-800 dark:border-slate-800">
          {topics.map(
            (topic) => {
              const status:
                TopicStatus =
                progressMap[
                  subject.id
                ]?.[
                  topic.id
                ] ??
                "Başlanmadı";

              const config =
                STATUS_CONFIG[
                  status
                ];

              const key =
                `${subject.id}:${topic.id}`;

              const isSaving =
                saving.has(
                  key
                );

              return (
                <button
                  key={
                    topic.id
                  }
                  type="button"
                  disabled={
                    isSaving
                  }
                  onClick={() =>
                    onTopicClick(
                      subject.id,
                      topic.id
                    )
                  }
                  className="group flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  {status ===
                  "Tamamlandı" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  ) : status ===
                    "Tekrar Edilecek" ? (
                    <RotateCcw className="h-4 w-4 shrink-0 text-violet-500" />
                  ) : (
                    <Circle
                      className={`h-4 w-4 shrink-0 ${
                        status ===
                        "Çalışılıyor"
                          ? "text-amber-500"
                          : "text-slate-300"
                      }`}
                    />
                  )}

                  <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">
                    {
                      topic.name
                    }
                  </span>

                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${config.bg} ${config.color} ${config.border}`}
                  >
                    {
                      config.label
                    }
                  </span>

                  {isSaving && (
                    <div className="h-3 w-3 animate-spin rounded-full border border-slate-400 border-t-transparent" />
                  )}
                </button>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
