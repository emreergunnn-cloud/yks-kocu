"use client";

import {
  LoadingSpinner,
} from "@/components/ui/LoadingSpinner";

import {
  AnalyticsCharts,
} from "./AnalyticsCharts";

import {
  AnalyticsGapsSection,
} from "./gaps/AnalyticsGapsSection";

import {
  useAnalyticsPageData,
} from "./hooks/useAnalyticsPageData";

export function AnalyticsOverview() {
  const analytics =
    useAnalyticsPageData();

  if (analytics.loading) {
    return (
      <LoadingSpinner text="İstatistikler hesaplanıyor..." />
    );
  }

  return (
    <>
      <AnalyticsCharts
        summary={
          analytics.summary
        }
        targetRanking={
          analytics.userProfile
            ?.hedefSiralama
        }
        targetDepartment={
          analytics.userProfile
            ?.hedefBolum
        }
      />

      <AnalyticsGapsSection
        uid={analytics.uid}
      />
    </>
  );
}