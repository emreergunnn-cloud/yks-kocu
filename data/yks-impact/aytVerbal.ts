import type {
  ExamImpactDefinition,
} from "@/types/examImpact";

export const AYT_VERBAL_EXAM_IMPACT:
  ExamImpactDefinition[] = [
  {
    topicId: "ae_divan",
    riskLevel: "high",
    expectedQuestions: {
      min: 2,
      max: 4,
    },
    reason:
      "Divan Edebiyatı geniş bilgi alanı ve yazar-eser bağlantıları nedeniyle yüksek risk taşır.",
  },
  {
    topicId: "ae_cumhuriyet_siir",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 3,
    },
    reason:
      "Cumhuriyet dönemi şiiri yoğun sanatçı-eser ve anlayış bilgisi gerektirir.",
  },
  {
    topicId: "ae_cumhuriyet_roman",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 3,
    },
    reason:
      "Cumhuriyet dönemi roman ve hikâyesi yoğun sanatçı-eser eşleştirmesi içerir.",
  },
  {
    topicId: "ae_islam_oncesi",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 2,
    },
    reason:
      "İslamiyet öncesi edebiyat ve destan bilgisi ayrıntı gerektiren alanlardandır.",
  },
  {
    topicId: "ae_gecis",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 2,
    },
    reason:
      "Geçiş dönemi eser ve özelliklerinin karıştırılması sık hata riskine yol açar.",
  },
];