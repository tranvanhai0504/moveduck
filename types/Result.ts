export type ComponentResult = {
  title?: string | null;
  description?: string | null;
  image?: string | null;
  type: ComponentResultType | null;
  color?: ColorResult | null;
  tags?: string[];
  quiz?: QuizResult;
};

export type ColorResult = {
  textColor?: string;
  backgroundColor?: string;
}

export type ComponentResultType = "Quizz" | "Swap" | "Buy";

export type QuizResult = {
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: string;
};
