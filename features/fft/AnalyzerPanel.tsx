"use client";

import { useAnalyzerStore } from "@/stores/analyzerStore";
import type { AnalyzerTab } from "@/types";
import SpectrumView from "@/features/fft/SpectrumView";
import WaveformView from "@/features/fft/WaveformView";

const TABS: { id: AnalyzerTab; label: string }[] = [
  { id: "spectrum", label: "SPECTRUM" },
  { id: "waveform", label: "WAVEFORM" },
  { id: "timeline", label: "TIMELINE" },
];

export default function AnalyzerPanel() {
  const tab = useAnalyzerStore((s) => s.tab);
  const setTab = useAnalyzerStore((s) => s.setTab);

  return (
    <section className="glass mx-5 mt-4 p-4">
      <div className="flex gap-6 border-b border-lw-line pb-2">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`relative pb-1 text-xs font-semibold tracking-[0.2em] transition-colors ${
              tab === id ? "neon-text" : "text-lw-muted hover:text-lw-text"
            }`}
          >
            {label}
            {tab === id && (
              <span className="absolute -bottom-[9px] left-0 h-0.5 w-full rounded-full bg-lw-primary" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-3 h-36">
        {tab === "spectrum" && <SpectrumView />}
        {tab === "waveform" && <WaveformView />}
        {tab === "timeline" && (
          <Placeholder label="Detection timeline arrives with the Solfeggio detector (Phase 7)." />
        )}
      </div>
    </section>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center text-xs text-lw-muted">
      {label}
    </div>
  );
}
