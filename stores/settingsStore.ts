import { create } from "zustand";
import type { SolfeggioSettings } from "@/types";
import { DEFAULT_SOLFEGGIO_SETTINGS } from "@/utils/constants";

interface SettingsState {
  solfeggio: SolfeggioSettings;
  showDebugPanel: boolean;
  setSolfeggio: (s: Partial<SolfeggioSettings>) => void;
  setShowDebugPanel: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  solfeggio: DEFAULT_SOLFEGGIO_SETTINGS,
  showDebugPanel: false,
  setSolfeggio: (patch) =>
    set((s) => ({ solfeggio: { ...s.solfeggio, ...patch } })),
  setShowDebugPanel: (showDebugPanel) => set({ showDebugPanel }),
}));
