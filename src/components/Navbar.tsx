import React from 'react';

interface NavbarProps {
  earnedStarsCount: number;
  soundEnabled: boolean;
  starPulse: number;
  onHomeClick: () => void;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ earnedStarsCount, soundEnabled, starPulse, onHomeClick, onToggleSound }) => (
  <header className="sticky top-0 z-40 border-b-4 border-forest-200 bg-white/95 backdrop-blur px-3 py-2 shadow-sm">
    <div className="mx-auto flex max-w-5xl items-center justify-between gap-2">
      <button
        type="button"
        onClick={onHomeClick}
        aria-label="Beranda"
        className="inline-flex min-h-12 items-center gap-2 rounded-2xl px-2 font-display text-xl sm:text-2xl font-bold text-forest-800"
      >
        <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-100 text-2xl">🏠</span>
        <span className="hidden min-[400px]:inline">Rumah untuk Ola</span>
      </button>
      <div className="flex items-center gap-2">
        <span
          key={starPulse}
          className="inline-flex min-h-12 items-center gap-1 rounded-2xl bg-sun-200 px-3 font-display text-xl font-bold text-bark motion-safe:animate-[wiggle_0.5s_ease-in-out_2]"
          aria-label={`${earnedStarsCount} dari 7 bintang`}
        >
          <span aria-hidden="true">⭐</span> {earnedStarsCount}/7
        </span>
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={soundEnabled}
          aria-label={soundEnabled ? 'Matikan suara' : 'Nyalakan suara'}
          className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl text-2xl border-2 ${
            soundEnabled ? 'bg-sky-100 border-sky-200' : 'bg-rose-100 border-rose-200'
          }`}
        >
          <span aria-hidden="true">{soundEnabled ? '🔊' : '🔇'}</span>
        </button>
      </div>
    </div>
  </header>
);
