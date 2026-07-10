"use client";

import { useAnalyzerStore } from "@/stores/analyzerStore";
import { useAudioStore } from "@/stores/audioStore";
import { formatTime } from "@/utils/format";
import { SOLFEGGIO_FREQUENCIES } from "@/utils/constants";

function hzColor(hz: number): string {
  const i = SOLFEGGIO_FREQUENCIES.indexOf(
    hz as (typeof SOLFEGGIO_FREQUENCIES)[number],
  );
  const t = i < 0 ? 0.5 : i / (SOLFEGGIO_FREQUENCIES.length - 1);
  if (t < 0.5) {
    return `color-mix(in oklab, #00E5FF ${100 - t * 200}%, #7C4DFF)`;
  }
  return `color-mix(in oklab, #7C4DFF ${100 - (t - 0.5) * 200}%, #FF2DAA)`;
}

/** Detection history timeline (Phase 7). */
export default function TimelineView() {
  const detections = useAnalyzerStore((s) => s.detections);
  const duration = useAudioStore((s) => s.duration);
  const sourceType = useAudioStore((s) => s.sourceType);

  if (detections.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-lw-muted">
        No Solfeggio detections yet
      </div>
    );
  }

  if (sourceType === "file" && duration > 0) {
    return (
      <div className="flex h-full flex-col justify-center px-1">
        <div className="relative h-10">
          {detections.map((d, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2"
              style={{
                left: `${Math.min(100, (d.time / duration) * 100)}%`,
              }}
            >
              <span
                className="block font-mono text-[10px]"
                style={{ color: hzColor(d.frequency) }}
              >
                {d.frequency}
              </span>
              <span
                className="mx-auto mt-0.5 block h-4 w-0.5 rounded-full"
                style={{ background: hzColor(d.frequency) }}
              />
            </div>
          ))}
        </div>
        <div className="relative mt-1 h-1 rounded-full bg-lw-surface-2">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-lw-primary/30 via-lw-glow/30 to-lw-accent/30" />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[10px] text-lw-muted">
          <span>0:00</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    );
  }

  // mic / no duration: recent detections as chips
  return (
    <div className="flex h-full flex-wrap content-center gap-2 overflow-y-auto">
      {detections.slice(-10).map((d, i) => (
        <span
          key={i}
          className="glass-pill px-3 py-1.5 font-mono text-xs"
          style={{ color: hzColor(d.frequency) }}
        >
          {d.frequency}Hz @ {formatTime(d.time)}
        </span>
      ))}
    </div>
  );
}
