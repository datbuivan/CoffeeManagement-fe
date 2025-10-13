import { create } from "zustand";

interface LoadingState {
  loadingCount: number;
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  loadingCount: 0,
  isLoading: false,
  startLoading: () => {
    const count = get().loadingCount + 1;
    set({ loadingCount: count, isLoading: true });
  },
  stopLoading: () => {
    const count = Math.max(0, get().loadingCount - 1);
    set({ loadingCount: count, isLoading: count > 0 });
  },
}));
