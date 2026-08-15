import type { StudyTask } from "@/types/studyPlan";
import type {
  RecommendationExam,
  ResourceSubject,
} from "@/types/recommendation";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("tr-TR");
}

function includesAny(
  text: string,
  words: string[]
) {
  return words.some((word) =>
    text.includes(word)
  );
}

export function resolveExam(
  task: StudyTask
): RecommendationExam {
  if (
    task.category === "AYT" ||
    normalize(task.subject).includes("ayt")
  ) {
    return "AYT";
  }

  return "TYT";
}

export function resolveSubject(
  task: StudyTask
): ResourceSubject {
  const text = normalize(
    `${task.subject} ${task.topic}`
  );

  if (text.includes("matematik")) return "mathematics";
  if (text.includes("turkce")) return "turkish";
  if (text.includes("edebiyat")) return "literature";
  if (text.includes("fizik")) return "physics";
  if (text.includes("kimya")) return "chemistry";
  if (text.includes("biyoloji")) return "biology";
  if (text.includes("cografya")) return "geography";
  if (text.includes("tarih")) return "history";
  if (text.includes("felsefe")) return "philosophy";
  if (text.includes("din")) return "religion";
  if (text.includes("dil")) return "language";

  if (
    includesAny(text, [
      "hareket",
      "kuvvet",
      "enerji",
      "elektrik",
      "optik",
      "basinc",
    ])
  ) {
    return "physics";
  }

  if (
    includesAny(text, [
      "atom",
      "periyodik",
      "mol",
      "asit",
      "baz",
      "cozelti",
    ])
  ) {
    return "chemistry";
  }

  if (
    includesAny(text, [
      "hucre",
      "canli",
      "kalitim",
      "ekoloji",
      "enzim",
      "dna",
    ])
  ) {
    return "biology";
  }

  return "mathematics";
}