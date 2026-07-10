"use client";

import dynamic from "next/dynamic";
import { FiMaximize } from "react-icons/fi";
import { PiWaveSine, PiSpiral } from "react-icons/pi";
import { useVisualStore } from "@/stores/visualStore";
import DetectionBadge from "@/features/solfeggio/DetectionBadge";

const VisualCanvas = dynamic(
  () => import("@/features/visual/renderer/VisualCanvas"),
  { ssr: false },
);

/** The single visual viewport hosting the R3F renderer. */
export default function VisualStage() {
  const mode = useVisualStore((s) => s.mode);
  const Icon = mode === "fluid" ? PiWaveSine : PiSpiral;
  const label = mode === "fluid" ? "Fluid Mode" : "Ribbon Mode";

  return (
    <section className="relative mx-5 mt-4 h-[48dvh] overflow-hidden rounded-3xl border border-lw-line bg-black">
      <VisualCanvas />

      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 text-sm text-lw-primary">
        <Icon size={18} />
        <span className="tracking-wide">{label}</span>
      </div>

      <button
        aria-label="Fullscreen"
        className="absolute right-4 top-4 rounded-lg p-1.5 text-lw-muted transition-colors hover:text-lw-text"
      >
        <FiMaximize size={18} />
      </button>

      <DetectionBadge />
    </section>
  );
}
