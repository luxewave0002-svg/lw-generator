"use client";

import { formatHzLabel } from "@/utils/format";

const BAR_COUNT = 48;
const FREQ_LABELS = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
const DB_LABELS = [0, -30, -60, -90];

/**
 * Spectrum display.
 * Phase 2: deterministic dummy bars (no hydration mismatch).
 * Phase 4 swaps the data source to live AnalyserNode frames on <canvas>.
 */
function dummyHeight(i: number): number {
  const t = i / BAR_COUNT;
  const lobe1 = Math.exp(-((t - 0.22) ** 2) / 0.02);
  const lobe2 = Math.exp(-((t - 0.55) ** 2) / 0.03) * 0.8;
  const lobe3 = Math.exp(-((t - 0.85) ** 2) / 0.015) * 0.55;
  const ripple = 0.12 * Math.sin(i * 2.7) * Math.sin(i * 0.9);
  return Math.min(1, Math.max(0.06, lobe1 + lobe2 + lobe3 + ripple));
}

function barColor(i: number): string {
  const t = i / (BAR_COUNT - 1);
  // cyan -> violet -> magenta
  if (t < 0.5) {
    const k = t / 0.5;
    return `color-mix(in oklab, #00E5FF ${100 - k * 100}%, #7C4DFF)`;
  }
  const k = (t - 0.5) / 0.5;
  return `color-mix(in oklab, #7C4DFF ${100 - k * 100}%, #FF2DAA)`;
}

export default function SpectrumView() {
  return (
    <div className="flex h-full gap-2">
      {/* dB axis */}
      <div className="flex flex-col justify-between pb-5 font-mono text-[10px] text-lw-muted">
        {DB_LABELS.map((db) => (
          <span key={db}>{db}</span>
        ))}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 items-end gap-[3px]">
          {Array.from({ length: BAR_COUNT }, (_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{
                height: `${dummyHeight(i) * 100}%`,
                background: barColor(i),
                opacity: 0.9,
              }}
            />
          ))}
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[10px] text-lw-muted">
          {FREQ_LABELS.map((hz) => (
            <span key={hz}>{formatHzLabel(hz)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
