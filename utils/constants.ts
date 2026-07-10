import type { SolfeggioSettings } from "@/types";

/** The nine Solfeggio target frequencies (Hz). */
export const SOLFEGGIO_FREQUENCIES = [
  174, 285, 396, 417, 528, 639, 741, 852, 963,
] as const;

export type SolfeggioFrequency = (typeof SOLFEGGIO_FREQUENCIES)[number];

/** Initial detector spec: within 1 Hz, sustained 3 s, above level floor. */
export const DEFAULT_SOLFEGGIO_SETTINGS: SolfeggioSettings = {
  toleranceHz: 1,
  minDurationSec: 3,
  minLevel: 0.02,
};

/** Analyser configuration shared by FFT views and the detector. */
export const ANALYSER_FFT_SIZE = 4096;
export const ANALYSER_SMOOTHING = 0.8;

export const BRAND = {
  bg: "#070B14",
  primary: "#00E5FF",
  accent: "#FF2DAA",
  glow: "#7C4DFF",
} as const;
