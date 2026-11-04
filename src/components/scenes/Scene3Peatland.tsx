import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { speechService } from '../../utils/speech';
import { Arena, Avatar, BigButton, PopCard } from '../ui';

interface Props {
  onComplete: () => void;
}

const RARA = 'Tanah ini seperti spons dari daun lama. Kalau terbakar, apinya bersembunyi di dalam tanah dan sulit dipadamkan.';
const FACT = 'Gambut basah menyimpan banyak air seperti spons raksasa.';

export const Scene3Peatland: React.FC<Props> = ({ onComplete }) => {
  const [wet, setWet] = useState(false);

  const pressSponge = () => {
    setWet(true);
    speechService.speak(FACT);
  };

  return (
    <div className="space-y-4">
      {/* Dialog Rara, persis naskah */}
      <div className="flex items-start gap-3 rounded-[28px] border-4 border-sky-200 bg-sky-100 p-3 sm:p-4 shadow-md">
        <Avatar who="rara" size={72} />
        <div className="min-w-0 flex-1 space-y-2">
          <span className="font-display text-lg font-bold text-sky-700">Rara si rangkong:</span>
          <p className="text-lg sm:text-xl font-semibold text-bark leading-snug">“{RARA}”</p>
          <BigButton tone="sky" icon="🔊" onClick={() => speechService.speak(RARA, { pitch: 1.25 })}>
            Dengar Rara
          </BigButton>
        </div>
      </div>

      <Arena title="Simulasi spons gambut" icon="🧽">
        <div className="grid grid-cols-2 gap-3">
          {/* Gambut kering berasap */}
          <div className={`rounded-3xl border-4 p-3 text-center transition-opacity ${wet ? 'opacity-60 border-stone-300' : 'border-orange-300'} bg-gradient-to-b from-stone-200 to-[#7a5233]`}>
            <div aria-hidden="true" className="relative h-28 text-5xl">
              <span className="absolute left-1/2 top-0 -translate-x-1/2 motion-safe:animate-pulse">💨</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2">🟫</span>
            </div>
            <span className="font-display text-lg font-bold text-white drop-shadow">Gambut kering</span>
          </div>
          {/* Gambut basah */}
          <div className="relative overflow-hidden rounded-3xl border-4 border-sky-400 bg-gradient-to-b from-sky-100 to-[#4b3a2a] p-3 text-center">
            <div aria-hidden="true" className="relative h-28 text-5xl">
              <AnimatePresence>
                {wet &&
                  [0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      initial={{ y: -40, opacity: 0 }}
                      animate={{ y: 40, opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 1.2, delay: i * 0.25, repeat: 2 }}
                      className="absolute top-0 text-3xl"
                      style={{ left: `${20 + i * 25}%` }}
                    >
                      💧
                    </motion.span>
                  ))}
              </AnimatePresence>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2">{wet ? '🧽' : '❔'}</span>
            </div>
            <span className="font-display text-lg font-bold text-white drop-shadow">Gambut basah</span>
          </div>
        </div>

        <div className="flex justify-center">
          <BigButton tone="sky" size="lg" icon="🧽" onClick={pressSponge} className={wet ? '' : 'motion-safe:animate-bounce'}>
            Spons Air
          </BigButton>
        </div>
      </Arena>

      <PopCard
        open={wet}
        title="💡 Tahukah Kamu?"
        emoji="🧽"
        tone="sky"
        action={
          <BigButton tone="green" icon="▶" onClick={onComplete}>
            Lanjut
          </BigButton>
        }
      >
        {FACT}
      </PopCard>
    </div>
  );
};
