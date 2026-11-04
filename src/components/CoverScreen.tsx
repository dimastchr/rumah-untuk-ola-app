import React from 'react';
import { Play, RotateCcw, BookOpen, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { ASSETS, ReadingLevel, SCENES } from '../types';

interface CoverScreenProps {
  readingLevel: ReadingLevel;
  unlockedScenes: number[];
  earnedStars: number[];
  onSelectLevel: (level: ReadingLevel) => void;
  onStartStory: (sceneId: number) => void;
  onOpenCharacters: () => void;
  onOpenTeacherGuide: () => void;
  onResetProgress: () => void;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({
  readingLevel,
  unlockedScenes,
  earnedStars,
  onSelectLevel,
  onStartStory,
  onOpenCharacters,
  onOpenTeacherGuide,
  onResetProgress,
}) => {
  const highestUnlocked = Math.max(...unlockedScenes, 1);
  const hasProgress = unlockedScenes.length > 1 || earnedStars.length > 0;

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl bg-white/95 rounded-3xl shadow-xl border border-amber-200/90 overflow-hidden backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
          {/* Cover image container */}
          <div className="md:col-span-6 relative bg-emerald-950 min-h-[300px] sm:min-h-[400px] overflow-hidden flex items-center justify-center">
            <img
              src={ASSETS.coverImg}
              alt="Sampul Buku Cerita Rumah untuk Ola"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
              <div className="text-white">
                <span className="text-xs uppercase tracking-widest bg-emerald-700/80 backdrop-blur-xs px-2.5 py-1 rounded-md font-bold inline-block mb-1">
                  Cerita Interaktif SD Kelas 1–3
                </span>
                <p className="text-sm text-emerald-100 font-medium">
                  Petualangan Ola menjaga hutan gambut Kalimantan
                </p>
              </div>
            </div>
          </div>

          {/* Right panel: Controls, level choice & actions */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Edisi Tematik Literasi & Lingkungan</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-black text-amber-950 tracking-tight leading-tight">
                Rumah untuk Ola
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
                Ayo ikuti kisah Ola, anak orangutan yang ceria, saat asap datang mengancam hutan gambut Kalimantan!
              </p>
            </div>

            {/* Reading Level Selector */}
            <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/90">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-900 mb-2">
                Pilih Level Membaca:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => onSelectLevel('mudah')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    readingLevel === 'mudah'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-102 font-bold'
                      : 'bg-white text-slate-700 border-amber-200 hover:border-emerald-400 hover:bg-emerald-50/50'
                  }`}
                >
                  <span className="text-base font-extrabold">🌱 Level MUDAH</span>
                  <span className={`text-[11px] mt-0.5 ${readingLevel === 'mudah' ? 'text-emerald-100' : 'text-slate-500'}`}>
                    Kalimat ringkas & jelas (Kelas 1)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectLevel('sedang')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    readingLevel === 'sedang'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-102 font-bold'
                      : 'bg-white text-slate-700 border-amber-200 hover:border-emerald-400 hover:bg-emerald-50/50'
                  }`}
                >
                  <span className="text-base font-extrabold">🌿 Level SEDANG</span>
                  <span className={`text-[11px] mt-0.5 ${readingLevel === 'sedang' ? 'text-emerald-100' : 'text-slate-500'}`}>
                    Kalimat lebih kaya (Kelas 2–3)
                  </span>
                </button>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="space-y-3">
              {hasProgress && highestUnlocked > 1 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => onStartStory(highestUnlocked)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-amber-950 font-black text-base shadow-md transition-all cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>Lanjut Adegan {highestUnlocked}</span>
                  </button>
                  <button
                    onClick={() => onStartStory(1)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-base shadow-md transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Mulai dari Adegan 1</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onStartStory(1)}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xl shadow-lg transition-all cursor-pointer hover:shadow-emerald-600/30 ring-2 ring-emerald-400/40"
                >
                  <Play className="w-6 h-6 fill-white" />
                  <span>Mulai Petualangan!</span>
                </button>
              )}

              {/* Extra nav buttons: Kenalan Tokoh & Panduan Guru */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={onOpenCharacters}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 active:scale-98 text-amber-900 font-bold text-xs sm:text-sm border border-amber-300 transition-all cursor-pointer"
                >
                  <Users className="w-4 h-4 text-amber-800" />
                  <span>Kenalan Tokoh</span>
                </button>

                <button
                  onClick={onOpenTeacherGuide}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-98 text-emerald-900 font-bold text-xs sm:text-sm border border-emerald-300 transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-emerald-800" />
                  <span>Panduan Guru</span>
                </button>
              </div>
            </div>

            {/* Scene quick selection if unlocked */}
            <div className="border-t border-amber-200/80 pt-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                <span>Peta 7 Adegan Cerita:</span>
                {hasProgress && (
                  <button
                    onClick={onResetProgress}
                    className="text-[11px] text-rose-600 hover:text-rose-800 underline cursor-pointer"
                  >
                    Ulang dari awal
                  </button>
                )}
              </div>
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                  const isUnlocked = unlockedScenes.includes(num);
                  const isStarred = earnedStars.includes(num);
                  return (
                    <button
                      key={num}
                      disabled={!isUnlocked}
                      onClick={() => onStartStory(num)}
                      className={`relative flex flex-col items-center justify-center py-2 rounded-xl text-xs font-black transition-all ${
                        isUnlocked
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 cursor-pointer shadow-xs border border-amber-300 active:scale-95'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      }`}
                      title={`Adegan ${num}: ${SCENES[num]?.title || ''}`}
                    >
                      <span>{num}</span>
                      {isStarred && (
                        <span className="absolute -top-1 -right-1 text-[10px]">⭐</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
