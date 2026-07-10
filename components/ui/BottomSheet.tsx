"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useUiStore, type SheetId } from "@/stores/uiStore";

/** Slide-up glass sheet used by PRESETS and EXPORT. */
export default function BottomSheet({
  id,
  title,
  children,
}: {
  id: Exclude<SheetId, null>;
  title: string;
  children: React.ReactNode;
}) {
  const open = useUiStore((s) => s.sheet === id);
  const close = useUiStore((s) => s.closeSheet);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className="glass fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-b-none px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 lg:max-w-2xl"
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-lw-muted/40" />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-[0.2em] text-lw-primary">
                {title}
              </h2>
              <button
                onClick={close}
                aria-label="Close"
                className="rounded-full p-1.5 text-lw-muted transition-colors hover:text-lw-text"
              >
                <FiX size={20} />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
