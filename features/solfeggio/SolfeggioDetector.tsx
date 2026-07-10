"use client";

import { useEffect } from "react";
import { getAudioEngine } from "@/features/audio/AudioEngine";
import { detectPitchHz, computeRms } from "@/features/solfeggio/detector";
import { useAudioStore } from "@/stores/audioStore";
import { useAnalyzerStore } from "@/stores/analyzerStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { SOLFEGGIO_FREQUENCIES, ANALYSER_FFT_SIZE } from "@/utils/constants";

const TICK_MS = 120;
const RELEASE_SEC = 0.8;

/**
 * Headless detector (Phase 7). Mounted once.
 * Rules: within toleranceHz of a target, sustained minDurationSec,
 * above minLevel. All three are user-tunable via settingsStore.
 */
export default function SolfeggioDetector() {
  useEffect(() => {
    const engine = getAudioEngine();
    const buf = new Float32Array(ANALYSER_FFT_SIZE);
    const sessionStart = performance.now() / 1000;

    let holdTarget = 0;
    let holdStart = 0;
    let lastSeen = 0;
    let fired = false;

    const reset = () => {
      holdTarget = 0;
      fired = false;
      const az = useAnalyzerStore.getState();
      if (az.activeDetection) az.setActiveDetection(null);
    };

    const id = setInterval(() => {
      const st = useAudioStore.getState();
      const cfg = useSettingsStore.getState().solfeggio;
      const az = useAnalyzerStore.getState();
      const listening = st.playback === "playing" || st.sourceType === "mic";

      if (!listening || !engine.getFloatTimeDomain(buf)) {
        reset();
        return;
      }

      const now = performance.now() / 1000;
      const rms = computeRms(buf);
      const pitch =
        rms >= cfg.minLevel ? detectPitchHz(buf, engine.getSampleRate()) : null;

      let match = 0;
      if (pitch) {
        for (const target of SOLFEGGIO_FREQUENCIES) {
          if (Math.abs(pitch.hz - target) <= cfg.toleranceHz) {
            match = target;
            break;
          }
        }
      }

      if (match) {
        if (holdTarget !== match) {
          holdTarget = match;
          holdStart = now;
          fired = false;
        }
        lastSeen = now;
        if (!fired && now - holdStart >= cfg.minDurationSec) {
          fired = true;
          const time =
            st.sourceType === "file"
              ? engine.getCurrentTime()
              : now - sessionStart;
          const det = {
            frequency: match,
            time,
            duration: now - holdStart,
          };
          az.pushDetection(det);
          az.setActiveDetection(det);
        }
      } else if (holdTarget && now - lastSeen > RELEASE_SEC) {
        reset();
      }
    }, TICK_MS);

    return () => clearInterval(id);
  }, []);

  return null;
}
