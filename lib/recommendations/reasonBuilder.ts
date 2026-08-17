import type {
  NetTrend,
  RecommendationExam,
} from "@/types/recommendation";

interface Options {
  trend:
    NetTrend;

  exam:
    RecommendationExam;

  examCount: number;

  hasBaseline: boolean;
}

export function buildRecommendationReason({
  trend,
  exam,
  examCount,
  hasBaseline,
}: Options) {
  if (examCount === 0) {
    return noExamReason(
      trend,
      exam,
      hasBaseline
    );
  }

  const change =
    trend.delta > 0
      ? `+${trend.delta.toFixed(1)}`
      : trend.delta.toFixed(1);

  const baselineText =
    hasBaseline
      ? `Kayıttaki başlangıç seviyene göre ${change} net değişim var.`
      : `Kayıtlı denemelerine göre net değişimin ${change}.`;

  return (
    `${baselineText} ` +
    `Hedefine yaklaşık ${trend.gap.toFixed(1)} net kaldı. ` +
    "Kaynak seviyesi son denemelerindeki ders performansına göre seçildi."
  );
}

function noExamReason(
  trend: NetTrend,
  exam: RecommendationExam,
  hasBaseline: boolean
) {
  if (hasBaseline) {
    return (
      `Henüz yeni ${exam} denemesi bulunmuyor. ` +
      `Kayıtta verdiğin ${trend.initial.toFixed(1)} net başlangıç seviyesi olarak kullanıldı.`
    );
  }

  return (
    `Henüz ${exam} deneme verisi bulunmuyor. ` +
    "Kaynak seviyesi başlangıç düzeyinden oluşturuldu."
  );
}