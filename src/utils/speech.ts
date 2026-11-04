/**
 * Suara umpan balik (Web Speech API, id-ID) dan audio narasi MP3.
 * Semua berjalan di perangkat; tidak ada data yang dikirim ke server.
 */

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
    if (!this.soundEnabled || !this.synth) {
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
