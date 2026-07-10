"use client";

import { useRef } from "react";
import { useCanvasLoop } from "@/hooks/useCanvasLoop";
import { getAudioEngine } from "@/features/audio/AudioEngine";

/** Live oscilloscope view (Phase 4). */
export default function WaveformView() {
  const timeRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  const canvasRef = useCanvasLoop((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const analyser = getAudioEngine().getAnalyser();

    ctx.lineWidth = Math.max(1.5, w * 0.0022);
    ctx.strokeStyle = "#00E5FF";
    ctx.shadowColor = "rgba(0,229,255,0.8)";
    ctx.shadowBlur = 14;
    ctx.beginPath();

    if (analyser) {
      const n = analyser.fftSize;
      if (!timeRef.current || timeRef.current.length !== n) {
        timeRef.current = new Uint8Array(n);
      }
      analyser.getByteTimeDomainData(timeRef.current);
      const data = timeRef.current;
      const step = Math.max(1, Math.floor(n / w));
      for (let i = 0, x = 0; i < n; i += step, x++) {
        const y = h / 2 + ((data[i] - 128) / 128) * h * 0.46;
        if (x === 0) ctx.moveTo(0, y);
        else ctx.lineTo((i / n) * w, y);
      }
    } else {
      // idle sine
      for (let x = 0; x <= w; x += 4) {
        const y =
          h / 2 +
          Math.sin(x * 0.02 + t * 2.2) * Math.sin(x * 0.005 + t) * h * 0.18;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.globalAlpha = 0.5;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    // center line
    ctx.strokeStyle = "rgba(107,122,149,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
  });

  return <canvas ref={canvasRef} className="h-full w-full" />;
}
