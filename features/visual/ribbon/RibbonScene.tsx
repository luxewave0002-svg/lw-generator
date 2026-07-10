"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ribbonVert, ribbonFrag } from "@/shaders/ribbon";
import { createBandLevelSampler } from "@/features/audio/analysis";

const COUNT = 7;
const SMOOTH = 0.16;

const C_LOW = new THREE.Color("#00E5FF");
const C_MID = new THREE.Color("#7C4DFF");
const C_HIGH = new THREE.Color("#FF2DAA");

function bandColor(t: number): THREE.Color {
  return t < 0.5
    ? C_LOW.clone().lerp(C_MID, t * 2)
    : C_MID.clone().lerp(C_HIGH, (t - 0.5) * 2);
}

/**
 * Ribbon mode (Phase 6): one GPU-displaced strip per frequency band.
 * Low bands render at the bottom in cyan, highs on top in magenta.
 */
export default function RibbonScene() {
  const sampler = useMemo(() => createBandLevelSampler(COUNT), []);
  const smooth = useRef(new Float32Array(COUNT));
  const mats = useRef<(THREE.ShaderMaterial | null)[]>([]);
  const group = useRef<THREE.Group>(null);

  const ribbons = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        y: (i - (COUNT - 1) / 2) * 0.42,
        phase: i * 3.71,
        uniforms: {
          uTime: { value: 0 },
          uAmp: { value: 0.15 },
          uPhase: { value: i * 3.71 },
          uFlow: { value: 0 },
          uColor: { value: bandColor(i / (COUNT - 1)) },
        },
      })),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const b = sampler();
    const s = smooth.current;
    let sum = 0;

    for (let i = 0; i < COUNT; i++) {
      const target = b.active
        ? Math.min(1, b.levels[i] * 1.25)
        : 0.14 + 0.08 * Math.sin(t * 0.8 + i * 1.7);
      s[i] += (target - s[i]) * SMOOTH;
      sum += s[i];
      const m = mats.current[i];
      if (m) {
        m.uniforms.uTime.value = t;
        m.uniforms.uAmp.value = s[i];
        m.uniforms.uFlow.value = sum / COUNT;
      }
    }

    const g = group.current;
    if (g) {
      const energy = sum / COUNT;
      g.rotation.z = Math.sin(t * 0.07) * 0.14;
      g.rotation.x = Math.sin(t * 0.05) * 0.1;
      const sc = 1 + energy * 0.12;
      g.scale.setScalar(sc);
    }
  });

  return (
    <group ref={group}>
      {ribbons.map((r, i) => (
        <mesh key={i} position={[0, r.y, 0]} frustumCulled={false}>
          <planeGeometry args={[8, 0.5, 220, 1]} />
          <shaderMaterial
            ref={(m) => {
              mats.current[i] = m;
            }}
            vertexShader={ribbonVert}
            fragmentShader={ribbonFrag}
            uniforms={r.uniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
