"use client";

import { FiMaximize } from "react-icons/fi";
import { PiWaveSine, PiSpiral } from "react-icons/pi";
import { useVisualStore } from "@/stores/visualStore";
import DetectionBadge from "@/features/solfeggio/DetectionBadge";

/**
 * The single visual viewport.
 * Phase 2: CSS aurora placeholder. Replaced by the R3F <Canvas>
 * (SceneRouter -> FluidScene / RibbonScene) in Phase 5.
 */
export default function VisualStage() {
  const mode = useVisualStore((s) => s.mode);
  const Icon = mode === "fluid" ? PiWaveSine : PiSpiral;
  const label = mode === "fluid" ? "Fluid Mode" : "Ribbon Mode";

  return (
    <section className="relative mx-5 mt-4 h-[48dvh] overflow-hidden rounded-3xl border border-lw-line bg-black">
      {/* aurora placeholder */}
      <div className="absolute inset-0" aria-hidden>
        <div
          className="absolute -inset-1/4 rounded-full opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse 60% 45% at 35% 45%, rgba(0,229,255,0.5), transparent 65%)",
            animation: "lw-aurora-a 14s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -inset-1/4 rounded-full opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse 55% 40% at 65% 55%, rgba(255,45,170,0.42), transparent 65%)",
            animation: "lw-aurora-b 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 40% 30% at 50% 50%, rgba(124,77,255,0.25), transparent 70%)",
            animation: "lw-pulse 6s ease-in-out infinite",
          }}
        />
      </div>

      {/* mode label */}
      <div className="absolute left-4 top-4 flex items-center gap-2 text-sm text-lw-primary">
        <Icon size={18} />
        <span className="tracking-wide">{label}</span>
      </div>

      {/* fullscreen */}
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
