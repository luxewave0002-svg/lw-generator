"use client";

import { useCallback } from "react";
import { getAudioEngine } from "@/features/audio/AudioEngine";
import { useAudioStore } from "@/stores/audioStore";

/**
 * Imperative commands shared by SourceBar / BottomNav / drop zone.
 * State sync (time ticker, volume, ended) lives in <AudioBridge>.
 */
export function useAudioCommands() {
  const loadFile = useCallback(async (file: File) => {
    const s = useAudioStore.getState();
    const engine = getAudioEngine();
    try {
      s.setPlayback("loading");
      const duration = await engine.loadFile(file);
      s.setFile(file.name, duration);
      s.setSourceType("file");
      s.setCurrentTime(0);
      engine.play();
      s.setPlayback("playing");
    } catch (e) {
      console.error("Failed to load audio file:", e);
      s.reset();
    }
  }, []);

  const togglePlay = useCallback(() => {
    const s = useAudioStore.getState();
    const engine = getAudioEngine();
    if (s.sourceType !== "file" || !s.fileName) return;
    if (engine.playing) {
      engine.pause();
      s.setPlayback("paused");
    } else if (engine.play()) {
      s.setPlayback("playing");
    }
  }, []);

  const toggleMic = useCallback(async () => {
    const s = useAudioStore.getState();
    const engine = getAudioEngine();
    if (engine.isMicActive) {
      engine.stopMic();
      s.setSourceType(s.fileName ? "file" : "none");
      s.setPlayback(s.fileName ? "paused" : "idle");
      return;
    }
    try {
      await engine.startMic();
      s.setSourceType("mic");
      s.setPlayback("idle");
    } catch (e) {
      console.error("Mic permission denied or unavailable:", e);
    }
  }, []);

  return { loadFile, togglePlay, toggleMic };
}
