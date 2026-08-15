import { BOOK_RESOURCES } from "@/data/recommendations/books";

import type {
  RecommendationExam,
  RecommendationLevel,
  ResourceSubject,
} from "@/types/recommendation";

export function findBooks(
  exam: RecommendationExam,
  subject: ResourceSubject,
  level: RecommendationLevel
) {
  const books = BOOK_RESOURCES.filter(
    (book) =>
      book.exam === exam &&
      book.subject === subject
  );

  const exact = books.filter(
    (book) =>
      book.levels.includes(level)
  );

  return (exact.length ? exact : books)
    .slice(0, 2);
}