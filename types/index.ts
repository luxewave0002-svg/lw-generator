/** Visual rendering modes. Extend here when adding Smoke / Nebula / etc. */
export type VisualMode =
  | "fluid"
  | "ribbon"
  | "smoke"
  | "nebula"
  | "crystal"
  | "organic"
  | "energy"
  | "galaxy"
  | "bloom";

/** Modes actually implemented in the MVP. */
export const IMPLEMENTED_MODES: VisualMode[] = ["fluid", "ribbon"];

/** Where the audio signal comes from. */
export type AudioSourceType = "none" | "file" | "mic";

export type PlaybackState = "idle" | "loading" | "playing" | "paused";

/** Bottom panel tab. */
export type AnalyzerTab = "spectrum" | "waveform" | "timeline";

/** A single Solfeggio detection event. */
export interface SolfeggioDetection {
  frequency: number;
  /** seconds (audio clock) at which the detection was confirmed */
  time: number;
  /** how long the tone had been sustained when confirmed (s) */
  duration: number;
}

/** Tunable detector settings (designed to be user-adjustable later). */
export interface SolfeggioSettings {
  /** allowed deviation from target, in Hz */
  toleranceHz: number;
  /** required sustained duration, in seconds */
  minDurationSec: number;
  /** minimum RMS level (0-1) for a frame to count */
  minLevel: number;
}

/** Per-frame analysis snapshot (written via refs, not the store). */
export interface AnalysisFrame {
  rms: number;
  spectralCentroid: number;
  dominantHz: number;
}
