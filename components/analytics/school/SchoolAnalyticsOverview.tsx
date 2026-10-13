"use client";

import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { UserProfile } from "@/types/user";
import { SchoolSubjectProgress } from "./SchoolSubjectProgress";
import { useSchoolAnalytics } from "./useSchoolAnalytics";

interface Props {
  uid: string | null;
  profile: UserProfile;
}

export function SchoolAnalyticsOverview({ uid, profile }: Props) {
  const { loading, studyStats, summary } = useSchoolAnalytics(uid, profile);
  if (loading) return <LoadingSpinner text="İstatistikler hesaplanıyor..." />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric label="Çalışılan Konu" value={`${summary.studied}/${summary.total}`} />
        <Metric label="Tamamlanan" value={summary.completed} />
        <Metric label="Tekrar Gereken" value={summary.review} />
        <Metric label="Bu Hafta" value={`${Math.round(studyStats.weekMinutes / 60 * 10) / 10} sa`} />
      </div>

      <Card className="space-y-4">
        <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Ders Bazlı İlerleme</h3>
          <p className="mt-1 text-xs text-slate-500">Çalışıldı ve tamamlandı durumundaki konular ilerlemeye dahil edilir.</p>
        </div>
        <SchoolSubjectProgress subjects={summary.subjects} />
      </Card>

      <Card className="grid grid-cols-3 gap-3 text-center">
        <StudyMetric label="Bugün" minutes={studyStats.todayMinutes} sessions={studyStats.todaySessions} />
        <StudyMetric label="Bu Hafta" minutes={studyStats.weekMinutes} sessions={studyStats.weekSessions} />
        <StudyMetric label="Bu Ay" minutes={studyStats.monthMinutes} sessions={studyStats.monthSessions} />
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <Card className="p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{value}</p></Card>;
}

function StudyMetric({ label, minutes, sessions }: { label: string; minutes: number; sessions: number }) {
  const hours = Math.round(minutes / 60 * 10) / 10;
  return <div><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-lg font-black">{hours} sa</p><p className="text-[10px] text-slate-400">{sessions} seans</p></div>;
}
