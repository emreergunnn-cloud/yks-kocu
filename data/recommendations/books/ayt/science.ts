import type {
  BookResource,
} from "@/types/recommendation";

export const AYT_SCIENCE_BOOKS: BookResource[] = [
  {
    id: "345-ayt-physics",
    title: "AYT Fizik Soru Bankası",
    publisher: "Üç Dört Beş",
    exam: "AYT",
    subject: "physics",
    levels: [
      "beginner",
      "intermediate",
    ],
    kind: "question-bank",
  },
  {
    id: "3d-ayt-physics",
    title: "AYT 3D Fizik Soru Bankası",
    publisher: "3D Yayınları",
    exam: "AYT",
    subject: "physics",
    levels: ["advanced"],
    kind: "question-bank",
  },
  {
    id: "345-ayt-chemistry",
    title: "AYT Kimya Konu Özetli Soru Bankası",
    publisher: "Üç Dört Beş",
    exam: "AYT",
    subject: "chemistry",
    levels: [
      "beginner",
      "intermediate",
    ],
    kind: "question-bank",
  },
  {
    id: "3d-ayt-chemistry",
    title: "AYT 3D Kimya Soru Bankası",
    publisher: "3D Yayınları",
    exam: "AYT",
    subject: "chemistry",
    levels: ["advanced"],
    kind: "question-bank",
  },
  {
    id: "345-ayt-biology",
    title: "AYT Biyoloji Konu Özetli Soru Bankası",
    publisher: "Üç Dört Beş",
    exam: "AYT",
    subject: "biology",
    levels: [
      "beginner",
      "intermediate",
    ],
    kind: "question-bank",
  },
];