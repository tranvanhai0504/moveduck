import { TStyle } from "./style";

export type ComponentResult = {
  title: string;
  description?: string | null;
  image?: string | null;
  type: ComponentResultType | null;
  quiz?: QuizResult;
  url?: string;
  style?: TStyle;
};

export type ComponentResultType = "Quiz" | "Swap" | "Buy";

export type QuizResult = {
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: string;
};
