import { create } from "zustand";
import { ComponentResult } from "@/types/result";

const resultInit: ComponentResult = {
  title: "Moveduck - Quiz",
  description: "",
  image: null,
  type: "Swap",
  color: {
    textColor: "#000000",
    backgroundColor: "#ffffff",
  },
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
