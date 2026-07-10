"use client";

import { useEffect, useRef, useState } from "react";
import { FiCamera, FiVideo, FiSquare } from "react-icons/fi";
import BottomSheet from "@/components/ui/BottomSheet";
import {
  captureScreenshot,
  startRecording,
  type Recorder,
} from "@/features/export/capture";
import { useExportStore } from "@/stores/exportStore";
import { formatTime } from "@/utils/format";

/** Screenshot (PNG) and video (WebM) export. */
export default function ExportSheet() {
  const status = useExportStore((s) => s.status);
  const setStatus = useExportStore((s) => s.setStatus);
  const recorder = useRef<Recorder | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [note, setNote] = useState<string | null>(null);

  const recording = status === "recording";

  useEffect(() => {
    if (!recording) return;
    setElapsed(0);
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [recording]);

  const shot = async () => {
    const ok = await captureScreenshot();
    setNote(ok ? "Saved PNG ✓" : "Capture failed");
    setTimeout(() => setNote(null), 2500);
  };

  const toggleRecord = () => {
    if (recording) {
      recorder.current?.stop();
      recorder.current = null;
      return;
    }
    const rec = startRecording(
      () => {
        setStatus("idle");
        setNote("Saved WebM ✓");
        setTimeout(() => setNote(null), 2500);
      },
      () => {
        setStatus("error");
        setNote("Recording unavailable");
        setTimeout(() => setNote(null), 2500);
      },
    );
    if (rec) {
      recorder.current = rec;
      setStatus("recording");
    }
  };

  const tile =
    "glass-pill flex flex-col items-center gap-2 py-5 text-sm font-medium tracking-wide transition-colors";

  return (
    <BottomSheet id="export" title="EXPORT">
      <div className="grid grid-cols-2 gap-3">
        <button onClick={shot} className={`${tile} text-lw-text hover:text-lw-primary`}>
          <FiCamera size={26} className="text-lw-primary" />
          Screenshot
          <span className="text-[11px] text-lw-muted">PNG</span>
        </button>

        <button
          onClick={toggleRecord}
          className={`${tile} ${recording ? "neon-ring text-lw-accent" : "text-lw-text hover:text-lw-primary"}`}
        >
          {recording ? (
            <>
              <FiSquare size={26} className="text-lw-accent" />
              Stop
              <span className="font-mono text-[11px] text-lw-accent">
                ● {formatTime(elapsed)}
              </span>
            </>
          ) : (
            <>
              <FiVideo size={26} className="text-lw-primary" />
              Record
              <span className="text-[11px] text-lw-muted">WebM + audio</span>
            </>
          )}
        </button>
      </div>

      <p className="mt-4 min-h-4 text-center text-xs text-lw-muted">
        {note ??
          "Captures the live visual. Video includes audio when a track is playing."}
      </p>
    </BottomSheet>
  );
}
