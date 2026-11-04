import React, { useState, useEffect } from 'react';
import { UserProgress, ReadingLevel } from './types';
import { loadProgress, saveProgress, resetProgress } from './utils/storage';
import { speechService } from './utils/speech';
import { Navbar } from './components/Navbar';
import { CoverScreen } from './components/CoverScreen';
import { CharacterScreen } from './components/CharacterScreen';
import { TeacherGuideScreen } from './components/TeacherGuideScreen';
import { EndingScreen } from './components/EndingScreen';
import { SceneContainer } from './components/SceneContainer';

// Individual scenes
import { Scene1Nest } from './components/scenes/Scene1Nest';
import { Scene2Smoke } from './components/scenes/Scene2Smoke';
import { Scene3Peatland } from './components/scenes/Scene3Peatland';
import { Scene4Friends } from './components/scenes/Scene4Friends';
import { Scene5Village } from './components/scenes/Scene5Village';
import { Scene6Firefighters } from './components/scenes/Scene6Firefighters';
import { Scene7NewHome } from './components/scenes/Scene7NewHome';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());

  // Keep speechService sound state synced with user preference
  useEffect(() => {
    speechService.setSoundEnabled(progress.soundEnabled);
  }, [progress.soundEnabled]);

  const updateAndSave = (partial: Partial<UserProgress>) => {
    setProgress((prev) => {
      const updated = { ...prev, ...partial };
      saveProgress(updated);
      return updated;
    });
  };

  const handleSelectLevel = (level: ReadingLevel) => {
    updateAndSave({ readingLevel: level });
    speechService.speak(`Level ${level} dipilih!`, { rate: 1.0, pitch: 1.15 });
  };

  const handleToggleSound = () => {
    const nextSound = !progress.soundEnabled;
    updateAndSave({ soundEnabled: nextSound });
    speechService.setSoundEnabled(nextSound);
  };

  const handleToggleUppercase = () => {
    updateAndSave({ isUppercase: !progress.isUppercase });
  };

  const handleNavigateScene = (sceneId: number) => {
    speechService.stopAll();
    updateAndSave({ currentScene: sceneId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteScene = (sceneId: number) => {
    // Add star if not earned yet
    const earnedStars = progress.earnedStars.includes(sceneId)
      ? progress.earnedStars
      : [...progress.earnedStars, sceneId];

    // Unlock next scene if valid
    const nextSceneId = sceneId + 1;
    const unlockedScenes = progress.unlockedScenes.includes(nextSceneId)
      ? progress.unlockedScenes
      : [...progress.unlockedScenes, nextSceneId];

    updateAndSave({
      earnedStars,
      unlockedScenes,
      currentScene: nextSceneId > 7 ? 8 : nextSceneId,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveMessage = (msg: string) => {
    updateAndSave({ olaMessage: msg });
  };

  const handleReset = () => {
    speechService.stopAll();
    const fresh = resetProgress();
    setProgress(fresh);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-emerald-50/20 to-amber-50/40 text-slate-900 flex flex-col font-body selection:bg-amber-200">
      {/* Top Navbar */}
      <Navbar
        currentScene={progress.currentScene}
        readingLevel={progress.readingLevel}
        earnedStarsCount={progress.earnedStars.length}
        soundEnabled={progress.soundEnabled}
        isUppercase={progress.isUppercase}
        onHomeClick={() => handleNavigateScene(0)}
        onToggleSound={handleToggleSound}
        onToggleUppercase={handleToggleUppercase}
        onSelectLevel={handleSelectLevel}
        onOpenCharacters={() => handleNavigateScene(9)}
        onOpenTeacherGuide={() => handleNavigateScene(10)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-10">
        {/* 0 = Cover Screen */}
        {progress.currentScene === 0 && (
          <CoverScreen
            readingLevel={progress.readingLevel}
            unlockedScenes={progress.unlockedScenes}
            earnedStars={progress.earnedStars}
            onSelectLevel={handleSelectLevel}
            onStartStory={(sceneId) => handleNavigateScene(sceneId)}
            onOpenCharacters={() => handleNavigateScene(9)}
            onOpenTeacherGuide={() => handleNavigateScene(10)}
            onResetProgress={handleReset}
          />
        )}

        {/* 1 = Scene 1: Pagi di Hutan */}
        {progress.currentScene === 1 && (
          <SceneContainer
            sceneId={1}
            readingLevel={progress.readingLevel}
            isUppercase={progress.isUppercase}
            soundEnabled={progress.soundEnabled}
            unlockedScenes={progress.unlockedScenes}
            onNavigateScene={handleNavigateScene}
            onBackToHome={() => handleNavigateScene(0)}
          >
            <Scene1Nest onComplete={() => handleCompleteScene(1)} />
          </SceneContainer>
        )}

        {/* 2 = Scene 2: Asap Datang */}
        {progress.currentScene === 2 && (
          <SceneContainer
            sceneId={2}
            readingLevel={progress.readingLevel}
            isUppercase={progress.isUppercase}
            soundEnabled={progress.soundEnabled}
            unlockedScenes={progress.unlockedScenes}
            onNavigateScene={handleNavigateScene}
            onBackToHome={() => handleNavigateScene(0)}
          >
            <Scene2Smoke onComplete={() => handleCompleteScene(2)} />
          </SceneContainer>
        )}

        {/* 3 = Scene 3: Tanah yang Berasap */}
        {progress.currentScene === 3 && (
          <SceneContainer
            sceneId={3}
            readingLevel={progress.readingLevel}
            isUppercase={progress.isUppercase}
            soundEnabled={progress.soundEnabled}
            unlockedScenes={progress.unlockedScenes}
            onNavigateScene={handleNavigateScene}
            onBackToHome={() => handleNavigateScene(0)}
          >
            <Scene3Peatland onComplete={() => handleCompleteScene(3)} />
          </SceneContainer>
        )}

        {/* 4 = Scene 4: Teman Baru */}
        {progress.currentScene === 4 && (
          <SceneContainer
            sceneId={4}
            readingLevel={progress.readingLevel}
            isUppercase={progress.isUppercase}
            soundEnabled={progress.soundEnabled}
            unlockedScenes={progress.unlockedScenes}
            onNavigateScene={handleNavigateScene}
            onBackToHome={() => handleNavigateScene(0)}
          >
            <Scene4Friends onComplete={() => handleCompleteScene(4)} />
          </SceneContainer>
        )}

        {/* 5 = Scene 5: Di Desa Tepi Hutan */}
        {progress.currentScene === 5 && (
          <SceneContainer
            sceneId={5}
            readingLevel={progress.readingLevel}
            isUppercase={progress.isUppercase}
            soundEnabled={progress.soundEnabled}
            unlockedScenes={progress.unlockedScenes}
            onNavigateScene={handleNavigateScene}
            onBackToHome={() => handleNavigateScene(0)}
          >
            <Scene5Village onComplete={() => handleCompleteScene(5)} />
          </SceneContainer>
        )}

        {/* 6 = Scene 6: Penjaga Hutan Datang */}
        {progress.currentScene === 6 && (
          <SceneContainer
            sceneId={6}
            readingLevel={progress.readingLevel}
            isUppercase={progress.isUppercase}
            soundEnabled={progress.soundEnabled}
            unlockedScenes={progress.unlockedScenes}
            onNavigateScene={handleNavigateScene}
            onBackToHome={() => handleNavigateScene(0)}
          >
            <Scene6Firefighters onComplete={() => handleCompleteScene(6)} />
          </SceneContainer>
        )}

        {/* 7 = Scene 7: Rumah Baru */}
        {progress.currentScene === 7 && (
          <SceneContainer
            sceneId={7}
            readingLevel={progress.readingLevel}
            isUppercase={progress.isUppercase}
            soundEnabled={progress.soundEnabled}
            unlockedScenes={progress.unlockedScenes}
            onNavigateScene={handleNavigateScene}
            onBackToHome={() => handleNavigateScene(0)}
          >
            <Scene7NewHome onComplete={() => handleCompleteScene(7)} />
          </SceneContainer>
        )}

        {/* 8 = Ending Screen */}
        {progress.currentScene === 8 && (
          <EndingScreen
            earnedStars={progress.earnedStars}
            savedMessage={progress.olaMessage}
            onSaveMessage={handleSaveMessage}
            onRestart={() => handleNavigateScene(1)}
            onOpenTeacherGuide={() => handleNavigateScene(10)}
          />
        )}

        {/* 9 = Character Screen */}
        {progress.currentScene === 9 && (
          <CharacterScreen onBack={() => handleNavigateScene(0)} />
        )}

        {/* 10 = Teacher Guide Screen */}
        {progress.currentScene === 10 && (
          <TeacherGuideScreen
            onBack={() => handleNavigateScene(0)}
            onJumpToScene={(sId) => handleNavigateScene(sId)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-200/80 bg-white/80 py-4 px-4 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">
          Rumah untuk Ola &bull; Media Cerita Interaktif Literasi & Sains Lingkungan Siswa SD Kelas 1–3
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          Didedikasikan untuk edukasi pelestarian orangutan dan perlindungan hutan gambut Kalimantan.
        </p>
      </footer>
    </div>
  );
}
