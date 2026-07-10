import { getCaptureCanvas } from "@/features/visual/renderer/captureBus";
import { getAudioEngine } from "@/features/audio/AudioEngine";

function timestamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Save the current visual frame as a PNG. */
export async function captureScreenshot(): Promise<boolean> {
  const canvas = getCaptureCanvas();
  if (!canvas) return false;
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve(false);
      triggerDownload(blob, `luxewave_${timestamp()}.png`);
      resolve(true);
    }, "image/png");
  });
}

function pickMimeType(): string {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  return (
    candidates.find((t) => MediaRecorder.isTypeSupported(t)) ?? "video/webm"
  );
}

export interface Recorder {
  stop: () => void;
}

/** Record the canvas (plus audio when available) to a WebM download. */
export function startRecording(
  onStop: () => void,
  onError: (e: unknown) => void,
): Recorder | null {
  const canvas = getCaptureCanvas();
  if (!canvas || typeof MediaRecorder === "undefined") {
    onError(new Error("Recording not supported"));
    return null;
  }
  try {
    const stream = canvas.captureStream(30);
    const audio = getAudioEngine().getRecordingStream();
    audio?.getAudioTracks().forEach((t) => stream.addTrack(t));

    const rec = new MediaRecorder(stream, {
      mimeType: pickMimeType(),
      videoBitsPerSecond: 8_000_000,
    });
    const chunks: BlobPart[] = [];
    rec.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    rec.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      triggerDownload(blob, `luxewave_${timestamp()}.webm`);
      onStop();
    };
    rec.start();
    return { stop: () => rec.state !== "inactive" && rec.stop() };
  } catch (e) {
    onError(e);
    return null;
  }
}
