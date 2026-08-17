"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  BookOpen,
} from "lucide-react";

import {
  YKS_SUBJECTS,
} from "@/lib/constants/subjects";

import {
  SubjectsFilters,
} from "./SubjectsFilters";

import {
  SubjectsHeader,
} from "./SubjectsHeader";

import {
  SubjectCard,
} from "./SubjectCard";

import type {
  StatusFilter,
  SubjectTab,
} from "./constants";

import {
  useSubjectsProgress,
} from "./useSubjectsProgress";

export function SubjectsPage() {
  const progress =
    useSubjectsProgress();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    tab,
    setTab,
  ] =
    useState<SubjectTab>(
      "all"
    );

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>(
      "all"
    );

  const [
    expanded,
    setExpanded,
  ] =
    useState<Set<string>>(
      new Set()
    );

  const subjects =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLocaleLowerCase(
            "tr-TR"
          );

      return YKS_SUBJECTS.filter(
        (subject) => {
          if (
            tab !== "all" &&
            subject.category !==
              tab
          ) {
            return false;
          }

          if (!query) {
            return true;
          }

          return (
            subject.name
              .toLocaleLowerCase(
                "tr-TR"
              )
              .includes(
                query
              ) ||
            subject.topics.some(
              (topic) =>
                topic.name
                  .toLocaleLowerCase(
                    "tr-TR"
                  )
                  .includes(
                    query
                  )
            )
          );
        }
      );
    }, [
      search,
      tab,
    ]);

  const totalTopics =
    YKS_SUBJECTS.reduce(
      (total, subject) =>
        total +
        subject.topics.length,
      0
    );

  const completedTopics =
    YKS_SUBJECTS.reduce(
      (total, subject) =>
        total +
        subject.topics.filter(
          (topic) =>
            progress
              .progressMap[
                subject.id
              ]?.[
                topic.id
              ] ===
            "Tamamlandı"
        ).length,
      0
    );

  function toggleSubject(
    id: string
  ) {
    setExpanded(
      (previous) => {
        const next =
          new Set(
            previous
          );

        if (
          next.has(id)
        ) {
          next.delete(id);
        } else {
          next.add(id);
        }

        return next;
      }
    );
  }

  if (progress.loading) {
    return (
      <div className="space-y-4 p-6">
        {[1, 2, 3].map(
          (item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
            />
          )
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 md:p-6">
      <SubjectsHeader
        completed={
          completedTopics
        }
        total={
          totalTopics
        }
      />

      <SubjectsFilters
        search={search}
        tab={tab}
        status={
          statusFilter
        }
        onSearch={
          setSearch
        }
        onTab={setTab}
        onStatus={
          setStatusFilter
        }
      />

      <div className="space-y-3">
        {subjects.map(
          (subject) => (
            <SubjectCard
              key={
                subject.id
              }
              subject={
                subject
              }
              progressMap={
                progress
                  .progressMap
              }
              statusFilter={
                statusFilter
              }
              open={
                expanded.has(
                  subject.id
                )
              }
              saving={
                progress.saving
              }
              onToggle={() =>
                toggleSubject(
                  subject.id
                )
              }
              onTopicClick={
                progress.changeStatus
              }
            />
          )
        )}
      </div>

      {subjects.length ===
        0 && (
        <div className="py-12 text-center text-slate-500">
          <BookOpen className="mx-auto mb-3 h-10 w-10 opacity-30" />

          <p className="font-medium">
            Sonuç bulunamadı
          </p>

          <p className="mt-1 text-sm">
            Arama veya filtre kriterlerini değiştirin.
          </p>
        </div>
      )}
    </div>
  );
}
