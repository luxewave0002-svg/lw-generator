"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PiSparkle } from "react-icons/pi";
import { useAnalyzerStore } from "@/stores/analyzerStore";
import { formatTime } from "@/utils/format";

/**
 * Floating "detected" badge inside the visual stage.
 * Driven by analyzerStore.activeDetection (wired by the detector in Phase 7).
 */
export default function DetectionBadge() {
  const detection = useAnalyzerStore((s) => s.activeDetection);

  return (
    <AnimatePresence>
      {detection && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="glass absolute bottom-5 left-1/2 -translate-x-1/2 px-6 py-3 text-center"
        >
          <div className="flex items-center gap-2.5">
            <PiSparkle className="text-lw-primary" size={22} />
            <span className="neon-text font-mono text-2xl font-semibold">
              {detection.frequency}Hz
            </span>
            <span className="text-xs font-semibold tracking-widest text-lw-accent">
              DETECTED
            </span>
          </div>
          <p className="mt-0.5 font-mono text-xs text-lw-muted">
            {formatTime(detection.time)}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
