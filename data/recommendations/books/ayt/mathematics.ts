import type {
  BookResource,
} from "@/types/recommendation";

export const AYT_MATHEMATICS_BOOKS: BookResource[] = [
  {
    id: "345-ayt-mathematics",
    title: "AYT Matematik Soru Bankası",
    publisher: "Üç Dört Beş",
    exam: "AYT",
    subject: "mathematics",
    levels: [
      "beginner",
      "intermediate",
    ],
    kind: "question-bank",
  },
  {
    id: "3d-ayt-mathematics",
    title: "AYT 3D Matematik Soru Bankası",
    publisher: "3D Yayınları",
    exam: "AYT",
    subject: "mathematics",
    levels: ["advanced"],
    kind: "question-bank",
  },
];