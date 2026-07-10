import { create } from "zustand";
import type { AudioSourceType, PlaybackState } from "@/types";

interface AudioState {
  sourceType: AudioSourceType;
  playback: PlaybackState;
  fileName: string | null;
  duration: number;
  /** coarse playhead for UI (updated at low rate, not per frame) */
  currentTime: number;
  volume: number;
  setSourceType: (t: AudioSourceType) => void;
  setPlayback: (p: PlaybackState) => void;
  setFile: (name: string, duration: number) => void;
  setCurrentTime: (t: number) => void;
  setVolume: (v: number) => void;
  reset: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  sourceType: "none",
  playback: "idle",
  fileName: null,
  duration: 0,
  currentTime: 0,
  volume: 0.7,
  setSourceType: (sourceType) => set({ sourceType }),
  setPlayback: (playback) => set({ playback }),
  setFile: (fileName, duration) => set({ fileName, duration }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setVolume: (volume) => set({ volume }),
  reset: () =>
    set({
      sourceType: "none",
      playback: "idle",
      fileName: null,
      duration: 0,
      currentTime: 0,
    }),
}));
