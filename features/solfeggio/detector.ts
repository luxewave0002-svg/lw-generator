/**
 * Solfeggio pitch detection (Phase 7).
 *
 * A plain FFT bin at fftSize 4096 is ~10.7 Hz wide, far too coarse for
 * the +-1 Hz spec. Instead we run autocorrelation on the time-domain
 * signal and refine the best lag with parabolic interpolation, which
 * resolves clean tones to well under 1 Hz.
 */

const MIN_HZ = 120;
const MAX_HZ = 1100;

export interface PitchResult {
  hz: number;
  /** peak clarity 0..1 (1 = perfectly periodic) */
  clarity: number;
}

const acf = new Float32Array(2048);

export function detectPitchHz(
  buf: Float32Array,
  sampleRate: number,
): PitchResult | null {
  const n = buf.length;
  const minLag = Math.floor(sampleRate / MAX_HZ);
  const maxLag = Math.min(acf.length - 2, Math.ceil(sampleRate / MIN_HZ));

  // zero-lag energy for normalization
  let e0 = 0;
  for (let i = 0; i < n; i++) e0 += buf[i] * buf[i];
  if (e0 <= 1e-6) return null;

  let best = -Infinity;
  let bestLag = -1;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let s = 0;
    for (let i = 0; i < n - lag; i++) s += buf[i] * buf[i + lag];
    const v = s / (n - lag);
    acf[lag] = v;
    if (v > best) {
      best = v;
      bestLag = lag;
    }
  }
  if (bestLag <= minLag || bestLag >= maxLag) return null;

  const clarity = best / (e0 / n);
  if (clarity < 0.3) return null; // not periodic enough

  // parabolic interpolation around the peak
  const y1 = acf[bestLag - 1];
  const y2 = acf[bestLag];
  const y3 = acf[bestLag + 1];
  const denom = y1 - 2 * y2 + y3;
  const shift = denom !== 0 ? (0.5 * (y1 - y3)) / denom : 0;
  const lag = bestLag + Math.max(-0.5, Math.min(0.5, shift));

  return { hz: sampleRate / lag, clarity: Math.min(1, clarity) };
}

export function computeRms(buf: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < buf.length; i += 2) sum += buf[i] * buf[i];
  return Math.sqrt(sum / (buf.length / 2));
}
