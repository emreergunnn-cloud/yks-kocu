import type {
  ExamImpactDefinition,
} from "@/types/examImpact";

export const TYT_EXAM_IMPACT:
  ExamImpactDefinition[] = [
  {
    topicId: "tt_paragrafta_anlam",
    riskLevel: "very-high",
    expectedQuestions: {
      min: 8,
      max: 12,
    },
    reason:
      "TYT Türkçede paragraf soruları süre ve çeldirici yönetimi açısından yüksek risk taşır.",
  },

  {
    topicId: "tm_sayi_problem",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 2,
    },
    reason:
      "Problem soruları TYT Matematikte yorum ve modelleme becerisini yoğun biçimde ölçer.",
  },
  {
    topicId: "tm_hareket_problem",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 2,
    },
    reason:
      "Hareket problemleri çok adımlı denklem kurmayı gerektirdiği için hata riski yüksektir.",
  },
  {
    topicId: "tm_isci_havuz",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 1,
    },
    reason:
      "İşçi-havuz problemleri oran ve denklem kurma hatalarına açıktır.",
  },
  {
    topicId: "tm_yuzde_kar",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 2,
    },
    reason:
      "Yüzde ve kâr-zarar soruları işlemden çok doğru matematiksel model kurmayı gerektirir.",
  },
  {
    topicId: "tm_karisim",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 1,
    },
    reason:
      "Karışım problemleri oran ve denklem bağlantısı nedeniyle sık hata yapılan problem türlerindendir.",
  },

  {
    topicId: "tf_fizik_hareket",
    riskLevel: "medium",
    expectedQuestions: {
      min: 1,
      max: 1,
    },
    reason:
      "Hareket ve kuvvet fizik sorularının temelini oluşturur; kavram yanılgısı sonraki konuları da etkiler.",
  },
  {
    topicId: "tf_fizik_elektrik",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 1,
    },
    reason:
      "Elektrik soruları kavramsal ilişki kurmayı gerektirdiğinden yüksek hata riski taşır.",
  },
  {
    topicId: "tf_fizik_optik",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 1,
    },
    reason:
      "Optikte görüntü ve ışın yorumları öğrencilerin sık kavram hatası yaptığı alanlardandır.",
  },
];