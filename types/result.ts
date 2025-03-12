export type ComponentResult = {
  title: string;
  description?: string | null;
  image?: string | null;
  type: ComponentResultType | null;
  color?: ColorResult | null;
  quiz?: QuizResult;
  url?: string;
};

export type ColorResult = {
  textColor?: string;
  backgroundColor?: string;
  buttonBackgroundColor?: string;
};

export type ComponentResultType = "Quizz" | "Swap" | "Buy";

export type QuizResult = {
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: string;
};
