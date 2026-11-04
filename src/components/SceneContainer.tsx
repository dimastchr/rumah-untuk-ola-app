import React from 'react';
import { motion } from 'motion/react';
import { SCENES, ReadingLevel } from '../types';
import { NarrationCard, ReadingCard } from './Narration';
import { speechService } from '../utils/speech';

interface SceneContainerProps {
  sceneId: number;
  readingLevel: ReadingLevel;
  isUppercase: boolean;
  soundEnabled: boolean;
  unlockedScenes: number[];
  children: React.ReactNode;
  onNavigateScene: (sceneId: number) => void;
  onSelectLevel: (l: ReadingLevel) => void;
  onToggleUppercase: () => void;
}

export const SceneContainer: React.FC<SceneContainerProps> = ({
  sceneId,
  readingLevel,
  isUppercase,
  soundEnabled,
  unlockedScenes,
  children,
  onNavigateScene,
  onSelectLevel,
  onToggleUppercase,
}) => {
  const scene = SCENES[sceneId];
  if (!scene) return null;

  const lines = readingLevel === 'mudah' ? scene.easyLines : scene.mediumLines;
  const prevTarget = sceneId > 1 ? sceneId - 1 : 0;
  const nextTarget = sceneId < 7 ? sceneId + 1 : 8;
  const canNext = unlockedScenes.includes(nextTarget);

  const go = (id: number) => {
    speechService.stopAll();
    onNavigateScene(id);
  };

  return (
    <motion.div
      key={sceneId}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-4xl space-y-4 p-3 sm:p-5"
    >
      {/* Navigasi adegan */}
      <nav aria-label="Navigasi adegan" className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => go(prevTarget)}
          aria-label={sceneId === 1 ? 'Kembali ke beranda' : `Kembali ke adegan ${prevTarget}`}
          className="inline-flex min-h-12 items-center gap-1 rounded-2xl bg-white px-4 font-display text-lg font-bold text-forest-800 border-2 border-forest-200 shadow-sm"
        >
          <span aria-hidden="true">◀</span> {sceneId === 1 ? 'Beranda' : 'Kembali'}
        </button>
        <div className="text-center min-w-0">
          <span className="block font-display text-base font-semibold text-forest-700">Adegan {sceneId} dari 7</span>
          <h2 className="font-display text-xl sm:text-3xl font-bold text-bark leading-tight">
            <span aria-hidden="true">{scene.emoji} </span>
            {scene.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => go(nextTarget)}
          disabled={!canNext}
          aria-label={canNext ? (sceneId === 7 ? 'Ke layar akhir' : `Ke adegan ${nextTarget}`) : 'Selesaikan misi dulu'}
          className="inline-flex min-h-12 items-center gap-1 rounded-2xl bg-white px-4 font-display text-lg font-bold text-forest-800 border-2 border-forest-200 shadow-sm disabled:opacity-40"
        >
          {canNext ? 'Maju' : '🔒'} <span aria-hidden="true">▶</span>
        </button>
      </nav>

      {/* Gambar adegan */}
      <div className="overflow-hidden rounded-[32px] border-4 border-white bg-forest-100 shadow-xl">
        <img
          src={scene.bgImage}
          alt={scene.imageAlt}
          width={1280}
          height={714}
          className="block aspect-[1280/714] w-full object-cover"
          decoding="async"
          fetchPriority="high"
        />
      </div>

      <NarrationCard scene={scene} soundEnabled={soundEnabled} isUppercase={isUppercase} />

      <ReadingCard
        key={`${sceneId}-${readingLevel}`}
        lines={lines}
        level={readingLevel}
        isUppercase={isUppercase}
        onLevel={onSelectLevel}
        onToggleCase={onToggleUppercase}
      />

      <div>{children}</div>
    </motion.div>
  );
};
