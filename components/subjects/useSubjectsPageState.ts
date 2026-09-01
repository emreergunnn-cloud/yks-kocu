"use client";

import { useMemo, useState } from "react";
import { YKS_SUBJECTS } from "@/lib/constants/subjects";
import type { StatusFilter, SubjectTab } from "./constants";
import { useSubjectsProgress } from "./useSubjectsProgress";

export function useSubjectsPageState() {
  const progress = useSubjectsProgress();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<SubjectTab>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const subjects = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("tr-TR");
    return YKS_SUBJECTS.filter((subject) => {
      if (tab !== "all" && subject.category !== tab) return false;
      if (!query) return true;
      return subject.name.toLocaleLowerCase("tr-TR").includes(query) ||
        subject.topics.some((topic) => topic.name.toLocaleLowerCase("tr-TR").includes(query));
    });
  }, [search, tab]);

  const totalTopics = YKS_SUBJECTS.reduce((total, subject) => total + subject.topics.length, 0);
  const completedTopics = YKS_SUBJECTS.reduce(
    (total, subject) => total + subject.topics.filter((topic) => progress.progressMap[subject.id]?.[topic.id] === "Tamamlandı").length,
    0
  );

  const toggleSubject = (id: string) => setExpanded((previous) => {
    const next = new Set(previous);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return {
    progress, search, setSearch, tab, setTab, statusFilter, setStatusFilter,
    expanded, subjects, totalTopics, completedTopics, toggleSubject,
  };
}
