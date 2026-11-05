import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { speechService } from '../utils/speech';
import { speakThen } from '../utils/speakThen';
import { whenNarrationIdle } from '../utils/narrationBus';
import { useScrollIntoView } from './ui';

/* ---------- Acak urutan (Fisher–Yates); bila hasilnya sama dengan urutan asli, acak lagi ---------- */
export function shuffle<T>(arr: T[], avoidSameOrder = false): T[] {
  if (arr.length < 2) return [...arr];
  for (let tries = 0; tries < 8; tries++) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    if (!avoidSameOrder || a.some((x, i) => x !== arr[i])) return a;
  }
  return [...arr].reverse();
}

/* ---------- Bacakan otomatis saat muncul, tanpa memotong narasi adegan ---------- */
export function useAutoSpeak(text: string, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    let cancelWait = () => {};
    const t = window.setTimeout(() => {
      cancelWait = whenNarrationIdle(() => speechService.speak(text));
    }, 350);
    return () => {
      window.clearTimeout(t);
      cancelWait();
    };
  }, [text, enabled]);
}

/* ---------- Tombol 🔊 kecil untuk membacakan ulang ---------- */
export const SpeakButton: React.FC<{ text: string; label?: string }> = ({ text, label = 'Dengarkan' }) => (
  <button
    type="button"
    onClick={() => speechService.speak(text)}
    aria-label={`${label}: ${text}`}
    className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-2xl text-white shadow-[0_4px_0_#17628f] active:translate-y-[3px] active:shadow-none"
  >
    <span aria-hidden="true">🔊</span>
  </button>
);

/* ---------- Ledakan bintang kecil saat jawaban benar (mati bila "kurangi gerak") ---------- */
const StarBurst: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
    {[0, 1, 2, 3, 4].map((i) => {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
      return (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{ x: Math.cos(angle) * 90, y: Math.sin(angle) * 60, scale: [0, 1.4, 1], opacity: [1, 1, 0] }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute text-4xl"
        >
          ⭐
        </motion.span>
      );
    })}
  </div>
);

export const ThinkShell: React.FC<{ title?: string; children: React.ReactNode; refEl?: React.Ref<HTMLElement> }> = ({
  title = 'Ayo Berpikir',
  children,
  refEl,
}) => (
  <motion.section
    ref={refEl}
    aria-label={title}
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative space-y-3 rounded-[32px] border-4 border-sun-300 bg-gradient-to-b from-sun-100 via-white to-sky-100 p-3 sm:p-5 shadow-lg"
  >
    <h3 className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-display text-lg sm:text-xl font-bold text-forest-800 shadow-sm">
      <span aria-hidden="true">🧠</span>
      {title}
    </h3>
    {children}
  </motion.section>
);

export const FeedbackBubble: React.FC<{ ok: boolean; text: string }> = ({ ok, text }) => (
  <motion.div
    key={text + ok}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    role="status"
    aria-live="polite"
    className={`flex items-center gap-3 rounded-3xl border-4 px-4 py-3 shadow-md ${
      ok ? 'border-forest-500 bg-forest-50 text-forest-900' : 'border-sun-400 bg-sun-100 text-bark'
    }`}
  >
    <span aria-hidden="true" className="text-3xl leading-none">
      {ok ? '🌟' : '🤔'}
    </span>
    <p className="text-lg sm:text-xl font-bold leading-snug">{text}</p>
  </motion.div>
);

/* =====================================================================
   ThinkQuestion: satu pertanyaan, 3 kartu pilihan besar (diacak)
   ===================================================================== */
export interface ThinkOption {
  text: string;
  correct?: boolean;
  /** Umpan balik yang dibacakan, persis teks spek */
  feedback: string;
}

