import { create } from "zustand";

const MIN_STEP = 1;
export const MAX_STEP = 4;

const useStep = create<{
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
}>((set) => ({
  step: 4,
  nextStep: () =>
    set((state) => {
      if (state.step === MAX_STEP) return state;
      return { step: state.step + 1 };
    }),
  prevStep: () =>
    set((state) => {
      if (state.step === MIN_STEP) return state;
      return { step: state.step - 1 };
    }),
  setStep: (step) => set({ step }),
}));

export default useStep;
