"use client";

import {
  AppLayout,
} from "@/components/layout/AppLayout";

import {
  AnalyticsHeader,
} from "@/components/analytics/AnalyticsHeader";

import {
  AnalyticsOverview,
} from "@/components/analytics/AnalyticsOverview";

export default function AnalyticsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <AnalyticsHeader />

        <AnalyticsOverview />
      </div>
    </AppLayout>
  );
}