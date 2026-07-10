"use client";

import { useEffect } from "react";
import { getAudioEngine } from "@/features/audio/AudioEngine";
import { useAudioStore } from "@/stores/audioStore";

/**
 * Mounted once. Keeps the engine and the store in sync:
 * volume changes, playhead ticker (4 Hz), natural end of playback.
 */
export default function AudioBridge() {
  // volume -> engine
  useEffect(() => {
    const engine = getAudioEngine();
    engine.setVolume(useAudioStore.getState().volume);
    return useAudioStore.subscribe((s, prev) => {
      if (s.volume !== prev.volume) engine.setVolume(s.volume);
    });
  }, []);

  // playhead ticker + ended handler
  useEffect(() => {
    const engine = getAudioEngine();
    engine.onEnded = () => {
      const s = useAudioStore.getState();
      s.setPlayback("paused");
      s.setCurrentTime(0);
    };
    const id = setInterval(() => {
      const s = useAudioStore.getState();
      if (s.playback === "playing") {
        s.setCurrentTime(engine.getCurrentTime());
      }
    }, 250);
    return () => {
      clearInterval(id);
      engine.onEnded = null;
    };
  }, []);

  return null;
}
