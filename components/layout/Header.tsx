"use client";

import { FiMenu, FiSettings } from "react-icons/fi";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-5 pt-4">
      <button
        aria-label="Menu"
        className="rounded-full p-2 text-lw-muted transition-colors hover:text-lw-text"
      >
        <FiMenu size={22} />
      </button>

      <div className="text-center">
        <h1 className="bg-gradient-to-r from-lw-primary via-lw-glow to-lw-accent bg-clip-text text-xl font-semibold tracking-[0.25em] text-transparent">
          LUXE WAVE
        </h1>
        <p className="text-xs tracking-[0.35em] text-lw-muted">Generator</p>
        <div className="mx-auto mt-1.5 h-0.5 w-12 rounded-full bg-gradient-to-r from-lw-primary to-lw-accent" />
      </div>

      <button
        aria-label="Settings"
        className="rounded-full p-2 text-lw-muted transition-colors hover:text-lw-text"
      >
        <FiSettings size={22} />
      </button>
    </header>
  );
}
