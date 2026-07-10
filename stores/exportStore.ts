import { create } from "zustand";

type ExportStatus = "idle" | "recording" | "processing" | "done" | "error";

/** Placeholder for screenshot / video export (post-MVP). */
interface ExportState {
  status: ExportStatus;
  progress: number;
  setStatus: (s: ExportStatus) => void;
  setProgress: (p: number) => void;
}

export const useExportStore = create<ExportState>((set) => ({
  status: "idle",
  progress: 0,
  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
}));
