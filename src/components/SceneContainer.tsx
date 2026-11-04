import React, { useState } from 'react';
import { SCENES, ReadingLevel } from '../types';
import { WordHighlightText } from './WordHighlightText';
import { AudioNarrationBar } from './AudioNarrationBar';
import { ArrowLeft, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { speechService } from '../utils/speech';

interface SceneContainerProps {
  sceneId: number;
  readingLevel: ReadingLevel;
  isUppercase: boolean;
  soundEnabled: boolean;
  unlockedScenes: number[];
  children: React.ReactNode;
  onNavigateScene: (sceneId: number) => void;
  onBackToHome: () => void;
}

export const SceneContainer: React.FC<SceneContainerProps> = ({
  sceneId,
  readingLevel,
  isUppercase,
  soundEnabled,
  unlockedScenes,
  children,
  onNavigateScene,
  onBackToHome,
}) => {
  const scene = SCENES[sceneId];
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);
  const [showFullNarration, setShowFullNarration] = useState<boolean>(false);

  if (!scene) return null;

  // Selected level text
  const primaryText = readingLevel === 'mudah' ? scene.easyText : scene.mediumText;
  const wordsCount = (showFullNarration ? scene.narrationText : primaryText)
    .split(/\s+/)
    .filter(Boolean).length;

  const handlePrev = () => {
    speechService.stopAll();
    if (sceneId > 1) {
      onNavigateScene(sceneId - 1);
    } else {
      onBackToHome();
    }
  };

  const handleNext = () => {
    speechService.stopAll();
    if (sceneId < 7) {
      onNavigateScene(sceneId + 1);
    } else {
      onNavigateScene(8); // Ending
    }
  };

  const isNextUnlocked = unlockedScenes.includes(sceneId + 1) || sceneId === 7;

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-5 md:p-6 space-y-4">
      {/* Scene Navigation & Progress Header */}
      <div className="flex items-center justify-between gap-2 bg-white/90 p-3 sm:p-4 rounded-2xl border border-amber-200/90 shadow-2xs backdrop-blur-md">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{sceneId === 1 ? 'Beranda' : `Adegan ${sceneId - 1}`}</span>
        </button>

        <div className="text-center">
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 block">
            {scene.title}
          </span>
          <h2 className="font-display text-sm sm:text-lg font-black text-slate-900 leading-tight">
            {scene.subTitle}
          </h2>
        </div>

        {isNextUnlocked ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
          >
            <span>{sceneId === 7 ? 'Layar Akhir' : `Adegan ${sceneId + 1}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-20 hidden xs:block"></div>
        )}
      </div>

      {/* Main Scene Card with Background Graphic */}
      <div className="bg-white rounded-3xl p-3 sm:p-5 border-2 border-amber-200/90 shadow-md space-y-4">
        {/* Background visual illustration from CDN */}
        <div className="relative rounded-2xl overflow-hidden bg-emerald-950 min-h-[220px] sm:min-h-[300px] border border-amber-200">
          <img
            src={scene.bgImage}
            alt={scene.title}
            className="w-full h-full object-cover max-h-[380px]"
            referrerPolicy="no-referrer"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-5">
            <div className="text-white">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-600/90 text-[11px] font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Hutan Gambut Kalimantan
              </span>
              <p className="text-xs sm:text-sm text-emerald-100/90 font-medium max-w-xl">
                {scene.narrationText}
              </p>
            </div>
          </div>
        </div>

        {/* Audio Narration Bar: Dengarkan Lagi & Progress */}
        <AudioNarrationBar
          sceneId={sceneId}
          audioUrl={scene.narrationAudio}
          totalWordsCount={wordsCount}
          soundEnabled={soundEnabled}
          onWordIndexChange={(idx) => setActiveWordIndex(idx)}
        />

        {/* Word-by-word Highlight Reading Text */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
            <span className="uppercase text-amber-900 font-black">
              Teks Bacaan (Level: {readingLevel.toUpperCase()}):
            </span>
            <button
              onClick={() => setShowFullNarration(!showFullNarration)}
              className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showFullNarration ? 'Tampilkan Teks Singkat' : 'Tampilkan Narasi Lengkap'}</span>
            </button>
          </div>

          <WordHighlightText
            text={showFullNarration ? scene.narrationText : primaryText}
            isUppercase={isUppercase}
            activeWordIndex={activeWordIndex}
            label={showFullNarration ? 'Narasi Lengkap' : `Level ${readingLevel.toUpperCase()}`}
          />
        </div>

        {/* Interactive Game / Action Component Slot */}
        <div className="pt-2">
          {children}
        </div>
      </div>
    </div>
  );
};
