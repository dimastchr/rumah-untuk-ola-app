import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, RotateCcw, Info } from 'lucide-react';
import { speechService } from '../../utils/speech';

interface Scene1NestProps {
  onComplete: () => void;
}

interface NestItem {
  id: string;
  name: string;
  icon: string;
  placed: boolean;
}

export const Scene1Nest: React.FC<Scene1NestProps> = ({ onComplete }) => {
  const [items, setItems] = useState<NestItem[]>([
    { id: 'item-1', name: 'Ranting Kayu', icon: '🪵', placed: false },
    { id: 'item-2', name: 'Daun Rimbun', icon: '🍃', placed: false },
    { id: 'item-3', name: 'Ranting Lentur', icon: '🌿', placed: false },
    { id: 'item-4', name: 'Daun Lembut', icon: '🌱', placed: false },
  ]);

  const [showDidYouKnow, setShowDidYouKnow] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const placedCount = items.filter((i) => i.placed).length;
  const totalCount = items.length;

  const handlePlaceItem = (id: string) => {
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, placed: true } : item
      );
      const allPlaced = updated.every((item) => item.placed);
      if (allPlaced && !isCompleted) {
        setIsCompleted(true);
        setShowDidYouKnow(true);
        // Play Indonesian speech feedback
        speechService.speak(
          'Hebat! Sarang Ola sudah jadi. Orangutan tidur di sarang baru setiap malam.',
          { rate: 0.95, pitch: 1.15 }
        );
      } else {
        speechService.speak('Bagus! Tambahkan lagi ranting atau daunnya.', { rate: 1.0, pitch: 1.1 });
      }
      return updated;
    });
  };

  const handleReset = () => {
    setItems((prev) => prev.map((i) => ({ ...i, placed: false })));
    setIsCompleted(false);
    setShowDidYouKnow(false);
  };

  return (
    <div className="w-full space-y-4">
      {/* Interactive Nest Canvas Box */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-emerald-900/60 via-amber-950/40 to-emerald-950/80 border-2 border-amber-300/80 p-4 sm:p-6 shadow-lg min-h-[340px] sm:min-h-[380px] flex flex-col justify-between backdrop-blur-xs">
        {/* Top instruction pill */}
        <div className="flex items-center justify-between gap-2 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 text-emerald-900 font-extrabold text-xs sm:text-sm shadow-sm border border-emerald-200">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Misi: Seret atau ketuk ranting & daun ke dahan pohon ({placedCount}/{totalCount})</span>
          </div>

          {placedCount > 0 && !isCompleted && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-bold text-white bg-black/40 hover:bg-black/60 px-3 py-1.5 rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi</span>
            </button>
          )}
        </div>

        {/* Center Target: Tree Branch & Nest */}
        <div className="my-auto flex flex-col items-center justify-center text-center z-10 py-4">
          <div
            onClick={() => {
              const firstUnplaced = items.find((i) => !i.placed);
              if (firstUnplaced) handlePlaceItem(firstUnplaced.id);
            }}
            className={`relative w-64 sm:w-80 h-44 sm:h-52 rounded-3xl border-4 transition-all duration-300 flex flex-col items-center justify-center p-4 cursor-pointer ${
              isCompleted
                ? 'bg-amber-900/85 border-amber-400 shadow-2xl scale-102 ring-4 ring-amber-300/60'
                : placedCount > 0
                ? 'bg-amber-950/70 border-amber-300/90 shadow-lg'
                : 'bg-emerald-950/70 border-dashed border-amber-300/80 hover:bg-emerald-900/80'
            }`}
          >
            {/* Visual Nest progress */}
            <div className="relative text-center">
              {isCompleted ? (
                <div className="space-y-1 animate-bounce">
                  <div className="text-5xl sm:text-6xl">🦧✨</div>
                  <span className="inline-block text-xs sm:text-sm font-black text-amber-200 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-400">
                    Sarang Ola Sudah Jadi!
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-4xl sm:text-5xl">
                    {placedCount === 0 ? '🌳' : placedCount === 1 ? '🪵' : placedCount === 2 ? '🪵🍃' : '🌿🪵🍃'}
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-amber-100 max-w-xs drop-shadow-sm">
                    {placedCount === 0
                      ? 'Dahan Pohon Kalimantan (Taruh ranting dan daun di sini)'
                      : `Sarang mulai teranyam (${placedCount}/${totalCount})`}
                  </p>
                </div>
              )}

              {/* Placed layers visual effect */}
              {placedCount > 0 && (
                <div className="flex justify-center gap-1 mt-2">
                  {items.filter((i) => i.placed).map((item) => (
                    <span key={item.id} className="text-xl">
                      {item.icon}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Available draggable/clickable pieces */}
        {!isCompleted && (
          <div className="z-10 bg-white/95 rounded-2xl p-3 border border-amber-300 shadow-md">
            <span className="block text-[11px] font-black uppercase text-amber-900 mb-1.5 text-center">
              Ketuk atau seret bahan sarang ke atas:
            </span>
            <div className="grid grid-cols-4 gap-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  disabled={item.placed}
                  onClick={() => handlePlaceItem(item.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all border ${
                    item.placed
                      ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-40 cursor-not-allowed'
                      : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-950 shadow-xs hover:scale-105 active:scale-95 cursor-pointer font-extrabold'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl">{item.icon}</span>
                  <span className="text-[10px] sm:text-xs font-bold mt-1 text-center line-clamp-1">
                    {item.placed ? 'Terpasang' : item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pop-up / Card: Tahukah Kamu? */}
      {showDidYouKnow && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-md animate-fade-in space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500 text-amber-950 rounded-xl shrink-0 font-bold">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                Tahukah Kamu?
              </span>
              <p className="text-base sm:text-lg font-black text-amber-950 mt-0.5">
                "Orangutan menghabiskan sebagian besar waktunya di pohon."
              </p>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                Setiap petang tiba, orangutan menganyam sarang baru di puncak dahan agar tidur nyenyak, bersih, dan terlindung dari bahaya di lantai hutan.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onComplete}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-200" />
              <span>Lanjut ke Adegan 2</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
