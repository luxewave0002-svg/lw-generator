"use client";

import { useRef } from "react";
import { useCanvasLoop } from "@/hooks/useCanvasLoop";
import { getAudioEngine } from "@/features/audio/AudioEngine";
import { formatHzLabel } from "@/utils/format";

const BAR_COUNT = 48;
const FREQ_LABELS = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
const DB_LABELS = [0, -30, -60, -90];
const F_MIN = 20;
const F_MAX = 20000;

/** gentle idle animation shown before any audio source exists */
function idleHeight(i: number, t: number): number {
  const x = i / BAR_COUNT;
  const lobe1 = Math.exp(-((x - 0.22) ** 2) / 0.02);
  const lobe2 = Math.exp(-((x - 0.55) ** 2) / 0.03) * 0.8;
  const lobe3 = Math.exp(-((x - 0.85) ** 2) / 0.015) * 0.55;
  const breathe = 0.75 + 0.25 * Math.sin(t * 0.9 + i * 0.35);
  return Math.max(0.05, (lobe1 + lobe2 + lobe3) * 0.5 * breathe);
}

/** Live log-frequency spectrum (Phase 4). */
export default function SpectrumView() {
  const freqRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  const canvasRef = useCanvasLoop((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const analyser = getAudioEngine().getAnalyser();

    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, "#00E5FF");
    grad.addColorStop(0.55, "#7C4DFF");
    grad.addColorStop(1, "#FF2DAA");
    ctx.fillStyle = grad;

    const gap = Math.max(1, w * 0.004);
    const barW = (w - gap * (BAR_COUNT - 1)) / BAR_COUNT;

    let data: Uint8Array<ArrayBuffer> | null = null;
    let hzPerBin = 0;
    if (analyser) {
      const n = analyser.frequencyBinCount;
      if (!freqRef.current || freqRef.current.length !== n) {
        freqRef.current = new Uint8Array(n);
      }
      analyser.getByteFrequencyData(freqRef.current);
      data = freqRef.current;
      hzPerBin = getAudioEngine().getSampleRate() / 2 / n;
    }

    for (let i = 0; i < BAR_COUNT; i++) {
      let v: number;
      if (data) {
        // log-spaced band edges 20Hz -> 20kHz
        const fLo = F_MIN * Math.pow(F_MAX / F_MIN, i / BAR_COUNT);
        const fHi = F_MIN * Math.pow(F_MAX / F_MIN, (i + 1) / BAR_COUNT);
        const a = Math.max(0, Math.floor(fLo / hzPerBin));
        const b = Math.min(data.length - 1, Math.max(a, Math.ceil(fHi / hzPerBin)));
        let s = 0;
        for (let k = a; k <= b; k++) s += data[k];
        v = Math.pow(s / (b - a + 1) / 255, 0.85);
      } else {
        v = idleHeight(i, t);
      }
      const bh = Math.max(2, v * h);
      const x = i * (barW + gap);
      ctx.globalAlpha = data ? 0.95 : 0.45;
      ctx.beginPath();
      ctx.roundRect(x, h - bh, barW, bh, [barW * 0.3, barW * 0.3, 0, 0]);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  });

  return (
    <div className="flex h-full gap-2">
      <div className="flex flex-col justify-between pb-5 font-mono text-[10px] text-lw-muted">
        {DB_LABELS.map((db) => (
          <span key={db}>{db}</span>
        ))}
      </div>
      <div className="flex flex-1 flex-col">
        <canvas ref={canvasRef} className="min-h-0 w-full flex-1" />
        <div className="mt-1.5 flex justify-between font-mono text-[10px] text-lw-muted">
          {FREQ_LABELS.map((hz) => (
            <span key={hz}>{formatHzLabel(hz)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
