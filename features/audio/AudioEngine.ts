import { ANALYSER_FFT_SIZE, ANALYSER_SMOOTHING } from "@/utils/constants";

/**
 * Singleton Web Audio engine.
 *
 * Graph:
 *   file : BufferSource -> Analyser -> Gain -> destination
 *   mic  : MediaStreamSource -> Analyser (output muted to avoid feedback)
 *
 * One shared AnalyserNode feeds the FFT views, the visual engine and
 * the Solfeggio detector. Per-frame data is read through refs/typed
 * arrays here - never through the Zustand stores.
 */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private gain: GainNode | null = null;
  private recDest: MediaStreamAudioDestinationNode | null = null;

  private buffer: AudioBuffer | null = null;
  private fileSource: AudioBufferSourceNode | null = null;
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;

  private startedAt = 0;
  private pausedOffset = 0;
  private manualStop = false;

  private volume = 0.7;
  private micActive = false;
  playing = false;

  /** called when file playback reaches the natural end */
  onEnded: (() => void) | null = null;

  /** Must be called from a user gesture on iOS Safari. */
  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctor();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = ANALYSER_FFT_SIZE;
      this.analyser.smoothingTimeConstant = ANALYSER_SMOOTHING;
      this.gain = this.ctx.createGain();
      this.analyser.connect(this.gain);
      this.gain.connect(this.ctx.destination);
      // parallel tap for recording (always carries signal, even for mic)
      this.recDest = this.ctx.createMediaStreamDestination();
      this.analyser.connect(this.recDest);
      this.applyVolume();
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  async loadFile(file: File): Promise<number> {
    const ctx = this.ensureContext();
    this.stopFileSource();
    this.stopMic();
    const data = await file.arrayBuffer();
    this.buffer = await ctx.decodeAudioData(data);
    this.pausedOffset = 0;
    return this.buffer.duration;
  }

  play(): boolean {
    if (!this.buffer || !this.analyser) return false;
    const ctx = this.ensureContext();
    this.stopFileSource();
    this.stopMic();

    const src = ctx.createBufferSource();
    src.buffer = this.buffer;
    src.connect(this.analyser);
    const offset = this.pausedOffset % this.buffer.duration;
    src.onended = () => {
      if (this.manualStop) return;
      this.playing = false;
      this.pausedOffset = 0;
      this.onEnded?.();
    };
    src.start(0, offset);
    this.fileSource = src;
    this.startedAt = ctx.currentTime;
    this.pausedOffset = offset;
    this.playing = true;
    this.applyVolume();
    return true;
  }

  pause(): void {
    if (!this.playing || !this.ctx) return;
    this.pausedOffset += this.ctx.currentTime - this.startedAt;
    this.stopFileSource();
    this.playing = false;
  }

  private stopFileSource(): void {
    if (this.fileSource) {
      this.manualStop = true;
      try {
        this.fileSource.stop();
      } catch {
        /* already stopped */
      }
      this.fileSource.disconnect();
      this.fileSource = null;
      this.manualStop = false;
    }
    this.playing = false;
  }

  async startMic(): Promise<void> {
    const ctx = this.ensureContext();
    this.pause();
    if (this.micActive) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.micStream = stream;
    this.micSource = ctx.createMediaStreamSource(stream);
    this.micSource.connect(this.analyser!);
    this.micActive = true;
    this.applyVolume(); // mutes output while mic is live
  }

  stopMic(): void {
    if (!this.micActive) return;
    this.micSource?.disconnect();
    this.micSource = null;
    this.micStream?.getTracks().forEach((t) => t.stop());
    this.micStream = null;
    this.micActive = false;
    this.applyVolume();
  }

  get isMicActive(): boolean {
    return this.micActive;
  }

  getCurrentTime(): number {
    if (!this.ctx) return 0;
    return this.playing
      ? this.pausedOffset + this.ctx.currentTime - this.startedAt
      : this.pausedOffset;
  }

  setVolume(v: number): void {
    this.volume = v;
    this.applyVolume();
  }

  private applyVolume(): void {
    if (this.gain) this.gain.gain.value = this.micActive ? 0 : this.volume;
  }

  /** Shared analyser for FFT views / visuals / detector (Phase 4+). */
  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  /** Fill target with float time-domain samples (Phase 7 detector). */
  getFloatTimeDomain(target: Float32Array<ArrayBuffer>): boolean {
    if (!this.analyser) return false;
    this.analyser.getFloatTimeDomainData(target);
    return true;
  }

  getSampleRate(): number {
    return this.ctx?.sampleRate ?? 44100;
  }

  /** Audio track for video export (null before context init). */
  getRecordingStream(): MediaStream | null {
    return this.recDest?.stream ?? null;
  }
}

let engine: AudioEngine | null = null;

export function getAudioEngine(): AudioEngine {
  if (!engine) engine = new AudioEngine();
  return engine;
}
