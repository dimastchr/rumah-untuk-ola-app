import { speechService } from './speech';

/**
 * Ucapkan teks lewat speechService.speak (teks persis, agar cocok dengan rekaman),
 * lalu jalankan `then` satu kali saat selesai. Ada batas waktu cadangan bila
 * perangkat tidak pernah mengabarkan suara selesai.
 */
export function speakThen(text: string, then: () => void, fallbackMs = 10000) {
  let called = false;
  const once = () => {
    if (called) return;
    called = true;
    window.clearTimeout(t);
    then();
  };
  const t = window.setTimeout(once, fallbackMs);
  speechService.speak(text, { onEnd: once });
  return () => {
    called = true;
    window.clearTimeout(t);
  };
}
