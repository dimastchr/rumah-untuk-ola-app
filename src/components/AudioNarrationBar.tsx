import React, { useEffect, useState, useRef } from 'react';
import { Volume2, RotateCcw, Play, Pause, Sparkles } from 'lucide-react';
import { speechService } from '../utils/speech';

interface AudioNarrationBarProps {
  sceneId: number;
  audioUrl: string;
  totalWordsCount: number;
  soundEnabled: boolean;
  onWordIndexChange: (index: number) => void;
}

export const AudioNarrationBar: React.FC<AudioNarrationBarProps> = ({
  sceneId,
  audioUrl,
  totalWordsCount,
  soundEnabled,
  onWordIndexChange,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [needsUserGesture, setNeedsUserGesture] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play audio on scene load
  useEffect(() => {
    setProgress(0);
    onWordIndexChange(-1);
    setNeedsUserGesture(false);

    if (!soundEnabled) {
      speechService.stopAudio();
      setIsPlaying(false);
      return;
    }

    const audio = speechService.playAudio(
      audioUrl,
      (current, duration) => {
        if (duration > 0) {
          const ratio = Math.min(current / duration, 1);
          setProgress(ratio * 100);
          if (totalWordsCount > 0) {
            const wordIdx = Math.floor(ratio * totalWordsCount);
            onWordIndexChange(Math.min(wordIdx, totalWordsCount - 1));
          }
        }
      },
      () => {
        setIsPlaying(false);
        setProgress(100);
        setTimeout(() => onWordIndexChange(-1), 1200);
      },
      () => {
        // Autoplay blocked by browser policy
        setNeedsUserGesture(true);
        setIsPlaying(false);
      }
    );

    audioRef.current = audio;
    if (audio) {
      setIsPlaying(true);
    }

    return () => {
      speechService.stopAudio();
    };
  }, [sceneId, audioUrl, soundEnabled, totalWordsCount]);

  const handleReplay = () => {
    speechService.stopAll();
    setProgress(0);
    onWordIndexChange(0);
    setNeedsUserGesture(false);

    const audio = speechService.playAudio(
      audioUrl,
      (current, duration) => {
        if (duration > 0) {
          const ratio = Math.min(current / duration, 1);
          setProgress(ratio * 100);
          if (totalWordsCount > 0) {
            const wordIdx = Math.floor(ratio * totalWordsCount);
            onWordIndexChange(Math.min(wordIdx, totalWordsCount - 1));
          }
        }
      },
      () => {
        setIsPlaying(false);
        setProgress(100);
        setTimeout(() => onWordIndexChange(-1), 1200);
      },
      () => {
        setIsPlaying(false);
      }
    );

    audioRef.current = audio;
    if (audio) {
      setIsPlaying(true);
    }
  };

  const handleTogglePlayPause = () => {
    if (!audioRef.current) {
      handleReplay();
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-amber-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Left: Button Dengarkan Lagi & Play/Pause */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          onClick={handleReplay}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-amber-950 font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          title="Putar ulang narasi suara dari awal"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Dengarkan Lagi</span>
        </button>

        <button
          onClick={handleTogglePlayPause}
          className="p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 transition-all active:scale-95 cursor-pointer border border-amber-300"
          title={isPlaying ? 'Jeda Narasi' : 'Lanjutkan Narasi'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
        </button>

        <div className="hidden xs:flex items-center gap-1 text-xs font-bold text-amber-900 ml-1">
          <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
          <span>{isPlaying ? 'Narasi bersuara...' : 'Narasi bersiap'}</span>
        </div>
      </div>

      {/* Center: Audio reading progress bar */}
      <div className="w-full sm:flex-1 max-w-xs flex items-center gap-2">
        <div className="flex-1 bg-amber-100 rounded-full h-2.5 overflow-hidden border border-amber-200">
          <div
            className="bg-emerald-600 h-full transition-all duration-150 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[11px] font-mono font-bold text-slate-500 min-w-8 text-right">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Autoplay prompt if browser requires gesture */}
      {needsUserGesture && (
        <button
          onClick={handleReplay}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs animate-bounce cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ketuk untuk Dengar Suara</span>
        </button>
      )}
    </div>
  );
};
