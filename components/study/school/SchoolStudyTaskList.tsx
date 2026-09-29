import type { StudyTask } from "@/types/studyPlan";
import { StudyPlanTaskCard } from "../StudyPlanTaskCard";
import { SchoolStudyGuide } from "./SchoolStudyGuide";

export function SchoolStudyTaskList({ tasks }: { tasks: StudyTask[] }) {
  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <div key={task.id}>
          <StudyPlanTaskCard task={task} index={index} />
          <SchoolStudyGuide task={task} />
        </div>
      ))}
    </div>
  );
}
