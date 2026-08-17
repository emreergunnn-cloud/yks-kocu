import {
  computeAnalyticsSummary,
} from "@/services/analyticsService";

import {
  Card,
} from "@/components/ui/Card";

import {
  TrendLineChart,
} from "./TrendLineChart";

import {
  SectionBarChart,
} from "./SectionBarChart";

import {
  AnalyticsGoalCard,
} from "./AnalyticsGoalCard";

type Summary =
  ReturnType<
    typeof computeAnalyticsSummary
  >;

interface Props {
  summary: Summary;

  targetRanking?:
    string | number | null;

  targetDepartment?:
    string | null;
}

export function AnalyticsCharts({
  summary,
  targetRanking,
  targetDepartment,
}: Props) {
  return (
    <>
      <Card className="space-y-4">
        <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Zaman İçindeki Net Değişim Analizi
          </h3>

          <p className="text-xs text-slate-500">
            Mavi: TYT Netleri ·
            Mor: AYT Netleri
          </p>
        </div>

        <TrendLineChart
          data={summary.trendData}
        />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="space-y-4 lg:col-span-2">
          <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Ders Bazlı Başarı Yüzdeleri
            </h3>

            <p className="text-xs text-slate-500">
              Derslere göre ortalama
              performansın.
            </p>
          </div>

          <SectionBarChart
            data={
              summary.sectionAverages
            }
          />
        </Card>

        <AnalyticsGoalCard
          percentage={
            summary
              .targetProgressPercentage
          }
          targetRanking={
            targetRanking
          }
          targetDepartment={
            targetDepartment
          }
        />
      </div>
    </>
  );
}