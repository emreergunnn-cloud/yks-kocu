"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { getExamResults } from "@/services/examService";
import { getTopicProgress, computeSubjectStats, SubjectProgressMap } from "@/services/topicService";
import { YKS_SUBJECTS } from "@/lib/constants/subjects";
import { ExamResult } from "@/types/exam";
import {
  Brain,
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  ClipboardList,
  Star,
  Lightbulb,
  ChevronRight,
  Calendar,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  BarChart2,
} from "lucide-react";
import Link from "next/link";

// ─── Helper ─────────────────────────────────────────────────────────────────


// ─── Daily Plan Generator ────────────────────────────────────────────────────

interface DailyTask {
  subject: string;
  topic: string;
  durationMinutes: number;
  type: "new" | "revision" | "exam_prep";
}

function generateDailyPlan(
  progressMap: SubjectProgressMap,
  totalHours = 4
): DailyTask[] {
  const tasks: DailyTask[] = [];
  let remainingMinutes = totalHours * 60;

  // 1. Revision tasks (high priority)
  for (const subject of YKS_SUBJECTS) {
    if (remainingMinutes <= 0) break;
    const data = progressMap[subject.id] ?? {};
    const reviewTopics = subject.topics.filter((t) => data[t.id] === "Tekrar Edilecek");
    if (reviewTopics.length > 0) {
      const duration = Math.min(30, remainingMinutes);
      tasks.push({
        subject: subject.name,
        topic: `${reviewTopics[0].name}${reviewTopics.length > 1 ? ` (+${reviewTopics.length - 1} daha)` : ""}`,
        durationMinutes: duration,
        type: "revision",
      });
      remainingMinutes -= duration;
    }
  }

  // 2. New topics from subjects with low progress
  const sortedSubjects = [...YKS_SUBJECTS].sort((a, b) => {
    const statsA = computeSubjectStats(a.id, a.topics.map(t => t.id), progressMap).progressPct;
    const statsB = computeSubjectStats(b.id, b.topics.map(t => t.id), progressMap).progressPct;
    return statsA - statsB;
  });

  for (const subject of sortedSubjects) {
    if (remainingMinutes <= 30) break;
    const data = progressMap[subject.id] ?? {};
    const notStarted = subject.topics.filter((t) => !data[t.id] || data[t.id] === "Başlanmadı");
    if (notStarted.length > 0 && !tasks.find((t) => t.subject === subject.name)) {
      const duration = Math.min(45, remainingMinutes);
      tasks.push({
        subject: subject.name,
        topic: notStarted[0].name,
        durationMinutes: duration,
        type: "new",
      });
      remainingMinutes -= duration;
    }
  }

  // 3. Add a general exam prep task if time allows
  if (remainingMinutes >= 60 && tasks.length < 5) {
    tasks.push({
      subject: "Genel Deneme Çözümü",
      topic: "TYT veya AYT denemesi çöz",
      durationMinutes: 60,
      type: "exam_prep",
    });
  }

  return tasks.slice(0, 6);
}

// ─── Component ──────────────────────────────────────────────────────────────

