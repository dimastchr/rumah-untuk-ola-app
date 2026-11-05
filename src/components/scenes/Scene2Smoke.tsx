import React, { useState } from 'react';
import { motion } from 'motion/react';
import { speechService } from '../../utils/speech';
import { Arena, Avatar, Bubble, NextRow } from '../ui';
import { ThinkQuestion } from '../Think';
import { speakThen } from '../../utils/speakThen';

interface Props {
  onComplete: () => void;
}

const WRONG = 'Duh, di bawah tanah ada asap tebal. Udara di bawah tidak sehat. Ayo berayun ke pohon hijau yang udaranya lebih bersih!';
const RIGHT = 'Hebat! Di pohon hijau udaranya lebih bersih.';

const QUESTION = 'Mengapa pohon hijau lebih aman untuk Ola?';
const WRONG_Q = 'Coba ingat lagi. Di mana asapnya lebih tebal?';
const OPTIONS = [
  { text: 'Asap di bawah lebih tebal.', correct: true, feedback: 'Benar! Asap di bawah lebih tebal, udara di pohon lebih bersih.' },
  { text: 'Pohon hijau lebih tinggi dari awan.', feedback: WRONG_Q },
  { text: 'Ola ingin bermain petak umpet.', feedback: WRONG_Q },
];

export const Scene2Smoke: React.FC<Props> = ({ onComplete }) => {
  const [choice, setChoice] = useState<'none' | 'ground' | 'tree'>('none');
  const [showQ, setShowQ] = useState(false);
  const [answered, setAnswered] = useState(false);

  const choose = (c: 'ground' | 'tree') => {
    setChoice(c);
    if (c === 'ground') speechService.speak(WRONG);
    else speakThen(RIGHT, () => setShowQ(true), 6000);
  };

  return (
    <div className="space-y-4">
      <Arena title="Ke mana Ola harus pergi?" icon="🤔">
        <div className="flex justify-center overflow-hidden py-2">
          <motion.div
            key={choice}
            animate={
              choice === 'tree'
                ? { x: [0, 50, 90, 50, 0], y: [0, -20, 0, -20, 0], rotate: [0, 15, 0, -15, 0] }
                : choice === 'ground'
                ? { x: [0, -6, 6, -6, 0] }
                : { y: [0, -6, 0] }
            }
            transition={{ duration: choice === 'tree' ? 1.6 : 0.6, repeat: choice === 'none' ? Infinity : 0, repeatDelay: 1 }}
          >
            <Avatar who="ola" size={96} />
          </motion.div>
        </div>

        {choice !== 'tree' && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => choose('ground')}
              className={`flex min-h-24 items-center gap-4 rounded-3xl border-4 bg-white p-4 text-left shadow-md active:scale-95 ${
                choice === 'ground' ? 'border-sun-400' : 'border-sky-200'
              }`}
            >
              <span aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-stone-200 text-4xl">⬇️</span>
              <span className="font-display text-xl sm:text-2xl font-bold text-bark">Turun ke tanah berasap.</span>
            </button>
            <button
              type="button"
              onClick={() => choose('tree')}
              className="flex min-h-24 items-center gap-4 rounded-3xl border-4 border-sky-200 bg-white p-4 text-left shadow-md active:scale-95"
            >
              <span aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-forest-100 text-4xl">🌳</span>
              <span className="font-display text-xl sm:text-2xl font-bold text-bark">Berayun ke pohon hijau.</span>
            </button>
          </div>
        )}

        {choice === 'ground' && (
          <Bubble who="ola" tone="hint">
            <span aria-hidden="true">😷 </span>
            {WRONG}
          </Bubble>
        )}
        {choice === 'tree' && <Bubble who="ola" tone="ok">🌳 {RIGHT}</Bubble>}
      </Arena>

      {choice === 'tree' && showQ && (
        <ThinkQuestion question={QUESTION} options={OPTIONS} onDone={() => setAnswered(true)} />
      )}

      {answered && <NextRow onClick={onComplete} icon="▶" label="Lanjut" />}
    </div>
  );
};
