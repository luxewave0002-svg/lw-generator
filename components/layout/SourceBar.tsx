"use client";

import { FiChevronDown, FiFolder, FiMic } from "react-icons/fi";
import { PiWaveform } from "react-icons/pi";
import { useAudioStore } from "@/stores/audioStore";

/**
 * Audio source controls.
 * Phase 2: visual only. Real upload / mic wiring lands in Phase 3.
 */
export default function SourceBar() {
  const sourceType = useAudioStore((s) => s.sourceType);

  const base =
    "glass-pill flex flex-1 items-center justify-center gap-2 px-3 py-3 text-xs font-medium tracking-widest transition-colors";

  return (
    <div className="flex gap-2.5 px-5 pt-4">
      <button
        className={`${base} ${sourceType === "file" ? "neon-ring text-lw-primary" : "text-lw-text hover:text-lw-primary"}`}
      >
        <FiFolder size={16} />
        UPLOAD
      </button>
      <button
        className={`${base} ${sourceType === "mic" ? "neon-ring text-lw-primary" : "text-lw-text hover:text-lw-primary"}`}
      >
        <FiMic size={16} />
        MIC
      </button>
      <button className={`${base} text-lw-text hover:text-lw-primary`}>
        <PiWaveform size={16} className="text-lw-primary" />
        INPUT
        <FiChevronDown size={14} className="text-lw-muted" />
      </button>
    </div>
  );
}
