export type TopicStatus = "Başlanmadı" | "Çalışılıyor" | "Tamamlandı" | "Tekrar Edilecek";

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  status: TopicStatus;
  notes?: string;
  lastReviewedAt?: any;
}

export interface SubjectProgress {
  subjectId: string;
  completedCount: number;
  studyingCount: number;
  needsReviewCount: number;
  notStartedCount: number;
  totalCount: number;
  progressPercentage: number;
  topics: Record<string, TopicStatus>;
  updatedAt?: any;
}

export type TopicProgressMap = Record<string, Record<string, TopicStatus>>;
