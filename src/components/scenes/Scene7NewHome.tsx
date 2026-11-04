import React, { useState } from 'react';
import { motion } from 'motion/react';
import { speechService } from '../../utils/speech';
import { Arena, Avatar, BigButton, Bubble, NextRow } from '../ui';

interface Props {
  onComplete: () => void;
}

export const Scene7NewHome: React.FC<Props> = ({ onComplete }) => {
  const [hugged, setHugged] = useState(false);

  const hug = () => {
    setHugged(true);
    speechService.speak('Ola bertemu lagi dengan ibunya! Ola punya rumah lagi.');
  };

  return (
    <div className="space-y-4">
      <Arena title="Satukan Ola dan ibunya" icon="🤗">
        <div className="relative flex h-40 items-center justify-center overflow-hidden">
          <motion.div animate={{ x: hugged ? 18 : -45 }} transition={{ type: 'spring', stiffness: 120 }}>
            <Avatar who="ola" size={84} />
          </motion.div>
          <motion.div animate={{ x: hugged ? -18 : 45 }} transition={{ type: 'spring', stiffness: 120 }}>
            <Avatar who="ibu" size={96} />
          </motion.div>
          {hugged && (
            <motion.span
              aria-hidden="true"
              initial={{ scale: 0, y: 0 }}
              animate={{ scale: [0, 1.4, 1], y: -50 }}
              className="absolute text-5xl"
            >
              💖
            </motion.span>
          )}
        </div>

        {!hugged ? (
          <div className="flex justify-center">
            <BigButton tone="rose" size="lg" icon="❤️" onClick={hug} className="motion-safe:animate-bounce">
              Pelukan Hati
            </BigButton>
          </div>
        ) : (
          <Bubble who="ola" tone="ok">Ola bertemu lagi dengan ibunya! Ola punya rumah lagi.</Bubble>
        )}
      </Arena>

      {hugged && (
        <NextRow onClick={onComplete} icon="✏️" label="Tulis untuk Ola" />
      )}
    </div>
  );
};
