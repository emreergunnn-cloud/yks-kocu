import {
  makeSubject,
} from "../builders";

import {
  TYT_TURKCE_TOPICS,
} from "./turkce";

import {
  TYT_MATEMATIK_TOPICS,
} from "./matematik";

import {
  TYT_SOSYAL_TOPICS,
} from "./sosyal";

import {
  TYT_FEN_TOPICS,
} from "./fen";

export const TYT_SUBJECTS = [
  makeSubject(
    "tyt_turkce",
    "TYT Türkçe",
    "TYT",
    40,
    TYT_TURKCE_TOPICS
  ),

  makeSubject(
    "tyt_matematik",
    "TYT Matematik",
    "TYT",
    40,
    TYT_MATEMATIK_TOPICS
  ),

  makeSubject(
    "tyt_sosyal",
    "TYT Sosyal Bilimler",
    "TYT",
    20,
    TYT_SOSYAL_TOPICS
  ),

  makeSubject(
    "tyt_fen",
    "TYT Fen Bilimleri",
    "TYT",
    20,
    TYT_FEN_TOPICS
  ),
] as const;