import { SOLFEGGIO_FREQUENCIES } from "@/utils/constants";

/**
 * Phase 1 placeholder page.
 * Verifies design tokens, fonts and glass utilities render correctly.
 * Replaced by the full app shell in Phase 2.
 */
export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 p-6">
      <header className="text-center">
        <h1 className="text-4xl font-semibold tracking-[0.18em]">
          <span className="neon-text">LUXE WAVE</span>
        </h1>
        <p className="mt-1 text-sm tracking-[0.5em] text-lw-muted">
          GENERATOR
        </p>
        <div className="mx-auto mt-3 h-0.5 w-16 rounded-full bg-gradient-to-r from-lw-primary via-lw-glow to-lw-accent" />
      </header>

      <section className="glass w-full max-w-sm p-6">
        <p className="text-xs uppercase tracking-widest text-lw-muted">
          Phase 1 / Scaffold
        </p>
        <p className="mt-2 text-sm leading-relaxed">
          Design tokens, stores and project structure are in place. Audio
          engine and visuals arrive in the next phases.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {SOLFEGGIO_FREQUENCIES.map((hz) => (
            <span
              key={hz}
              className="glass-pill px-3 py-1 font-mono text-xs text-lw-primary"
            >
              {hz}Hz
            </span>
          ))}
        </div>
      </section>

      <footer className="font-mono text-[11px] text-lw-muted">
        #070B14 / #00E5FF / #FF2DAA / #7C4DFF
      </footer>
    </main>
  );
}
