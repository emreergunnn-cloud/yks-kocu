"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getActiveSubjects } from "@/lib/constants/curriculum/activeSubjects";
import { isYksGrade } from "@/lib/constants/curriculum/config";
import type { StatusFilter, SubjectTab } from "./constants";
import { useSubjectsProgress } from "./useSubjectsProgress";

export function useSubjectsPageState() {
  const { userProfile } = useAuth();
  const progress = useSubjectsProgress();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<SubjectTab>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const grade = userProfile?.sinif ?? "";
  const alan = userProfile?.alan ?? "";
  const activeSubjects = useMemo(
    () => getActiveSubjects(grade, alan),
    [grade, alan]
  );
  const showExamTabs = isYksGrade(grade);

  const subjects = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("tr-TR");
    return activeSubjects.filter((subject) => {
      if (showExamTabs && tab !== "all" && subject.category !== tab) return false;
      if (!query) return true;
      return subject.name.toLocaleLowerCase("tr-TR").includes(query) ||
        subject.topics.some((topic) => topic.name.toLocaleLowerCase("tr-TR").includes(query));
    });
  }, [activeSubjects, search, showExamTabs, tab]);

  const totalTopics = activeSubjects.reduce(
    (total, subject) => total + subject.topics.length,
    0
  );
  const completedTopics = activeSubjects.reduce(
    (total, subject) => total + subject.topics.filter(
      (topic) => progress.progressMap[subject.id]?.[topic.id] === "Tamamlandı"
    ).length,
    0
  );

  const toggleSubject = (id: string) => setExpanded((previous) => {
    const next = new Set(previous);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return {
    progress, search, setSearch, tab, setTab, statusFilter, setStatusFilter,
    expanded, subjects, totalTopics, completedTopics, toggleSubject, showExamTabs,
  };
}
