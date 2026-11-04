import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { speechService } from '../utils/speech';
import { Avatar, BigButton } from './ui';

interface EndingScreenProps {
  earnedStars: number[];
  savedMessage: string;
  onSaveMessage: (msg: string) => void;
  onRestart: () => void;
  onOpenTeacherGuide: () => void;
}

const SAMPLES = ['Ola, aku sayang hutanmu.', 'Aku akan menanam pohon.', 'Semoga hutanmu tetap hijau.'];

export const EndingScreen: React.FC<EndingScreenProps> = ({ earnedStars, savedMessage, onSaveMessage, onRestart, onOpenTeacherGuide }) => {
  const [message, setMessage] = useState(savedMessage || '');
  const [saved, setSaved] = useState(!!savedMessage);
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle');

  useEffect(() => {
    // Konfeti dari dua sudut bawah, di bawah lapisan teks (tidak menutupi tulisan) dan mati bila "kurangi gerak" aktif
    try {
      const opts = { particleCount: 50, spread: 55, startVelocity: 45, ticks: 120, zIndex: 0, disableForReducedMotion: true };
      confetti({ ...opts, angle: 60, origin: { x: 0, y: 1 } });
      confetti({ ...opts, angle: 120, origin: { x: 1, y: 1 } });
    } catch {
      /* abaikan */
    }
    speechService.speak('Hore! Ola punya rumah lagi. Terima kasih!');
    return () => {
      try {
        confetti.reset();
      } catch {
        /* abaikan */
      }
    };
  }, []);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const m = message.trim();
    if (!m) return;
    onSaveMessage(m);
    setSaved(true);
    speechService.speak(m);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`Untuk Ola: ${message.trim()}`);
      setCopied('ok');
    } catch {
      setCopied('fail');
    }
    window.setTimeout(() => setCopied('idle'), 2500);
  };

  return (
    // Lapisan isi di atas kanvas konfeti (z-10 > 0)
    <div className="relative z-10 mx-auto max-w-3xl space-y-5 p-3 sm:p-6">
      <section className="rounded-[36px] bg-gradient-to-b from-forest-700 to-forest-800 p-5 sm:p-8 text-center text-white shadow-xl">
        <div className="flex justify-center -space-x-4">
          <Avatar who="ola" size={88} />
          <Avatar who="ibu" size={88} />
        </div>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold">Hore! Kamu hebat!</h1>
        <p className="mt-1 text-xl font-semibold">Ola punya rumah lagi.</p>

        <h2 className="mt-5 font-display text-xl font-bold text-sun-200">Bintang kamu</h2>
        <ul className="mt-2 flex flex-wrap justify-center gap-1 sm:gap-2" aria-label={`${earnedStars.length} dari 7 bintang`}>
          {[1, 2, 3, 4, 5, 6, 7].map((n, i) => (
            <motion.li
              key={n}
              aria-hidden="true"
              initial={{ scale: 0, rotate: -120 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15 * i, type: 'spring', stiffness: 220 }}
              className={`text-4xl sm:text-5xl ${earnedStars.includes(n) ? '' : 'opacity-30 grayscale'}`}
            >
              ⭐
            </motion.li>
          ))}
        </ul>
        <p className="mt-2 font-display text-2xl font-bold text-sun-200">{earnedStars.length} dari 7</p>
      </section>

      <section className="rounded-[32px] border-4 border-sun-300 bg-sun-100 p-4 sm:p-6 shadow-md">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest-800">🌳 Ayo tanam pohon untuk Ola!</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm">
            <span aria-hidden="true" className="text-5xl">🌱</span>
            <p className="font-display text-xl font-bold text-bark">Tanam satu bibit.</p>
          </div>
          <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm">
            <span aria-hidden="true" className="text-5xl">💧</span>
            <p className="font-display text-xl font-bold text-bark">Siram dan rawat.</p>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border-4 border-sky-200 bg-white p-4 sm:p-6 shadow-md space-y-3">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-sky-700">✏️ Tulis satu kalimat untuk Ola</h2>
        <div className="flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setMessage(s);
                setSaved(false);
              }}
              className="min-h-12 rounded-2xl border-2 border-sky-200 bg-sky-100 px-3 text-lg font-semibold text-bark"
            >
              {s}
            </button>
          ))}
        </div>
        <form onSubmit={save} className="space-y-3">
          <label htmlFor="pesan-ola" className="sr-only">
            Kalimat untuk Ola
          </label>
          <input
            id="pesan-ola"
            type="text"
            value={message}
            maxLength={120}
            autoComplete="off"
            onChange={(e) => {
              setMessage(e.target.value);
              setSaved(false);
            }}
            placeholder="Tulis di sini…"
            className="min-h-16 w-full rounded-2xl border-4 border-sky-200 bg-sky-100/40 px-4 font-display text-2xl font-bold text-bark placeholder:text-bark/40 focus:border-sky-400 focus:outline-none"
          />
          <div className="flex flex-wrap items-center gap-3">
            <BigButton type="submit" tone="green" icon="💌" disabled={!message.trim()}>
              Simpan
            </BigButton>
            {saved && message.trim() && (
              <BigButton tone="white" icon={copied === 'ok' ? '✅' : '📋'} onClick={copy}>
                {copied === 'ok' ? 'Tersalin' : copied === 'fail' ? 'Gagal salin' : 'Salin'}
              </BigButton>
            )}
            <span className="text-base font-semibold text-forest-700" aria-live="polite">
              {saved ? '✓ Tersimpan di perangkat ini' : ''}
            </span>
          </div>
        </form>
        {saved && message.trim() && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 rounded-3xl border-4 border-sun-300 bg-sun-100 p-4">
            <Avatar who="ola" size={64} />
            <p className="font-display text-2xl font-bold text-bark">“{message.trim()}”</p>
          </motion.div>
        )}
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <BigButton tone="yellow" icon="🔁" onClick={onRestart} className="flex-1">
          Baca Lagi
        </BigButton>
        <BigButton tone="white" icon="📘" onClick={onOpenTeacherGuide} className="flex-1">
          Panduan Guru
        </BigButton>
      </div>
    </div>
  );
};
