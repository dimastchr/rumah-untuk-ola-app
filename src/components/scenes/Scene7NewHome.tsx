import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { speechService } from '../../utils/speech';
import { speakThen } from '../../utils/speakThen';
import { savePromise } from '../../utils/storage';
import { ASSETS } from '../../types';
import { Arena, Avatar, BigButton, Bubble, NextRow, PopCard } from '../ui';
import { ThinkShell, SpeakButton, FeedbackBubble, useAutoSpeak } from '../Think';

interface Props {
  onComplete: () => void;
}

const HUG_VO = 'Ola bertemu lagi dengan ibunya! Ola punya rumah lagi.';

// Tahukah Kamu? Sumber: Kompas.com, 19 Juni 2026, "Kisah Himba dan Lykke, 2 dari 5 Orangutan yang Dilepasliarkan
// Usai Rehabilitasi Puluhan Tahun" (https://regional.kompas.com/read/2026/06/19/151102678/kisah-himba-dan-lykke-2-dari-5-orangutan-yang-dilepasliarkan-usai)
const FACT =
  'Himba adalah orangutan sungguhan dari Kalimantan. Waktu bayi, Himba terluka karena kebakaran hutan. Himba dirawat selama 14 tahun. Pada Juni 2026, Himba kembali ke hutan.';

// C6: merancang aksi (jawaban terbuka, semua diterima)
const PROMISE_INSTRUCTION = 'Apa yang bisa kamu lakukan untuk hutan? Susun janjimu.';
const AKSI = ['menanam pohon', 'mengajak orang tidak membakar lahan', 'menceritakan kisah Ola kepada teman'];
const ALASAN = ['hutan rumah satwa', 'asap membuat kita sakit'];
const PRAISE = 'Janji yang hebat!';
export const promiseSentence = (aksi: string, alasan: string) => `Aku akan ${aksi} karena ${alasan}.`;

