"use client";

import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../../context/AuthContext";

import { AppLayout } from "../../components/layout/AppLayout";

import { getExamResults } from "../../services/examService";
import { computeAnalyticsSummary } from "../../services/analyticsService";
import { getTopicProgress } from "../../services/topicService";
import { ensureDailyNotifications } from "../../services/notificationService";
import { generateCoachReport } from "../../services/coachEngine";

import { ExamResult } from "../../types/exam";

import { YKS_SUBJECTS } from "../../lib/constants/subjects";

import { YksCountdown } from "../../components/analytics/YksCountdown";

import { WelcomeSection } from "../../components/dashboard/WelcomeSection";
import { QuickStats } from "../../components/dashboard/QuickStats";
import { RankingCalculatorBanner } from "../../components/dashboard/RankingCalculatorBanner";
import { AnalyticsCharts } from "../../components/dashboard/AnalyticsCharts";
import { GoalSection } from "../../components/dashboard/GoalSection";
import { RecentExams } from "../../components/dashboard/RecentExams";
import { CoachReport } from "../../components/dashboard/CoachReport";

import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export default function DashboardPage() {
  const { user, userProfile } = useAuth();

  const [exams, setExams] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userProfile) return;

    if (!userProfile.onboardingCompleted) {
      window.location.href = "/onboarding";
    }
  }, [userProfile]);

  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);

    Promise.all([
      getExamResults(user.uid),
      getTopicProgress(user.uid),
    ])
      .then(([data, progressMap]) => {
        setExams(data);

        const completed = YKS_SUBJECTS.reduce(
          (acc, subject) =>
            acc +
            subject.topics.filter(
              (topic) =>
                progressMap[subject.id]?.[topic.id] === "Tamamlandı"
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
      exams
    );
  }, [userProfile, exams]);

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

        {/* YKS Countdown */}
        <YksCountdown
          daysRemaining={summary.daysRemainingToYks}
        />

        {/* Quick Statistics */}
        <QuickStats
          totalExams={summary.totalExams}
          avgTytNet={summary.avgTytNet}
          avgAytNet={summary.avgAytNet}
          avgToplamNet={summary.avgToplamNet}
          maxTytNet={summary.maxTytNet}
          maxAytNet={summary.maxAytNet}
        />

        {/* Ranking Calculator */}
        <RankingCalculatorBanner />

        {/* Analytics */}
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

        {/* Goals */}
        <GoalSection />

        {/* Recent Exams */}
        <RecentExams
          loading={loading}
          exams={recentExams}
          totalExams={exams.length}
        />

        {/* Coach */}
        {coachReport && (
          <CoachReport
            report={coachReport}
          />
        )}

      </div>
    </AppLayout>
  );
}