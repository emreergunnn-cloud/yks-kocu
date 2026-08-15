import type {
  ExamImpactDefinition,
} from "@/types/examImpact";

export const AYT_SAYISAL_EXAM_IMPACT:
  ExamImpactDefinition[] = [
  {
    topicId: "af_atislar",
    riskLevel: "very-high",
    expectedQuestions: {
      min: 1,
      max: 1,
    },
    reason:
      "2026 AYT Fizikte atışlar seçiciliği yüksek başlıklardan biri olarak değerlendirildi.",
  },
  {
    topicId: "af_cembersel",
    riskLevel: "very-high",
    expectedQuestions: {
      min: 1,
      max: 1,
    },
    reason:
      "2026 AYT Fizikte çembersel hareket belirleyici ve zorlayıcı konular arasında yer aldı.",
  },
  {
    topicId: "af_induksiyon",
    riskLevel: "very-high",
    expectedQuestions: {
      min: 1,
      max: 1,
    },
    reason:
      "Manyetik akı ve indüksiyon 2026 AYT Fizikte seçici başlıklar arasında değerlendirildi.",
  },
  {
    topicId: "af_elektrik",
    riskLevel: "very-high",
    expectedQuestions: {
      min: 1,
      max: 1,
    },
    reason:
      "Elektrik alan soruları formülün yanında fiziksel yorum gerektirdiği için yüksek risklidir.",
  },
  {
    topicId: "af_enerji",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 1,
    },
    reason:
      "İş ve enerji 2026 AYT Fizikte belirleyici konular arasında değerlendirildi.",
  },
  {
    topicId: "af_manyetik",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 1,
    },
    reason:
      "Manyetizma yön ve vektör ilişkileri nedeniyle yüksek kavram hatası riski taşır.",
  },
  {
    topicId: "af_modern",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 2,
    },
    reason:
      "Modern fizik düzenli soru alan ve kavramsal yorum gerektiren AYT Fizik alanlarındandır.",
  },

  {
    topicId: "ak_elektrik",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 2,
    },
    reason:
      "Kimya ve Elektrik geçmiş sınavlarda yoğun soru alan AYT Kimya başlıklarındandır.",
  },
  {
    topicId: "ak_organik",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 2,
    },
    reason:
      "Organik Kimya geçmiş AYT sınavlarında soru yoğunluğu yüksek alanlardan biridir.",
  },
  {
    topicId: "ak_denge",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 2,
    },
    reason:
      "Kimyasal denge işlem ve kavram bilgisini birlikte gerektiren kritik AYT konularındandır.",
  },
  {
    topicId: "ak_cozelti",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 1,
    },
    reason:
      "Sıvı çözeltiler hesaplama ve kavram bilgisini birlikte ölçer.",
  },

  {
    topicId: "ab_nukleik",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 1,
    },
    reason:
      "Nükleik asitler geçmiş AYT'lerde düzenli soru alan biyoloji konularındandır.",
  },
  {
    topicId: "ab_genetik",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 2,
    },
    reason:
      "Genetik şifre ve protein sentezi AYT Biyolojide yüksek soru yoğunluğuna sahiptir.",
  },
  {
    topicId: "ab_dolasim",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 1,
    },
    reason:
      "Dolaşım sistemi geçmiş AYT sınavlarında düzenli soru alan sistem konularındandır.",
  },
  {
    topicId: "ab_hucresel_solunum",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 1,
    },
    reason:
      "Hücresel solunum geçmiş AYT sınavlarında düzenli ölçülen biyoloji konularındandır.",
  },
  {
    topicId: "ab_bitki",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 2,
    },
    reason:
      "Bitki biyolojisi geçmiş AYT sınavlarında en yüksek soru yoğunluğuna sahip biyoloji alanlarındandır.",
  },

  {
    topicId: "am_trigonometri",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 2,
    },
    reason:
      "Trigonometri AYT Matematiğin temel ve bağlantılı konularından biridir.",
  },
  {
    topicId: "am_turev",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 2,
    },
    reason:
      "Türev düzenli soru alan ve sonraki matematik kazanımlarıyla bağlantılı kritik bir konudur.",
  },
  {
    topicId: "am_integral",
    riskLevel: "high",
    expectedQuestions: {
      min: 1,
      max: 2,
    },
    reason:
      "İntegral AYT Matematikte düzenli ölçülen ve işlem hatasına açık temel başlıklardandır.",
  },
];