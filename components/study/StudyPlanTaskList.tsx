"use client";

import React from "react";

import type { StudyTask } from "@/types/studyPlan";

import { StudyPlanTaskCard } from "./StudyPlanTaskCard";

interface StudyPlanTaskListProps {
  tasks: StudyTask[];
}

export const StudyPlanTaskList: React.FC<
  StudyPlanTaskListProps
> = ({ tasks }) => {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <StudyPlanTaskCard
          key={task.id}
          task={task}
          index={index}
        />
      ))}
    </div>
  );
};