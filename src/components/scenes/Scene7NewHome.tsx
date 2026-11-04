import React, { useState } from 'react';
import { Heart, Sparkles, ArrowRight, Trees } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speechService } from '../../utils/speech';

interface Scene7NewHomeProps {
  onComplete: () => void;
}

export const Scene7NewHome: React.FC<Scene7NewHomeProps> = ({ onComplete }) => {
  const [hugged, setHugged] = useState(false);

  const handleHeartHug = () => {
    setHugged(true);
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore
    }

    speechService.speak(
      'Ola memeluk ibunya dengan penuh kehangatan di atas sarang pohon yang baru. Ola punya rumah lagi!',
      { rate: 0.95, pitch: 1.15 }
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Heart Reunion Sandbox */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-emerald-950/70 via-teal-900/60 to-emerald-950/80 border-2 border-amber-300/80 p-5 sm:p-7 shadow-lg min-h-[360px] flex flex-col justify-between">
        {/* Rain and green forest aura */}
        <div className="z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 text-xs sm:text-sm font-black text-emerald-950 border border-emerald-300">
            <Trees className="w-4 h-4 text-emerald-600" />
            <span>Misi Terakhir: Satukan Ola dan Ibunya</span>
          </div>

          <div className="text-xs font-bold text-emerald-200">
            🌧️ Hujan sejuk menyegarkan rimba
          </div>
        </div>

        {/* Center: The Hug Visual */}
        <div className="my-auto z-10 py-4 flex flex-col items-center justify-center text-center">
          {hugged ? (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl animate-bounce">💖</span>
                <span className="text-6xl sm:text-7xl animate-pulse">🦧❤️🦧</span>
                <span className="text-4xl animate-bounce">💖</span>
              </div>
              <div className="bg-emerald-950/90 text-emerald-100 p-4 rounded-2xl border-2 border-emerald-400 max-w-md shadow-xl">
                <p className="text-base sm:text-lg font-black text-white">
                  Pelukan Hangat Penuh Cinta!
                </p>
                <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                  Malam ini Ola tidur nyenyak di sarang baru bersama sang ibu di kanopi hutan Kalimantan yang damai.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-6 text-5xl sm:text-6xl">
                <span className="animate-bounce">🦧</span>
                <span className="text-3xl text-amber-300 animate-pulse">⋯⋯</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>
                  🦧
                </span>
              </div>
              <p className="text-sm sm:text-base font-extrabold text-amber-100 max-w-sm">
                Ola melihat ibunya di dahan pohon! Tekan tombol "Pelukan Hati" di bawah untuk menyatukan mereka:
              </p>
            </div>
          )}
        </div>

        {/* Big Button: Pelukan Hati */}
        <div className="z-10 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {!hugged ? (
            <button
              onClick={handleHeartHug}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-lg sm:text-xl shadow-xl transition-all cursor-pointer active:scale-95 ring-4 ring-rose-400/50 animate-bounce"
            >
              <Heart className="w-6 h-6 fill-white" />
              <span>Tekan Tombol "Pelukan Hati" ❤️</span>
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg sm:text-xl shadow-xl transition-all cursor-pointer active:scale-95 ring-4 ring-emerald-400/50"
            >
              <Sparkles className="w-6 h-6 text-amber-300" />
              <span>Buka Layar Akhir & Bintang Perolehan</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
