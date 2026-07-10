/**
 * Audio-reactive fluid shader.
 * Domain-warped fbm produces flowing neon filaments; audio bands
 * modulate warp strength (bass), flow speed (mid), filament density
 * (treble), color balance (centroid) and brightness (level).
 */

export const fluidVert = /* glsl */ `
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const fluidFrag = /* glsl */ `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform float uLevel;
uniform float uBass;
uniform float uMid;
uniform float uTreble;
uniform float uCentroid;
uniform float uVariant; // 0 = fluid, 1 = ribbon-ish (temporary, Phase 6)

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  float t = uTime * (0.05 + 0.10 * uMid);

  vec2 p = uv * (1.8 + 0.6 * uVariant);

  // two-stage domain warp
  vec2 q = vec2(
    fbm(p + vec2(0.0, t)),
    fbm(p + vec2(5.2, 1.3) - t * 0.7)
  );
  float w = 1.2 + 2.6 * uBass;
  vec2 r = vec2(
    fbm(p + w * q + vec2(1.7, 9.2) + 0.15 * t),
    fbm(p + w * q + vec2(8.3, 2.8) - 0.12 * t)
  );
  float f = fbm(p + 2.2 * r);

  // neon filaments
  float bands = 3.0 + 5.0 * uTreble + 4.0 * uVariant;
  float fil = abs(fract(f * bands + t * 0.5) - 0.5);
  float lines = pow(smoothstep(0.28 - 0.10 * uVariant, 0.0, fil), 1.5);

  vec3 cCyan = vec3(0.0, 0.898, 1.0);   // #00E5FF
  vec3 cGlow = vec3(0.486, 0.302, 1.0); // #7C4DFF
  vec3 cAcc  = vec3(1.0, 0.176, 0.667); // #FF2DAA

  vec3 col = mix(cCyan, cGlow, clamp(f * 1.5, 0.0, 1.0));
  col = mix(col, cAcc, smoothstep(0.35, 0.95, q.y + uCentroid * 0.6));

  float energy = 0.25 + 1.6 * uLevel;
  vec3 base  = col * (f * f) * 0.35 * energy;
  vec3 fl    = col * lines * (0.55 + 1.8 * uLevel);

  // treble sparkles
  float sp = step(0.9975, hash(floor(uv * 90.0) + floor(uTime * 3.0)));
  vec3 spark = vec3(1.0) * sp * (0.15 + 0.85 * uTreble);

  vec3 outCol = base + fl + spark;

  // vignette + faint blue depth
  float vig = smoothstep(1.15, 0.35, length(uv));
  outCol *= vig;
  outCol += vec3(0.012, 0.02, 0.05) * vig;

  gl_FragColor = vec4(outCol, 1.0);
}
`;
