import { getAudioEngine } from "@/features/audio/AudioEngine";

export interface Bands {
  /** overall RMS level 0..1 */
  level: number;
  bass: number;
  mid: number;
  treble: number;
  /** spectral centroid, normalized 0..1 over 0-8kHz */
  centroid: number;
  /** false until an AudioContext exists */
  active: boolean;
}

/**
 * Allocation-free per-frame band sampler.
 * Feeds the visual engine uniforms; typed arrays are reused.
 */
export function createBandSampler(): () => Bands {
  let freq: Uint8Array<ArrayBuffer> | null = null;
  let time: Uint8Array<ArrayBuffer> | null = null;
  const out: Bands = {
    level: 0,
    bass: 0,
    mid: 0,
    treble: 0,
    centroid: 0.35,
    active: false,
  };

  return function sample(): Bands {
    const engine = getAudioEngine();
    const analyser = engine.getAnalyser();
    if (!analyser) {
      out.active = false;
      return out;
    }
    const n = analyser.frequencyBinCount;
    if (!freq || freq.length !== n) {
      freq = new Uint8Array(n);
      time = new Uint8Array(analyser.fftSize);
    }
    analyser.getByteFrequencyData(freq);
    analyser.getByteTimeDomainData(time!);

    let sum = 0;
    const step = 4;
    for (let i = 0; i < time!.length; i += step) {
      const v = (time![i] - 128) / 128;
      sum += v * v;
    }
    out.level = Math.sqrt(sum / (time!.length / step));

    const hzPerBin = engine.getSampleRate() / 2 / n;
    const avg = (lo: number, hi: number): number => {
      const a = Math.max(0, Math.floor(lo / hzPerBin));
      const b = Math.min(n - 1, Math.max(a, Math.ceil(hi / hzPerBin)));
      let s = 0;
      for (let i = a; i <= b; i++) s += freq![i];
      return s / (b - a + 1) / 255;
    };
    out.bass = avg(20, 250);
    out.mid = avg(250, 2000);
    out.treble = avg(2000, 8000);

    let num = 0;
    let den = 0;
    const maxBin = Math.min(n - 1, Math.floor(8000 / hzPerBin));
    for (let i = 0; i <= maxBin; i++) {
      num += freq![i] * i;
      den += freq![i];
    }
    out.centroid = den > 0 ? num / den / maxBin : 0.35;
    out.active = true;
    return out;
  };
}
