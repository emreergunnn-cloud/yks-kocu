"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { YKS_SUBJECTS, SubjectWithTopics } from "../../lib/constants/subjects";
import { getTopicProgress, saveTopicStatus, computeSubjectStats, SubjectProgressMap } from "../../services/topicService";
import { TopicStatus } from "../../types/topic";
import { Search, ChevronDown, ChevronRight, CheckCircle2, Circle, RotateCcw, BookOpen, Filter } from "lucide-react";

type TabFilter = "all" | "TYT" | "AYT";
type StatusFilter = "all" | TopicStatus;

const STATUS_CONFIG: Record<TopicStatus, { label: string; color: string; bg: string; border: string }> = {
  "Başlanmadı": { label: "Başlanmadı", color: "text-slate-400", bg: "bg-slate-100 dark:bg-slate-800", border: "border-slate-200 dark:border-slate-700" },
  "Çalışılıyor": { label: "Çalışılıyor", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/50", border: "border-amber-200 dark:border-amber-800" },
  "Tamamlandı": { label: "Tamamlandı", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/50", border: "border-emerald-200 dark:border-emerald-800" },
  "Tekrar Edilecek": { label: "Tekrar", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/50", border: "border-violet-200 dark:border-violet-800" },
};

const STATUSES: TopicStatus[] = ["Başlanmadı", "Çalışılıyor", "Tamamlandı", "Tekrar Edilecek"];

function nextStatus(current?: TopicStatus): TopicStatus {
  const idx = STATUSES.indexOf(current ?? "Başlanmadı");
  return STATUSES[(idx + 1) % STATUSES.length];
}

export const SubjectsPage: React.FC = () => {
  const { user } = useAuth();
  const [progressMap, setProgressMap] = useState<SubjectProgressMap>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<TabFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    getTopicProgress(user.uid).then((pm) => {
      setProgressMap(pm);
      setLoading(false);
    });
  }, [user]);

  const toggleExpand = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleTopicClick = useCallback(async (subjectId: string, topicId: string) => {
    if (!user) return;
    const current = progressMap[subjectId]?.[topicId] as TopicStatus | undefined;
    const next = nextStatus(current);
    const key = `${subjectId}:${topicId}`;
    setSaving((prev) => new Set(prev).add(key));
    try {
      await saveTopicStatus(user.uid, subjectId, topicId, next);
      setProgressMap((prev) => ({
        ...prev,
        [subjectId]: { ...prev[subjectId], [topicId]: next },
      }));
    } finally {
      setSaving((prev) => { const s = new Set(prev); s.delete(key); return s; });
    }
  }, [user, progressMap]);

  const filteredSubjects = useMemo(() => {
    return YKS_SUBJECTS.filter((s) => {
      if (tab !== "all" && s.category !== tab) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!s.name.toLowerCase().includes(q) && !s.topics.some((t) => t.name.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [tab, search]);

  // Overall stats
  const totalTopics = YKS_SUBJECTS.reduce((acc, s) => acc + s.topics.length, 0);
  const totalCompleted = YKS_SUBJECTS.reduce((acc, s) => {
    return acc + s.topics.filter((t) => progressMap[s.id]?.[t.id] === "Tamamlandı").length;
  }, 0);
  const totalPct = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[1,2,3].map((i) => (
          <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" /> Konu Takip
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {totalCompleted}/{totalTopics} konu tamamlandı — %{totalPct}
          </p>
        </div>
        {/* Overall progress bar */}
        <div className="w-full sm:w-48">
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${totalPct}%` }} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Ders veya konu ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "TYT", "AYT"] as TabFilter[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? "bg-blue-600 text-white shadow-sm" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"}`}
            >
              {t === "all" ? "Tümü" : t}
            </button>
          ))}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          <option value="all">Tüm Durumlar</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <span key={s} className={`text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
              {cfg.label}
            </span>
          );
        })}
        <span className="text-xs text-slate-400 dark:text-slate-500 self-center">Tıkla → durum değiştir</span>
      </div>

      {/* Subjects */}
      <div className="space-y-3">
        {filteredSubjects.map((subject) => {
          const topicIds = subject.topics.map((t) => t.id);
          const stats = computeSubjectStats(subject.id, topicIds, progressMap);
          const isOpen = expanded.has(subject.id);

          // Filter topics by status if status filter active
          const visibleTopics = statusFilter === "all"
            ? subject.topics
            : subject.topics.filter((t) => (progressMap[subject.id]?.[t.id] ?? "Başlanmadı") === statusFilter);

          const hasVisibleTopics = visibleTopics.length > 0;
          if (!hasVisibleTopics && statusFilter !== "all") return null;

          return (
            <div key={subject.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              {/* Subject header */}
              <button
                onClick={() => toggleExpand(subject.id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
              >
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${subject.category === "TYT" ? "bg-blue-500" : "bg-purple-500"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">{subject.name}</span>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${subject.category === "TYT" ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400" : "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400"}`}>
                      {subject.category}
                    </span>
                  </div>
                  {/* Mini progress */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${stats.progressPct}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 shrink-0">{stats.completed}/{stats.total}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:flex items-center gap-1.5 text-xs">
                    {stats.studying > 0 && <span className="text-amber-600 dark:text-amber-400">{stats.studying} çalışıyor</span>}
                    {stats.needsReview > 0 && <span className="text-violet-600 dark:text-violet-400">{stats.needsReview} tekrar</span>}
                  </div>
                  {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </div>
              </button>

              {/* Topics */}
              {isOpen && (
                <div className="border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                  {visibleTopics.map((topic) => {
                    const status: TopicStatus = progressMap[subject.id]?.[topic.id] ?? "Başlanmadı";
                    const cfg = STATUS_CONFIG[status];
                    const key = `${subject.id}:${topic.id}`;
                    const isSaving = saving.has(key);

                    return (
                      <button
                        key={topic.id}
                        onClick={() => handleTopicClick(subject.id, topic.id)}
                        disabled={isSaving}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-left group"
                      >
                        {status === "Tamamlandı" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : status === "Tekrar Edilecek" ? (
                          <RotateCcw className="w-4 h-4 text-violet-500 shrink-0" />
                        ) : (
                          <Circle className={`w-4 h-4 shrink-0 ${status === "Çalışılıyor" ? "text-amber-500" : "text-slate-300 dark:text-slate-600"}`} />
                        )}
                        <span className={`flex-1 text-sm ${status === "Tamamlandı" ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-700 dark:text-slate-300"}`}>
                          {topic.name}
                        </span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border} shrink-0 opacity-0 group-hover:opacity-100 transition-opacity`}>
                          {cfg.label}
                        </span>
                        {isSaving && <div className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Sonuç bulunamadı</p>
          <p className="text-sm mt-1">Arama veya filtre kriterlerini değiştirin.</p>
        </div>
      )}
    </div>
  );
};
