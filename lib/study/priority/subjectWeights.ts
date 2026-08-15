import type {
  AlanOption,
} from "@/types/user";

interface WeightDefinition {
  questions: number;

  weights:
    Partial<
      Record<AlanOption, number>
    >;
}

const ALL_TYT_TRACKS = {
  Sayısal: 0,
  "Eşit Ağırlık": 0,
  Sözel: 0,
  Dil: 0,
} satisfies Record<
  AlanOption,
  number
>;

const SUBJECT_WEIGHTS:
  Record<string, WeightDefinition> = {
  tyt_turkce: {
    questions: 40,
    weights: {
      ...ALL_TYT_TRACKS,
      Sayısal: 13.2,
      "Eşit Ağırlık": 13.2,
      Sözel: 13.2,
      Dil: 13.2,
    },
  },

  tyt_sosyal: {
    questions: 20,
    weights: {
      ...ALL_TYT_TRACKS,
      Sayısal: 6.8,
      "Eşit Ağırlık": 6.8,
      Sözel: 6.8,
      Dil: 6.8,
    },
  },

  tyt_matematik: {
    questions: 40,
    weights: {
      ...ALL_TYT_TRACKS,
      Sayısal: 13.2,
      "Eşit Ağırlık": 13.2,
      Sözel: 13.2,
      Dil: 13.2,
    },
  },

  tyt_fen: {
    questions: 20,
    weights: {
      ...ALL_TYT_TRACKS,
      Sayısal: 6.8,
      "Eşit Ağırlık": 6.8,
      Sözel: 6.8,
      Dil: 6.8,
    },
  },

  ayt_matematik: {
    questions: 40,
    weights: {
      Sayısal: 30,
      "Eşit Ağırlık": 30,
    },
  },

  ayt_fizik: {
    questions: 14,
    weights: {
      Sayısal: 10,
    },
  },

  ayt_kimya: {
    questions: 13,
    weights: {
      Sayısal: 10,
    },
  },

  ayt_biyoloji: {
    questions: 13,
    weights: {
      Sayısal: 10,
    },
  },

  ayt_edebiyat: {
    questions: 24,
    weights: {
      "Eşit Ağırlık": 18,
      Sözel: 18,
    },
  },

  ayt_tarih1: {
    questions: 10,
    weights: {
      "Eşit Ağırlık": 7,
      Sözel: 7,
    },
  },

  ayt_cografya1: {
    questions: 6,
    weights: {
      "Eşit Ağırlık": 5,
      Sözel: 5,
    },
  },

  ayt_tarih2: {
    questions: 11,
    weights: {
      Sözel: 8,
    },
  },

  ayt_cografya2: {
    questions: 11,
    weights: {
      Sözel: 8,
    },
  },

  ayt_felsefe: {
    questions: 12,
    weights: {
      Sözel: 9,
    },
  },

  ayt_din: {
    questions: 6,
    weights: {
      Sözel: 5,
    },
  },
};

export function getSubjectWeight(
  subjectId: string,
  alan: AlanOption | ""
) {
  if (!alan) {
    return null;
  }

  const definition =
    SUBJECT_WEIGHTS[subjectId];

  if (!definition) {
    return null;
  }

  const weight =
    definition.weights[alan];

  if (!weight) {
    return null;
  }

  return {
    questions:
      definition.questions,
    weight,
  };
}