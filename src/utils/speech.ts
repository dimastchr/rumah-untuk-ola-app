/**
 * Suara umpan balik: rekaman MP3 suara Aoede (AI Studio); Web Speech API hanya cadangan
 * (mis. kalimat yang diketik anak). Audio narasi MP3.
 * Semua berjalan di perangkat; tidak ada data yang dikirim ke server.
 */

import { VOICE_CLIPS, VO_BASE, READ_TIMINGS, WORD_SLICES } from './voiceClips';

export const normVo = (t: string) =>
  t.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();

export type PlayResult = 'playing' | 'blocked' | 'error' | 'muted';

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private indonesianVoice: SpeechSynthesisVoice | null = null;
  private soundEnabled = true;
  private currentAudio: HTMLAudioElement | null = null;
  private listeners = new Set<() => void>();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      try {
        this.synth.addEventListener?.('voiceschanged', () => this.initVoices());
      } catch {
        /* abaikan */
      }
    }
  }

  /** Dipanggil komponen yang perlu tahu saat semua suara dihentikan */
  public onStop(fn: () => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled) this.stopAll();
  }

  public isSoundEnabled() {
    return this.soundEnabled;
  }

  private initVoices() {
    if (!this.synth) return;
    try {
      const voices = this.synth.getVoices();
      // Hanya suara bahasa Indonesia. Jika tidak ada, biarkan browser memilih via lang="id-ID".
      this.indonesianVoice =
        voices.find((v) => v.lang.toLowerCase().replace('_', '-') === 'id-id') ||
        voices.find((v) => v.lang.toLowerCase().startsWith('id')) ||
        null;
    } catch {
      this.indonesianVoice = null;
    }
  }

  public speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      onEnd?: () => void;
      onStart?: () => void;
      onBoundary?: (charIndex: number) => void;
    }
  ) {
    if (!this.soundEnabled) {
      options?.onEnd?.();
      return false;
    }
    // Utamakan rekaman suara Aoede (AI Studio) agar konsisten dengan narasi
    const key = normVo(text);
    const slice = WORD_SLICES[key];
    if (slice) {
      try {
        this.stopAll();
        const [file, s0, e0] = slice;
        const audio = new Audio(VO_BASE + file);
        this.currentAudio = audio;
        const start = Math.max(0, s0 - 0.04);
        const stopAt = e0 + 0.08;
        audio.preload = 'auto';
        const begin = () => {
          try { audio.currentTime = start; } catch { /* abaikan */ }
          const pr = audio.play();
          if (pr && typeof pr.catch === 'function') pr.catch(() => options?.onEnd?.());
          window.setTimeout(() => {
            if (this.currentAudio === audio) { audio.pause(); options?.onEnd?.(); }
          }, (stopAt - start) * 1000 + 120);
        };
        if (audio.readyState >= 1) begin();
        else audio.addEventListener('loadedmetadata', begin, { once: true });
        audio.onerror = () => options?.onEnd?.();
        return true;
      } catch {
        /* lanjut */
      }
    }
    const clip = VOICE_CLIPS[key];
    const timings = READ_TIMINGS[key];
    if (clip) {
      try {
        this.stopAll();
        const audio = new Audio(VO_BASE + clip);
        this.currentAudio = audio;
        let started = false;
        audio.ontimeupdate = () => {
          if (!started) { started = true; options?.onStart?.(); }
          if (!options?.onBoundary) return;
          if (timings) {
            // sorot kata sesuai waktu sebenarnya di rekaman
            const t = audio.currentTime;
            let idx = 0;
            for (let k = 0; k < timings.length; k++) if (t >= timings[k][0] - 0.05) idx = k;
            const words = text.split(/\s+/);
            let ci = 0;
            for (let k = 0; k < idx && k < words.length; k++) ci += words[k].length + 1;
            options.onBoundary(ci);
          } else if (audio.duration && isFinite(audio.duration)) {
            options.onBoundary(Math.floor((audio.currentTime / audio.duration) * text.length));
          }
        };
        audio.onended = () => options?.onEnd?.();
        audio.onerror = () => options?.onEnd?.();
        const pr = audio.play();
        if (pr && typeof pr.catch === 'function') pr.catch(() => options?.onEnd?.());
        return true;
      } catch {
        /* lanjut ke suara perangkat */
      }
    }
    if (!this.synth) {
      options?.onEnd?.();
      return false;
    }
    try {
      this.stopAll();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'id-ID';
      if (this.indonesianVoice) u.voice = this.indonesianVoice;
      u.rate = options?.rate ?? 0.9;
      u.pitch = options?.pitch ?? 1.1;
      if (options?.onStart) u.onstart = options.onStart;
      if (options?.onBoundary) {
        u.onboundary = (e) => {
          if (e.name === undefined || e.name === 'word') options.onBoundary?.(e.charIndex);
        };
      }
      u.onend = () => options?.onEnd?.();
      u.onerror = () => options?.onEnd?.();
      this.synth.speak(u);
      return true;
    } catch {
      options?.onEnd?.();
      return false;
    }
  }

  /**
   * Putar MP3 narasi. Mengembalikan elemen audio; status awal dikabarkan lewat onStatus
   * ('blocked' bila browser menolak putar otomatis, supaya tombol besar "Dengarkan" tampil).
   */
  public playAudio(
    url: string,
    handlers: {
      onTimeUpdate?: (current: number, duration: number) => void;
      onEnded?: () => void;
      onStatus?: (status: PlayResult) => void;
    } = {}
  ): HTMLAudioElement | null {
    if (!this.soundEnabled) {
      handlers.onStatus?.('muted');
      return null;
    }
    this.stopAll();
    try {
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.currentAudio = audio;
      audio.ontimeupdate = () => {
        if (audio.duration && isFinite(audio.duration)) {
          handlers.onTimeUpdate?.(audio.currentTime, audio.duration);
        }
      };
      audio.onended = () => handlers.onEnded?.();
      audio.onerror = () => handlers.onStatus?.('error');
      const p = audio.play();
      if (p && typeof p.then === 'function') {
        p.then(() => handlers.onStatus?.('playing')).catch((err: unknown) => {
          const name = (err as { name?: string })?.name;
          handlers.onStatus?.(name === 'NotAllowedError' ? 'blocked' : 'error');
        });
      } else {
        handlers.onStatus?.('playing');
      }
      return audio;
    } catch {
      handlers.onStatus?.('error');
      return null;
    }
  }

  public stopAudio() {
    if (this.currentAudio) {
      try {
        this.currentAudio.ontimeupdate = null;
        this.currentAudio.onended = null;
        this.currentAudio.pause();
        this.currentAudio.removeAttribute('src');
        this.currentAudio.load();
      } catch {
        /* abaikan */
      }
      this.currentAudio = null;
    }
  }

  public stopSpeech() {
    try {
      this.synth?.cancel();
    } catch {
      /* abaikan */
    }
  }

  public stopAll() {
    this.stopAudio();
    this.stopSpeech();
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch {
        /* abaikan */
      }
    });
  }
}

export const speechService = new SpeechService();
