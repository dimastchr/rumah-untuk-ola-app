import { UserProgress, READING_LEVELS } from '../types';

const STORAGE_KEY = 'rumah_untuk_ola_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  readingLevel: 'sedang',
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
      readingLevel: READING_LEVELS.includes(p.readingLevel) ? p.readingLevel : 'sedang',
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
    window.localStorage.removeItem(PROMISE_KEY);
  } catch {
    /* abaikan */
  }
  return { ...DEFAULT_PROGRESS };
}

/* ---------- Janji anak dari Adegan 7 (disimpan di perangkat ini saja) ---------- */
const PROMISE_KEY = 'rumah_untuk_ola_janji_v1';

export function loadPromise(): string {
  try {
    const v = window.localStorage.getItem(PROMISE_KEY);
    return typeof v === 'string' ? v.slice(0, 160) : '';
  } catch {
    return '';
  }
}

export function savePromise(text: string): void {
  try {
    window.localStorage.setItem(PROMISE_KEY, text.slice(0, 160));
  } catch {
    /* abaikan */
  }
}
