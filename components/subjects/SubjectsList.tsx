import { BookOpen } from "lucide-react";
import type { SubjectWithTopics } from "@/lib/constants/subjects";
import type { SubjectProgressMap } from "@/services/topicService";
import type { StatusFilter } from "./constants";
import { SubjectCard } from "./SubjectCard";

interface Props {
  subjects: SubjectWithTopics[];
  progressMap: SubjectProgressMap;
  statusFilter: StatusFilter;
  expanded: Set<string>;
  saving: Set<string>;
  onToggle: (id: string) => void;
  onTopicClick: (subjectId: string, topicId: string) => void;
}

export function SubjectsList({ subjects, progressMap, statusFilter, expanded, saving, onToggle, onTopicClick }: Props) {
  if (!subjects.length) {
    return (
      <div className="py-12 text-center text-slate-500">
        <BookOpen className="mx-auto mb-3 h-10 w-10 opacity-30" />
        <p className="font-medium">Sonuç bulunamadı</p>
        <p className="mt-1 text-sm">Arama veya filtre kriterlerini değiştirin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {subjects.map((subject) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          progressMap={progressMap}
          statusFilter={statusFilter}
          open={expanded.has(subject.id)}
          saving={saving}
          onToggle={() => onToggle(subject.id)}
          onTopicClick={onTopicClick}
        />
      ))}
    </div>
  );
}
