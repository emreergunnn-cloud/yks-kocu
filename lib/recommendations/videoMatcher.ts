import {
  YOUTUBE_CHANNELS,
} from "@/data/recommendations/youtube";

import type {
  RecommendationExam,
  ResourceSubject,
  VideoResource,
} from "@/types/recommendation";

export function createVideoRecommendation(
  subject: ResourceSubject,
  exam: RecommendationExam,
  topic: string
): VideoResource {
  const channel =
    YOUTUBE_CHANNELS[subject];

  const query =
    `${channel} ${exam} ${topic} konu anlatımı`;

  return {
    channel,
    title:
      `${topic} konu anlatımı`,
    url:
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
  };
}