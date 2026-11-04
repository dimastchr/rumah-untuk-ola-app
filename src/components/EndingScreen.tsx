import React, { useState, useEffect } from 'react';
import { Star, Send, RotateCcw, Sparkles, Heart, Trees, Download, Check, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ASSETS } from '../types';
import { speechService } from '../utils/speech';

interface EndingScreenProps {
  earnedStars: number[];
  savedMessage: string;
  onSaveMessage: (msg: string) => void;
  onRestart: () => void;
  onOpenTeacherGuide: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({
  earnedStars,
  savedMessage,
  onSaveMessage,
  onRestart,
  onOpenTeacherGuide,
}) => {
  const [message, setMessage] = useState(savedMessage || '');
  const [isSaved, setIsSaved] = useState(!!savedMessage);
  const [copiedCard, setCopiedCard] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti when ending screen loads
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore
    }

    // Friendly celebration voice
    speechService.speak(
      'Hore! Kamu hebat sekali! Hutan Kalimantan sudah hijau kembali dan Ola punya rumah baru.',
      { rate: 0.95, pitch: 1.15 }
    );
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSaveMessage(message.trim());
    setIsSaved(true);
    speechService.speak('Terima kasih atas pesan indahmu untuk Ola!', { rate: 0.95, pitch: 1.15 });
  };

  const sampleMessages = [
    'Tumbuh sehat dan bahagia ya, Ola!',
    'Aku berjanji akan menjaga pohon di sekitarku.',
    'Hutan Kalimantan rumah terindah untukmu, Ola!',
    'Terima kasih pahlawan pemadam api hutan.',
  ];

  const handleCopyCard = () => {
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      {/* Top Celebration Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Trees className="w-48 h-48" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs sm:text-sm font-black uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Selamat! Petualangan Selesai</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Hutan Lestari, Ola Punya Rumah Lagi!
        </h1>

        <p className="text-emerald-100 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Berkat kerja sama kamu, petugas Manggala Agni, dan warga yang bijak, api berhasil dipadamkan dan hutan kembali rimbun.
        </p>

        {/* Stars Display */}
        <div className="pt-4 flex flex-col items-center">
          <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-emerald-200 mb-2">
            Bintang Perolehan Kamu:
          </span>
          <div className="flex items-center justify-center gap-2 sm:gap-3 p-3 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/20">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => {
              const isEarned = earnedStars.includes(num);
              return (
                <div key={num} className="flex flex-col items-center">
                  <Star
                    className={`w-7 h-7 sm:w-9 sm:h-9 transition-transform hover:scale-110 ${
                      isEarned
                        ? 'fill-amber-400 text-amber-400 drop-shadow-md'
                        : 'text-white/40 fill-white/10'
                    }`}
                  />
                  <span className="text-[10px] font-bold text-emerald-100 mt-0.5">A{num}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs sm:text-sm font-bold text-amber-200 mt-2">
            ⭐ {earnedStars.length} dari 7 Bintang Emas Berhasil Kamu Kumpulkan!
          </p>
        </div>
      </div>

      {/* Action Call: Mari Menanam Pohon untuk Ola */}
      <div className="bg-amber-50/90 rounded-3xl p-6 sm:p-8 border-2 border-amber-300/90 shadow-md">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shrink-0 shadow-sm">
            <Trees className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
              Aksi Nyata Pelajar Cilik
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-amber-950">
              Aksi Nyata: Mari Menanam Pohon untuk Ola!
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              Orangutan membutuhkan pohon-pohon yang tinggi untuk membuat sarang setiap hari. Kita bisa membantu Ola dan seluruh makhluk hidup dengan melakukan aksi kecil ini:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs">
            <div className="text-2xl mb-1">🌱</div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Tanam Satu Bibit</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tanam bibit pohon buah atau bunga di pot depan rumah atau halaman sekolah.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs">
            <div className="text-2xl mb-1">💧</div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Siram & Rawat</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Siram tanaman dengan rutin agar tumbuh subur seperti spons gambut yang sejuk.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs">
            <div className="text-2xl mb-1">📝</div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Hemat Kertas</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gunakan buku tulis bolak-balik sampai habis untuk menghemat pohon di hutan!
            </p>
          </div>
        </div>
      </div>

      {/* Message for Ola Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900">
            Tulis Satu Kalimat untuk Ola
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600">
          Tulis pesan semangat, doa, atau janji menjaga pohon untuk Ola. Pesanmu akan tersimpan rapi di sini:
        </p>

        {/* Suggestion pills for Grade 1-3 */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="font-bold text-amber-900 self-center">Pilihan Contoh:</span>
          {sampleMessages.map((msg, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setMessage(msg);
                setIsSaved(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-100/70 hover:bg-amber-200 text-amber-900 font-semibold border border-amber-300 transition-all active:scale-95 text-left cursor-pointer"
            >
              "{msg}"
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setIsSaved(false);
              }}
              placeholder="Ketik satu kalimat untuk Ola di sini..."
              maxLength={120}
              className="w-full text-base sm:text-xl font-bold p-4 sm:p-5 rounded-2xl border-2 border-amber-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 transition-all text-slate-900 placeholder:text-slate-400 placeholder:font-normal bg-amber-50/30"
            />
            <span className="absolute right-4 bottom-4 text-xs text-slate-400">
              {message.length}/120
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {isSaved ? '✓ Pesan telah tersimpan di komputermu' : 'Belum disimpan'}
            </span>

            <button
              type="submit"
              disabled={!message.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-sm sm:text-base shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Simpan Pesan untuk Ola</span>
            </button>
          </div>
        </form>

        {/* Display Card Preview if message exists */}
        {message && (
          <div className="mt-4 p-5 rounded-2xl bg-amber-100/60 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={ASSETS.coverImg}
                alt="Ola"
                className="w-14 h-14 rounded-xl object-cover border-2 border-amber-300 shrink-0"
              />
              <div>
                <span className="text-xs font-black uppercase text-amber-800">
                  Kartu Pesan Persahabatan:
                </span>
                <p className="text-base sm:text-lg font-extrabold text-amber-950 mt-0.5 italic">
                  "{message}"
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyCard}
              className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-amber-900 hover:bg-amber-50 border border-amber-300 text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
            >
              {copiedCard ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Salin Kartu</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Nav / Restart */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
        <button
          onClick={onRestart}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-base shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Baca Ulang dari Adegan 1</span>
        </button>

        <button
          onClick={onOpenTeacherGuide}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-emerald-900 border border-emerald-300 font-extrabold text-base shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <BookOpen className="w-5 h-5 text-emerald-700" />
          <span>Buka Panduan Guru</span>
        </button>
      </div>
    </div>
  );
};
