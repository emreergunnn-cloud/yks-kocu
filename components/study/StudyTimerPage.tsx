"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Timer, Play, Pause, RotateCcw, Coffee, Target, BookOpen, Check, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { YKS_SUBJECTS } from "../../lib/constants/subjects";
import { db } from "../../lib/firebase";
import { getUserSettings, UserSettings, DEFAULT_SETTINGS } from "../../services/settingsService";
import { recordStudyActivity } from "../../services/streakService";

type PomodoroMode = "pomodoro" | "short_break" | "long_break";
type Preset = { label: string; work: number; short: number; long: number };

const PRESETS: Preset[] = [
  { label: "25/5", work: 25, short: 5, long: 15 },
  { label: "50/10", work: 50, short: 10, long: 20 },
  { label: "90/20", work: 90, short: 20, long: 30 },
];

const MODE_LABELS: Record<PomodoroMode, string> = {
  pomodoro: "Çalışma",
  short_break: "Kısa Mola",
  long_break: "Uzun Mola",
};

const MODE_COLORS: Record<PomodoroMode, string> = {
  pomodoro: "from-blue-500 to-blue-700",
  short_break: "from-emerald-500 to-emerald-700",
  long_break: "from-violet-500 to-violet-700",
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export const StudyTimerPage: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [preset, setPreset] = useState<Preset>(PRESETS[0]);
  const [mode, setMode] = useState<PomodoroMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalStudySeconds, setTotalStudySeconds] = useState(0);
  const [sessionStudySeconds, setSessionStudySeconds] = useState(0);
  const [subject, setSubject] = useState("");
  const [note, setNote] = useState("");
  const [savedSessions, setSavedSessions] = useState<Array<{ subject: string; duration: number; ts: Date }>>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSavedSubject, setLastSavedSubject] = useState("");
  const [lastSavedDuration, setLastSavedDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const searchParams = useSearchParams();
  const urlSubjectId = searchParams.get("subjectId");
  const urlTopicId = searchParams.get("topicId");
  const urlDuration = searchParams.get("duration");

  const [subjectId, setSubjectId] = useState<string>(urlSubjectId || "");
  const [topicId, setTopicId] = useState<string>(urlTopicId || "");

  useEffect(() => {
    if (urlSubjectId && urlTopicId) {
      const subj = YKS_SUBJECTS.find(s => s.id === urlSubjectId);
      const top = subj?.topics.find(t => t.id === urlTopicId);
      if (subj && top) {
        setSubject(`${subj.name} - ${top.name}`);
      }
    }
    if (urlDuration) {
      const mins = parseInt(urlDuration, 10);
      if (!isNaN(mins) && mins > 0) {
        const found = PRESETS.find(p => p.work === mins);
        if (found) {
          setPreset(found);
          setTimeLeft(found.work * 60);
        } else {
          // Custom preset
          setPreset({ label: `${mins} Dk`, work: mins, short: 5, long: 15 });
          setTimeLeft(mins * 60);
        }
      }
    }
  }, [urlSubjectId, urlTopicId, urlDuration]);

  useEffect(() => {
    if (user && !urlDuration) {
      getUserSettings(user.uid).then((s) => {
        setSettings(s);
        const found = PRESETS.find((p) => p.work === s.pomodoroLength) ?? PRESETS[0];
        setPreset(found);
        setTimeLeft(found.work * 60);
      });
    }
  }, [user, urlDuration]);

  const getModeTotal = useCallback((m: PomodoroMode) => {
    if (m === "pomodoro") return preset.work * 60;
    if (m === "short_break") return preset.short * 60;
    return preset.long * 60;
  }, [preset]);

  const handleModeSwitch = useCallback((newMode: PomodoroMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(getModeTotal(newMode));
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [getModeTotal]);

  const handlePreset = (p: Preset) => {
    setPreset(p);
    setMode("pomodoro");
    setIsRunning(false);
    setTimeLeft(p.work * 60);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            // Auto session complete
            if (mode === "pomodoro") {
              setCompletedSessions((c) => c + 1);
              setSessionCount((c) => c + 1);
              const secs = getModeTotal("pomodoro");
              setTotalStudySeconds((t) => t + secs);
              setSessionStudySeconds((s) => s + secs);
              saveSession(secs);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, mode]);

  const saveSession = async (secs: number) => {
    if (!user) return;
    const sessionData = {
      startTime: Timestamp.fromMillis(Date.now() - secs * 1000),
      endTime: Timestamp.now(),
      duration: secs,
      subject: subject || "Genel",
      subjectId: subjectId || null,
      topicId: topicId || null,
      note: note,
      uid: user.uid,
    };
    try {
      await addDoc(collection(db, "users", user.uid, "studySessions"), sessionData);
      setSavedSessions((prev) => [{ subject: subject || "Genel", duration: secs, ts: new Date() }, ...prev.slice(0, 4)]);
      setLastSavedSubject(subject || "Genel");
      setLastSavedDuration(secs);
      setShowSuccessModal(true);
      
      // Record streak activity
      await recordStudyActivity(user.uid, sessionData.endTime.toMillis()).catch(() => {});
      
      // Update progressMap if this is an AI Coach tracked session
      if (subjectId && topicId) {
        import("../../services/topicService").then(async ({ getTopicProgress, saveTopicStatus }) => {
          const pm = await getTopicProgress(user.uid);
          const currentStatus = pm[subjectId]?.[topicId];
          if (!currentStatus) {
            await saveTopicStatus(user.uid, subjectId, topicId, "Çalışılıyor");
          }
        });
      }
    } catch {}
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(getModeTotal(mode));
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleSkip = () => {
    if (mode === "pomodoro") {
      const secs = getModeTotal("pomodoro") - timeLeft;
      if (secs > 60) {
        setTotalStudySeconds((t) => t + secs);
        setSessionStudySeconds((s) => s + secs);
        saveSession(secs);
      }
    }
    const nextMode: PomodoroMode = mode === "pomodoro" ? (completedSessions % 4 === 3 ? "long_break" : "short_break") : "pomodoro";
    handleModeSwitch(nextMode);
  };

  const totalMinutes = Math.floor(totalStudySeconds / 60);
  const totalPct = getModeTotal(mode) > 0 ? ((getModeTotal(mode) - timeLeft) / getModeTotal(mode)) * 100 : 0;
  const circumference = 2 * Math.PI * 90;

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Timer className="w-5 h-5 text-blue-600" /> Çalışma Zamanlayıcı
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Bugün {totalMinutes} dakika çalıştın • {completedSessions} pomodoro tamamlandı</p>
      </div>

      {/* Preset selection */}
      <div className="flex gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => handlePreset(p)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${preset.label === p.label ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Timer */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
          {/* Mode tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
            {(["pomodoro", "short_break", "long_break"] as PomodoroMode[]).map((m) => (
              <button
                key={m}
                onClick={() => handleModeSwitch(m)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${mode === m ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
              >
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>

          {/* Clock */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-52 h-52">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
                <circle
                  cx="100" cy="100" r="90" fill="none"
                  stroke="url(#timerGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (circumference * totalPct) / 100}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={mode === "pomodoro" ? "#3b82f6" : mode === "short_break" ? "#10b981" : "#8b5cf6"} />
                    <stop offset="100%" stopColor={mode === "pomodoro" ? "#1d4ed8" : mode === "short_break" ? "#059669" : "#7c3aed"} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black font-mono text-slate-900 dark:text-white">{formatTime(timeLeft)}</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{MODE_LABELS[mode]}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsRunning((r) => !r)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center gap-2 bg-gradient-to-br ${MODE_COLORS[mode]} hover:scale-105 active:scale-95`}
              >
                {isRunning ? <><Pause className="w-4 h-4" />Durdur</> : <><Play className="w-4 h-4" />Başlat</>}
              </button>
              <button
                onClick={handleSkip}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                title="Atla"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subject/note fields */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Çalıştığın ders (isteğe bağlı)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <input
              type="text"
              placeholder="Not (isteğe bağlı)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {/* Stats panel */}
        <div className="space-y-3">
          {/* Pomodoro dots */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Döngü</p>
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 rounded-full ${i < completedSessions % 8 ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-700"}`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400">Her 4 pomodorodan sonra uzun mola</p>
          </div>

          {/* Today's stats */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bugün</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Çalışma</span>
                <span className="font-semibold text-slate-900 dark:text-white">{totalMinutes} dk</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Pomodoro</span>
                <span className="font-semibold text-slate-900 dark:text-white">{completedSessions}</span>
              </div>
            </div>
          </div>

          {/* Recent sessions */}
          {savedSessions.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Son Seanslar</p>
              <div className="space-y-1.5">
                {savedSessions.map((s, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 truncate max-w-[100px]">{s.subject}</span>
                    <span className="text-slate-500">{Math.round(s.duration / 60)} dk</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm text-center space-y-4 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Seans Tamamlandı 🎉</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{lastSavedSubject}</span> çalışmasını tamamladın.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {Math.round(lastSavedDuration / 60)} dakikalık çalışma başarıyla kaydedildi.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/dashboard"
                className="w-full flex justify-center py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl text-sm font-bold shadow-sm transition-all"
              >
                AI Koç'a Dön
              </Link>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-semibold transition-all"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
