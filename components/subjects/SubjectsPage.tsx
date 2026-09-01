"use client";

import { SubjectsFilters } from "./SubjectsFilters";
import { SubjectsHeader } from "./SubjectsHeader";
import { SubjectsList } from "./SubjectsList";
import { useSubjectsPageState } from "./useSubjectsPageState";

export function SubjectsPage() {
  const state = useSubjectsPageState();

  if (state.progress.loading) {
    return (
      <div className="space-y-4 p-6">
        {[1, 2, 3].map((item) => <div key={item} className="h-20 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />)}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 md:p-6">
      <SubjectsHeader completed={state.completedTopics} total={state.totalTopics} />
      <SubjectsFilters
        search={state.search}
        tab={state.tab}
        status={state.statusFilter}
        onSearch={state.setSearch}
        onTab={state.setTab}
        onStatus={state.setStatusFilter}
      />
      <SubjectsList
        subjects={state.subjects}
        progressMap={state.progress.progressMap}
        statusFilter={state.statusFilter}
        expanded={state.expanded}
        saving={state.progress.saving}
        onToggle={state.toggleSubject}
        onTopicClick={state.progress.changeStatus}
      />
    </div>
  );
}
