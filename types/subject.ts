import { ExamType } from "./exam";
import { AlanOption } from "./user";

export interface Subject {
  id: string;
  name: string;
  category: ExamType;
  allowedTracks?: AlanOption[];
  questionCount: number;
  icon?: string;
}
