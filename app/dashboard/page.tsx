"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

import { AppLayout } from "../../components/layout/AppLayout";

import { getExamResults } from "../../services/examService";
import { computeAnalyticsSummary } from "../../services/analyticsService";
import { getTopicProgress, SubjectProgressMap } from "../../services/topicService";
import { ensureDailyNotifications } from "../../services/notificationService";
import { generateCoachReport } from "../../services/coachEngine";
import { getRecentStudySessions, StudySession } from "../../services/studyService";
import { getAllMasteries, MasteryResult } from "../../services/masteryEngine";
import { useStreak } from "../../hooks/useStreak";

import { ExamResult } from "../../types/exam";

import { YKS_SUBJECTS } from "../../lib/constants/subjects";

import { YksCountdown } from "../../components/analytics/YksCountdown";

import { WelcomeSection } from "../../components/dashboard/WelcomeSection";
import { StreakCard } from "../../components/dashboard/StreakCard";
import { QuickStats } from "../../components/dashboard/QuickStats";
import { RankingCalculatorBanner } from "../../components/dashboard/RankingCalculatorBanner";
import { AnalyticsCharts } from "../../components/dashboard/AnalyticsCharts";
import { GoalSection } from "../../components/dashboard/GoalSection";
import { RecentExams } from "../../components/dashboard/RecentExams";
import { CoachReport } from "../../components/dashboard/CoachReport";
import { ManifestQuoteCard } from "../../components/dashboard/ManifestQuoteCard";

import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export default function DashboardPage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();

  const [exams, setExams] = useState<ExamResult[]>([]);
  const [progressMap, setProgressMap] = useState<SubjectProgressMap>({});
  const [recentStudySessions, setRecentStudySessions] = useState<StudySession[]>([]);
  const { streak } = useStreak();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!userProfile) return;

  if (userProfile.onboardingCompleted === false) {
    router.replace("/onboarding");
  }
}, [userProfile, router]);

  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);

    Promise.all([
      getExamResults(user.uid),
      getTopicProgress(user.uid),
      getRecentStudySessions(user.uid),
    ])
      .then(([data, pm, sessions]) => {
        setExams(data);
        setProgressMap(pm);
        setRecentStudySessions(sessions);

        const completed = YKS_SUBJECTS.reduce(
          (acc, subject) =>
            acc +
            subject.topics.filter(
              (topic) =>
                pm[subject.id]?.[topic.id] === "Tamamlandı"
            ).length,
          0
        );

        ensureDailyNotifications(
          user.uid,
          completed,
          data.length
        ).catch(() => {});
      })
      .catch((error) => {
        console.error(
          "Dashboard verileri yüklenirken hata oluştu:",
          error
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  const summary = useMemo(() => {
    return computeAnalyticsSummary(
      exams,
      userProfile
    );
  }, [exams, userProfile]);

  const recentExams = useMemo(() => {
    return exams.slice(0, 3);
  }, [exams]);

  const coachReport = useMemo(() => {
    if (!userProfile) return null;

    return generateCoachReport(
      userProfile,
      exams,
      progressMap,
      streak,
      recentStudySessions
    );
  }, [userProfile, exams, progressMap, streak, recentStudySessions]);

  const masteries = useMemo(() => {
    return getAllMasteries(progressMap, exams, recentStudySessions);
  }, [progressMap, exams, recentStudySessions]);

  if (loading && !userProfile) {
    return (
      <AppLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <LoadingSpinner />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Welcome */}
        <WelcomeSection
          user={user}
          userProfile={userProfile}
        />

        {/* 1. YKS Countdown */}
        <YksCountdown />

        {/* 2. Manifest Quote */}
        <ManifestQuoteCard />

        {/* 3. Streak */}
        <StreakCard />

        {/* 4. Coach */}
        {coachReport && (
          <CoachReport
            report={coachReport}
          />
        )}

        {/* 5. Quick Statistics / Analytics / Recent Exams */}
        <QuickStats
          totalExams={summary.totalExams}
          avgTytNet={summary.avgTytNet}
          avgAytNet={summary.avgAytNet}
          avgToplamNet={summary.avgToplamNet}
          maxTytNet={summary.maxTytNet}
          maxAytNet={summary.maxAytNet}
        />

        <RankingCalculatorBanner />

        <AnalyticsCharts
          loading={loading}
          trendData={summary.trendData}
          sectionAverages={summary.sectionAverages}
          targetProgressPercentage={
            summary.targetProgressPercentage
          }
          estimatedTargetNet={
            summary.estimatedTargetNet
          }
          maxTytNet={summary.maxTytNet}
          maxAytNet={summary.maxAytNet}
        />

        <RecentExams
          loading={loading}
          exams={recentExams}
          totalExams={exams.length}
        />

        {/* 6. Goals (Konu İlerlemesi) */}
        <GoalSection masteries={masteries} />

      </div>
    </AppLayout>
  );
}