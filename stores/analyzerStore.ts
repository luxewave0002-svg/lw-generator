import { create } from "zustand";
import type { AnalyzerTab, SolfeggioDetection } from "@/types";

/**
 * Holds analyzer UI state and detection history.
 * NOTE: per-frame FFT data intentionally lives outside this store
 * (refs inside the audio engine) to avoid re-render pressure at 60fps.
 */
interface AnalyzerState {
  tab: AnalyzerTab;
  detections: SolfeggioDetection[];
  activeDetection: SolfeggioDetection | null;
  setTab: (t: AnalyzerTab) => void;
  pushDetection: (d: SolfeggioDetection) => void;
  setActiveDetection: (d: SolfeggioDetection | null) => void;
  clearDetections: () => void;
}

export const useAnalyzerStore = create<AnalyzerState>((set) => ({
  tab: "spectrum",
  detections: [],
  activeDetection: null,
  setTab: (tab) => set({ tab }),
  pushDetection: (d) =>
    set((s) => ({ detections: [...s.detections, d].slice(-200) })),
  setActiveDetection: (activeDetection) => set({ activeDetection }),
  clearDetections: () => set({ detections: [], activeDetection: null }),
}));
