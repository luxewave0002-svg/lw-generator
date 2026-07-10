"use client";

import { FiPause, FiPlay, FiStar, FiUpload } from "react-icons/fi";
import { PiGauge, PiChartBar } from "react-icons/pi";
import { useAudioStore } from "@/stores/audioStore";
import { useAudioCommands } from "@/hooks/useAudioCommands";
import { useUiStore } from "@/stores/uiStore";

const LEFT = [
  { id: "visual", label: "VISUAL", Icon: PiGauge },
  { id: "analyze", label: "ANALYZE", Icon: PiChartBar },
] as const;
const RIGHT = [
  { id: "presets", label: "PRESETS", Icon: FiStar },
  { id: "export", label: "EXPORT", Icon: FiUpload },
] as const;

export default function BottomNav() {
  const playback = useAudioStore((s) => s.playback);
  const hasFile = useAudioStore((s) => Boolean(s.fileName));
  const { togglePlay } = useAudioCommands();
  const playing = playback === "playing";
  const sheet = useUiStore((s) => s.sheet);
  const openSheet = useUiStore((s) => s.openSheet);
  const closeSheet = useUiStore((s) => s.closeSheet);

  const item = (
    id: "visual" | "analyze" | "presets" | "export",
    label: string,
    Icon: typeof FiStar,
  ) => {
    const active = sheet === id || (sheet === null && id === "visual");
    const onClick = () => {
      if (id === "presets" || id === "export") openSheet(id);
      else closeSheet();
    };
    return (
      <button
        key={id}
        onClick={onClick}
        className={`flex flex-col items-center gap-1 text-[10px] tracking-widest transition-colors ${
          active ? "text-lw-primary" : "text-lw-muted hover:text-lw-text"
        }`}
      >
        <Icon size={20} />
        {label}
      </button>
    );
  };

  return (
    <nav className="sticky bottom-0 mt-5 border-t border-lw-line bg-lw-bg/85 px-8 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        {LEFT.map((i) => item(i.id, i.label, i.Icon))}
        <button
          aria-label={playing ? "Pause" : "Play"}
          onClick={togglePlay}
          disabled={!hasFile}
          className="neon-ring -mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-lw-surface text-lw-primary transition-transform active:scale-95 disabled:opacity-40"
        >
          {playing ? (
            <FiPause size={24} />
          ) : (
            <FiPlay size={24} className="ml-1" />
          )}
        </button>
        {RIGHT.map((i) => item(i.id, i.label, i.Icon))}
      </div>
    </nav>
  );
}