export const StudyPlannerPage: React.FC = () => {
  const { user } = useAuth();
  const [progressMap, setProgressMap] = useState<SubjectProgressMap>({});
  const [exams, setExams] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyHours, setDailyHours] = useState(4);
  const [activeTab, setActiveTab] = useState<"today" | "subjects">("today");

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getTopicProgress(user.uid),
      getExamResults(user.uid, 50),
    ]).then(([pm, ex]) => {
      setProgressMap(pm);
      setExams(ex);
      setLoading(false);
    });
  }, [user]);

  const dailyPlan = useMemo(() => generateDailyPlan(progressMap, dailyHours), [progressMap, dailyHours]);
  const totalDailyMinutes = dailyPlan.reduce((a, t) => a + t.durationMinutes, 0);

  // Subject stats for overview
  const subjectStats = useMemo(() =>
    YKS_SUBJECTS.map((s) => {
      const stats = computeSubjectStats(s.id, s.topics.map((t) => t.id), progressMap);
      return { ...s, stats };
    }),
    [progressMap]
  );

  const overallCompleted = subjectStats.reduce((a, s) => a + s.stats.completed, 0);
  const overallTotal = subjectStats.reduce((a, s) => a + s.stats.total, 0);
  const overallPct = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;

  const today = new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" });

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" /> Çalışma Planı
          </h1>
           <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
             Kişiselleştirilmiş günlük çalışma programı
           </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">{today}</span>
          <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">%{overallPct} Müfredat</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
        {([
          { id: "today", label: "Bugünkü Plan", icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: "subjects", label: "Ders Durumu", icon: <BarChart2 className="w-3.5 h-3.5" /> },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── TODAY'S PLAN TAB ── */}
      {activeTab === "today" && (
        <div className="space-y-4">
          {/* Hours selector */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Günlük çalışma hedefi</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{dailyHours} saat</span>
              </div>
              <input
                type="range"
                min={1}
                max={12}
                step={0.5}
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>1 sa</span><span>6 sa</span><span>12 sa</span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">Toplam</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{totalDailyMinutes} dk</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">Görev</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{dailyPlan.length}</p>
              </div>
            </div>
          </div>

          {dailyPlan.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-500" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">Harika gidiyorsun!</p>
              <p className="text-sm text-slate-500 mt-1">Bugün için özel görev yok. Konulardan birini çalışmaya devam et.</p>
              <Link href="/subjects" className="mt-4 inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Konulara Git <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {dailyPlan.map((task, idx) => (
                <div
                  key={idx}
                  className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 flex items-start gap-3 ${
                    task.type === "revision"
                      ? "border-violet-200 dark:border-violet-800"
                      : task.type === "exam_prep"
                      ? "border-emerald-200 dark:border-emerald-800"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {/* Order badge */}
                  <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-black ${
                    task.type === "revision" ? "bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300" :
                    task.type === "exam_prep" ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700" :
                    "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{task.subject}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        task.type === "revision" ? "bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800" :
                        task.type === "exam_prep" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-200 dark:border-emerald-800" :
                        "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                      }`}>
                        {task.type === "revision" ? "Tekrar" : task.type === "exam_prep" ? "Deneme" : "Yeni Konu"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{task.topic}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">{task.durationMinutes} dk</span>
                  </div>
                </div>
              ))}

              {/* Quick actions */}
              <div className="flex gap-2 pt-1">
                <Link
                  href="/subjects"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all"
                >
                  <BookOpen className="w-4 h-4" /> Konulara Git
                </Link>
                <Link
                  href="/study"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium rounded-xl transition-all"
                >
                  <Clock className="w-4 h-4" /> Zamanlayıcı
                </Link>
              </div>
            </div>
          )}
        </div>
      )}


      {/* ── SUBJECTS STATUS TAB ── */}
      {activeTab === "subjects" && (
        <div className="space-y-3">
          {/* Overall progress banner */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-4 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">Genel Müfredat İlerlemesi</p>
              <div className="h-2 bg-blue-800/50 rounded-full overflow-hidden">
                <div className="h-full bg-white/80 rounded-full transition-all" style={{ width: `${overallPct}%` }} />
              </div>
              <p className="text-xs text-blue-200 mt-1">{overallCompleted}/{overallTotal} konu tamamlandı</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-3xl font-black">%{overallPct}</p>
            </div>
          </div>

          {/* Per-subject rows */}
          {(["TYT", "AYT"] as const).map((cat) => (
            <div key={cat}>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1">{cat}</h3>
              <div className="space-y-2">
                {subjectStats.filter((s) => s.category === cat).map((s) => (
                  <div key={s.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${cat === "TYT" ? "bg-blue-500" : "bg-purple-500"}`} />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1 truncate">{s.name}</span>
                      <span className="text-xs text-slate-500 shrink-0">{s.stats.completed}/{s.stats.total}</span>
                      <span className={`text-xs font-bold shrink-0 ${s.stats.progressPct >= 75 ? "text-emerald-600" : s.stats.progressPct >= 40 ? "text-amber-600" : "text-rose-500"}`}>
                        %{s.stats.progressPct}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${s.stats.progressPct >= 75 ? "bg-emerald-500" : s.stats.progressPct >= 40 ? "bg-amber-500" : "bg-rose-500"}`}
                        style={{ width: `${s.stats.progressPct}%` }}
                      />
                    </div>
                    <div className="flex gap-3 mt-1.5 text-[10px] text-slate-400">
                      {s.stats.studying > 0 && <span className="text-amber-600 dark:text-amber-400">{s.stats.studying} çalışıyor</span>}
                      {s.stats.needsReview > 0 && <span className="text-violet-600 dark:text-violet-400">{s.stats.needsReview} tekrar</span>}
                      {s.stats.notStarted > 0 && <span>{s.stats.notStarted} başlanmadı</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Link href="/subjects" className="flex items-center justify-center gap-1.5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium rounded-xl transition-all">
            Konuları Düzenle <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};
