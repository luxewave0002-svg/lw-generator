"use client";

import FluidScene from "@/features/visual/fluid/FluidScene";

/**
 * Ribbon mode.
 * Phase 5 interim: reuses the fluid shader with a denser filament
 * variant so the mode switch stays meaningful.
 * Phase 6 replaces this with true 3D tube ribbons per frequency band.
 */
export default function RibbonScene() {
  return <FluidScene variant={1} />;
}
