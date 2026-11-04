import React from 'react';
import { SCENES } from '../types';

/** Peta kemajuan adegan berbentuk jalan setapak daun */
export const LeafPath: React.FC<{
  unlocked: number[];
  stars: number[];
  current?: number;
  onPick: (id: number) => void;
}> = ({ unlocked, stars, current, onPick }) => (
  <nav aria-label="Peta adegan">
    <ol className="flex flex-wrap items-center justify-center gap-x-1 gap-y-3">
      {[1, 2, 3, 4, 5, 6, 7].map((n) => {
        const open = unlocked.includes(n);
        const star = stars.includes(n);
        return (
          <li key={n} className="flex items-center">
            <button
              type="button"
              disabled={!open}
              onClick={() => onPick(n)}
              aria-label={`Adegan ${n}: ${SCENES[n].title}${star ? ', dapat bintang' : ''}${open ? '' : ', terkunci'}`}
              aria-current={current === n ? 'step' : undefined}
              className={`leaf-node relative flex h-14 w-14 items-center justify-center font-display text-2xl font-bold shadow-md transition-transform ${
                open ? 'bg-forest-600 text-white hover:scale-110' : 'bg-stone-200 text-stone-500'
              } ${current === n ? 'ring-4 ring-sun-400' : ''}`}
            >
              {open ? n : '🔒'}
              {star && (
                <span aria-hidden="true" className="absolute -right-2 -top-2 text-xl">
                  ⭐
                </span>
              )}
            </button>
            {n < 7 && (
              <span aria-hidden="true" className="mx-0.5 text-sm text-forest-500">
                • •
              </span>
            )}
          </li>
        );
      })}
      <li className="flex items-center">
        <span aria-hidden="true" className="ml-1 text-3xl">🏡</span>
      </li>
    </ol>
  </nav>
);
