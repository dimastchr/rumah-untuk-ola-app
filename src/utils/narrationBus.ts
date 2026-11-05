/**
 * Penanda sederhana apakah narasi MP3 adegan sedang diputar, supaya pertanyaan
 * "Ayo Berpikir" yang dibacakan otomatis tidak memotong narasi.
 */
let playing = false;
const waiters = new Set<() => void>();

export function setNarrationPlaying(v: boolean) {
  playing = v;
  if (!v) {
    const fns = Array.from(waiters);
    waiters.clear();
    fns.forEach((fn) => {
      try {
        fn();
      } catch {
        /* abaikan */
      }
    });
  }
}

export const isNarrationPlaying = () => playing;

/** Jalankan fn saat narasi tidak sedang diputar (langsung bila sudah diam). Mengembalikan fungsi batal. */
export function whenNarrationIdle(fn: () => void): () => void {
  if (!playing) {
    fn();
    return () => {};
  }
  waiters.add(fn);
  return () => {
    waiters.delete(fn);
  };
}
