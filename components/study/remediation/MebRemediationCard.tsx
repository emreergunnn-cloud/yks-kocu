import type {
  StudyTask,
} from "@/types/studyPlan";

import {
  MebRemediationDetails,
} from "./MebRemediationDetails";

interface Props {
  task: StudyTask;
}

export function MebRemediationCard({
  task,
}: Props) {
  if (!task.remediation) {
    return null;
  }

  return (
    <MebRemediationDetails
      subjectId={
        task.subjectId
      }
      topicId={
        task.topicId
      }
      remediation={
        task.remediation
      }
    />
  );
}