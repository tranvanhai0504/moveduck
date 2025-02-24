import { create } from "zustand";
import { ComponentResult } from "@/types/Result";

const resultInit: ComponentResult = {
    title: "Hello bro",
    description: null,
    image: null,
    type: "Swap",
    color: null,
    tags: []
}

const useResultStore = create<{
    data: ComponentResult;
    setResult: (result: ComponentResult) => void;
}>((set) => ({
    data: resultInit,
    setResult: (result: ComponentResult) => set({ data: result }),
}));

export default useResultStore;
