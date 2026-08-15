import type {
  BookResource,
} from "@/types/recommendation";

export const TYT_MATHEMATICS_BOOKS: BookResource[] = [
  {
    id: "345-tyt-mathematics",
    title: "TYT Matematik Soru Bankası",
    publisher: "Üç Dört Beş",
    exam: "TYT",
    subject: "mathematics",
    levels: [
      "beginner",
      "intermediate",
    ],
    kind: "question-bank",
  },
  {
    id: "3d-tyt-mathematics",
    title: "TYT 3D Matematik Soru Bankası",
    publisher: "3D Yayınları",
    exam: "TYT",
    subject: "mathematics",
    levels: ["advanced"],
    kind: "question-bank",
  },
];