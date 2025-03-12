import { create } from "zustand";
interface ImageStore {
  images: string[];
  addImage: (url: string) => void;
  addImages: (urls: string[]) => void;
  removeImage: (url: string) => void;
  clearImages: () => void;
}

const useImagesStore = create<ImageStore>((set) => ({
  images: [],
  addImage: (url) =>
    set((state) => ({
      images: [...state.images, url],
    })),
  addImages: (urls) =>
    set((state) => ({
      images: [...state.images, ...urls],
    })),
  removeImage: (url) =>
    set((state) => ({
      images: state.images.filter((image) => image !== url),
    })),
  clearImages: () => set({ images: [] }),
}));

export default useImagesStore;
