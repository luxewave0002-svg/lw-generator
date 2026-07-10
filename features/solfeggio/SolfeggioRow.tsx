"use client";

import { PiSparkle } from "react-icons/pi";
import { SOLFEGGIO_FREQUENCIES } from "@/utils/constants";
import { useAnalyzerStore } from "@/stores/analyzerStore";

/**
 * The nine Solfeggio target pills.
 * Highlight state comes from analyzerStore.activeDetection (Phase 7).
 */
export default function SolfeggioRow() {
  const active = useAnalyzerStore((s) => s.activeDetection);

  return (
    <section className="mx-5 mt-4">
      <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-lw-primary">
        <PiSparkle size={15} />
        SOLFEGGIO DETECTOR
      </div>
      <div className="scrollbar-none mt-3 flex gap-2 overflow-x-auto pb-1">
        {SOLFEGGIO_FREQUENCIES.map((hz) => {
          const isActive = active?.frequency === hz;
          return (
            <div
              key={hz}
              className={`glass-pill flex min-w-[3.4rem] flex-col items-center px-2 py-2 font-mono transition-all ${
                isActive
                  ? "neon-ring scale-105 text-lw-primary"
                  : "text-lw-muted"
              }`}
            >
              <span className="text-sm font-semibold">{hz}</span>
              <span className="text-[10px]">Hz</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
