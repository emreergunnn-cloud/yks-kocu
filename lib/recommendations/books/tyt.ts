import type {
  BookResource,
} from "@/types/recommendation";

export const TYT_BOOKS: BookResource[] = [
  {
    id: "rm-zero-math",
    title: "0 DAN MATEMATİK",
    publisher: "Rehber Matematik",
    exam: "TYT",
    subject: "mathematics",
    levels: ["beginner"],
    kind: "video-book",
  },
  {
    id: "345-tyt-math",
    title: "TYT Matematik Soru Bankası",
    publisher: "Üç Dört Beş",
    exam: "TYT",
    subject: "mathematics",
    levels: ["intermediate"],
    kind: "question-bank",
  },
  {
    id: "3d-tyt-math",
    title: "TYT 3D Matematik Soru Bankası",
    publisher: "3D Yayınları",
    exam: "TYT",
    subject: "mathematics",
    levels: ["advanced"],
    kind: "question-bank",
  },

  ...[
    ["turkish", "Türkçe"],
    ["physics", "Fizik"],
    ["chemistry", "Kimya"],
    ["biology", "Biyoloji"],
  ].flatMap(([subject, label]) => [
    {
      id: `345-tyt-${subject}`,
      title: `TYT ${label} Soru Bankası`,
      publisher: "Üç Dört Beş",
      exam: "TYT" as const,
      subject: subject as BookResource["subject"],
      levels: ["beginner", "intermediate"] as BookResource["levels"],
      kind: "question-bank" as const,
    },
    {
      id: `3d-tyt-${subject}`,
      title: `TYT 3D ${label} Soru Bankası`,
      publisher: "3D Yayınları",
      exam: "TYT" as const,
      subject: subject as BookResource["subject"],
      levels: ["advanced"] as BookResource["levels"],
      kind: "question-bank" as const,
    },
  ]),

  {
    id: "345-tyt-geography",
    title: "TYT Coğrafya Soru Bankası",
    publisher: "Üç Dört Beş",
    exam: "TYT",
    subject: "geography",
    levels: ["beginner", "intermediate"],
    kind: "question-bank",
  },
  {
    id: "3d-tyt-geography",
    title: "TYT 3D Coğrafya Soru Bankası",
    publisher: "3D Yayınları",
    exam: "TYT",
    subject: "geography",
    levels: ["advanced"],
    kind: "question-bank",
  },
  {
    id: "3d-tyt-history",
    title: "TYT 3D Tarih Soru Bankası",
    publisher: "3D Yayınları",
    exam: "TYT",
    subject: "history",
    levels: ["beginner", "intermediate", "advanced"],
    kind: "question-bank",
  },
];