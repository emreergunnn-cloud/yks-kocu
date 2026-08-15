import type {
  BookResource,
} from "@/types/recommendation";

export const AYT_BOOKS: BookResource[] = [
  {
    id: "rm-ayt-math",
    title: "65 GÜNDE AYT MATEMATİK",
    publisher: "Rehber Matematik",
    exam: "AYT",
    subject: "mathematics",
    levels: ["beginner"],
    kind: "video-book",
  },
  {
    id: "345-ayt-math",
    title: "AYT Matematik Soru Bankası",
    publisher: "Üç Dört Beş",
    exam: "AYT",
    subject: "mathematics",
    levels: ["intermediate"],
    kind: "question-bank",
  },
  {
    id: "3d-ayt-math",
    title: "AYT 3D Matematik Soru Bankası",
    publisher: "3D Yayınları",
    exam: "AYT",
    subject: "mathematics",
    levels: ["advanced"],
    kind: "question-bank",
  },

  ...[
    ["physics", "Fizik"],
    ["chemistry", "Kimya"],
    ["biology", "Biyoloji"],
    ["literature", "Edebiyat"],
  ].flatMap(([subject, label]) => [
    {
      id: `345-ayt-${subject}`,
      title:
        subject === "chemistry" || subject === "biology"
          ? `AYT ${label} Konu Özetli Soru Bankası`
          : `AYT ${label} Soru Bankası`,
      publisher: "Üç Dört Beş",
      exam: "AYT" as const,
      subject: subject as BookResource["subject"],
      levels: ["beginner", "intermediate"] as BookResource["levels"],
      kind: "question-bank" as const,
    },
    {
      id: `3d-ayt-${subject}`,
      title: `AYT 3D ${label} Soru Bankası`,
      publisher: "3D Yayınları",
      exam: "AYT" as const,
      subject: subject as BookResource["subject"],
      levels: ["advanced"] as BookResource["levels"],
      kind: "question-bank" as const,
    },
  ]),

  {
    id: "3d-ayt-history",
    title: "AYT 3D Tarih Soru Bankası",
    publisher: "3D Yayınları",
    exam: "AYT",
    subject: "history",
    levels: ["beginner", "intermediate", "advanced"],
    kind: "question-bank",
  },
  {
    id: "3d-ayt-geography",
    title: "AYT 3D Coğrafya Soru Bankası",
    publisher: "3D Yayınları",
    exam: "AYT",
    subject: "geography",
    levels: ["beginner", "intermediate", "advanced"],
    kind: "question-bank",
  },
];