/* ---------- Seret Ola ke Ibu: menyatu menjadi gambar berpelukan ---------- */
const HugStage: React.FC<{ joined: boolean; onJoin: () => void }> = ({ joined, onJoin }) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const olaRef = useRef<HTMLDivElement | null>(null);
  const ibuRef = useRef<HTMLDivElement | null>(null);
  const start = useRef<{ x: number; y: number; pid: number } | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number } | null>(null);
  const [failed, setFailed] = useState<{ ola?: boolean; ibu?: boolean; peluk?: boolean }>({});

  const closeEnough = () => {
    const a = olaRef.current?.getBoundingClientRect();
    const b = ibuRef.current?.getBoundingClientRect();
    if (!a || !b) return false;
    const dx = a.left + a.width / 2 - (b.left + b.width / 2);
    const dy = a.top + a.height / 2 - (b.top + b.height / 2);
    // cukup dekat: jarak pusat lebih kecil dari setengah lebar gabungan kedua gambar
    return Math.hypot(dx, dy) < ((a.width + b.width) / 2) * 0.55;
  };

  const down = (e: React.PointerEvent<HTMLDivElement>) => {
    if (joined) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    start.current = { x: e.clientX, y: e.clientY, pid: e.pointerId };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* abaikan */
    }
  };
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = start.current;
    if (!s || s.pid !== e.pointerId || joined) return;
    const stage = stageRef.current?.getBoundingClientRect();
    let dx = e.clientX - s.x;
    let dy = e.clientY - s.y;
    if (stage) {
      dx = Math.max(-20, Math.min(stage.width, dx));
      dy = Math.max(-stage.height / 2, Math.min(stage.height / 2, dy));
    }
    setOffset({ x: dx, y: dy });
    if (closeEnough()) {
      start.current = null;
      onJoin();
    }
  };
  const up = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = start.current;
    if (!s || s.pid !== e.pointerId) return;
    start.current = null;
    if (!joined && closeEnough()) onJoin();
    else setOffset(null); // kembali ke tempat semula
  };

  useEffect(() => {
    if (joined) setOffset(null);
  }, [joined]);

  return (
    <div ref={stageRef} className="relative h-56 sm:h-72 overflow-hidden rounded-[28px] bg-gradient-to-b from-sky-100 to-forest-100">
      <AnimatePresence>
        {!joined && (
          <motion.div
            key="ibu"
            ref={ibuRef}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-0 right-2 flex h-[92%] w-[42%] items-end justify-center"
          >
            {failed.ibu ? (
              <Avatar who="ibu" size={110} />
            ) : (
              <img
                src={ASSETS.ibuSendiri}
                alt="Ibu Ola"
                draggable={false}
                onError={() => setFailed((f) => ({ ...f, ibu: true }))}
                className="pointer-events-none h-full w-full select-none object-contain object-bottom"
              />
            )}
          </motion.div>
        )}
        {!joined && (
          <motion.div
            key="ola"
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-0 left-2 z-10 h-[72%] w-[34%]"
          >
            <div
              ref={olaRef}
              onPointerDown={down}
              onPointerMove={move}
              onPointerUp={up}
              onPointerCancel={() => {
                start.current = null;
                setOffset(null);
              }}
              role="img"
              aria-label="Ola. Seret Ola ke ibunya."
              className={`drag-handle relative flex h-full w-full items-end justify-center ${
                offset ? 'cursor-grabbing' : 'cursor-grab transition-transform duration-300'
              }`}
              style={{ transform: offset ? `translate(${offset.x}px, ${offset.y}px)` : undefined }}
            >
              {failed.ola ? (
                <Avatar who="ola" size={88} />
              ) : (
                <img
                  src={ASSETS.olaSendiri}
                  alt=""
                  draggable={false}
                  onError={() => setFailed((f) => ({ ...f, ola: true }))}
                  className="pointer-events-none h-full w-full select-none object-contain object-bottom"
                />
              )}
              {!offset && (
                <span aria-hidden="true" className="absolute -right-2 top-1/3 text-3xl motion-safe:animate-pulse">
                  👉
                </span>
              )}
            </div>
          </motion.div>
        )}
        {joined && (
          <motion.div
            key="peluk"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute inset-0 flex items-end justify-center"
          >
            {failed.peluk ? (
              <div className="mb-6 flex -space-x-4">
                <Avatar who="ola" size={96} />
                <Avatar who="ibu" size={110} />
              </div>
            ) : (
              <img
                src={ASSETS.olaIbuPeluk}
                alt="Ola dan ibunya berpelukan."
                draggable={false}
                onError={() => setFailed((f) => ({ ...f, peluk: true }))}
                className="h-[95%] w-auto max-w-full select-none object-contain object-bottom"
              />
            )}
            <motion.span
              aria-hidden="true"
              initial={{ scale: 0, y: 0 }}
              animate={{ scale: [0, 1.4, 1], y: -10 }}
              transition={{ delay: 0.8 }}
              className="absolute top-3 text-5xl"
            >
              💖
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------- Susun janjimu: pilih satu aksi lalu satu alasan ---------- */
const PromiseBuilder: React.FC<{ onDone: (sentence: string) => void }> = ({ onDone }) => {
  const [aksi, setAksi] = useState<string | null>(null);
  const [alasan, setAlasan] = useState<string | null>(null);
  const [praised, setPraised] = useState(false);
  const cancelRef = useRef<() => void>(() => {});
  useAutoSpeak(PROMISE_INSTRUCTION);
  useEffect(() => () => cancelRef.current(), []);

  const finished = !!aksi && !!alasan;
  const sentence = finished ? promiseSentence(aksi!, alasan!) : '';

  const chooseAlasan = (a: string) => {
    if (!aksi || finished) return;
    setAlasan(a);
    const text = promiseSentence(aksi, a);
    savePromise(text);
    onDone(text);
    cancelRef.current = speakThen(text, () => {
      setPraised(true);
      speechService.speak(PRAISE);
    });
  };

  const card = (active: boolean) =>
    `min-h-16 rounded-3xl border-4 px-4 py-2 text-left font-display text-lg sm:text-xl font-bold shadow-md active:scale-95 disabled:opacity-40 ${
      active ? 'border-forest-500 bg-forest-50 text-forest-900' : 'border-sky-200 bg-white text-bark hover:border-sky-400'
    }`;

  return (
    <ThinkShell title="Susun janjimu">
      <div className="flex items-start gap-3">
        <p className="flex-1 font-display text-xl sm:text-2xl font-bold text-bark leading-snug">{PROMISE_INSTRUCTION}</p>
        <SpeakButton text={PROMISE_INSTRUCTION} label="Dengar petunjuk" />
      </div>

      {/* Pratinjau kalimat janji */}
      <div className="flex min-h-16 flex-wrap items-center gap-2 rounded-3xl border-4 border-dashed border-forest-200 bg-white/70 px-3 py-3 font-display text-xl sm:text-2xl font-bold text-bark">
        <span>Aku akan</span>
        <span className={`rounded-2xl px-2 ${aksi ? 'bg-sun-200' : 'min-w-16 bg-forest-50'}`}>{aksi ?? '…'}</span>
        <span>karena</span>
        <span className={`rounded-2xl px-2 ${alasan ? 'bg-sky-100' : 'min-w-16 bg-forest-50'}`}>{alasan ? `${alasan}.` : '…'}</span>
      </div>

      <div role="group" aria-label="Pilih aksi" className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {AKSI.map((a) => (
          <button
            key={a}
            type="button"
            aria-pressed={aksi === a}
            disabled={finished && aksi !== a}
            onClick={() => !finished && setAksi(a)}
            className={card(aksi === a)}
          >
            <span aria-hidden="true">{a === AKSI[0] ? '🌱 ' : a === AKSI[1] ? '🙏 ' : '📖 '}</span>
            {a}
          </button>
        ))}
      </div>

      {aksi && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          role="group"
          aria-label="Pilih alasan"
          className="grid grid-cols-1 gap-2 sm:grid-cols-2"
        >
          {ALASAN.map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={alasan === a}
              disabled={finished && alasan !== a}
              onClick={() => chooseAlasan(a)}
              className={card(alasan === a)}
            >
              <span aria-hidden="true">{a === ALASAN[0] ? '🐒 ' : '😷 '}</span>
              {a}
            </button>
          ))}
        </motion.div>
      )}

      {finished && (
        <div className="flex items-center gap-3 rounded-3xl border-4 border-sun-300 bg-sun-100 p-3">
          <p className="flex-1 font-display text-xl sm:text-2xl font-bold text-bark">“{sentence}”</p>
          <SpeakButton text={sentence} label="Dengar janjimu" />
        </div>
      )}
      {praised && <FeedbackBubble ok text={PRAISE} />}
    </ThinkShell>
  );
};

