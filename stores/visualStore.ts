import { create } from "zustand";
import type { VisualMode } from "@/types";

/** User-tunable visual parameters (saved inside presets). */
export interface VisualParams {
  /** overall brightness / reactivity multiplier */
  intensity: number;
  /** flow / motion speed multiplier */
  speed: number;
  /** color balance shift toward magenta (0..1) */
  glow: number;
}

export const DEFAULT_PARAMS: VisualParams = {
  intensity: 1,
  speed: 1,
  glow: 0.5,
};

export interface Preset {
  id: string;
  name: string;
  mode: VisualMode;
  params: VisualParams;
  /** true for shipped presets that cannot be deleted */
  builtin?: boolean;
}

const BUILTIN_PRESETS: Preset[] = [
  {
    id: "builtin-aurora",
    name: "Aurora",
    mode: "fluid",
    params: { intensity: 1, speed: 0.8, glow: 0.35 },
    builtin: true,
  },
  {
    id: "builtin-inferno",
    name: "Inferno",
    mode: "fluid",
    params: { intensity: 1.4, speed: 1.5, glow: 0.85 },
    builtin: true,
  },
  {
    id: "builtin-silk",
    name: "Silk Ribbons",
    mode: "ribbon",
    params: { intensity: 0.9, speed: 0.7, glow: 0.5 },
    builtin: true,
  },
  {
    id: "builtin-rave",
    name: "Rave",
    mode: "ribbon",
    params: { intensity: 1.5, speed: 1.8, glow: 0.9 },
    builtin: true,
  },
];

const STORAGE_KEY = "lw-presets-v1";

function loadUserPresets(): Preset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Preset[]) : [];
  } catch {
    return [];
  }
}

function saveUserPresets(presets: Preset[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(presets.filter((p) => !p.builtin)),
    );
  } catch {
    /* quota / private mode - ignore */
  }
}

interface VisualState {
  mode: VisualMode;
  fullscreen: boolean;
  params: VisualParams;
  presets: Preset[];
  setMode: (m: VisualMode) => void;
  setFullscreen: (f: boolean) => void;
  setParam: <K extends keyof VisualParams>(k: K, v: VisualParams[K]) => void;
  applyPreset: (id: string) => void;
  savePreset: (name: string) => void;
  deletePreset: (id: string) => void;
  hydratePresets: () => void;
}

export const useVisualStore = create<VisualState>((set, get) => ({
  mode: "fluid",
  fullscreen: false,
  params: { ...DEFAULT_PARAMS },
  presets: BUILTIN_PRESETS,
  setMode: (mode) => set({ mode }),
  setFullscreen: (fullscreen) => set({ fullscreen }),
  setParam: (k, v) => set((s) => ({ params: { ...s.params, [k]: v } })),
  applyPreset: (id) => {
    const p = get().presets.find((x) => x.id === id);
    if (p) set({ mode: p.mode, params: { ...p.params } });
  },
  savePreset: (name) => {
    const { mode, params, presets } = get();
    const preset: Preset = {
      id: `user-${Date.now()}`,
      name: name.trim() || "Untitled",
      mode,
      params: { ...params },
    };
    const next = [...presets, preset];
    set({ presets: next });
    saveUserPresets(next);
  },
  deletePreset: (id) => {
    const next = get().presets.filter((p) => p.id !== id || p.builtin);
    set({ presets: next });
    saveUserPresets(next);
  },
  hydratePresets: () => {
    const user = loadUserPresets();
    if (user.length) set({ presets: [...BUILTIN_PRESETS, ...user] });
  },
}));
