import { create } from "zustand";
import { ComponentResult } from "@/types/result";
import { STYLES } from "@/types/style";

const resultInit: ComponentResult = {
  title: "Moveduck - Quiz",
  description: "",
  image: STYLES[0].image,
  type: "Quiz",
  style: STYLES[0],
  quiz: undefined,
  url: undefined,
};

const useResultStore = create<{
  data: ComponentResult;
  setResult: (result: ComponentResult) => void;
}>((set) => ({
  data: resultInit,
  setResult: (result: ComponentResult) => set({ data: result }),
}));

export default useResultStore;
