export interface StudyTask {
  id: string;
  title: string;
  subjectId?: string;
  topicId?: string;
  durationMinutes: number;
  completed: boolean;
  notes?: string;
}

export interface DayPlan {
  dayName: "Pazartesi" | "Salı" | "Çarşamba" | "Perşembe" | "Cuma" | "Cumartesi" | "Pazar";
  date?: string;
  tasks: StudyTask[];
}

export interface StudyPlan {
  id?: string;
  uid: string;
  weekStartDate: string;
  days: DayPlan[];
  createdAt?: any;
}
