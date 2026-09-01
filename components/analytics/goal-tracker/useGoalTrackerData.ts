"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { DEFAULT_SETTINGS, getUserSettings, type UserSettings } from "../../../services/settingsService";
import { getStudyStats, type StudyStats } from "../../../services/studyStatsService";
import { getExamResults } from "../../../services/examService";
import { getTopicProgress } from "../../../services/topicService";
import { YKS_SUBJECTS } from "../../../lib/constants/subjects";

const EMPTY_STATS: StudyStats = { todayMinutes: 0, weekMinutes: 0, monthMinutes: 0, todaySessions: 0, weekSessions: 0, monthSessions: 0 };

export function useGoalTrackerData() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [studyStats, setStudyStats] = useState<StudyStats>(EMPTY_STATS);
  const [examCount, setExamCount] = useState(0);
  const [completedTopics, setCompletedTopics] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([getUserSettings(user.uid), getStudyStats(user.uid), getExamResults(user.uid), getTopicProgress(user.uid)])
      .then(([nextSettings, stats, exams, progressMap]) => {
        setSettings(nextSettings); setStudyStats(stats); setExamCount(exams.length);
        const completed = YKS_SUBJECTS.reduce((acc, subject) => acc + subject.topics.filter((topic) => progressMap[subject.id]?.[topic.id] === "Tamamlandı").length, 0);
        setCompletedTopics(completed); setLoading(false);
      });
  }, [user]);

  return { settings, studyStats, examCount, completedTopics, loading };
}
