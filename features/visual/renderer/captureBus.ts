import type * as THREE from "three";

/**
 * Module-level handle to the live WebGL renderer/canvas so the export
 * feature can grab frames without prop-drilling through R3F.
 */
interface CaptureHandle {
  gl: THREE.WebGLRenderer;
  canvas: HTMLCanvasElement;
}

let handle: CaptureHandle | null = null;

export function setCaptureHandle(h: CaptureHandle | null): void {
  handle = h;
}

export function getCaptureCanvas(): HTMLCanvasElement | null {
  return handle?.canvas ?? null;
}
