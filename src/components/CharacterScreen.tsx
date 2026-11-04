import React from 'react';
import { ArrowLeft, Volume2, Sparkles, Heart } from 'lucide-react';
import { ASSETS } from '../types';
import { speechService } from '../utils/speech';

interface CharacterScreenProps {
  onBack: () => void;
}

const CHARACTERS = [
  {
    name: 'Ola si Orangutan',
    tagline: 'Anak orangutan ceria yang lincah',
    desc: 'Ola adalah anak orangutan berbulu cokelat kemerahan dari hutan hujan Kalimantan. Ola suka berayun di dahan pohon dan belajar membuat sarang baru.',
    soundIntro: 'Halo! Aku Ola, anak orangutan dari hutan Kalimantan. Aku suka berayun di pohon rindang!',
    badge: 'Tokoh Utama',
    bgColor: 'bg-amber-50 border-amber-300',
    btnColor: 'bg-amber-600 hover:bg-amber-700 text-white',
  },
  {
    name: 'Ibu Ola',
    tagline: 'Induk penyayang & pelindung Ola',
    desc: 'Ibu selalu menjaga Ola dengan penuh kasih sayang, mengajari cara merajut ranting pohon menjadi tempat tidur yang aman setiap malam.',
    soundIntro: 'Ibu Ola selalu menjaga anaknya di atas dahan pohon yang sejuk dan aman.',
    badge: 'Keluarga',
    bgColor: 'bg-orange-50 border-orange-300',
    btnColor: 'bg-orange-600 hover:bg-orange-700 text-white',
  },
  {
    name: 'Bima si Bekantan',
    tagline: 'Monyet berhidung panjang khas Kalimantan',
    desc: 'Bima tinggal di pohon sekitar rawa gambut dan sungai. Makanan favorit Bima adalah daun-daun muda yang segar dan pucuk pohon.',
    soundIntro: 'Hai! Aku Bima si bekantan. Hidungku unik dan panjang! Makanan kesukaanku adalah daun muda.',
    badge: 'Sahabat Hutan',
    bgColor: 'bg-lime-50 border-lime-300',
    btnColor: 'bg-lime-700 hover:bg-lime-800 text-white',
  },
  {
    name: 'Rara si Rangkong',
    tagline: 'Burung elok berparuh tanduk besar',
    desc: 'Rara terbang tinggi mengawasi hutan. Rara sangat pintar mencari buah ara (beringin) dan tahu rahasia spons tanah gambut Kalimantan.',
    soundIntro: 'Kweeek! Aku Rara si burung rangkong. Paruhku besar dan megah. Aku suka makan buah ara!',
    badge: 'Sahabat Hutan',
    bgColor: 'bg-sky-50 border-sky-300',
    btnColor: 'bg-sky-700 hover:bg-sky-800 text-white',
  },
  {
    name: 'Petugas Manggala Agni & Relawan',
    tagline: 'Penjaga hutan & pemadam kebakaran lahan',
    desc: 'Para pahlawan berbaju dinas dan helm oranye yang gagah berani memadamkan titik api di tanah gambut, membasahi lahan, serta menanam bibit pohon baru.',
    soundIntro: 'Kami petugas Manggala Agni dan relawan! Kami siap siaga memadamkan api dan menanam bibit pohon baru untuk hutan Indonesia.',
    badge: 'Pahlawan Hutan',
    bgColor: 'bg-emerald-50 border-emerald-300',
    btnColor: 'bg-emerald-700 hover:bg-emerald-800 text-white',
  },
];

export const CharacterScreen: React.FC<CharacterScreenProps> = ({ onBack }) => {
  const handleSpeak = (text: string) => {
    speechService.speak(text, { rate: 0.95, pitch: 1.1 });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between gap-3 bg-white/90 p-4 rounded-2xl border border-amber-200/90 shadow-sm backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-sm transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="text-center">
          <h1 className="font-display text-xl sm:text-2xl font-black text-amber-950">
            Kenalan dengan Tokoh Cerita
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Ketahui para sahabat hutan Kalimantan dan peran penting mereka
          </p>
        </div>

        <div className="w-16 hidden sm:block"></div>
      </div>

      {/* Main Character Illustration Banner (1_karakter.jpg) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-md border border-amber-200/90 overflow-hidden">
        <div className="relative rounded-2xl overflow-hidden border border-amber-200 bg-emerald-950 max-h-[380px]">
          <img
            src={ASSETS.charactersImg}
            alt="Tokoh Cerita Rumah untuk Ola"
            className="w-full h-full object-contain mx-auto"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white text-xs sm:text-sm flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Ilustrasi Sahabat Rimba Kalimantan
            </span>
            <span className="text-amber-200 text-xs">
              Ketuk tombol suara di bawah untuk mendengar sapaan tokoh!
            </span>
          </div>
        </div>
      </div>

      {/* Characters Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {CHARACTERS.map((char, index) => (
          <div
            key={index}
            className={`p-5 rounded-2xl border-2 ${char.bgColor} shadow-sm flex flex-col justify-between transition-all hover:shadow-md`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="inline-block text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white/80 text-slate-800 border border-slate-200 shadow-2xs mb-1">
                    {char.badge}
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-black text-slate-900">
                    {char.name}
                  </h3>
                </div>
                <button
                  onClick={() => handleSpeak(char.soundIntro)}
                  className={`p-2.5 rounded-xl font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer ${char.btnColor}`}
                  title="Dengarkan Suara Tokoh"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="text-xs hidden xs:inline">Dengar Sapaan</span>
                </button>
              </div>

              <p className="text-xs font-semibold text-amber-800/90 mb-2 italic">
                "{char.tagline}"
              </p>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {char.desc}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Hutan Hujan Gambut Kalimantan</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
