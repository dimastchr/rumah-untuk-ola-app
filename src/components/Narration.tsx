import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SceneData, ReadingLevel } from '../types';
import { speechService, PlayResult } from '../utils/speech';
import { syllabify } from '../utils/syllables';

/* Bobot waktu per kata: panjang kata + jeda tanda baca. Dipakai untuk sorot kata
   sebanding dengan currentTime/duration audio asli (sinkron persis per kata tidak tersedia). */
function wordTimeline(words: string[]) {
  const weights = words.map((w) => w.replace(/[^A-Za-z]/g, '').length + 2 + (/[.!?]$/.test(w) ? 4 : /[,]$/.test(w) ? 2 : 0));
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  return weights.map((w) => {
    const startFrac = acc / total;
    acc += w;
    return startFrac;
  });
}

/* ---------------- Narasi suara (MP3) dengan teks menyala per kata ---------------- */
export const NarrationCard: React.FC<{ scene: SceneData; soundEnabled: boolean; isUppercase: boolean }> = ({
  scene,
  soundEnabled,
  isUppercase,
}) => {
  const words = useMemo(() => scene.narrationText.split(/\s+/).filter(Boolean), [scene.narrationText]);
  const starts = useMemo(() => wordTimeline(words), [words]);
  const [active, setActive] = useState(-1);
  const [status, setStatus] = useState<PlayResult | 'idle' | 'ended' | 'paused'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = () => {
    setActive(-1);
    const audio = speechService.playAudio(scene.narrationAudio, {
      onTimeUpdate: (t) => {
        const span = scene.speechEnd - scene.speechStart;
        const frac = (t - scene.speechStart) / span;
        if (frac < 0) return setActive(-1);
        if (frac >= 1) return setActive(words.length - 1);
        let idx = 0;
        while (idx + 1 < starts.length && starts[idx + 1] <= frac) idx++;
        setActive(idx);
      },
      onEnded: () => {
        setStatus('ended');
        setTimeout(() => setActive(-1), 1200);
      },
      onStatus: (s) => setStatus(s),
    });
    audioRef.current = audio;
  };

  // Putar otomatis saat adegan dibuka; berhenti saat keluar adegan.
  useEffect(() => {
    if (soundEnabled) play();
    else setStatus('muted');
    const off = speechService.onStop(() => {
      setActive(-1);
      audioRef.current = null;
      setStatus((s) => (s === 'playing' || s === 'paused' ? 'ended' : s));
    });
    return () => {
      off();
      speechService.stopAudio();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id, soundEnabled]);

  const display = (w: string) => (isUppercase ? w.toUpperCase() : w);
  const blocked = status === 'blocked' || status === 'error';
  const playing = status === 'playing';

  return (
    <div className="rounded-[28px] bg-white border-4 border-sun-200 p-3 sm:p-4 shadow-md space-y-3">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {blocked || status === 'idle' || status === 'muted' ? (
          <button
            type="button"
            onClick={() => (soundEnabled ? play() : undefined)}
            disabled={!soundEnabled}
            className="motion-safe:animate-pulse inline-flex min-h-16 items-center gap-3 rounded-2xl bg-forest-700 px-6 font-display text-2xl font-bold text-white shadow-[0_5px_0_#1b5531] active:translate-y-[3px] active:shadow-none disabled:opacity-50 disabled:animate-none"
          >
            <span aria-hidden="true">▶</span> Dengarkan
          </button>
        ) : (
          <button
            type="button"
            onClick={play}
            className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-sun-300 px-5 font-display text-lg font-bold text-bark shadow-[0_5px_0_#c99000] active:translate-y-[3px] active:shadow-none"
          >
            <span aria-hidden="true">🔁</span> Dengarkan Lagi
          </button>
        )}
        {playing && (
          <button
            type="button"
            onClick={() => {
              audioRef.current?.pause();
              setStatus('paused');
            }}
            aria-label="Jeda narasi"
            className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-2xl text-sky-700 border-2 border-sky-200"
          >
            <span aria-hidden="true">⏸</span>
          </button>
        )}
        {status === 'paused' && audioRef.current && (
          <button
            type="button"
            onClick={() => {
              audioRef.current
                ?.play()
                .then(() => setStatus('playing'))
                .catch(() => setStatus('blocked'));
            }}
            aria-label="Lanjutkan narasi"
            className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-2xl text-sky-700 border-2 border-sky-200"
          >
            <span aria-hidden="true">▶</span>
          </button>
        )}
        <span className="text-base font-semibold text-forest-700" aria-live="polite">
          {!soundEnabled ? '🔇 Suara mati' : playing ? '🔊 Ayo menyimak…' : blocked ? 'Ketuk untuk mendengar' : ''}
        </span>
      </div>
      <p className="text-lg sm:text-xl leading-relaxed text-bark font-semibold" aria-label={scene.narrationText}>
        {words.map((w, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`inline-block rounded-lg px-1 transition-colors duration-150 ${
              i === active ? 'bg-sun-300 text-bark' : i < active ? 'text-forest-700' : ''
            }`}
          >
            {display(w)}
          </span>
        ))}
      </p>
    </div>
  );
};

/* ---------------- Teks bacaan anak (Mudah/Sedang) ---------------- */
export const ReadingCard: React.FC<{
  lines: string[];
  level: ReadingLevel;
  isUppercase: boolean;
  onLevel: (l: ReadingLevel) => void;
  onToggleCase: () => void;
}> = ({ lines, level, isUppercase, onLevel, onToggleCase }) => {
  const text = lines.join(' ');
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);
  const [active, setActive] = useState(-1);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const off = speechService.onStop(() => setActive(-1));
    return () => {
      off();
      if (timer.current) window.clearInterval(timer.current);
    };
  }, []);

  // Peta posisi huruf -> indeks kata untuk event onboundary
  const charToWord = useMemo(() => {
    const map: number[] = [];
    let pos = 0;
    words.forEach((w, i) => {
      for (let k = 0; k < w.length + 1; k++) map[pos + k] = i;
      pos += w.length + 1;
    });
    return map;
  }, [words]);

  const readAloud = () => {
    if (timer.current) window.clearInterval(timer.current);
    let gotBoundary = false;
    const ok = speechService.speak(text, {
      rate: 0.8,
      onBoundary: (ci) => {
        gotBoundary = true;
        setActive(charToWord[ci] ?? -1);
      },
      onEnd: () => {
        if (timer.current) window.clearInterval(timer.current);
        setTimeout(() => setActive(-1), 600);
      },
    });
    if (!ok) {
      setActive(-1);
      return;
    }
    setActive(0);
    // Cadangan bila browser tidak mengirim onboundary: sorot per kata kira-kira tiap 0,6 detik
    let i = 0;
    timer.current = window.setInterval(() => {
      if (gotBoundary) {
        if (timer.current) window.clearInterval(timer.current);
        return;
      }
      i++;
      if (i >= words.length) {
        if (timer.current) window.clearInterval(timer.current);
        return;
      }
      setActive(i);
    }, 650);
  };

  const tapWord = (w: string) => {
    const clean = w.replace(/[.,!?;:"'()]/g, '');
    if (clean) speechService.speak(clean, { rate: 0.75 });
  };

  const disp = (s: string) => (isUppercase ? s.toUpperCase() : s);
  const syllableColors = ['text-forest-700', 'text-sky-700'];

  return (
    <div className="rounded-[28px] bg-gradient-to-br from-sun-100 to-white border-4 border-sun-300 p-3 sm:p-5 shadow-md space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-xl font-bold text-bark">📖 Ayo Membaca</h3>
        <div className="flex items-center gap-2">
          <div role="group" aria-label="Pilih level bacaan" className="flex rounded-2xl bg-white p-1 border-2 border-sun-200">
            {(['mudah', 'sedang'] as const).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={level === l}
                onClick={() => onLevel(l)}
                className={`min-h-12 rounded-xl px-3 font-display text-base font-bold ${
                  level === l ? 'bg-forest-700 text-white' : 'text-forest-800'
                }`}
              >
                {l === 'mudah' ? '🌱 Mudah' : '🌿 Sedang'}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onToggleCase}
            aria-pressed={isUppercase}
            aria-label={isUppercase ? 'Ganti ke huruf kecil' : 'Ganti ke huruf besar'}
            className="min-h-12 min-w-12 rounded-2xl bg-white border-2 border-sun-200 px-3 font-display text-lg font-bold text-bark"
          >
            {isUppercase ? 'Aa' : 'AA'}
          </button>
        </div>
      </div>

      <div className="space-y-1" aria-label={text}>
        {(() => {
          let wi = -1;
          return lines.map((line, li) => (
            <p key={li} className="flex flex-wrap gap-x-2 gap-y-1 font-display text-3xl sm:text-4xl font-bold leading-tight">
              {line
                .split(/\s+/)
                .filter(Boolean)
                .map((w) => {
                  wi++;
                  const idx = wi;
                  const isActive = idx === active;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => tapWord(w)}
                      aria-label={`Dengar kata ${w.replace(/[.,!?]/g, '')}`}
                      className={`min-h-12 rounded-2xl px-2 transition-all ${
                        isActive ? 'bg-sun-300 ring-4 ring-sun-400 scale-105' : 'hover:bg-sun-100'
                      }`}
                    >
                      {level === 'mudah'
                        ? syllabify(w).map((s, si) => (
                            <span key={si} className={syllableColors[si % 2]}>
                              {disp(s)}
                            </span>
                          ))
                        : <span className="text-bark">{disp(w)}</span>}
                    </button>
                  );
                })}
            </p>
          ));
        })()}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={readAloud}
          className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-sky-600 px-5 font-display text-lg font-bold text-white shadow-[0_5px_0_#17628f] active:translate-y-[3px] active:shadow-none"
        >
          <span aria-hidden="true">🔊</span> Bacakan
        </button>
        <span className="text-base text-bark/80">Ketuk kata untuk mendengar.</span>
      </div>
    </div>
  );
};
