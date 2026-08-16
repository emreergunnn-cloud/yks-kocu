"use client";

import type {
  StudyTask,
} from "@/types/studyPlan";

import {
  StudyPlanTaskCard,
} from "../StudyPlanTaskCard";

import {
  StudyTaskResources,
} from "./StudyTaskResources";

import {
  useStudyPlanRecommendations,
} from "./useStudyPlanRecommendations";

interface Props {
  uid: string | null;

  tasks: StudyTask[];
}

export function StudyPlanTaskListWithResources({
  uid,
  tasks,
}: Props) {
  const {
    recommendations,
    loading,
  } =
    useStudyPlanRecommendations(
      uid,
      tasks
    );

  return (
    <div className="space-y-3">
      {tasks.map(
        (task, index) => (
          <div key={task.id}>
            <StudyPlanTaskCard
              task={task}
              index={index}
            />

            {!loading &&
              recommendations[
                task.id
              ] && (
                <StudyTaskResources
                  recommendation={
                    recommendations[
                      task.id
                    ]
                  }
                />
              )}
          </div>
        )
      )}
    </div>
  );
}