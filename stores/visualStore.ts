import { create } from "zustand";
import type { VisualMode } from "@/types";

interface VisualState {
  mode: VisualMode;
  fullscreen: boolean;
  setMode: (m: VisualMode) => void;
  setFullscreen: (f: boolean) => void;
}

export const useVisualStore = create<VisualState>((set) => ({
  mode: "fluid",
  fullscreen: false,
  setMode: (mode) => set({ mode }),
  setFullscreen: (fullscreen) => set({ fullscreen }),
}));
