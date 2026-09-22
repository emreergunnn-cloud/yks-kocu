"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getActiveSubjects } from "../../../lib/constants/curriculum/activeSubjects";
import { DEFAULT_SETTINGS, getUserSettings, type UserSettings } from "../../../services/settingsService";
import { getStudyStats, type StudyStats } from "../../../services/studyStatsService";
import { getExamResults } from "../../../services/examService";
import { getTopicProgress } from "../../../services/topicService";

const EMPTY_STATS: StudyStats = {
  todayMinutes: 0,
  weekMinutes: 0,
  monthMinutes: 0,
  todaySessions: 0,
  weekSessions: 0,
  monthSessions: 0,
};

export function useGoalTrackerData() {
  const { user, userProfile } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [studyStats, setStudyStats] = useState<StudyStats>(EMPTY_STATS);
  const [examCount, setExamCount] = useState(0);
  const [completedTopics, setCompletedTopics] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !userProfile) return;
    const subjects = getActiveSubjects(userProfile.sinif);

    Promise.all([
      getUserSettings(user.uid),
      getStudyStats(user.uid),
      getExamResults(user.uid),
      getTopicProgress(user.uid),
    ]).then(([nextSettings, stats, exams, progressMap]) => {
      setSettings(nextSettings);
      setStudyStats(stats);
      setExamCount(exams.length);
      const completed = subjects.reduce(
        (total, subject) => total + subject.topics.filter(
          (topic) => progressMap[subject.id]?.[topic.id] === "Tamamlandı"
        ).length,
        0
      );
      setCompletedTopics(completed);
      setLoading(false);
    });
  }, [user, userProfile?.sinif]);

  return { settings, studyStats, examCount, completedTopics, loading };
}
