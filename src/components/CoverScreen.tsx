import React from 'react';
import { motion } from 'motion/react';
import { ASSETS, ReadingLevel } from '../types';
import { BigButton, Avatar } from './ui';
import { LeafPath } from './LeafPath';

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
  const highest = Math.min(Math.max(...unlockedScenes.filter((n) => n <= 7), 1), 7);
  const hasProgress = earnedStars.length > 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-4xl space-y-5 p-3 sm:p-6">
      <div className="overflow-hidden rounded-[36px] border-4 border-white bg-white shadow-xl">
        <img
          src={ASSETS.coverImg}
          alt="Sampul cerita Rumah untuk Ola: Ola si anak orangutan di hutan."
          width={1280}
          height={714}
          className="block aspect-[1280/714] w-full object-cover"
          fetchPriority="high"
        />
        <div className="space-y-5 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <Avatar who="ola" size={64} className="floaty" />
            <div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-forest-800 leading-none">Rumah untuk Ola</h1>
              <p className="mt-1 text-lg font-semibold text-bark">Cerita interaktif kelas 1–3 SD</p>
            </div>
          </div>

          <div>
            <h2 className="mb-2 font-display text-xl font-bold text-bark">Pilih level bacaan:</h2>
            <div role="group" aria-label="Level bacaan" className="grid grid-cols-2 gap-3">
              {(['mudah', 'sedang'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={readingLevel === l}
                  onClick={() => onSelectLevel(l)}
                  className={`min-h-20 rounded-3xl border-4 p-3 font-display text-left transition-all ${
                    readingLevel === l ? 'border-forest-700 bg-forest-700 text-white shadow-lg' : 'border-forest-200 bg-white text-bark'
                  }`}
                >
                  <span className="block text-2xl font-bold">{l === 'mudah' ? '🌱 Mudah' : '🌿 Sedang'}</span>
                  <span className="block text-base font-semibold opacity-90">{l === 'mudah' ? 'Kelas 1' : 'Kelas 2–3'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {hasProgress && highest > 1 ? (
              <>
                <BigButton tone="green" size="lg" icon="▶" onClick={() => onStartStory(highest)} className="flex-1">
                  Lanjut Adegan {highest}
                </BigButton>
                <BigButton tone="yellow" size="lg" icon="🔁" onClick={() => onStartStory(1)} className="flex-1">
                  Dari Awal
                </BigButton>
              </>
            ) : (
              <BigButton tone="green" size="lg" icon="▶" onClick={() => onStartStory(1)} className="flex-1">
                Mulai
              </BigButton>
            )}
          </div>

          <div className="rounded-[28px] bg-forest-50 p-3 sm:p-4">
            <h2 className="mb-3 text-center font-display text-xl font-bold text-forest-800">🍃 Jalan Petualangan Ola</h2>
            <LeafPath unlocked={unlockedScenes} stars={earnedStars} onPick={onStartStory} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <BigButton tone="white" icon="🦧" onClick={onOpenCharacters}>
              Kenalan Tokoh
            </BigButton>
            <BigButton tone="white" icon="📘" onClick={onOpenTeacherGuide}>
              Panduan Guru
            </BigButton>
          </div>

          {hasProgress && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Hapus semua bintang dan mulai dari awal?')) onResetProgress();
                }}
                className="min-h-12 rounded-2xl px-4 text-base font-semibold text-rose-700 underline"
              >
                Hapus kemajuan
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
