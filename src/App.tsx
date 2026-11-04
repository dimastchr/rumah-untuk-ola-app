import React, { useEffect, useRef, useState } from 'react';
import { MotionConfig, AnimatePresence, motion } from 'motion/react';
import { UserProgress, ReadingLevel } from './types';
import { loadProgress, saveProgress, resetProgress } from './utils/storage';
import { speechService } from './utils/speech';
import { Navbar } from './components/Navbar';
import { CoverScreen } from './components/CoverScreen';
import { CharacterScreen } from './components/CharacterScreen';
import { TeacherGuideScreen } from './components/TeacherGuideScreen';
import { EndingScreen } from './components/EndingScreen';
import { SceneContainer } from './components/SceneContainer';
import { Scene1Nest } from './components/scenes/Scene1Nest';
import { Scene2Smoke } from './components/scenes/Scene2Smoke';
import { Scene3Peatland } from './components/scenes/Scene3Peatland';
import { Scene4Friends } from './components/scenes/Scene4Friends';
import { Scene5Village } from './components/scenes/Scene5Village';
import { Scene6Firefighters } from './components/scenes/Scene6Firefighters';
import { Scene7NewHome } from './components/scenes/Scene7NewHome';

const SCENE_COMPONENTS: Record<number, React.FC<{ onComplete: () => void }>> = {
  1: Scene1Nest,
  2: Scene2Smoke,
  3: Scene3Peatland,
  4: Scene4Friends,
  5: Scene5Village,
  6: Scene6Firefighters,
  7: Scene7NewHome,
};

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());
  const [starToast, setStarToast] = useState<number | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    speechService.setSoundEnabled(progress.soundEnabled);
  }, [progress.soundEnabled]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
  }, []);

  const update = (partial: Partial<UserProgress>) => setProgress((prev) => ({ ...prev, ...partial }));

  const navigate = (sceneId: number) => {
    speechService.stopAll(); // narasi berhenti saat meninggalkan adegan
    update({ currentScene: sceneId });
    window.scrollTo({ top: 0 });
  };

  // Bintang hanya diberikan saat misi adegan benar-benar selesai.
  const completeScene = (sceneId: number) => {
    speechService.stopAll();
    const next = sceneId < 7 ? sceneId + 1 : 8;
    const isNewStar = !progress.earnedStars.includes(sceneId);
    setProgress((prev) => ({
      ...prev,
      earnedStars: prev.earnedStars.includes(sceneId) ? prev.earnedStars : [...prev.earnedStars, sceneId].sort(),
      unlockedScenes: prev.unlockedScenes.includes(next) ? prev.unlockedScenes : [...prev.unlockedScenes, next],
      currentScene: next,
    }));
    window.scrollTo({ top: 0 });
    if (isNewStar) {
      setStarToast(sceneId);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setStarToast(null), 1800);
    }
  };

  const selectLevel = (level: ReadingLevel) => update({ readingLevel: level });

  const cur = progress.currentScene;
  const SceneComp = SCENE_COMPONENTS[cur];

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col">
        <a href="#isi" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-xl focus:bg-white focus:p-3">
          Lompat ke isi
        </a>
        <Navbar
          earnedStarsCount={progress.earnedStars.length}
          soundEnabled={progress.soundEnabled}
          starPulse={progress.earnedStars.length}
          onHomeClick={() => navigate(0)}
          onToggleSound={() => update({ soundEnabled: !progress.soundEnabled })}
        />

        <main id="isi" className="flex-1 pb-10">
          {cur === 0 && (
            <CoverScreen
              readingLevel={progress.readingLevel}
              unlockedScenes={progress.unlockedScenes}
              earnedStars={progress.earnedStars}
              onSelectLevel={selectLevel}
              onStartStory={navigate}
              onOpenCharacters={() => navigate(9)}
              onOpenTeacherGuide={() => navigate(10)}
              onResetProgress={() => {
                speechService.stopAll();
                setProgress(resetProgress());
              }}
            />
          )}

          {SceneComp && (
            <SceneContainer
              key={cur}
              sceneId={cur}
              readingLevel={progress.readingLevel}
              isUppercase={progress.isUppercase}
              soundEnabled={progress.soundEnabled}
              unlockedScenes={progress.unlockedScenes}
              onNavigateScene={navigate}
              onSelectLevel={selectLevel}
              onToggleUppercase={() => update({ isUppercase: !progress.isUppercase })}
            >
              <SceneComp onComplete={() => completeScene(cur)} />
            </SceneContainer>
          )}

          {cur === 8 && (
            <EndingScreen
              earnedStars={progress.earnedStars}
              savedMessage={progress.olaMessage}
              onSaveMessage={(m) => update({ olaMessage: m })}
              onRestart={() => navigate(1)}
              onOpenTeacherGuide={() => navigate(10)}
            />
          )}

          {cur === 9 && <CharacterScreen onBack={() => navigate(0)} />}
          {cur === 10 && <TeacherGuideScreen onBack={() => navigate(0)} onJumpToScene={navigate} />}
        </main>

        <AnimatePresence>
          {starToast !== null && (
            <motion.div
              role="status"
              aria-live="polite"
              initial={{ y: -80, opacity: 0, scale: 0.6 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="pointer-events-none fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full border-4 border-sun-400 bg-white px-6 py-3 font-display text-2xl font-bold text-bark shadow-2xl"
            >
              <span aria-hidden="true">⭐ </span>+1 Bintang!
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="border-t-4 border-forest-100 bg-white/80 px-4 py-4 text-center text-base text-bark/80">
          <p className="font-display font-bold text-forest-800">Rumah untuk Ola · Cerita interaktif SD kelas 1–3</p>
          <p>Disusun oleh Dimas Yuli Rakasiwi · SDN Ngadimulyo, Kab. Pasuruan</p>
          <p className="text-sm">Didedikasikan untuk edukasi pelestarian orangutan dan perlindungan hutan gambut Kalimantan.</p>
        </footer>
      </div>
    </MotionConfig>
  );
}
