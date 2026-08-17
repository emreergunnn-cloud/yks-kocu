"use client";

import {
  Card,
} from "@/components/ui/Card";

import {
  GapSummary,
} from "./GapSummary";

import {
  HomeworkGapList,
} from "./HomeworkGapList";

import {
  TopicGapList,
} from "./TopicGapList";

import {
  useAnalyticsGaps,
} from "./useAnalyticsGaps";

interface Props {
  uid:
    string | null;
}

export function AnalyticsGapsSection({
  uid,
}: Props) {
  const {
    gaps,
    loading,
  } =
    useAnalyticsGaps(uid);

  return (
    <Card className="space-y-5">
      <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Eksikler ve Takviye
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Tamamlanmamış
          ödevlerin ve tekrar
          gerektiren konuların.
        </p>
      </div>

      {loading ? (
        <p className="py-6 text-center text-xs text-slate-400">
          Eksikler
          hesaplanıyor...
        </p>
      ) : (
        <>
          <GapSummary
            gaps={gaps}
          />

          <GapGroup
            title="Eksik Ödevler"
            description="Bitiremediğin sorular sonraki çalışma planında öncelikli olarak tekrar gelir."
          >
            <HomeworkGapList
              gaps={
                gaps.homework
              }
            />
          </GapGroup>

          <GapGroup
            title="Konu Eksikleri"
            description="Ödev tamamlanmış olsa bile başarı seviyesi düşük kalan konular."
          >
            <TopicGapList
              gaps={
                gaps.topics
              }
            />
          </GapGroup>
        </>
      )}
    </Card>
  );
}

function GapGroup({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children:
    React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          {title}
        </h4>

        <p className="mt-0.5 text-[11px] text-slate-500">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}