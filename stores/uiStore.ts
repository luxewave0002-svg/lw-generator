import { create } from "zustand";

export type SheetId = "presets" | "export" | null;

interface UiState {
  sheet: SheetId;
  openSheet: (s: SheetId) => void;
  closeSheet: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sheet: null,
  openSheet: (sheet) => set({ sheet }),
  closeSheet: () => set({ sheet: null }),
}));
