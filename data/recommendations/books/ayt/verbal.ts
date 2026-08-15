import type {
  BookResource,
} from "@/types/recommendation";

export const AYT_VERBAL_BOOKS: BookResource[] = [
  {
    id: "345-ayt-literature",
    title: "AYT Edebiyat Soru Bankası",
    publisher: "Üç Dört Beş",
    exam: "AYT",
    subject: "literature",
    levels: [
      "beginner",
      "intermediate",
    ],
    kind: "question-bank",
  },
  {
    id: "3d-ayt-literature",
    title: "AYT 3D Edebiyat Soru Bankası",
    publisher: "3D Yayınları",
    exam: "AYT",
    subject: "literature",
    levels: ["advanced"],
    kind: "question-bank",
  },
];