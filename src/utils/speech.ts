/**
 * Web Speech API and Narration Audio helper for "Rumah untuk Ola"
 */

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private indonesianVoice: SpeechSynthesisVoice | null = null;
  private soundEnabled: boolean = true;
  private currentAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  private initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Look for Indonesian voices (id, id-ID, id_ID)
    const indonesian = voices.find((v) =>
      v.lang.toLowerCase().startsWith('id') || v.lang.toLowerCase().includes('indonesia')
    );
    if (indonesian) {
      this.indonesianVoice = indonesian;
    } else if (voices.length > 0) {
      // Fallback
      this.indonesianVoice = voices[0];
    }
  }

  /**
   * Speak feedback in Indonesian using Web Speech API (id-ID)
   */
  public speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      onEnd?: () => void;
      onStart?: () => void;
    }
  ) {
    if (!this.soundEnabled || !this.synth) {
      options?.onEnd?.();
      return;
    }

    try {
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      if (this.indonesianVoice) {
        utterance.voice = this.indonesianVoice;
      }
      utterance.rate = options?.rate ?? 0.95; // slightly slower for SD class 1-3
      utterance.pitch = options?.pitch ?? 1.1; // warm and friendly

      if (options?.onStart) utterance.onstart = options.onStart;
      if (options?.onEnd) utterance.onend = options.onEnd;
      utterance.onerror = () => {
        options?.onEnd?.();
      };

      this.synth.speak(utterance);
    } catch {
      options?.onEnd?.();
    }
  }

  /**
   * Play narration MP3 with word synchronization and error safety
   */
  public playAudio(
    url: string,
    onTimeUpdate?: (currentTime: number, duration: number) => void,
    onEnded?: () => void,
    onError?: () => void
  ): HTMLAudioElement | null {
    if (!this.soundEnabled) {
      return null;
    }

    this.stopAudio();

    try {
      const audio = new Audio(url);
      this.currentAudio = audio;

      audio.ontimeupdate = () => {
        if (onTimeUpdate && audio.duration) {
          onTimeUpdate(audio.currentTime, audio.duration);
        }
      };

      audio.onended = () => {
        if (onEnded) onEnded();
      };

      audio.onerror = () => {
        if (onError) onError();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented by browser policy before first interaction
          if (onError) onError();
        });
      }

      return audio;
    } catch {
      if (onError) onError();
      return null;
    }
  }

  public stopAudio() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // Ignore
      }
      this.currentAudio = null;
    }
  }

  public stopSpeech() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // Ignore
      }
    }
  }

  public stopAll() {
    this.stopAudio();
    this.stopSpeech();
  }
}

export const speechService = new SpeechService();
