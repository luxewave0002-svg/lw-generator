"use client";

import { useRef } from "react";
import { FiChevronDown, FiFolder, FiMic } from "react-icons/fi";
import { PiWaveform } from "react-icons/pi";
import { useAudioStore } from "@/stores/audioStore";
import { useAudioCommands } from "@/hooks/useAudioCommands";
import { formatTime } from "@/utils/format";

/** Audio source controls: file picker, mic toggle, current input. */
export default function SourceBar() {
  const sourceType = useAudioStore((s) => s.sourceType);
  const playback = useAudioStore((s) => s.playback);
  const fileName = useAudioStore((s) => s.fileName);
  const currentTime = useAudioStore((s) => s.currentTime);
  const duration = useAudioStore((s) => s.duration);
  const { loadFile, toggleMic } = useAudioCommands();
  const inputRef = useRef<HTMLInputElement>(null);

  const base =
    "glass-pill flex flex-1 items-center justify-center gap-2 px-3 py-3 text-xs font-medium tracking-widest transition-colors";

  const inputLabel =
    sourceType === "mic" ? "MIC LIVE" : (fileName ?? "INPUT");

  return (
    <div className="px-5 pt-4">
      <div className="flex gap-2.5">
        <button
          onClick={() => inputRef.current?.click()}
          className={`${base} ${sourceType === "file" ? "neon-ring text-lw-primary" : "text-lw-text hover:text-lw-primary"}`}
        >
          <FiFolder size={16} />
          {playback === "loading" ? "LOADING" : "UPLOAD"}
        </button>
        <button
          onClick={() => void toggleMic()}
          className={`${base} ${sourceType === "mic" ? "neon-ring text-lw-primary" : "text-lw-text hover:text-lw-primary"}`}
        >
          <FiMic size={16} />
          MIC
        </button>
        <button
          className={`${base} min-w-0 text-lw-text hover:text-lw-primary`}
        >
          <PiWaveform size={16} className="shrink-0 text-lw-primary" />
          <span className="max-w-24 truncate">{inputLabel}</span>
          <FiChevronDown size={14} className="shrink-0 text-lw-muted" />
        </button>
      </div>

      {sourceType === "file" && fileName && (
        <div className="glass-pill mt-2.5 flex items-center justify-between px-4 py-2 text-xs">
          <span className="max-w-[60%] truncate text-lw-text">{fileName}</span>
          <span className="font-mono text-lw-muted">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".mp3,.wav,audio/mpeg,audio/wav,audio/x-wav"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void loadFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
