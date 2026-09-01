import type { SubjectWithTopics } from "@/lib/constants/subjects";
import type { SubjectProgressMap } from "@/services/topicService";
import type { StatusFilter } from "../constants";

export interface SubjectCardProps {
  subject: SubjectWithTopics;
  progressMap: SubjectProgressMap;
  statusFilter: StatusFilter;
  open: boolean;
  saving: Set<string>;
  onToggle: () => void;
  onTopicClick: (subjectId: string, topicId: string) => void;
}
