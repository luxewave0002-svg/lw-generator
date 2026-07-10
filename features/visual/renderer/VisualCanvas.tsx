"use client";

import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { setCaptureHandle } from "@/features/visual/renderer/captureBus";
import { useVisualStore } from "@/stores/visualStore";
import FluidScene from "@/features/visual/fluid/FluidScene";
import RibbonScene from "@/features/visual/ribbon/RibbonScene";

/** Routes the active VisualMode to its scene. Extend for new modes. */
function SceneRouter() {
  const mode = useVisualStore((s) => s.mode);
  if (mode === "ribbon") return <RibbonScene />;
  return <FluidScene />;
}

/** Publishes the renderer/canvas to the capture bus for export. */
function CaptureRegistrar() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    setCaptureHandle({ gl, canvas: gl.domElement });
    return () => setCaptureHandle(null);
  }, [gl]);
  return null;
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
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <CaptureRegistrar />
      <SceneRouter />
    </Canvas>
  );
}
