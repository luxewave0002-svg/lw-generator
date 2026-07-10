"use client";

import { useEffect, useState } from "react";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { PiWaveSine, PiSpiral } from "react-icons/pi";
import BottomSheet from "@/components/ui/BottomSheet";
import { useVisualStore, type VisualParams } from "@/stores/visualStore";

const PARAM_META: {
  key: keyof VisualParams;
  label: string;
  min: number;
  max: number;
  step: number;
}[] = [
  { key: "intensity", label: "Intensity", min: 0.2, max: 2, step: 0.05 },
  { key: "speed", label: "Speed", min: 0.2, max: 2, step: 0.05 },
  { key: "glow", label: "Glow", min: 0, max: 1, step: 0.02 },
];

/** Visual parameter sliders + save/apply/delete presets. */
export default function PresetsSheet() {
  const params = useVisualStore((s) => s.params);
  const presets = useVisualStore((s) => s.presets);
  const mode = useVisualStore((s) => s.mode);
  const setParam = useVisualStore((s) => s.setParam);
  const applyPreset = useVisualStore((s) => s.applyPreset);
  const savePreset = useVisualStore((s) => s.savePreset);
  const deletePreset = useVisualStore((s) => s.deletePreset);
  const hydratePresets = useVisualStore((s) => s.hydratePresets);
  const [name, setName] = useState("");

  useEffect(() => {
    hydratePresets();
  }, [hydratePresets]);

  const doSave = () => {
    savePreset(name);
    setName("");
  };

  return (
    <BottomSheet id="presets" title="PRESETS">
      <div className="space-y-3">
        {PARAM_META.map(({ key, label, min, max, step }) => {
          const val = params[key];
          const fill = ((val - min) / (max - min)) * 100;
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-xs text-lw-muted">
                {label}
              </span>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={val}
                onChange={(e) => setParam(key, Number(e.target.value))}
                className="lw-range w-full"
                style={{ ["--fill" as string]: `${fill}%` }}
              />
              <span className="w-10 shrink-0 text-right font-mono text-xs text-lw-text">
                {val.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name this preset…"
          maxLength={24}
          className="glass-pill flex-1 bg-transparent px-4 py-2.5 text-sm text-lw-text outline-none placeholder:text-lw-muted"
        />
        <button
          onClick={doSave}
          className="glass-pill neon-ring flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-lw-primary"
        >
          <FiPlus size={16} />
          Save
        </button>
      </div>

      <div className="mt-4 grid max-h-56 grid-cols-2 gap-2 overflow-y-auto pb-1">
        {presets.map((p) => {
          const Icon = p.mode === "ribbon" ? PiSpiral : PiWaveSine;
          const active =
            p.mode === mode &&
            p.params.intensity === params.intensity &&
            p.params.speed === params.speed &&
            p.params.glow === params.glow;
          return (
            <div
              key={p.id}
              className={`glass-pill flex items-center justify-between px-3 py-2.5 ${active ? "neon-ring" : ""}`}
            >
              <button
                onClick={() => applyPreset(p.id)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <Icon
                  size={16}
                  className={active ? "text-lw-primary" : "text-lw-muted"}
                />
                <span className="truncate text-sm text-lw-text">{p.name}</span>
              </button>
              {!p.builtin && (
                <button
                  onClick={() => deletePreset(p.id)}
                  aria-label={`Delete ${p.name}`}
                  className="ml-1 shrink-0 text-lw-muted transition-colors hover:text-lw-accent"
                >
                  <FiTrash2 size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </BottomSheet>
  );
}
