/**
 * Ribbon shader: each ribbon is a long subdivided strip displaced
 * entirely in the vertex shader by 1D fbm noise, so geometry never
 * rebuilds on the CPU. Its frequency band level drives amplitude,
 * width and brightness.
 */

export const ribbonVert = /* glsl */ `
uniform float uTime;
uniform float uAmp;   // band level 0..1
uniform float uPhase; // per-ribbon offset
uniform float uFlow;  // global flow speed boost

varying vec2 vUv;

float hash1(float n) {
  return fract(sin(n) * 43758.5453123);
}
float noise1(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(hash1(i), hash1(i + 1.0), u);
}
float fbm1(float x) {
  return noise1(x) * 0.55
       + noise1(x * 2.13 + 5.0) * 0.30
       + noise1(x * 4.70 + 11.0) * 0.15;
}

void main() {
  vUv = uv;

  float t = uTime * (0.35 + uFlow * 0.9);
  float x = position.x * 0.85 + uPhase;
  float amp = 0.35 + uAmp * 1.5;

  float dy = (fbm1(x * 1.15 + t) - 0.5) * 2.0;
  float dz = (fbm1(x * 1.60 - t * 0.8 + 20.0) - 0.5) * 2.0;

  float thick = position.y; // strip thickness axis
  vec3 q;
  q.x = position.x;
  q.y = thick * (0.55 + uAmp * 1.0) + dy * amp;
  q.z = dz * amp * 0.9;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(q, 1.0);
}
`;

export const ribbonFrag = /* glsl */ `
precision highp float;

uniform vec3  uColor;
uniform float uAmp;

varying vec2 vUv;

void main() {
  // soft edges across the strip + fade at both ends
  float edge = smoothstep(0.0, 0.45, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
  float core = pow(edge, 1.8);
  float ends = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x);

  vec3 col = uColor * (0.4 + 2.2 * uAmp);
  gl_FragColor = vec4(col * core * ends, core * ends);
}
`;
