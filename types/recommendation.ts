export type RecommendationLevel =
  | "beginner"
  | "intermediate"
  | "advanced";

export type RecommendationExam =
  | "TYT"
  | "AYT";

export type ResourceSubject =
  | "mathematics"
  | "turkish"
  | "physics"
  | "chemistry"
  | "biology"
  | "literature"
  | "history"
  | "geography"
  | "philosophy"
  | "religion"
  | "language";

export interface NetTrend {
  initial: number;
  current: number;
  target: number;
  delta: number;
  gap: number;
}

export interface BookResource {
  id: string;
  title: string;
  publisher: string;
  exam: RecommendationExam;
  subject: ResourceSubject;
  levels: RecommendationLevel[];
  kind: "question-bank" | "video-book";
}

export interface VideoResource {
  channel: string;
  title: string;
  url: string;
}

export interface TaskRecommendation {
  level: RecommendationLevel;
  trend: NetTrend;
  books: BookResource[];
  video: VideoResource;
  reason: string;
}