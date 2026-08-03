"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { getExamResults } from "../../services/examService";
import { ExamResult } from "../../types/exam";
import {
  collection,
  getDocs,
  Timestamp,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Plus,
  X,
  ClipboardList,
  BookOpen,
  Target,
} from "lucide-react";

interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: "exam" | "study" | "goal";
  color: string;
  notes?: string;
  durationMinutes?: number;
}

const WEEKDAY_LABELS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTH_NAMES = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

function toYMD(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function parseDateLocal(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function getMonthGrid(year: number, month: number): (Date | null)[] {
  const days = getDaysInMonth(year, month);
  const firstDow = (days[0].getDay() + 6) % 7; // Monday=0
  const grid: (Date | null)[] = Array(firstDow).fill(null);
  grid.push(...days);
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
}

const TYPE_CONFIG = {
  exam: { label: "Deneme", color: "bg-violet-500", textColor: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/40", border: "border-violet-200 dark:border-violet-800" },
  study: { label: "Çalışma", color: "bg-blue-500", textColor: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/40", border: "border-blue-200 dark:border-blue-800" },
  goal: { label: "Hedef", color: "bg-emerald-500", textColor: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-800" },
};

export const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState<"exam" | "study" | "goal">("study");
  const [formNotes, setFormNotes] = useState("");
  const [formDuration, setFormDuration] = useState(60);
  const [saving, setSaving] = useState(false);

  const loadEvents = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Load calendar events from Firestore
      const eventsRef = collection(db, "users", user.uid, "calendarEvents");
      const snap = await getDocs(eventsRef);
      const calEvents: CalendarEvent[] = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as CalendarEvent[];

      // Also load exam results as events
      const exams = await getExamResults(user.uid, 200);
      const examEvents: CalendarEvent[] = exams
        .filter((e) => e.sinavTarihi)
        .map((e) => ({
          id: `exam-${e.id}`,
          date: e.sinavTarihi as string,
          title: `${e.denemeTipi || "Deneme"} — Net: ${(e.tytToplamNet || 0).toFixed(1)}`,
          type: "exam" as const,
          color: TYPE_CONFIG.exam.color,
        }));

      setEvents([...calEvents, ...examEvents]);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const grid = useMemo(() => getMonthGrid(currentYear, currentMonth), [currentYear, currentMonth]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const ev of events) {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    }
    return map;
  }, [events]);

  const selectedEvents = selectedDate ? (eventsByDate[selectedDate] ?? []) : [];

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  };

  const handleAddEvent = async () => {
    if (!user || !selectedDate || !formTitle.trim()) return;
    setSaving(true);
    try {
      const evData = {
        date: selectedDate,
        title: formTitle.trim(),
        type: formType,
        color: TYPE_CONFIG[formType].color,
        notes: formNotes,
        durationMinutes: formDuration,
        createdAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, "users", user.uid, "calendarEvents"), evData);
      setEvents((prev) => [...prev, { id: docRef.id, ...evData }]);
      setFormTitle("");
      setFormNotes("");
      setFormDuration(60);
      setShowAddForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!user || eventId.startsWith("exam-")) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "calendarEvents", eventId));
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch {}
  };

  const todayStr = toYMD(today);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" /> Takvim
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Çalışma planı ve etkinlik takibi
          </p>
        </div>
        {selectedDate && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" /> Etkinlik Ekle
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          {/* Month navigation */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800">
            {WEEKDAY_LABELS.map((d) => (
              <div key={d} className="py-2.5 text-center text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7">
            {grid.map((day, idx) => {
              if (!day) {
                return <div key={`empty-${idx}`} className="min-h-[68px] border-b border-r border-slate-50 dark:border-slate-800/50" />;
              }
              const ymd = toYMD(day);
              const dayEvents = eventsByDate[ymd] ?? [];
              const isToday = ymd === todayStr;
              const isSelected = ymd === selectedDate;
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;

              return (
                <button
                  key={ymd}
                  onClick={() => setSelectedDate(ymd === selectedDate ? null : ymd)}
                  className={`min-h-[68px] p-1.5 text-left border-b border-r border-slate-50 dark:border-slate-800/50 transition-colors group ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-950/40"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <span
                    className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-semibold mb-1 ${
                      isToday
                        ? "bg-blue-600 text-white"
                        : isSelected
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        : isWeekend
                        ? "text-slate-400 dark:text-slate-500"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className={`h-1.5 rounded-full ${ev.color} opacity-80`}
                        title={ev.title}
                      />
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-slate-400">+{dayEvents.length - 2}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 px-5 py-3 border-t border-slate-100 dark:border-slate-800">
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className={`w-2.5 h-2.5 rounded-full ${cfg.color}`} />
                {cfg.label}
              </div>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-3">
          {/* Selected date panel */}
          {selectedDate ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {parseDateLocal(selectedDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" })}
                </h3>
                <button onClick={() => setSelectedDate(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {showAddForm ? (
                <div className="p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Yeni Etkinlik</h4>
                  <input
                    type="text"
                    placeholder="Başlık"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                  <div className="flex gap-1.5">
                    {(["study", "exam", "goal"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setFormType(t)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${formType === t ? `${TYPE_CONFIG[t].color} text-white` : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
                      >
                        {TYPE_CONFIG[t].label}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Süre (dakika)</label>
                    <input
                      type="number"
                      min={5}
                      max={480}
                      value={formDuration}
                      onChange={(e) => setFormDuration(parseInt(e.target.value) || 60)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                  <textarea
                    placeholder="Not (isteğe bağlı)"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddEvent}
                      disabled={!formTitle.trim() || saving}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all"
                    >
                      {saving ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  {selectedEvents.length === 0 ? (
                    <div className="text-center py-6">
                      <CalendarDays className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                      <p className="text-sm text-slate-400 dark:text-slate-500">Bu gün için etkinlik yok</p>
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="mt-3 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium mx-auto hover:underline"
                      >
                        <Plus className="w-3.5 h-3.5" /> Ekle
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedEvents.map((ev) => {
                        const cfg = TYPE_CONFIG[ev.type];
                        return (
                          <div key={ev.id} className={`rounded-xl border ${cfg.border} ${cfg.bg} p-3`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 min-w-0">
                                <span className={`mt-0.5 shrink-0 ${cfg.textColor}`}>
                                  {ev.type === "exam" ? <ClipboardList className="w-4 h-4" /> : ev.type === "goal" ? <Target className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                                </span>
                                <div className="min-w-0">
                                  <p className={`text-sm font-medium ${cfg.textColor} truncate`}>{ev.title}</p>
                                  {ev.durationMinutes && ev.type !== "exam" && (
                                    <p className="text-[11px] text-slate-400 mt-0.5">{ev.durationMinutes} dakika</p>
                                  )}
                                  {ev.notes && <p className="text-[11px] text-slate-400 mt-0.5">{ev.notes}</p>}
                                </div>
                              </div>
                              {!ev.id.startsWith("exam-") && (
                                <button
                                  onClick={() => handleDeleteEvent(ev.id)}
                                  className="text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors shrink-0"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="w-full py-2 border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 text-xs rounded-xl hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Etkinlik Ekle
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center">
              <CalendarDays className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Bir gün seçin</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Etkinlik eklemek veya görmek için takvimde bir güne tıklayın.</p>
            </div>
          )}

          {/* This month stats */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {MONTH_NAMES[currentMonth]} Özeti
            </h3>
            {(() => {
              const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
              const monthEvents = events.filter((e) => e.date.startsWith(monthPrefix));
              const counts = {
                study: monthEvents.filter((e) => e.type === "study").length,
                exam: monthEvents.filter((e) => e.type === "exam").length,
                goal: monthEvents.filter((e) => e.type === "goal").length,
              };
              return (
                <div className="space-y-2">
                  {(["study", "exam", "goal"] as const).map((type) => {
                    const cfg = TYPE_CONFIG[type];
                    return (
                      <div key={type} className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${cfg.color} shrink-0`} />
                        <span className="text-sm text-slate-600 dark:text-slate-400 flex-1">{cfg.label}</span>
                        <span className={`text-sm font-semibold ${cfg.textColor}`}>{counts[type]}</span>
                      </div>
                    );
                  })}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Toplam Etkinlik</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">{monthEvents.length}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="text-center text-xs text-slate-400 py-2">
              <div className="inline-block w-4 h-4 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