export const Scene7NewHome: React.FC<Props> = ({ onComplete }) => {
  const [joined, setJoined] = useState(false);
  const [showPromise, setShowPromise] = useState(false);
  const [promised, setPromised] = useState(false);

  const join = () => {
    if (joined) return;
    setJoined(true);
    speakThen(HUG_VO, () => setShowPromise(true), 8000);
  };

  return (
    <div className="space-y-4">
      <Arena title="Satukan Ola dan ibunya" icon="🤗">
        <HugStage joined={joined} onJoin={join} />

        {!joined ? (
          <div className="flex justify-center">
            <BigButton tone="rose" size="lg" icon="🤗" onClick={join}>
              Dekatkan
            </BigButton>
          </div>
        ) : (
          <Bubble who="ola" tone="ok">{HUG_VO}</Bubble>
        )}
      </Arena>

      <PopCard
        open={showPromise}
        title="💡 Tahukah Kamu?"
        emoji="🦧"
        tone="green"
        action={
          <BigButton tone="sky" icon="🔊" onClick={() => speechService.speak(`Tahukah kamu? ${FACT}`)}>
            Dengar
          </BigButton>
        }
      >
        {FACT}
      </PopCard>

      {showPromise && <PromiseBuilder onDone={() => setPromised(true)} />}

      {promised && <NextRow onClick={onComplete} icon="✏️" label="Tulis untuk Ola" />}
    </div>
  );
};
