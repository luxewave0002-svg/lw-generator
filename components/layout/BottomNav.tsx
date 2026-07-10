"use client";

import { FiPause, FiPlay, FiStar, FiUpload } from "react-icons/fi";
import { PiGauge, PiChartBar } from "react-icons/pi";
import { useAudioStore } from "@/stores/audioStore";

const LEFT = [
  { id: "visual", label: "VISUAL", Icon: PiGauge, active: true },
  { id: "analyze", label: "ANALYZE", Icon: PiChartBar, active: false },
];
const RIGHT = [
  { id: "presets", label: "PRESETS", Icon: FiStar, active: false },
  { id: "export", label: "EXPORT", Icon: FiUpload, active: false },
];

export default function BottomNav() {
  const playback = useAudioStore((s) => s.playback);
  const setPlayback = useAudioStore((s) => s.setPlayback);
  const playing = playback === "playing";

  const item = (id: string, label: string, Icon: typeof FiStar, active: boolean) => (
    <button
      key={id}
      className={`flex flex-col items-center gap-1 text-[10px] tracking-widest transition-colors ${
        active ? "text-lw-primary" : "text-lw-muted hover:text-lw-text"
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  return (
    <nav className="sticky bottom-0 mt-5 border-t border-lw-line bg-lw-bg/85 px-8 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        {LEFT.map((i) => item(i.id, i.label, i.Icon, i.active))}
        <button
          aria-label={playing ? "Pause" : "Play"}
          onClick={() => setPlayback(playing ? "paused" : "playing")}
          className="neon-ring -mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-lw-surface text-lw-primary transition-transform active:scale-95"
        >
          {playing ? <FiPause size={24} /> : <FiPlay size={24} className="ml-1" />}
        </button>
        {RIGHT.map((i) => item(i.id, i.label, i.Icon, i.active))}
      </div>
    </nav>
  );
}
