"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { fluidVert, fluidFrag } from "@/shaders/fluid";
import { createBandSampler } from "@/features/audio/analysis";

/** baseline motion so the visual breathes before any audio plays */
const IDLE = { level: 0.1, bass: 0.18, mid: 0.3, treble: 0.15, centroid: 0.35 };
const SMOOTH = 0.12;

export default function FluidScene({ variant = 0 }: { variant?: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const sampler = useMemo(() => createBandSampler(), []);
  const smooth = useRef({ ...IDLE });

  const uniforms = useMemo(
    () => ({
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uLevel: { value: IDLE.level },
      uBass: { value: IDLE.bass },
      uMid: { value: IDLE.mid },
      uTreble: { value: IDLE.treble },
      uCentroid: { value: IDLE.centroid },
      uVariant: { value: variant },
    }),
    [variant],
  );

  useFrame((state) => {
    const m = matRef.current;
    if (!m) return;
    const b = sampler();
    const s = smooth.current;

    const target = b.active
      ? {
          level: Math.min(1, Math.max(b.level * 1.6, IDLE.level * 0.5)),
          bass: Math.max(b.bass, 0.05),
          mid: Math.max(b.mid, 0.12),
          treble: b.treble,
          centroid: b.centroid,
        }
      : IDLE;

    s.level += (target.level - s.level) * SMOOTH;
    s.bass += (target.bass - s.bass) * SMOOTH;
    s.mid += (target.mid - s.mid) * SMOOTH;
    s.treble += (target.treble - s.treble) * SMOOTH;
    s.centroid += (target.centroid - s.centroid) * SMOOTH;

    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uRes.value.set(
      state.size.width * state.viewport.dpr,
      state.size.height * state.viewport.dpr,
    );
    m.uniforms.uLevel.value = s.level;
    m.uniforms.uBass.value = s.bass;
    m.uniforms.uMid.value = s.mid;
    m.uniforms.uTreble.value = s.treble;
    m.uniforms.uCentroid.value = s.centroid;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={fluidVert}
        fragmentShader={fluidFrag}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
