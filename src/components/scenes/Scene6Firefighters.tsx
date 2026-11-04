import React, { useState } from 'react';
import { Flame, Droplets, Trees, Star, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speechService } from '../../utils/speech';

interface Scene6FirefightersProps {
  onComplete: () => void;
}

export const Scene6Firefighters: React.FC<Scene6FirefightersProps> = ({ onComplete }) => {
  // Steps: 1 = Api, 2 = Siram Gambut, 3 = Tanam Bibit
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [flames, setFlames] = useState<number[]>([1, 2, 3, 4]); // 4 flame spots
  const [waterCount, setWaterCount] = useState<number>(0); // needs 3 waters
  const [seedsPlanted, setSeedsPlanted] = useState<number>(0); // needs 3 seeds
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [warnMessage, setWarnMessage] = useState<string | null>(null);

  // 1. Extinguish flame
  const handleExtinguishFlame = (id: number) => {
    setWarnMessage(null);
    setFlames((prev) => {
      const remaining = prev.filter((f) => f !== id);
      if (remaining.length === 0) {
        setActiveStep(2);
        speechService.speak(
          'Hebat! Api sudah padam. Sekarang mari siram tanah gambutnya!',
          { rate: 0.95, pitch: 1.15 }
        );
      } else {
        speechService.speak('Satu titik api padam!', { rate: 1.0, pitch: 1.1 });
      }
      return remaining;
    });
  };

  // 2. Water peatland
  const handleWaterPeat = () => {
    setWarnMessage(null);
    if (flames.length > 0) {
      setWarnMessage('Padamkan apinya dulu, ya.');
      speechService.speak('Padamkan apinya dulu, ya.', { rate: 0.95, pitch: 1.1 });
      return;
    }

    const nextCount = waterCount + 1;
    setWaterCount(nextCount);

    if (nextCount >= 3) {
      setActiveStep(3);
      speechService.speak(
        'Tanah gambut sudah basah dan sejuk seperti spons raksasa. Ayo tanam bibit pohonnya!',
        { rate: 0.95, pitch: 1.15 }
      );
    } else {
      speechService.speak('Syuuur! Gambut semakin basah.', { rate: 1.0, pitch: 1.1 });
    }
  };

  // 3. Plant seed
  const handlePlantSeed = () => {
    setWarnMessage(null);
    // If flames still exist:
    if (flames.length > 0) {
      setWarnMessage('Padamkan apinya dulu, ya.');
      speechService.speak('Padamkan apinya dulu, ya.', { rate: 0.95, pitch: 1.1 });
      return;
    }

    // If peatland not watered yet:
    if (waterCount < 3) {
      setWarnMessage('Siram tanah gambutnya dulu sampai basah, ya.');
      speechService.speak('Siram tanah gambutnya dulu sampai basah, ya.', {
        rate: 0.95,
        pitch: 1.1,
      });
      return;
    }

    const nextSeed = seedsPlanted + 1;
    setSeedsPlanted(nextSeed);

    if (nextSeed >= 3 && !isCompleted) {
      setIsCompleted(true);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } catch {
        // Ignore
      }
      speechService.speak(
        'Luar biasa! Hutan kembali hijau dan berseri. Petugas Manggala Agni dan relawan melambaikan tangan terima kasih!',
        { rate: 0.95, pitch: 1.15 }
      );
    } else {
      speechService.speak('Satu bibit pohon tertanam subur!', { rate: 1.0, pitch: 1.1 });
    }
  };

  const handleReset = () => {
    setActiveStep(1);
    setFlames([1, 2, 3, 4]);
    setWaterCount(0);
    setSeedsPlanted(0);
    setIsCompleted(false);
    setWarnMessage(null);
  };

  return (
    <div className="w-full space-y-4">
      {/* Mini Game Box */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-stone-900/80 via-emerald-950/70 to-stone-900/90 border-2 border-amber-300/80 p-5 sm:p-6 shadow-lg min-h-[360px] flex flex-col justify-between">
        {/* Step Progression Pills */}
        <div className="z-10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Step 1 badge */}
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black transition-all ${
                flames.length === 0
                  ? 'bg-emerald-700 text-white'
                  : activeStep === 1
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-black/40 text-slate-300'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>1. Padamkan Api ({4 - flames.length}/4)</span>
            </div>

            {/* Step 2 badge */}
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black transition-all ${
                waterCount >= 3
                  ? 'bg-emerald-700 text-white'
                  : activeStep === 2
                  ? 'bg-sky-500 text-white animate-pulse'
                  : 'bg-black/40 text-slate-300'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>2. Siram Gambut ({waterCount}/3)</span>
            </div>

            {/* Step 3 badge */}
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black transition-all ${
                seedsPlanted >= 3
                  ? 'bg-emerald-700 text-white'
                  : activeStep === 3
                  ? 'bg-emerald-500 text-white animate-pulse'
                  : 'bg-black/40 text-slate-300'
              }`}
            >
              <Trees className="w-3.5 h-3.5" />
              <span>3. Tanam Bibit ({seedsPlanted}/3)</span>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-bold text-white bg-black/40 hover:bg-black/60 px-3 py-1.5 rounded-xl border border-white/20 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mulai Ulang</span>
          </button>
        </div>

        {/* Warning Toast if wrong order clicked */}
        {warnMessage && (
          <div className="z-10 p-2.5 rounded-xl bg-amber-500 text-amber-950 font-black text-xs text-center shadow-md animate-bounce">
            ⚠️ {warnMessage}
          </div>
        )}

        {/* Active Stage Interactive Field */}
        <div className="my-auto z-10 py-4 flex flex-col items-center justify-center">
          {/* If fully completed */}
          {isCompleted ? (
            <div className="space-y-3 text-center animate-fade-in">
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className="w-10 h-10 sm:w-12 sm:h-12 fill-amber-400 text-amber-400 animate-bounce"
                  />
                ))}
              </div>
              <div className="text-5xl sm:text-6xl animate-pulse">👨‍🚒👋👩‍🌾👋🌲✨</div>
              <div className="bg-emerald-950/90 text-emerald-200 px-5 py-3 rounded-2xl border-2 border-emerald-400 max-w-md shadow-xl">
                <p className="text-base sm:text-lg font-black text-white">
                  3 Bintang Emas Berhasil Diraih!
                </p>
                <p className="text-xs sm:text-sm text-emerald-300 mt-1">
                  Petugas Manggala Agni dan para relawan melambaikan tangan dengan penuh senyum rasa terima kasih!
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-lg space-y-4">
              {/* Forest Ground Interactive Surface */}
              <div
                className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center justify-center min-h-[170px] ${
                  waterCount >= 3
                    ? 'bg-emerald-950/80 border-emerald-400'
                    : flames.length === 0
                    ? 'bg-amber-950/70 border-sky-400'
                    : 'bg-stone-950/80 border-rose-500'
                }`}
              >
                {/* 1. Flames spots on field */}
                {flames.length > 0 && (
                  <div className="space-y-2 text-center">
                    <p className="text-xs sm:text-sm font-extrabold text-amber-200">
                      Ketuk semua titik api di bawah untuk memadamkannya:
                    </p>
                    <div className="flex items-center justify-center gap-4 sm:gap-6 pt-2">
                      {flames.map((f) => (
                        <button
                          key={f}
                          onClick={() => handleExtinguishFlame(f)}
                          className="text-4xl sm:text-5xl hover:scale-125 active:scale-90 transition-all cursor-pointer animate-bounce filter drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                          title="Ketuk untuk padamkan api ini!"
                        >
                          🔥
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Water peatland status */}
                {flames.length === 0 && waterCount < 3 && (
                  <div className="space-y-2 text-center">
                    <div className="text-4xl animate-bounce">🧽💦</div>
                    <p className="text-xs sm:text-sm font-extrabold text-sky-200">
                      Gambut masih kering! Ketuk tombol "Siram Gambut" di bawah ({waterCount}/3).
                    </p>
                  </div>
                )}

                {/* 3. Seeds planted view */}
                {waterCount >= 3 && !isCompleted && (
                  <div className="space-y-2 text-center">
                    <div className="text-4xl flex items-center justify-center gap-2">
                      {seedsPlanted === 0 && '🌱❓'}
                      {seedsPlanted === 1 && '🌱'}
                      {seedsPlanted === 2 && '🌱🌱'}
                      {seedsPlanted === 3 && '🌲🌲🌲'}
                    </div>
                    <p className="text-xs sm:text-sm font-extrabold text-emerald-200">
                      Tanah sudah sejuk! Ketuk tombol "Tanam Bibit" ({seedsPlanted}/3).
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3 Action Buttons Controls */}
        {!isCompleted && (
          <div className="z-10 grid grid-cols-3 gap-2 pt-2">
            <button
              onClick={() => {
                if (flames.length > 0) handleExtinguishFlame(flames[0]);
              }}
              disabled={flames.length === 0}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                flames.length > 0
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md active:scale-95 ring-2 ring-rose-400'
                  : 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
              }`}
            >
              <Flame className="w-5 h-5 sm:w-6 h-6 mb-1" />
              <span className="text-[11px] sm:text-xs font-black">
                {flames.length === 0 ? 'Api Padam ✓' : 'Padamkan Api'}
              </span>
            </button>

            <button
              onClick={handleWaterPeat}
              disabled={flames.length > 0 && false}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                flames.length === 0 && waterCount < 3
                  ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-md active:scale-95 ring-2 ring-sky-300 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <Droplets className="w-5 h-5 sm:w-6 h-6 mb-1 text-sky-300" />
              <span className="text-[11px] sm:text-xs font-black">
                {waterCount >= 3 ? 'Gambut Basah ✓' : 'Siram Gambut'}
              </span>
            </button>

            <button
              onClick={handlePlantSeed}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                waterCount >= 3
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95 ring-2 ring-emerald-300 animate-bounce'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <Trees className="w-5 h-5 sm:w-6 h-6 mb-1 text-emerald-300" />
              <span className="text-[11px] sm:text-xs font-black">
                {seedsPlanted >= 3 ? 'Bibit Tertanam ✓' : 'Tanam Bibit'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Completion Next Step */}
      {isCompleted && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-md flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm sm:text-base font-black text-emerald-950">
                Luar biasa! 3 Bintang Emas Penjaga Hutan menjadi milikmu.
              </p>
              <p className="text-xs text-emerald-800">
                Pohon-pohon baru kini siap tumbuh subur untuk tempat tinggal Ola.
              </p>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <span>Lanjut ke Adegan 7</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
