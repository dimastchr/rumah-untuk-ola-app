import React, { useEffect, useRef, useState } from 'react';
import { speechService } from '../../utils/speech';
import { Arena, Avatar, BigButton, Bubble, NextRow } from '../ui';

interface Props {
  onComplete: () => void;
}

const POLITE = 'Jangan bakar, Pak. Hutan rumah kami.';
const IMPOLITE = 'Hei, jangan bakar!';
const BAPAK = 'Baik nak, Bapak tidak jadi membakar lahan.';
const PRAISE = 'Hebat! Kalimatmu santun.';
const MAX_MS = 15000;

type Step = 'choose' | 'record' | 'recording' | 'recorded';

export const Scene5Village: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('choose');
  const [wrong, setWrong] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playingBack, setPlayingBack] = useState(false);
  const [bapak, setBapak] = useState(false);
  const [micError, setMicError] = useState(false);

  const recRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const playerRef = useRef<HTMLAudioElement | null>(null);
  const stopTimer = useRef<number | null>(null);

  // Bersihkan mikrofon, pemutar, dan URL rekaman saat keluar adegan. Rekaman tidak pernah diunggah.
  useEffect(() => {
    return () => {
      if (stopTimer.current) window.clearTimeout(stopTimer.current);
      try {
        if (recRef.current && recRef.current.state !== 'inactive') recRef.current.stop();
      } catch {
        /* abaikan */
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      playerRef.current?.pause();
    };
  }, []);
  useEffect(() => () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  const bapakReplies = () => {
    setBapak(true);
    speechService.speak(BAPAK, { rate: 0.85, pitch: 0.8 });
  };

  const choosePolite = () => {
    setWrong(false);
    setStep('record');
    speechService.speak(PRAISE);
  };

  const chooseImpolite = () => {
    setWrong(true);
    speechService.speak('Yuk, ajak dengan sopan.');
  };

  const startRec = async () => {
    setMicError(false);
    speechService.stopAll();
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') throw new Error('no-mic');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const rec = new MediaRecorder(stream);
      recRef.current = rec;
      chunks.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunks.current, { type: rec.mimeType || 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob)); // hanya di memori perangkat
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setStep('recorded');
        bapakReplies();
      };
      rec.start();
      setStep('recording');
      stopTimer.current = window.setTimeout(() => stopRec(), MAX_MS);
    } catch {
      setMicError(true);
    }
  };

  const stopRec = () => {
    if (stopTimer.current) window.clearTimeout(stopTimer.current);
    try {
      if (recRef.current && recRef.current.state !== 'inactive') recRef.current.stop();
    } catch {
      setStep('recorded');
    }
  };

  const playBack = () => {
    if (!audioUrl) return;
    speechService.stopAll();
    playerRef.current?.pause();
    const a = new Audio(audioUrl);
    playerRef.current = a;
    a.onended = () => setPlayingBack(false);
    setPlayingBack(true);
    a.play().catch(() => setPlayingBack(false));
  };

  const flow: { key: string; label: string; on: boolean }[] = [
    { key: '1', label: '● Rekam', on: step === 'record' || step === 'recording' },
    { key: '2', label: '▶ Putar ulang', on: step === 'recorded' && !!audioUrl },
    { key: '3', label: '✔ Lanjut', on: bapak },
  ];

  return (
    <div className="space-y-4">
      <Arena title="Ajak Bapak dengan santun" icon="💬">
        <div className="flex items-center gap-3">
          <Avatar who="bapak" size={80} />
          <div className="flex -space-x-3">
            <Avatar who="ola" size={56} />
            <Avatar who="bima" size={56} />
            <Avatar who="rara" size={56} />
          </div>
        </div>

        {step === 'choose' && (
          <>
            <p className="text-lg font-semibold text-bark">Pilih kalimat untuk Bapak.</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={chooseImpolite}
                className="min-h-20 rounded-3xl border-4 border-sky-200 bg-white p-4 text-left font-display text-xl sm:text-2xl font-bold text-bark shadow-md active:scale-95"
              >
                <span aria-hidden="true">🗣️ </span>“{IMPOLITE}”
              </button>
              <button
                type="button"
                onClick={choosePolite}
                className="min-h-20 rounded-3xl border-4 border-sky-200 bg-white p-4 text-left font-display text-xl sm:text-2xl font-bold text-bark shadow-md active:scale-95"
              >
                <span aria-hidden="true">🙏 </span>“{POLITE}”
              </button>
            </div>
            {wrong && <Bubble emoji="🤗" tone="hint">Yuk, ajak dengan sopan.</Bubble>}
          </>
        )}

        {step !== 'choose' && (
          <div className="space-y-4">
            <Bubble emoji="🌟" tone="ok">{PRAISE}</Bubble>

            <div className="rounded-3xl border-4 border-sun-300 bg-white p-4 text-center">
              <p className="font-display text-2xl sm:text-3xl font-bold text-bark">“{POLITE}”</p>
            </div>

            {/* Alur perekam: Rekam → Putar ulang → Lanjut */}
            <ol className="flex flex-wrap items-center justify-center gap-2" aria-label="Langkah merekam">
              {flow.map((f, i) => (
                <li key={f.key} className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 font-display text-base font-bold ${
                      f.on ? 'bg-forest-700 text-white' : 'bg-forest-50 text-forest-800'
                    }`}
                  >
                    {i + 1}. {f.label}
                  </span>
                  {i < flow.length - 1 && <span aria-hidden="true">➜</span>}
                </li>
              ))}
            </ol>

            <div className="flex flex-wrap justify-center gap-3">
              {step === 'record' && (
                <BigButton tone="rose" size="lg" icon="🔴" onClick={startRec}>
                  REC
                </BigButton>
              )}
              {step === 'recording' && (
                <BigButton tone="yellow" size="lg" icon="⏹️" onClick={stopRec} className="motion-safe:animate-pulse">
                  Selesai
                </BigButton>
              )}
              {step === 'recorded' && audioUrl && (
                <>
                  <BigButton tone="sky" icon="▶" onClick={playBack} disabled={playingBack}>
                    {playingBack ? 'Memutar…' : 'Putar ulang'}
                  </BigButton>
                  <BigButton tone="white" icon="🔁" onClick={() => setStep('record')}>
                    Rekam lagi
                  </BigButton>
                </>
              )}
            </div>
            {step === 'recording' && (
              <p className="text-center text-lg font-bold text-rose-700" aria-live="assertive">
                🎙️ Merekam… Baca kalimatnya.
              </p>
            )}

            {micError && !bapak && (
              <div className="space-y-2 text-center">
                <p className="text-lg font-semibold text-bark">🎤 Mikrofon belum bisa dipakai. Tidak apa-apa!</p>
                <BigButton tone="white" icon="🗣️" onClick={bapakReplies}>
                  Ucapkan langsung
                </BigButton>
              </div>
            )}

            <p className="text-center text-base text-bark/80">🔒 Rekaman hanya ada di perangkat ini.</p>

            {bapak && <Bubble who="bapak" tone="ok">“{BAPAK}”</Bubble>}
          </div>
        )}
      </Arena>

      {bapak && (
        <NextRow onClick={onComplete} icon="▶" label="Lanjut" />
      )}
    </div>
  );
};
