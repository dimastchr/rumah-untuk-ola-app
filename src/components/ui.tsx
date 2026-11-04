import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ASSETS } from '../types';

/* ---------- Avatar tokoh dipotong dari 1_karakter.jpg (1280×714) ---------- */
export type CharKey = 'ola' | 'ibu' | 'bima' | 'rara' | 'bapak' | 'petugas' | 'relawan';

const CROPS: Record<CharKey, { cx: number; cy: number; w: number; label: string }> = {
  ola: { cx: 145, cy: 300, w: 150, label: 'Ola si orangutan' },
  ibu: { cx: 222, cy: 255, w: 175, label: 'Ibu Ola' },
  bima: { cx: 425, cy: 330, w: 185, label: 'Bima si bekantan' },
  rara: { cx: 615, cy: 330, w: 210, label: 'Rara si rangkong' },
  bapak: { cx: 780, cy: 215, w: 150, label: 'Bapak warga desa' },
  petugas: { cx: 970, cy: 205, w: 170, label: 'Petugas Manggala Agni' },
  relawan: { cx: 1160, cy: 250, w: 165, label: 'Relawan' },
};

export const Avatar: React.FC<{ who: CharKey; size?: number; className?: string; decorative?: boolean }> = ({
  who,
  size = 64,
  className = '',
  decorative = false,
}) => {
  const c = CROPS[who];
  const scale = size / c.w;
  return (
    <span
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : c.label}
      aria-hidden={decorative ? true : undefined}
      className={`inline-block shrink-0 rounded-full bg-white ring-4 ring-white shadow-md ${className}`}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${ASSETS.charactersImg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${1280 * scale}px ${714 * scale}px`,
        backgroundPosition: `${-(c.cx * scale - size / 2)}px ${-(c.cy * scale - size / 2)}px`,
      }}
    />
  );
};

/* ---------- Tombol besar ---------- */
type Tone = 'green' | 'yellow' | 'sky' | 'white' | 'rose';
const TONES: Record<Tone, string> = {
  green: 'bg-forest-700 hover:bg-forest-800 text-white shadow-[0_5px_0_#133d23]',
  yellow: 'bg-sun-300 hover:bg-sun-400 text-bark shadow-[0_5px_0_#c99000]',
  sky: 'bg-sky-600 hover:bg-sky-700 text-white shadow-[0_5px_0_#17628f]',
  white: 'bg-white hover:bg-forest-50 text-forest-800 border-2 border-forest-200 shadow-[0_4px_0_#a9e3b8]',
  rose: 'bg-rose-600 hover:bg-rose-700 text-white shadow-[0_5px_0_#9f1239]',
};

export const BigButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone; icon?: React.ReactNode; size?: 'md' | 'lg' }
> = ({ tone = 'green', icon, size = 'md', className = '', children, ...rest }) => (
  <button
    type="button"
    {...rest}
    className={`inline-flex items-center justify-center gap-2 rounded-2xl font-display font-bold transition-all active:translate-y-[3px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none ${
      size === 'lg' ? 'min-h-16 px-7 text-xl sm:text-2xl' : 'min-h-14 px-5 text-lg'
    } ${TONES[tone]} ${className}`}
  >
    {icon && (
      <span aria-hidden="true" className="text-2xl leading-none">
        {icon}
      </span>
    )}
    <span>{children}</span>
  </button>
);

/* ---------- Gulir halus ke elemen yang baru muncul (penting di layar HP) ---------- */
export function useScrollIntoView<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(() => {
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      ref.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
    }, 250);
    return () => window.clearTimeout(t);
  }, [active]);
  return ref;
}

/* ---------- Baris tombol "Lanjut" yang otomatis terlihat ---------- */
export const NextRow: React.FC<{ onClick: () => void; label?: string; icon?: string }> = ({ onClick, label = 'Lanjut', icon = '▶' }) => {
  const ref = useScrollIntoView<HTMLDivElement>(true);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
      <BigButton tone="green" icon={icon} size="lg" onClick={onClick}>
        {label}
      </BigButton>
    </motion.div>
  );
};

/* ---------- Kartu pop-up ramah anak (mis. "Tahukah Kamu?") ---------- */
export const PopCard: React.FC<{
  open: boolean;
  title: string;
  who?: CharKey;
  emoji?: string;
  tone?: 'sun' | 'sky' | 'green';
  children: React.ReactNode;
  action?: React.ReactNode;
}> = ({ open, title, who, emoji, tone = 'sun', children, action }) => {
  const ref = useScrollIntoView<HTMLDivElement>(open);
  const toneCls =
    tone === 'sky'
      ? 'bg-sky-100 border-sky-400'
      : tone === 'green'
      ? 'bg-forest-50 border-forest-500'
      : 'bg-sun-100 border-sun-400';
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className={`relative rounded-[28px] border-4 ${toneCls} p-4 sm:p-5 shadow-xl`}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            {who ? (
              <Avatar who={who} size={68} />
            ) : (
              <span aria-hidden="true" className="text-5xl leading-none">
                {emoji}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-forest-800">{title}</h3>
              <div className="mt-1 text-lg sm:text-xl font-semibold text-bark leading-snug">{children}</div>
            </div>
          </div>
          {action && <div className="mt-4 flex flex-wrap justify-end gap-3">{action}</div>}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ---------- Gelembung umpan balik ---------- */
export const Bubble: React.FC<{ who?: CharKey; emoji?: string; tone?: 'ok' | 'hint' | 'info'; children: React.ReactNode }> = ({
  who,
  emoji,
  tone = 'info',
  children,
}) => {
  const cls =
    tone === 'ok'
      ? 'bg-forest-50 border-forest-500 text-forest-900'
      : tone === 'hint'
      ? 'bg-sun-100 border-sun-400 text-bark'
      : 'bg-white border-sky-200 text-bark';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      role="status"
      aria-live="polite"
      className={`flex items-center gap-3 rounded-3xl border-4 px-4 py-3 shadow-md ${cls}`}
    >
      {who && <Avatar who={who} size={52} decorative />}
      {!who && emoji && (
        <span aria-hidden="true" className="text-4xl leading-none">
          {emoji}
        </span>
      )}
      <p className="text-lg sm:text-xl font-bold leading-snug">{children}</p>
    </motion.div>
  );
};

/* ---------- Kotak arena permainan ---------- */
export const Arena: React.FC<{ title: string; icon: string; children: React.ReactNode; right?: React.ReactNode }> = ({
  title,
  icon,
  children,
  right,
}) => (
  <section aria-label={title} className="rounded-[32px] bg-gradient-to-b from-sky-100 via-white to-forest-50 border-4 border-forest-200 p-3 sm:p-5 shadow-lg space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-display text-lg sm:text-xl font-bold text-forest-800 shadow-sm">
        <span aria-hidden="true">{icon}</span>
        {title}
      </h3>
      {right}
    </div>
    {children}
  </section>
);
