import React, { useState } from 'react';
import { ArrowDown, Trees, ArrowRight, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { speechService } from '../../utils/speech';

interface Scene2SmokeProps {
  onComplete: () => void;
}

export const Scene2Smoke: React.FC<Scene2SmokeProps> = ({ onComplete }) => {
  const [selectedChoice, setSelectedChoice] = useState<'none' | 'ground' | 'tree'>('none');
  const [isCoughing, setIsCoughing] = useState(false);

  const handleChooseGround = () => {
    setSelectedChoice('ground');
    setIsCoughing(true);
    // Voice feedback
    speechService.speak(
      'Duh, di bawah tanah ada asap tebal. Udara di bawah tidak sehat. Ayo berayun ke pohon hijau yang udaranya lebih bersih!',
      { rate: 0.95, pitch: 1.1 }
    );
  };

  const handleChooseTree = () => {
    setSelectedChoice('tree');
    setIsCoughing(false);
    // Voice feedback
    speechService.speak('Hebat! Di pohon hijau udaranya lebih bersih.', {
      rate: 0.95,
      pitch: 1.15,
    });
  };

  const handleRetry = () => {
    setSelectedChoice('none');
    setIsCoughing(false);
  };

  return (
    <div className="w-full space-y-4">
      {/* Choice Prompt & Interactive Visual */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900/80 via-amber-950/70 to-slate-900/90 border-2 border-amber-300/80 p-5 sm:p-7 shadow-lg flex flex-col justify-between min-h-[320px]">
        {/* Smoke particle overlay effect */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] animate-pulse"></div>

        {/* Status bar */}
        <div className="z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 text-amber-950 text-xs sm:text-sm font-black border border-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Pilihan Bercabang: Ke mana Ola harus pergi?</span>
          </div>

          {selectedChoice !== 'none' && (
            <button
              onClick={handleRetry}
              className="flex items-center gap-1 text-xs font-bold text-white bg-black/40 hover:bg-black/60 px-3 py-1.5 rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Pilih Ulang</span>
            </button>
          )}
        </div>

        {/* Center: Ola reaction state */}
        <div className="z-10 my-4 flex flex-col items-center justify-center text-center">
          {selectedChoice === 'ground' ? (
            <div className="space-y-2 animate-shake">
              <div className="text-5xl sm:text-6xl">🦧😷💨</div>
              <div className="bg-amber-950/90 text-amber-200 px-4 py-2 rounded-2xl border border-amber-400 max-w-md shadow-md">
                <p className="text-sm sm:text-base font-extrabold">
                  "Uhuk-uhuk! Di bawah tanah asapnya tebal sekali!"
                </p>
                <p className="text-xs text-amber-300 mt-1">
                  Mata Ola perih. Jangan khawatir, kamu bisa memilih ulang ke tempat yang aman!
                </p>
              </div>
            </div>
          ) : selectedChoice === 'tree' ? (
            <div className="space-y-2 animate-bounce">
              <div className="text-5xl sm:text-6xl">🦧🌿✨</div>
              <div className="bg-emerald-950/90 text-emerald-200 px-4 py-2 rounded-2xl border border-emerald-400 max-w-md shadow-md">
                <p className="text-sm sm:text-base font-extrabold">
                  "Hore! Ola berayun ke dahan pohon hijau yang udaranya segar!"
                </p>
                <p className="text-xs text-emerald-300 mt-1">
                  Pilihan yang sangat cerdas untuk menghindari asap tebal di lantai hutan.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-5xl sm:text-6xl animate-pulse">🦧❓</div>
              <p className="text-xs sm:text-sm font-bold text-amber-100 drop-shadow-md">
                Asap mengepul di sekitar. Bantu Ola memilih jalan terbaik:
              </p>
            </div>
          )}
        </div>

        {/* Two Big Pictorial Buttons */}
        <div className="z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Option A: Ground */}
          <button
            onClick={handleChooseGround}
            className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
              selectedChoice === 'ground'
                ? 'bg-amber-900/90 border-amber-400 text-white shadow-md'
                : 'bg-white/95 hover:bg-amber-50 border-amber-300 text-slate-800 hover:scale-102 active:scale-95'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center text-xl shrink-0">
              <ArrowDown className="w-6 h-6 text-slate-700" />
            </div>
            <div className="text-left">
              <span className="block text-[11px] font-black uppercase text-amber-800">
                Pilihan A (Lantai Hutan)
              </span>
              <span className="text-base sm:text-lg font-black block">
                Turun ke tanah berasap
              </span>
              <span className="text-xs text-slate-500">
                Lantai hutan dipenuhi kabut asap
              </span>
            </div>
          </button>

          {/* Option B: Tree */}
          <button
            onClick={handleChooseTree}
            className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
              selectedChoice === 'tree'
                ? 'bg-emerald-700 border-emerald-400 text-white shadow-md'
                : 'bg-white/95 hover:bg-emerald-50 border-emerald-300 text-slate-800 hover:scale-102 active:scale-95'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shrink-0">
              <Trees className="w-6 h-6 text-emerald-700" />
            </div>
            <div className="text-left">
              <span className="block text-[11px] font-black uppercase text-emerald-800">
                Pilihan B (Kanopi Rimbun)
              </span>
              <span className="text-base sm:text-lg font-black block">
                Berayun ke pohon hijau
              </span>
              <span className="text-xs text-slate-500">
                Udara di tajuk pohon lebih bersih
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Outcome / Next Button */}
      {selectedChoice === 'ground' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <p className="text-xs sm:text-sm font-semibold">
            Di bawah tanah udaranya kurang sehat. Ayo coba pilih <strong>Berayun ke pohon hijau</strong>!
          </p>
          <button
            onClick={handleChooseTree}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shrink-0 transition-all cursor-pointer"
          >
            Pindah ke Pohon Hijau 🌿
          </button>
        </div>
      )}

      {selectedChoice === 'tree' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-md flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm sm:text-base font-black text-emerald-950">
                Bagus sekali! Ola selamat di tajuk pohon hijau.
              </p>
              <p className="text-xs text-emerald-800">
                Pilihan tepat membuat Ola terhindar dari sesak napas.
              </p>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <span>Lanjut ke Adegan 3</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
