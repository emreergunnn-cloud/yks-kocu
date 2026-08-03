export type TopicStatus = "Tamamlandı" | "Tekrar Edilecek" | "Başlanmadı";

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
  totalCount: number;
  topics: Record<string, Topic>;
  updatedAt?: any;
}
