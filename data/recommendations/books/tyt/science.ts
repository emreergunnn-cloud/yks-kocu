import type {
  BookResource,
} from "@/types/recommendation";

export const TYT_SCIENCE_BOOKS: BookResource[] = [
  createBook(
    "physics",
    "Fizik"
  ),
  createBook(
    "chemistry",
    "Kimya"
  ),
  createBook(
    "biology",
    "Biyoloji"
  ),
].flat();

function createBook(
  subject:
    | "physics"
    | "chemistry"
    | "biology",
  label: string
): BookResource[] {
  return [
    {
      id: `345-tyt-${subject}`,
      title: `TYT ${label} Soru Bankası`,
      publisher: "Üç Dört Beş",
      exam: "TYT",
      subject,
      levels: [
        "beginner",
        "intermediate",
      ],
      kind: "question-bank",
    },
    {
      id: `3d-tyt-${subject}`,
      title: `TYT 3D ${label} Soru Bankası`,
      publisher: "3D Yayınları",
      exam: "TYT",
      subject,
      levels: ["advanced"],
      kind: "question-bank",
    },
  ];
}