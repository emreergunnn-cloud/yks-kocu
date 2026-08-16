"use client";

import type {
  StudyTask,
} from "@/types/studyPlan";

import {
  ExamImpactBadge,
} from "./ExamImpactBadge";

import {
  ReinforcementBadge,
} from "./ReinforcementBadge";

import {
  MebRemediationCard,
} from "./remediation/MebRemediationCard";

import {
  CarryoverTaskNotice,
} from "./task-card/CarryoverTaskNotice";

import {
  StudyTaskHeader,
} from "./task-card/StudyTaskHeader";

import {
  StudyTaskMeta,
} from "./task-card/StudyTaskMeta";

interface Props {
  task: StudyTask;
  index: number;
}

export function StudyPlanTaskCard({
  task,
  index,
}: Props) {
  const isCarryover =
    task.assignmentKind ===
    "carryover";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <StudyTaskHeader
        task={task}
        index={index}
      />

      <div className="ml-11">
        <StudyTaskMeta
          task={task}
        />

        <CarryoverTaskNotice
          task={task}
        />

        {!isCarryover && (
          <ReinforcementBadge
            role={task.role}
            previousAssignments={
              task.previousAssignments
            }
          />
        )}

        {task.examImpact && (
          <ExamImpactBadge
            impact={
              task.examImpact
            }
          />
        )}

        <MebRemediationCard
          task={task}
        />
      </div>
    </div>
  );
}