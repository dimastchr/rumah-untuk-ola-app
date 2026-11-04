import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { speechService } from '../../utils/speech';
import { Arena, Avatar, BigButton, Bubble, NextRow } from '../ui';

interface Props {
  onComplete: () => void;
}

const ORDER_HINT = 'Padamkan apinya dulu, ya.';

export const Scene6Firefighters: React.FC<Props> = ({ onComplete }) => {
  const [flames, setFlames] = useState([1, 2, 3]);
  const [wet, setWet] = useState(false);
  const [planted, setPlanted] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const fireOut = flames.length === 0;

  const tapFlame = (id: number) => {
    setHint(null);
    const rest = flames.filter((f) => f !== id);
    setFlames(rest);
    speechService.speak(rest.length === 0 ? 'Api padam!' : 'Byur!', { rate: 1 });
  };

  const water = () => {
    if (!fireOut) {
      setHint(ORDER_HINT);
      speechService.speak(ORDER_HINT);
      return;
    }
    setHint(null);
    setWet(true);
    speechService.speak('Gambut basah!', { rate: 1 });
  };

  const plant = () => {
    if (!fireOut) {
      setHint(ORDER_HINT);
      speechService.speak(ORDER_HINT);
      return;
    }
    if (!wet) {
      setHint('Siram gambutnya dulu, ya.');
      speechService.speak('Siram gambutnya dulu, ya.');
      return;
    }
    setHint(null);
    setPlanted(true);
    speechService.speak('Hebat! Tiga bintang emas!');
  };

  const steps = [
    { n: 1, label: 'Titik Api', done: fireOut, icon: '🔥' },
    { n: 2, label: 'Siram Gambut', done: wet, icon: '💦' },
    { n: 3, label: 'Tanam Bibit', done: planted, icon: '🌱' },
  ];

  return (
    <div className="space-y-4">
      <Arena title="Bantu penjaga hutan" icon="🧑‍🚒">
        {/* Peta langkah */}
        <ol className="grid grid-cols-3 gap-2" aria-label="Urutan langkah">
          {steps.map((s) => (
            <li
              key={s.n}
              className={`rounded-2xl px-2 py-2 text-center font-display text-base sm:text-lg font-bold ${
                s.done ? 'bg-forest-700 text-white' : 'bg-white text-bark border-2 border-forest-100'
              }`}
            >
              {s.done ? '✅' : `${s.n}.`} {s.label}
            </li>
          ))}
        </ol>

        {/* Lahan */}
        <div
          className={`relative h-44 overflow-hidden rounded-[28px] border-4 transition-colors duration-700 ${
            wet ? 'border-sky-400 bg-gradient-to-b from-sky-100 to-[#5b4630]' : 'border-orange-300 bg-gradient-to-b from-stone-200 to-[#7a5233]'
          }`}
        >
          {!planted && (
            <div className="absolute inset-0 flex items-center justify-center gap-4 sm:gap-8">
              <AnimatePresence>
                {flames.map((f) => (
                  <motion.button
                    key={f}
                    type="button"
                    onClick={() => tapFlame(f)}
                    exit={{ scale: 0, opacity: 0 }}
                    aria-label={`Titik api ${f}. Ketuk untuk menyemprot air.`}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-white/70 text-5xl shadow-lg motion-safe:animate-bounce"
                  >
                    <span aria-hidden="true">🔥</span>
                  </motion.button>
                ))}
              </AnimatePresence>
              {fireOut && !wet && <span aria-hidden="true" className="text-5xl">🟫🟫🟫</span>}
              {wet && <span aria-hidden="true" className="text-5xl">💧💧💧</span>}
            </div>
          )}
          {planted && (
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute inset-0 flex items-end justify-center gap-6 pb-4 text-6xl" aria-hidden="true">
              <span>🌱</span>
              <span>🌱</span>
              <span>🌱</span>
            </motion.div>
          )}
        </div>

        {!planted && (
          <div className="grid grid-cols-2 gap-3">
            <BigButton tone="sky" icon="💦" onClick={water} disabled={wet}>
              Siram Gambut
            </BigButton>
            <BigButton tone="green" icon="🌱" onClick={plant}>
              Tanam Bibit
            </BigButton>
          </div>
        )}
        {!fireOut && !hint && <p className="text-lg font-semibold text-bark">Ketuk titik api 🔥 dulu.</p>}
        {hint && <Bubble who="petugas" tone="hint">{hint}</Bubble>}

        {planted && (
          <div className="space-y-3 text-center">
            <div className="flex justify-center gap-2" aria-label="Tiga bintang emas">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2 + i * 0.25, type: 'spring' }}
                  className="text-6xl drop-shadow"
                >
                  ⭐
                </motion.span>
              ))}
            </div>
            <div className="flex justify-center gap-4">
              {(['petugas', 'relawan'] as const).map((w, i) => (
                <motion.div
                  key={w}
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: 2, delay: i * 0.2 }}
                  className="flex flex-col items-center"
                >
                  <Avatar who={w} size={80} />
                  <span aria-hidden="true" className="text-3xl">👋</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </Arena>

      {planted && (
        <NextRow onClick={onComplete} icon="▶" label="Lanjut" />
      )}
    </div>
  );
};
