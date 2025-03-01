import { create } from "zustand";
import { ComponentResult } from "@/types/Result";

const resultInit: ComponentResult = {
  title: "Quiz generated",
  description: null,
  image: null,
  type: "Swap",
  color: {
    textColor: "#000000",
    backgroundColor: "#ffffff",
  },
  tags: [],
  quiz: {
    question:
      "What is the role of the Move Configuration file (.toml) in the Move package analogy?",
    answerA: "Mixing ingredients",
    answerB: "Delivering the cake",
    answerC: "Baking the batter",
    answerD: "Writing tests",
    correctAnswer: "B",
  },
};

const useResultStore = create<{
  data: ComponentResult;
  setResult: (result: ComponentResult) => void;
}>((set) => ({
  data: resultInit,
  setResult: (result: ComponentResult) => set({ data: result }),
}));

export default useResultStore;
