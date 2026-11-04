import React, { useState } from 'react';
import { Droplets, Flame, ArrowRight, Sparkles, Info, RefreshCw } from 'lucide-react';
import { speechService } from '../../utils/speech';

interface Scene3PeatlandProps {
  onComplete: () => void;
}

export const Scene3Peatland: React.FC<Scene3PeatlandProps> = ({ onComplete }) => {
  const [isWet, setIsWet] = useState(false);
  const [waterDrops, setWaterDrops] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const handleSpongeWater = () => {
    setIsWet(true);
    setWaterDrops((prev) => prev + 1);
    setShowPopup(true);
    speechService.speak(
      'Gambut basah menyimpan banyak air seperti spons raksasa. Apinya padam dan tanah menjadi sejuk!',
      { rate: 0.95, pitch: 1.15 }
    );
  };

  const handleToggleState = () => {
    setIsWet(!isWet);
    if (!isWet) {
      setShowPopup(true);
      speechService.speak(
        'Gambut basah menyimpan banyak air seperti spons raksasa.',
        { rate: 0.95, pitch: 1.15 }
      );
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Rara Dialog Bubble */}
      <div className="bg-sky-50 rounded-2xl p-4 border-2 border-sky-300 shadow-sm flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-sky-200 text-sky-900 flex items-center justify-center text-2xl shrink-0 font-bold">
          🦜
        </div>
        <div>
          <span className="text-xs font-black uppercase text-sky-900 tracking-wider">
            Kata Rara si Burung Rangkong:
          </span>
          <p className="text-sm sm:text-base font-extrabold text-sky-950 mt-0.5 leading-snug">
            "Tanah ini seperti spons dari daun lama. Kalau terbakar, apinya bersembunyi di dalam tanah dan sulit dipadamkan."
          </p>
        </div>
      </div>

      {/* Interactive Peatland Sponge Sandbox */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-amber-950/70 via-slate-900/80 to-amber-950/90 border-2 border-amber-300/80 p-5 sm:p-6 shadow-lg min-h-[340px] flex flex-col justify-between">
        {/* Header with state indicator & toggle */}
        <div className="z-10 flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 text-xs sm:text-sm font-black shadow-xs border border-amber-200">
            {isWet ? (
              <>
                <Droplets className="w-4 h-4 text-sky-600" />
                <span className="text-emerald-900">Kondisi: Gambut Basah (Sejuk & Lembap)</span>
              </>
            ) : (
              <>
                <Flame className="w-4 h-4 text-rose-600 animate-pulse" />
                <span className="text-amber-950">Kondisi: Gambut Kering Berasap</span>
              </>
            )}
          </div>

          <button
            onClick={handleToggleState}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Ganti ke {isWet ? 'Gambut Kering' : 'Gambut Basah'}</span>
          </button>
        </div>

        {/* Cross-section illustration */}
        <div className="my-auto z-10 py-3">
          <div className="max-w-md mx-auto rounded-3xl overflow-hidden border-4 shadow-xl transition-all duration-500 bg-white/10 backdrop-blur-xs">
            {/* Upper ground vegetation */}
            <div
              className={`p-3 text-center transition-colors duration-500 flex items-center justify-center gap-2 ${
                isWet ? 'bg-emerald-800/80 text-emerald-100' : 'bg-amber-900/70 text-amber-200'
              }`}
            >
              <span className="text-2xl">{isWet ? '🌿 🌱 🌳' : '🍂 💨 🪵'}</span>
              <span className="text-xs sm:text-sm font-black">
                {isWet ? 'Permukaan Hutan Sejuk & Terlindungi' : 'Permukaan Hutan Kering & Terbakar'}
              </span>
            </div>

            {/* Cross Section Layers (Sponge Peatland) */}
            <div
              className={`p-5 transition-all duration-500 relative flex flex-col items-center justify-center min-h-[140px] text-center ${
                isWet
                  ? 'bg-gradient-to-b from-teal-950 via-slate-900 to-sky-950 border-t-2 border-teal-500'
                  : 'bg-gradient-to-b from-amber-950 via-red-950 to-orange-950 border-t-2 border-rose-500'
              }`}
            >
              {isWet ? (
                <div className="space-y-2 animate-fade-in">
                  <div className="text-4xl animate-bounce">🧽💧💧</div>
                  <p className="text-xs sm:text-sm font-black text-sky-200">
                    Spons gambut menyerap jutaan liter air!
                  </p>
                  <p className="text-[11px] text-teal-300">
                    Kedalaman tanah tetap dingin, api tidak bisa menyala di sini.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 animate-pulse">
                  <div className="text-4xl">🧽🔥💨</div>
                  <p className="text-xs sm:text-sm font-black text-amber-200">
                    Spons daun mengering, bara api tersembunyi di bawah tanah!
                  </p>
                  <p className="text-[11px] text-rose-300">
                    Asap mengepul keluar dari celah tanah yang kering.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom stratum indicator */}
            <div className="bg-black/60 p-2 text-center text-[10px] text-slate-300 font-mono tracking-wider">
              {isWet ? 'LAPISAN BAWAH TANAH BASAH & AMAN' : 'BARA API DI KEDALAMAN TANAH GAMBUT'}
            </div>
          </div>
        </div>

        {/* Big Action Button: Spons Air */}
        <div className="z-10 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleSpongeWater}
            className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-base sm:text-lg shadow-xl transition-all cursor-pointer active:scale-95 ${
              isWet
                ? 'bg-sky-500 hover:bg-sky-600 text-white ring-4 ring-sky-300/50'
                : 'bg-sky-600 hover:bg-sky-700 text-white ring-4 ring-sky-400/60 animate-bounce'
            }`}
          >
            <Droplets className="w-6 h-6 fill-white" />
            <span>Tekan Tombol "Spons Air" 🧽💧</span>
          </button>
        </div>
      </div>

      {/* Pop-up Box as specified in prompt */}
      {showPopup && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-md animate-fade-in space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500 text-amber-950 rounded-xl shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                Pengetahuan Penting:
              </span>
              <p className="text-base sm:text-lg font-black text-amber-950 mt-0.5">
                "Gambut basah menyimpan banyak air seperti spons raksasa."
              </p>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                Tanah gambut terbentuk dari tumpukan daun dan dahan selama ribuan tahun. Saat basah, gambut mengunci air dan mencegah kebakaran hutan Kalimantan.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onComplete}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>Lanjut ke Adegan 4</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