export const ThinkQuestion: React.FC<{
  question: string;
  options: ThinkOption[];
  onDone: () => void;
  /** tampilkan judul "🧠 Ayo Berpikir" (default ya) */
  title?: string;
}> = ({ question, options, onDone, title }) => {
  const [shuffled] = useState(() => shuffle(options));
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [shake, setShake] = useState<string | null>(null);
  const [fb, setFb] = useState<{ ok: boolean; text: string } | null>(null);
  const [solved, setSolved] = useState<string | null>(null);
  const cancelRef = useRef<() => void>(() => {});
  const ref = useScrollIntoView<HTMLElement>(true);

  useAutoSpeak(question);
  useEffect(() => () => cancelRef.current(), []);

  const pick = (o: ThinkOption) => {
    if (solved) return;
    if (o.correct) {
      setSolved(o.text);
      setFb({ ok: true, text: o.feedback });
      cancelRef.current = speakThen(o.feedback, onDone);
    } else {
      setWrongPicks((w) => (w.includes(o.text) ? w : [...w, o.text]));
      setShake(o.text);
      window.setTimeout(() => setShake(null), 700);
      setFb({ ok: false, text: o.feedback });
      speechService.speak(o.feedback);
    }
  };

  return (
    <ThinkShell title={title} refEl={ref}>
      <div className="flex items-start gap-3">
        <p className="flex-1 font-display text-xl sm:text-2xl font-bold text-bark leading-snug">{question}</p>
        <SpeakButton text={question} label="Dengar pertanyaan" />
      </div>
      <div className="grid grid-cols-1 gap-3">
        {shuffled.map((o) => {
          const isSolved = solved === o.text;
          const isWrong = wrongPicks.includes(o.text) && !solved;
          return (
            <motion.button
              key={o.text}
              type="button"
              onClick={() => pick(o)}
              disabled={!!solved && !isSolved}
              aria-pressed={isSolved}
              animate={shake === o.text ? { x: [0, -8, 8, -6, 6, 0] } : isSolved ? { scale: [1, 1.04, 1] } : {}}
              transition={{ duration: 0.6 }}
              className={`relative flex min-h-16 items-center gap-3 rounded-3xl border-4 bg-white px-4 py-3 text-left font-display text-lg sm:text-2xl font-bold text-bark shadow-md transition-colors active:scale-95 disabled:opacity-40 ${
                isSolved
                  ? 'border-forest-500 bg-forest-50'
                  : isWrong
                  ? 'border-sun-400 bg-sun-100'
                  : 'border-sky-200 hover:border-sky-400'
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-2xl ${
                  isSolved ? 'bg-forest-700 text-white' : 'bg-sky-100'
                }`}
              >
                {isSolved ? '✔' : '•'}
              </span>
              <span className="min-w-0 flex-1">{o.text}</span>
              {isSolved && <StarBurst />}
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence>{fb && <FeedbackBubble ok={fb.ok} text={fb.text} />}</AnimatePresence>
    </ThinkShell>
  );
};

/* =====================================================================
   OrderCards: ketuk kartu sesuai urutan. Salah urutan → umpan balik + ulang.
   ===================================================================== */
export const OrderCards: React.FC<{
  instruction: string;
  /** kartu dalam urutan yang benar */
  items: string[];
  correctFeedback: string;
  wrongFeedback: string;
  onDone: () => void;
  /** 'list' = daftar bernomor (urutan kejadian), 'sentence' = susun menjadi satu kalimat */
  layout?: 'list' | 'sentence';
  title?: string;
}> = ({ instruction, items, correctFeedback, wrongFeedback, onDone, layout = 'list', title }) => {
  const [pool] = useState(() => shuffle(items, true));
  const [placed, setPlaced] = useState<string[]>([]);
  const [shake, setShake] = useState<string | null>(null);
  const [fb, setFb] = useState<{ ok: boolean; text: string } | null>(null);
  const [solved, setSolved] = useState(false);
  const cancelRef = useRef<() => void>(() => {});
  const ref = useScrollIntoView<HTMLElement>(true);

  useAutoSpeak(instruction);
  useEffect(() => () => cancelRef.current(), []);

  const tap = (card: string) => {
    if (solved || placed.includes(card)) return;
    const expected = items[placed.length];
    if (card !== expected) {
      setShake(card);
      window.setTimeout(() => setShake(null), 700);
      setPlaced([]);
      setFb({ ok: false, text: wrongFeedback });
      speechService.speak(wrongFeedback);
      return;
    }
    const next = [...placed, card];
    setPlaced(next);
    setFb(null);
    if (next.length === items.length) {
      setSolved(true);
      setFb({ ok: true, text: correctFeedback });
      cancelRef.current = speakThen(correctFeedback, onDone);
    }
  };

  return (
    <ThinkShell title={title} refEl={ref}>
      <div className="flex items-start gap-3">
        <p className="flex-1 font-display text-xl sm:text-2xl font-bold text-bark leading-snug">{instruction}</p>
        <SpeakButton text={instruction} label="Dengar petunjuk" />
      </div>

      {/* Hasil susunan */}
      {layout === 'list' ? (
        <ol className="space-y-2" aria-label="Urutan yang kamu pilih">
          {items.map((_, i) => (
            <li
              key={i}
              className={`flex min-h-14 items-center gap-3 rounded-2xl border-4 border-dashed px-3 py-2 ${
                placed[i] ? 'border-forest-500 bg-forest-50' : 'border-forest-200 bg-white/60'
              }`}
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sun-300 font-display text-xl font-bold text-bark"
              >
                {i + 1}
              </span>
              <span className="font-display text-lg sm:text-xl font-bold text-bark">{placed[i] ?? ''}</span>
            </li>
          ))}
        </ol>
      ) : (
        <div
          aria-label="Kalimat yang kamu susun"
          className={`flex min-h-20 flex-wrap items-center gap-2 rounded-3xl border-4 border-dashed px-3 py-3 ${
            solved ? 'border-forest-500 bg-forest-50' : 'border-forest-200 bg-white/60'
          }`}
        >
          {placed.length === 0 && <span aria-hidden="true" className="text-3xl opacity-40">✏️</span>}
          {placed.map((w) => (
            <motion.span
              key={w}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-2xl bg-white px-3 py-1 font-display text-xl sm:text-2xl font-bold text-bark shadow-sm"
            >
              {w}
            </motion.span>
          ))}
        </div>
      )}

      {/* Kartu pilihan */}
      {!solved && (
        <div className={`grid gap-3 ${layout === 'list' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2'}`}>
          {pool.map((card) => {
            const used = placed.includes(card);
            return (
              <motion.button
                key={card}
                type="button"
                onClick={() => tap(card)}
                disabled={used}
                aria-hidden={used || undefined}
                animate={shake === card ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                transition={{ duration: 0.6 }}
                className={`min-h-16 rounded-3xl border-4 px-3 py-2 font-display text-lg sm:text-xl font-bold shadow-md active:scale-95 ${
                  used ? 'border-dashed border-forest-100 bg-transparent text-transparent shadow-none' : 'border-sky-200 bg-white text-bark hover:border-sky-400'
                }`}
              >
                {card}
              </motion.button>
            );
          })}
        </div>
      )}

      <AnimatePresence>{fb && <FeedbackBubble ok={fb.ok} text={fb.text} />}</AnimatePresence>
      {solved && (
        <div className="relative h-0">
          <StarBurst />
        </div>
      )}
    </ThinkShell>
  );
};
