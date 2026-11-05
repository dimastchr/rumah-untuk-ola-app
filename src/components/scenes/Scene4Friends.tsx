import React, { useState } from 'react';
import { motion } from 'motion/react';
import { speechService } from '../../utils/speech';
import { Draggable } from '../Draggable';
import { Arena, Avatar, Bubble, CharKey, NextRow } from '../ui';
import { ThinkQuestion } from '../Think';
import { speakThen } from '../../utils/speakThen';

interface Props {
  onComplete: () => void;
}

type AnimalId = 'ola' | 'bima' | 'rara';
type FoodId = 'buah' | 'daun' | 'ara';

const ANIMALS: { id: AnimalId; name: string; species: string; food: FoodId }[] = [
  { id: 'ola', name: 'Ola', species: 'orangutan', food: 'buah' },
  { id: 'bima', name: 'Bima', species: 'bekantan', food: 'daun' },
  { id: 'rara', name: 'Rara', species: 'rangkong', food: 'ara' },
];

const FOODS: { id: FoodId; name: string; icon: string }[] = [
  { id: 'buah', name: 'Buah-buahan', icon: '🍌' },
  { id: 'daun', name: 'Daun Muda', icon: '🌿' },
  { id: 'ara', name: 'Buah Ara', icon: '🟣' },
];

const foodName = (f: FoodId) => FOODS.find((x) => x.id === f)!.name.toLowerCase();

// Umpan balik salah, mengikuti pola naskah Adegan 4 untuk tiap satwa
const hintFor = (a: (typeof ANIMALS)[number]) =>
  `Ups, ${a.name} si ${a.species} paling suka makan ${foodName(a.food)}. Coba berikan ${foodName(a.food)} padanya!`;

const ALL_DONE = 'Nyam-nyam, terima kasih! Makanan mereka sudah tepat.';

const QUESTION = 'Kalau pohon ara terbakar, siapa paling kesulitan makan?';
const WRONG_Q = 'Coba ingat lagi. Siapa yang suka buah ara?';
const OPTIONS = [
  { text: 'Rara si rangkong', correct: true, feedback: 'Benar! Rara suka buah ara. Tanpa pohon ara, Rara kesulitan makan.' },
  { text: 'Bima si bekantan', feedback: WRONG_Q },
  { text: 'Ola si orangutan', feedback: WRONG_Q },
];

export const Scene4Friends: React.FC<Props> = ({ onComplete }) => {
  const [fed, setFed] = useState<AnimalId[]>([]);
  const [selected, setSelected] = useState<FoodId | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [shake, setShake] = useState<AnimalId | null>(null);
  const [msg, setMsg] = useState<{ text: string; tone: 'ok' | 'hint' | 'info'; who?: CharKey } | null>(null);

  const [showQ, setShowQ] = useState(false);
  const [answered, setAnswered] = useState(false);

  const allFed = fed.length === ANIMALS.length;

  const give = (food: FoodId, animalId: AnimalId) => {
    const a = ANIMALS.find((x) => x.id === animalId)!;
    setSelected(null);
    if (fed.includes(animalId)) return;
    if (a.food === food) {
      const next = [...fed, animalId];
      setFed(next);
      if (next.length === ANIMALS.length) {
        setMsg({ text: ALL_DONE, tone: 'ok' });
        speakThen(ALL_DONE, () => setShowQ(true), 7000);
      } else {
        setMsg({ text: `Nyam! ${a.name} senang.`, tone: 'ok', who: a.id });
        speechService.speak(`Nyam! ${a.name} senang.`);
      }
    } else {
      // Salah: tokoh menggeleng pelan, makanan kembali ke tempatnya
      setShake(animalId);
      window.setTimeout(() => setShake(null), 900);
      const h = hintFor(a);
      setMsg({ text: h, tone: 'hint', who: a.id });
      speechService.speak(h);
    }
  };

  return (
    <div className="space-y-4">
      <Arena
        title="Beri makan teman Ola"
        icon="🍽️"
        right={<span className="rounded-full bg-sun-200 px-3 py-1 font-display text-lg font-bold text-bark">{fed.length}/3</span>}
      >
        <p className="text-lg font-semibold text-bark">Seret makanan ke hewan yang tepat.</p>

        {/* Satwa = tujuan lepas */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {ANIMALS.map((a) => {
            const isFed = fed.includes(a.id);
            return (
              <motion.button
                key={a.id}
                type="button"
                data-drop={a.id}
                onClick={() => selected && give(selected, a.id)}
                animate={shake === a.id ? { rotate: [0, -8, 8, -6, 6, 0] } : isFed ? { y: [0, -8, 0] } : {}}
                transition={{ duration: 0.8 }}
                aria-label={`${a.name} si ${a.species}${isFed ? ', sudah makan' : selected ? ', ketuk untuk memberi makanan' : ''}`}
                className={`flex flex-col items-center gap-1 rounded-3xl border-4 p-2 sm:p-3 shadow-md ${
                  isFed
                    ? 'border-forest-500 bg-forest-50'
                    : hover === a.id || selected
                    ? 'border-sun-400 bg-sun-100'
                    : 'border-sky-200 bg-white'
                }`}
              >
                <Avatar who={a.id} size={64} decorative />
                <span className="font-display text-lg sm:text-xl font-bold text-bark">{a.name}</span>
                <span className="text-sm sm:text-base font-semibold text-bark/80">{isFed ? '😋 Kenyang' : a.species}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Piring makanan */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {FOODS.map((f) => {
            const eaten = ANIMALS.some((a) => a.food === f.id && fed.includes(a.id));
            return eaten ? (
              <div key={f.id} aria-hidden="true" className="min-h-24 rounded-3xl border-4 border-dashed border-forest-100" />
            ) : (
              <Draggable
                key={f.id}
                id={f.id}
                label={`${f.name}. Seret ke hewan, atau ketuk lalu ketuk hewan.`}
                selected={selected === f.id}
                onTap={(id) => setSelected((s) => (s === id ? null : (id as FoodId)))}
                onDrop={(id, target) => {
                  if (target && ['ola', 'bima', 'rara'].includes(target)) give(id as FoodId, target as AnimalId);
                }}
                onHover={setHover}
                className={`flex min-h-24 flex-col items-center justify-center rounded-full border-4 bg-white px-1 shadow-md ${
                  selected === f.id ? 'border-sun-400 ring-4 ring-sun-300' : 'border-sun-200'
                }`}
              >
                <span aria-hidden="true" className="text-4xl">{f.icon}</span>
                <span className="font-display text-sm sm:text-lg font-bold text-bark leading-tight text-center">{f.name}</span>
              </Draggable>
            );
          })}
        </div>
        <p className="text-base text-bark/80">Atau ketuk makanan, lalu ketuk hewan.</p>

        {msg && (
          <Bubble key={msg.text} who={msg.who} emoji={msg.who ? undefined : '🎉'} tone={msg.tone}>
            {msg.text}
          </Bubble>
        )}
      </Arena>

      {allFed && showQ && <ThinkQuestion question={QUESTION} options={OPTIONS} onDone={() => setAnswered(true)} />}

      {answered && <NextRow onClick={onComplete} icon="▶" label="Lanjut" />}
    </div>
  );
};
