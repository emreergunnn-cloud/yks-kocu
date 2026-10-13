"use client";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PremiumGate } from "@/components/premium/PremiumGate";
import { isSchoolGrade } from "@/lib/constants/curriculum/config";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { AnalyticsGapsSection } from "./gaps/AnalyticsGapsSection";
import { useAnalyticsPageData } from "./hooks/useAnalyticsPageData";
import { PremiumAnalyticsLocked } from "./premium/PremiumAnalyticsLocked";
import { YksAdvancedAnalytics } from "./premium/YksAdvancedAnalytics";
import { SchoolAnalyticsOverview } from "./school/SchoolAnalyticsOverview";

export function AnalyticsOverview() {
  const analytics = useAnalyticsPageData();
  if (!analytics.userProfile || analytics.loading) {
    return <LoadingSpinner text="İstatistikler hesaplanıyor..." />;
  }

  const schoolMode = isSchoolGrade(analytics.userProfile.sinif);

  return (
    <>
      {schoolMode ? (
        <SchoolAnalyticsOverview uid={analytics.uid} profile={analytics.userProfile} />
      ) : (
        <>
          <AnalyticsCharts
            summary={analytics.summary}
            targetRanking={analytics.userProfile.hedefSiralama}
            targetDepartment={analytics.userProfile.hedefBolum}
          />
          <PremiumGate feature="advanced_analytics" fallback={<PremiumAnalyticsLocked />}>
            <YksAdvancedAnalytics exams={analytics.exams} profile={analytics.userProfile} />
          </PremiumGate>
        </>
      )}
      <AnalyticsGapsSection uid={analytics.uid} />
    </>
  );
}
