"use client";

import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "framer-motion";
import { FiUploadCloud } from "react-icons/fi";
import { useAudioCommands } from "@/hooks/useAudioCommands";

/**
 * Full-page drag & drop surface for MP3 / WAV.
 * Click-to-open is handled by the UPLOAD button in SourceBar.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const { loadFile } = useAudioCommands();

  const { getRootProps, isDragActive } = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: false,
    accept: {
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
      "audio/x-wav": [".wav"],
    },
    onDrop: (files) => {
      if (files[0]) void loadFile(files[0]);
    },
  });

  return (
    <div {...getRootProps()} className="relative min-h-dvh outline-none">
      {children}
      <AnimatePresence>
        {isDragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-lw-bg/80 backdrop-blur-md"
          >
            <div className="glass neon-ring flex flex-col items-center gap-3 px-10 py-8">
              <FiUploadCloud size={40} className="text-lw-primary" />
              <p className="text-sm tracking-widest text-lw-text">
                Drop MP3 / WAV to play
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
