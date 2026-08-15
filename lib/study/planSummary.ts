import type {
  StudyTask,
} from "@/types/studyPlan";

export function getStudyPlanSummary(
  tasks: StudyTask[]
) {
  return tasks.reduce(
    (summary, task) => ({
      totalMinutes:
        summary.totalMinutes +
        task.durationMinutes,

      totalQuestions:
        summary.totalQuestions +
        task.questionCount,
    }),
    {
      totalMinutes: 0,
      totalQuestions: 0,
    }
  );
}