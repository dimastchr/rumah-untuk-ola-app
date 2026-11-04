import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, RotateCcw, ArrowRight, CheckCircle2, Volume2, AlertCircle } from 'lucide-react';
import { speechService } from '../../utils/speech';

interface Scene5VillageProps {
  onComplete: () => void;
}

export const Scene5Village: React.FC<Scene5VillageProps> = ({ onComplete }) => {
  const [selectedChoice, setSelectedChoice] = useState<'none' | 'polite' | 'impolite'>('none');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [bapakResponded, setBapakResponded] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      // Clean up blob URL on unmount
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
    };
  }, [recordedAudioUrl]);

  const handleChoosePolite = () => {
    setSelectedChoice('polite');
    speechService.speak(
      'Bagus sekali! Kalimat ini sangat santun. Sekarang, tekan tombol mikrofon merah untuk merekam suaramu!',
      { rate: 0.95, pitch: 1.15 }
    );
  };

  const handleChooseImpolite = () => {
    setSelectedChoice('impolite');
    speechService.speak('Yuk, ajak dengan sopan.', { rate: 0.95, pitch: 1.1 });
  };

  const handleRetryChoice = () => {
    setSelectedChoice('none');
    setMicError(null);
  };

  // Recording functionality (HTML5 MediaRecorder, completely client-side in memory)
  const startRecording = async () => {
    setMicError(null);
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser tidak mendukung perekam audio.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());

        // Automatically trigger Bapak's response
        triggerBapakResponse();
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      setMicError('Izin mikrofon belum aktif atau tidak tersedia. Kamu tetap bisa lanjut!');
      // Allow proceeding even if microphone is blocked or not available in environment
      triggerBapakResponse();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecordedAudio = () => {
    if (!recordedAudioUrl) return;
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    const audio = new Audio(recordedAudioUrl);
    audioPlayerRef.current = audio;
    setIsPlayingRecording(true);

    audio.onended = () => {
      setIsPlayingRecording(false);
    };

    audio.play();
  };

  const triggerBapakResponse = () => {
    setTimeout(() => {
      setBapakResponded(true);
      // Bapak's warm voice
      speechService.speak('Baik nak, Bapak tidak jadi membakar lahan.', {
        rate: 0.9,
        pitch: 0.85, // Adult male voice pitch
      });
    }, 600);
  };

  return (
    <div className="w-full space-y-4">
      {/* Village Edge Arena */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-amber-950/70 via-stone-900/80 to-amber-950/90 border-2 border-amber-300/80 p-5 sm:p-7 shadow-lg min-h-[340px] flex flex-col justify-between">
        {/* Header bar */}
        <div className="z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 text-xs sm:text-sm font-black text-amber-950 border border-amber-300">
            <span>Misi: Bantu Ola berbicara santun kepada warga desa</span>
          </div>

          {selectedChoice !== 'none' && (
            <button
              onClick={handleRetryChoice}
              className="flex items-center gap-1 text-xs font-bold text-white bg-black/40 hover:bg-black/60 px-3 py-1.5 rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ganti Pilihan</span>
            </button>
          )}
        </div>

        {/* Center: Interaction state */}
        <div className="my-auto z-10 py-3 text-center flex flex-col items-center">
          {selectedChoice === 'none' && (
            <div className="space-y-3">
              <div className="text-5xl sm:text-6xl animate-bounce">🧔🌾🔥</div>
              <p className="text-sm sm:text-base font-extrabold text-amber-100 max-w-md">
                Bapak warga desa hendak menyalakan api. Kalimat apa yang sebaiknya kita ucapkan?
              </p>
            </div>
          )}

          {selectedChoice === 'impolite' && (
            <div className="space-y-2 animate-shake">
              <div className="text-5xl">😟💬</div>
              <div className="bg-amber-900/90 text-amber-200 px-4 py-2.5 rounded-2xl border border-amber-400 max-w-md">
                <p className="text-sm sm:text-base font-black">"Hei, jangan bakar!"</p>
                <p className="text-xs text-amber-300 mt-1">
                  Kalimat ini terdengar membentak. Yuk, ajak dengan sopan dan ramah!
                </p>
              </div>
            </div>
          )}

          {selectedChoice === 'polite' && (
            <div className="space-y-4 max-w-lg w-full">
              <div className="bg-white/95 rounded-2xl p-4 border-2 border-emerald-400 shadow-md">
                <span className="text-[11px] font-black uppercase text-emerald-800 block mb-1">
                  Kalimat Ajakan Santun:
                </span>
                <p className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
                  "Jangan bakar, Pak. Hutan rumah kami."
                </p>
              </div>

              {/* In-browser Voice Recorder Box */}
              <div className="bg-amber-950/80 rounded-2xl p-4 border border-amber-300 text-white space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-amber-200">
                  <Mic className="w-4 h-4 text-rose-400" />
                  <span>Perekam Suara Anak (Aman di Komputer Anda)</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm sm:text-base shadow-lg transition-all active:scale-95 cursor-pointer ring-4 ring-rose-400/40"
                    >
                      <span className="w-3 h-3 rounded-full bg-white animate-ping"></span>
                      <span>● REC (Rekam Suaraku)</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-sm sm:text-base shadow-lg transition-all active:scale-95 cursor-pointer animate-pulse ring-4 ring-amber-300/50"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      <span>◼ SELESAI REKAM</span>
                    </button>
                  )}

                  {recordedAudioUrl && !isRecording && (
                    <button
                      onClick={playRecordedAudio}
                      disabled={isPlayingRecording}
                      className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isPlayingRecording ? 'Memutar...' : 'Putar Rekamanku'}</span>
                    </button>
                  )}

                  {/* Skip/direct speak button if mic is not handy */}
                  {!bapakResponded && (
                    <button
                      onClick={triggerBapakResponse}
                      className="text-xs text-amber-200 hover:text-white underline px-2 py-1 cursor-pointer"
                    >
                      Kirim Pesan Langsung
                    </button>
                  )}
                </div>

                {micError && (
                  <p className="text-[11px] text-amber-300 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{micError}</span>
                  </p>
                )}
              </div>

              {/* Bapak's Response */}
              {bapakResponded && (
                <div className="bg-emerald-950/90 border-2 border-emerald-400 p-4 rounded-2xl text-emerald-100 flex items-start gap-3 text-left shadow-lg animate-fade-in">
                  <div className="text-3xl sm:text-4xl">🧔🌾✨</div>
                  <div>
                    <span className="text-[11px] font-black uppercase text-emerald-300">
                      Tanggapan Bapak Warga Desa:
                    </span>
                    <p className="text-base sm:text-lg font-black text-white mt-0.5">
                      "Baik nak, Bapak tidak jadi membakar lahan."
                    </p>
                    <p className="text-xs text-emerald-200 mt-1">
                      Korek api telah dimatikan dan disingkirkan. Kata-kata santunmu berhasil menyentuh hati bapak!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Choice Buttons */}
        {selectedChoice === 'none' && (
          <div className="z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleChoosePolite}
              className="p-4 rounded-2xl bg-white/95 hover:bg-emerald-50 border-2 border-emerald-400 text-slate-800 text-left transition-all hover:scale-102 active:scale-95 cursor-pointer shadow-md"
            >
              <span className="block text-[11px] font-black uppercase text-emerald-700">
                Pilihan A (Santun)
              </span>
              <span className="text-base sm:text-lg font-black block text-emerald-950">
                "Jangan bakar, Pak. Hutan rumah kami."
              </span>
              <span className="text-xs text-slate-500">
                Mengajak dengan sopan, santun, dan menyentuh hati
              </span>
            </button>

            <button
              onClick={handleChooseImpolite}
              className="p-4 rounded-2xl bg-white/95 hover:bg-amber-50 border-2 border-amber-300 text-slate-800 text-left transition-all hover:scale-102 active:scale-95 cursor-pointer shadow-md"
            >
              <span className="block text-[11px] font-black uppercase text-amber-800">
                Pilihan B (Kurang Santun)
              </span>
              <span className="text-base sm:text-lg font-black block text-slate-900">
                "Hei, jangan bakar!"
              </span>
              <span className="text-xs text-slate-500">
                Terdengar membentak dan kasar
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Completion Next Step */}
      {bapakResponded && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-md flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm sm:text-base font-black text-emerald-950">
                Bagus sekali! Hutan terselamatkan oleh kesantunanmu.
              </p>
              <p className="text-xs text-emerald-800">
                Sekarang para petugas pelindung hutan telah tiba untuk membantu.
              </p>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <span>Lanjut ke Adegan 6</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
