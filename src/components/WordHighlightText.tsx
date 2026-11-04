import React from 'react';
import { speechService } from '../utils/speech';
import { Volume2 } from 'lucide-react';

interface WordHighlightTextProps {
  text: string;
  isUppercase: boolean;
  activeWordIndex: number;
  label?: string;
  className?: string;
  onWordClick?: (word: string) => void;
}

export const WordHighlightText: React.FC<WordHighlightTextProps> = ({
  text,
  isUppercase,
  activeWordIndex,
  label,
  className = '',
  onWordClick,
}) => {
  const displayText = isUppercase ? text.toUpperCase() : text;
  const words = displayText.split(/\s+/).filter(Boolean);

  const handleWordTap = (word: string) => {
    // Strip punctuation for speech pronunciation
    const cleanWord = word.replace(/[.,!?;:"'()]/g, '');
    if (cleanWord) {
      speechService.speak(cleanWord, { rate: 0.85, pitch: 1.15 });
    }
    if (onWordClick) {
      onWordClick(cleanWord);
    }
  };

  return (
    <div className={`rounded-2xl bg-white/95 p-4 sm:p-5 shadow-md border border-amber-200/80 backdrop-blur-sm ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-amber-800/80 mb-2 tracking-wide uppercase">
          <span>{label}</span>
          <span className="text-[11px] font-normal text-amber-700/70 flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5" /> Ketuk kata untuk mengeja
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-2 gap-y-2 sm:gap-x-2.5 sm:gap-y-2.5 text-lg sm:text-2xl md:text-3xl font-bold leading-relaxed text-slate-800">
        {words.map((word, idx) => {
          const isActive = idx === activeWordIndex;
          return (
            <button
              key={`${word}-${idx}`}
              type="button"
              onClick={() => handleWordTap(word)}
              title="Ketuk untuk dengar suara kata ini"
              className={`inline-block px-2.5 py-1 rounded-xl transition-all duration-200 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                isActive
                  ? 'bg-amber-300 text-amber-950 font-black shadow-md scale-105 ring-2 ring-amber-400'
                  : 'hover:bg-amber-100/70 text-slate-800 active:scale-95'
              }`}
            >
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
};
