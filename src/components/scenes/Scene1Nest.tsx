import React, { useState } from 'react';
import { motion } from 'motion/react';
import { speechService } from '../../utils/speech';
import { Draggable } from '../Draggable';
import { Arena, BigButton, PopCard, Bubble, NextRow } from '../ui';
import { ThinkQuestion, SpeakButton } from '../Think';
import { SCENES } from '../../types';

interface Props {
  onComplete: () => void;
}

// Bahan sarang (ranting dan daun) + pengecoh (plastik dan batu)
const ALL_ITEMS = [
  { id: 'ranting-1', name: 'Ranting', icon: '🪵', good: true },
  { id: 'plastik', name: 'Plastik', icon: '🧴', good: false },
  { id: 'daun-1', name: 'Daun', icon: '🍃', good: true },
  { id: 'batu', name: 'Batu', icon: '🪨', good: false },
  { id: 'ranting-2', name: 'Ranting', icon: '🪵', good: true },
  { id: 'daun-2', name: 'Daun', icon: '🍃', good: true },
];
const ITEMS = ALL_ITEMS.filter((i) => i.good);

const INSTRUCTION = 'Pilih bahan yang cocok untuk sarang Ola.';
const DISTRACTOR = 'Plastik dan batu bukan dari pohon. Pilih ranting dan daun, ya.';

const QUESTION = 'Mengapa Ola perlu hutan yang banyak pohonnya?';
const WRONG_Q = 'Coba baca lagi. Dari apa sarang Ola dibuat?';
const OPTIONS = [
  { text: 'Sarang Ola dibuat dari ranting dan daun pohon.', correct: true, feedback: 'Tepat! Sarang Ola dibuat dari ranting dan daun pohon.' },
  { text: 'Ola suka bermain pasir.', feedback: WRONG_Q },
  { text: 'Ola tidur di dalam sungai.', feedback: WRONG_Q },
];

const FEEDBACK = 'Hebat! Sarang Ola sudah jadi. Orangutan tidur di sarang baru setiap malam.';
const FACT = 'Orangutan menghabiskan sebagian besar waktunya di pohon.';

