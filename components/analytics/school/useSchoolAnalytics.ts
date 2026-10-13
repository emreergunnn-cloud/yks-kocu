"use client";

import { useEffect, useMemo, useState } from "react";
import { getActiveSubjects } from "@/lib/constants/curriculum/activeSubjects";
import { loadResolvedTopicProgress } from "@/services/topicProgress/loadResolvedTopicProgress";
import { getStudyStats, type StudyStats } from "@/services/studyStatsService";
import type { SubjectProgressMap } from "@/services/topicService";
import type { UserProfile } from "@/types/user";

const EMPTY_STATS: StudyStats = {
  todayMinutes: 0,
  weekMinutes: 0,
  monthMinutes: 0,
  todaySessions: 0,
  weekSessions: 0,
  monthSessions: 0,
};

export function useSchoolAnalytics(uid: string | null, profile: UserProfile) {
  const [progress, setProgress] = useState<SubjectProgressMap>({});
  const [studyStats, setStudyStats] = useState<StudyStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(Boolean(uid));
  const subjects = useMemo(
    () => getActiveSubjects(profile.sinif, profile.alan),
    [profile.sinif, profile.alan]
  );

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    Promise.all([loadResolvedTopicProgress(uid), getStudyStats(uid)])
      .then(([nextProgress, nextStats]) => {
        if (!active) return;
        setProgress(nextProgress);
        setStudyStats(nextStats);
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [uid]);

  const summary = useMemo(() => {
    const subjectRows = subjects.map((subject) => {
      const statuses = subject.topics.map((topic) => progress[subject.id]?.[topic.id] ?? "Başlanmadı");
      const studied = statuses.filter((status) => status === "Çalışılıyor" || status === "Tamamlandı").length;
      const completed = statuses.filter((status) => status === "Tamamlandı").length;
      const review = statuses.filter((status) => status === "Tekrar Edilecek").length;
      return { id: subject.id, name: subject.name, total: statuses.length, studied, completed, review };
    });
    return {
      subjects: subjectRows,
      total: subjectRows.reduce((sum, item) => sum + item.total, 0),
      studied: subjectRows.reduce((sum, item) => sum + item.studied, 0),
      completed: subjectRows.reduce((sum, item) => sum + item.completed, 0),
      review: subjectRows.reduce((sum, item) => sum + item.review, 0),
    };
  }, [subjects, progress]);

  return { loading, studyStats, summary };
}
