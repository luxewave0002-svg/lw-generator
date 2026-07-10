"use client";

import { FiVolume2 } from "react-icons/fi";
import { useAudioStore } from "@/stores/audioStore";

export default function VolumeSlider() {
  const volume = useAudioStore((s) => s.volume);
  const setVolume = useAudioStore((s) => s.setVolume);
  const pct = Math.round(volume * 100);

  return (
    <div className="glass mx-5 mt-4 flex items-center gap-4 px-4 py-3">
      <FiVolume2 size={18} className="shrink-0 text-lw-muted" />
      <input
        type="range"
        min={0}
        max={100}
        value={pct}
        onChange={(e) => setVolume(Number(e.target.value) / 100)}
        className="lw-range w-full"
        style={{ ["--fill" as string]: `${pct}%` }}
        aria-label="Volume"
      />
      <span className="w-10 shrink-0 text-right font-mono text-sm text-lw-text">
        {pct}%
      </span>
    </div>
  );
}
