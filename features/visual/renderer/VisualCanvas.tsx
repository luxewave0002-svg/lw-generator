"use client";

import { Canvas } from "@react-three/fiber";
import { useVisualStore } from "@/stores/visualStore";
import FluidScene from "@/features/visual/fluid/FluidScene";
import RibbonScene from "@/features/visual/ribbon/RibbonScene";

/** Routes the active VisualMode to its scene. Extend for new modes. */
function SceneRouter() {
  const mode = useVisualStore((s) => s.mode);
  if (mode === "ribbon") return <RibbonScene />;
  return <FluidScene />;
}

/** The single R3F renderer instance for the whole app. */
export default function VisualCanvas() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop="always"
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <SceneRouter />
    </Canvas>
  );
}
