import type {
  BookResource,
} from "@/types/recommendation";

export const TYT_VERBAL_BOOKS: BookResource[] = [
  {
    id: "345-tyt-turkish",
    title: "TYT Türkçe Soru Bankası",
    publisher: "Üç Dört Beş",
    exam: "TYT",
    subject: "turkish",
    levels: [
      "beginner",
      "intermediate",
    ],
    kind: "question-bank",
  },
  {
    id: "3d-tyt-turkish",
    title: "TYT 3D Türkçe Soru Bankası",
    publisher: "3D Yayınları",
    exam: "TYT",
    subject: "turkish",
    levels: ["advanced"],
    kind: "question-bank",
  },
  {
    id: "345-tyt-geography",
    title: "TYT Coğrafya Soru Bankası",
    publisher: "Üç Dört Beş",
    exam: "TYT",
    subject: "geography",
    levels: [
      "beginner",
      "intermediate",
    ],
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
];