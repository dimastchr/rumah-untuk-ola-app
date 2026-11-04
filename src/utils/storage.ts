import { UserProgress } from '../types';

const STORAGE_KEY = 'rumah_untuk_ola_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  readingLevel: 'mudah',
  currentScene: 0,
  unlockedScenes: [1],
  earnedStars: [],
  olaMessage: '',
  isUppercase: true,
  soundEnabled: true,
};

const isSceneList = (v: unknown): v is number[] =>
  Array.isArray(v) && v.every((n) => Number.isInteger(n) && n >= 1 && n <= 8);

/** Kemajuan hanya disimpan di perangkat ini (localStorage). Semua galat ditangkap. */
export function loadProgress(): UserProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const p = JSON.parse(raw) ?? {};
    return {
      readingLevel: p.readingLevel === 'sedang' ? 'sedang' : 'mudah',
      currentScene:
        Number.isInteger(p.currentScene) && p.currentScene >= 0 && p.currentScene <= 10 ? p.currentScene : 0,
      unlockedScenes: isSceneList(p.unlockedScenes) && p.unlockedScenes.length ? p.unlockedScenes : [1],
      earnedStars: isSceneList(p.earnedStars) ? p.earnedStars.filter((n: number) => n <= 7) : [],
      olaMessage: typeof p.olaMessage === 'string' ? p.olaMessage.slice(0, 120) : '',
      isUppercase: typeof p.isUppercase === 'boolean' ? p.isUppercase : true,
      soundEnabled: typeof p.soundEnabled === 'boolean' ? p.soundEnabled : true,
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Penyimpanan penuh / mode privat: aplikasi tetap jalan tanpa menyimpan.
  }
}

export function resetProgress(): UserProgress {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* abaikan */
  }
  return { ...DEFAULT_PROGRESS };
}
