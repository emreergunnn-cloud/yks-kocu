import type {
  Timestamp,
} from "firebase/firestore";

import type {
  StudyAssignmentCounts,
} from "@/types/studyPlan";

export interface SavedStudyPlan {
  id: string;
  uid: string;

  mode:
    | "daily"
    | "weekly";

  date: string;

  taskIds: string[];

  createdAt?: Timestamp;
}

export interface AssignmentHistory {
  counts:
    StudyAssignmentCounts;

  updatedAt?: Timestamp;
}