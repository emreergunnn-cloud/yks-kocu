import type { SchoolGrade } from "@/lib/constants/curriculum/config";
import type { StudyTask } from "@/types/studyPlan";
import { StudyPlanTaskCard } from "../StudyPlanTaskCard";
import { SchoolStudyGuide } from "./SchoolStudyGuide";
import { SchoolStudyResources } from "./SchoolStudyResources";

interface Props {
  tasks: StudyTask[];
  grade: SchoolGrade;
}

export function SchoolStudyTaskList({ tasks, grade }: Props) {
  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <div key={task.id}>
          <StudyPlanTaskCard task={task} index={index} />
          <SchoolStudyGuide task={task} />
          <SchoolStudyResources grade={grade} task={task} />
        </div>
      ))}
    </div>
  );
}