export const Scene1Nest: React.FC<Props> = ({ onComplete }) => {
  const [placed, setPlaced] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const [done, setDone] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [shake, setShake] = useState<string | null>(null);
  const [hint, setHint] = useState(false);

  const place = (id: string) => {
    if (placed.includes(id)) return;
    const item = ALL_ITEMS.find((i) => i.id === id);
    if (!item?.good) {
      // Pengecoh: kembali ke tempatnya + umpan balik lembut
      setSelected(null);
      setShake(id);
      window.setTimeout(() => setShake(null), 700);
      setHint(true);
      speechService.speak(DISTRACTOR);
      return;
    }
    setHint(false);
    const next = [...placed, id];
    setPlaced(next);
    setSelected(null);
    if (next.length === ITEMS.length) {
      setDone(true);
      speechService.speak(FEEDBACK, {
        onEnd: () => setShowFact(true),
      });
      // Pop-up tetap muncul walau suara mati / tidak didukung
      window.setTimeout(() => setShowFact(true), 5000);
    } else {
      speechService.speak('Bagus!', { rate: 1 });
    }
  };

  const tapBranch = () => {
    if (selected) place(selected);
    else {
      // Belum memilih bahan: ingatkan instruksi
      speechService.speak(INSTRUCTION);
    }
  };

  return (
    <div className="space-y-4">
      <Arena title="Bantu Ola membuat sarang" icon="🪺" right={<span className="rounded-full bg-sun-200 px-3 py-1 font-display text-lg font-bold text-bark">{placed.length}/{ITEMS.length}</span>}>
        {!done ? (
          <>
            <div className="flex items-start gap-3">
              <p className="flex-1 text-lg sm:text-xl font-bold text-bark">{INSTRUCTION}</p>
              <SpeakButton text={INSTRUCTION} />
            </div>
            {/* Tujuan lepas: dahan pohon */}
            <button
              type="button"
              data-drop="dahan"
              onClick={tapBranch}
              aria-label={`Dahan pohon. Sarang ${placed.length} dari ${ITEMS.length}. Ketuk untuk menaruh bahan.`}
              className={`relative mx-auto flex h-48 w-full max-w-md flex-col items-center justify-end rounded-[32px] border-4 border-dashed p-3 transition-colors ${
                hover || selected ? 'border-sun-400 bg-sun-100' : 'border-forest-500 bg-forest-50'
              }`}
            >
              <span aria-hidden="true" className="absolute left-4 right-4 bottom-12 h-5 rounded-full bg-[#8a5a32]" />
              <span aria-hidden="true" className="absolute -top-1 left-6 text-5xl">🌳</span>
              <span aria-hidden="true" className="relative z-10 mb-12 flex flex-wrap justify-center gap-1 text-4xl">
                {placed.map((id) => (
                  <motion.span key={id} initial={{ scale: 0, y: -30 }} animate={{ scale: 1, y: 0 }}>
                    {ITEMS.find((i) => i.id === id)?.icon}
                  </motion.span>
                ))}
              </span>
              <span className="relative z-10 font-display text-lg font-bold text-forest-800">Dahan pohon</span>
            </button>

            {/* Bahan sarang */}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
              {ALL_ITEMS.map((it) =>
                placed.includes(it.id) ? (
                  <div key={it.id} aria-hidden="true" className="min-h-24 rounded-3xl border-4 border-dashed border-forest-100" />
                ) : (
                  <Draggable
                    key={it.id}
                    id={it.id}
                    label={`${it.name}. Seret ke dahan, atau ketuk lalu ketuk dahan.`}
                    shake={shake === it.id}
                    selected={selected === it.id}
                    onTap={(id) => setSelected((s) => (s === id ? null : id))}
                    onDrop={(id, target) => {
                      if (target === 'dahan') place(id);
                    }}
                    onHover={(t) => setHover(t === 'dahan')}
                    className={`flex min-h-24 flex-col items-center justify-center rounded-3xl border-4 bg-white shadow-md ${
                      selected === it.id ? 'border-sun-400 ring-4 ring-sun-300' : 'border-sun-200'
                    }`}
                  >
                    <span aria-hidden="true" className="text-4xl sm:text-5xl">{it.icon}</span>
                    <span className="font-display text-base sm:text-lg font-bold text-bark">{it.name}</span>
                  </Draggable>
                )
              )}
            </div>
            <p className="text-base text-bark/80">Atau ketuk bahan, lalu ketuk dahan.</p>
            {hint && <Bubble who="ola" tone="hint">{DISTRACTOR}</Bubble>}
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
            <div className="relative overflow-hidden rounded-[28px] border-4 border-sun-300">
              <img
                src={SCENES[1].bgImage}
                alt="Ola duduk tersenyum di atas sarang barunya di dahan pohon."
                className="block aspect-[16/9] w-full object-cover"
              />
              <span aria-hidden="true" className="floaty absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-4xl shadow-lg">🪺✨</span>
            </div>
            <Bubble who="ola" tone="ok">{FEEDBACK}</Bubble>
          </motion.div>
        )}
      </Arena>

      <PopCard
        open={showFact}
        title="💡 Tahukah Kamu?"
        who="ola"
        action={
          <>
            <BigButton tone="sky" icon="🔊" onClick={() => speechService.speak(`Tahukah kamu? ${FACT}`)}>
              Dengar
            </BigButton>
          </>
        }
      >
        {FACT}
      </PopCard>

      {showFact && <ThinkQuestion question={QUESTION} options={OPTIONS} onDone={() => setAnswered(true)} />}

      {answered && <NextRow onClick={onComplete} icon="▶" label="Lanjut" />}
    </div>
  );
};
