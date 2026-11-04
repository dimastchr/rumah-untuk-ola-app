import React from 'react';
import { Home, Volume2, VolumeX, BookOpen, Users, Star, Type } from 'lucide-react';
import { ReadingLevel } from '../types';

interface NavbarProps {
  currentScene: number;
  readingLevel: ReadingLevel;
  earnedStarsCount: number;
  soundEnabled: boolean;
  isUppercase: boolean;
  onHomeClick: () => void;
  onToggleSound: () => void;
  onToggleUppercase: () => void;
  onSelectLevel: (level: ReadingLevel) => void;
  onOpenCharacters: () => void;
  onOpenTeacherGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScene,
  readingLevel,
  earnedStarsCount,
  soundEnabled,
  isUppercase,
  onHomeClick,
  onToggleSound,
  onToggleUppercase,
  onSelectLevel,
  onOpenCharacters,
  onOpenTeacherGuide,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs px-3 sm:px-6 py-2.5 sm:py-3 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Home */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={onHomeClick}
            className="flex items-center gap-2 text-amber-900 hover:text-amber-700 font-extrabold text-base sm:text-xl tracking-tight transition-transform active:scale-95 group focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-xl px-2 py-1"
            title="Kembali ke Beranda"
          >
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-xl group-hover:bg-amber-200 transition-colors shadow-xs">
              <Home className="w-5 h-5 sm:w-6 h-6" />
            </span>
            <span className="font-display font-black text-amber-900 hidden xs:inline">Rumah untuk Ola</span>
          </button>

          {/* Quick links to Tokoh & Panduan Guru */}
          <div className="hidden md:flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
            <button
              onClick={onOpenCharacters}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                currentScene === 9
                  ? 'bg-amber-200 text-amber-950 font-bold'
                  : 'hover:bg-amber-100 text-amber-900'
              }`}
            >
              <Users className="w-4 h-4 text-amber-700" />
              <span>Kenalan Tokoh</span>
            </button>

            <button
              onClick={onOpenTeacherGuide}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                currentScene === 10
                  ? 'bg-emerald-200 text-emerald-950 font-bold'
                  : 'hover:bg-emerald-100 text-emerald-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Panduan Guru</span>
            </button>
          </div>
        </div>

        {/* Center / Scene indicator if reading */}
        {currentScene >= 1 && currentScene <= 7 && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-100/80 rounded-full border border-amber-200/90 text-xs sm:text-sm font-bold text-amber-900 shadow-2xs">
            <span>Adegan {currentScene} dari 7</span>
          </div>
        )}

        {/* Right controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Level Switcher (Mudah / Sedang) */}
          <div className="flex items-center bg-amber-100/90 p-1 rounded-xl border border-amber-200/90 text-xs font-bold shadow-2xs">
            <button
              onClick={() => onSelectLevel('mudah')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all ${
                readingLevel === 'mudah'
                  ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                  : 'text-amber-900 hover:text-emerald-800'
              }`}
              title="Level Mudah: Kalimat pendek dan mudah dibaca"
            >
              Mudah
            </button>
            <button
              onClick={() => onSelectLevel('sedang')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all ${
                readingLevel === 'sedang'
                  ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                  : 'text-amber-900 hover:text-emerald-800'
              }`}
              title="Level Sedang: Kalimat lebih kaya kosakata"
            >
              Sedang
            </button>
          </div>

          {/* Uppercase toggle */}
          <button
            onClick={onToggleUppercase}
            className={`p-2 rounded-xl transition-all flex items-center gap-1 text-xs font-bold border ${
              isUppercase
                ? 'bg-amber-200 text-amber-950 border-amber-300 shadow-2xs'
                : 'bg-white hover:bg-amber-50 text-slate-700 border-amber-200'
            }`}
            title={isUppercase ? 'Mode Huruf Besar Aktif' : 'Ganti ke Huruf Besar'}
          >
            <Type className="w-4 h-4 text-amber-800" />
            <span className="hidden sm:inline">{isUppercase ? 'HURUF BESAR' : 'Huruf Kecil'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold border ${
              soundEnabled
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                : 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
            }`}
            title={soundEnabled ? 'Matikan Suara (Mute)' : 'Nyalakan Suara (Unmute)'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 sm:w-5 h-5 text-emerald-700" />
                <span className="hidden md:inline">Suara: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 sm:w-5 h-5 text-rose-700" />
                <span className="hidden md:inline">Suara: OFF</span>
              </>
            )}
          </button>

          {/* Stars tally */}
          <div
            className="flex items-center gap-1 px-2.5 py-1.5 bg-yellow-100/90 text-yellow-900 rounded-xl border border-yellow-300 text-xs sm:text-sm font-extrabold shadow-2xs"
            title={`${earnedStarsCount} dari 7 Bintang Tersimpan`}
          >
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 animate-pulse" />
            <span>{earnedStarsCount}/7</span>
          </div>
        </div>
      </div>
    </header>
  );
};
