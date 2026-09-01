import { computeSubjectStats } from "@/services/topicService";
import { SubjectCardHeader } from "./subject-card/SubjectCardHeader";
import { SubjectTopicList } from "./subject-card/SubjectTopicList";
import type { SubjectCardProps } from "./subject-card/types";

export function SubjectCard({ subject, progressMap, statusFilter, open, saving, onToggle, onTopicClick }: SubjectCardProps) {
  const stats = computeSubjectStats(subject.id, subject.topics.map((topic) => topic.id), progressMap);
  const topics = statusFilter === "all"
    ? subject.topics
    : subject.topics.filter((topic) => (progressMap[subject.id]?.[topic.id] ?? "Başlanmadı") === statusFilter);

  if (!topics.length) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <SubjectCardHeader subject={subject} completed={stats.completed} total={stats.total} progressPct={stats.progressPct} open={open} onToggle={onToggle} />
      {open && <SubjectTopicList subject={subject} topics={topics} progressMap={progressMap} saving={saving} onTopicClick={onTopicClick} />}
    </div>
  );
}
