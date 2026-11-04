import { UserProgress } from '../types';

const STORAGE_KEY = 'rumah_untuk_ola_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  readingLevel: 'mudah',
  currentScene: 0, // 0 = Cover
  unlockedScenes: [1],
  earnedStars: [],
  olaMessage: '',
  isUppercase: true, // Default uppercase is great for grade 1-3 reading
  soundEnabled: true,
};

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      unlockedScenes: Array.isArray(parsed.unlockedScenes) && parsed.unlockedScenes.length > 0 
        ? parsed.unlockedScenes 
        : [1],
      earnedStars: Array.isArray(parsed.earnedStars) ? parsed.earnedStars : [],
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: Partial<UserProgress>): UserProgress {
  try {
    const current = loadProgress();
    const updated: UserProgress = {
      ...current,
      ...progress,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return { ...DEFAULT_PROGRESS, ...progress };
  }
}

export function resetProgress(): UserProgress {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore error
  }
  return DEFAULT_PROGRESS;
}
