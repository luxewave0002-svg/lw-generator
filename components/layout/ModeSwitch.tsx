"use client";

import { motion } from "framer-motion";
import { PiWaveSine, PiSpiral } from "react-icons/pi";
import { useVisualStore } from "@/stores/visualStore";
import type { VisualMode } from "@/types";

const MODES: { id: VisualMode; label: string; Icon: typeof PiWaveSine }[] = [
  { id: "fluid", label: "FLUID", Icon: PiWaveSine },
  { id: "ribbon", label: "RIBBON", Icon: PiSpiral },
];

export default function ModeSwitch() {
  const mode = useVisualStore((s) => s.mode);
  const setMode = useVisualStore((s) => s.setMode);

  return (
    <div className="glass-pill mx-5 mt-4 flex p-1">
      {MODES.map(({ id, label, Icon }) => {
        const active = mode === id;
        return (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`relative flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium tracking-[0.2em] transition-colors ${
              active ? "text-lw-text" : "text-lw-muted hover:text-lw-text"
            }`}
          >
            {active && (
              <motion.span
                layoutId="mode-pill"
                className="neon-ring absolute inset-0 rounded-full bg-lw-surface-2"
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
              />
            )}
            <Icon
              size={17}
              className={`relative ${active ? "text-lw-primary" : ""}`}
            />
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
