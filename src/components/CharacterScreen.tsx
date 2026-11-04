import React from 'react';
import { ASSETS } from '../types';
import { speechService } from '../utils/speech';
import { Avatar, BigButton, CharKey } from './ui';

interface CharacterScreenProps {
  onBack: () => void;
}

// Keterangan hanya memakai fakta dari naskah Dev1 (lihat Daftar Cek Fakta).
const CHARACTERS: { who: CharKey; name: string; lines: string[]; bg: string }[] = [
  { who: 'ola', name: 'Ola', lines: ['Anak orangutan.', 'Bulunya cokelat kemerahan.', 'Dari hutan Kalimantan.'], bg: 'bg-sun-100 border-sun-300' },
  { who: 'ibu', name: 'Ibu Ola', lines: ['Induk orangutan.', 'Mengajak Ola membuat sarang.'], bg: 'bg-orange-50 border-orange-200' },
  { who: 'bima', name: 'Bima', lines: ['Bekantan.', 'Hidungnya panjang, perutnya buncit.', 'Suka daun muda.'], bg: 'bg-forest-50 border-forest-200' },
  { who: 'rara', name: 'Rara', lines: ['Burung rangkong.', 'Paruhnya besar bercula.', 'Suka buah ara.'], bg: 'bg-sky-100 border-sky-200' },
  { who: 'bapak', name: 'Bapak Warga Desa', lines: ['Tinggal di desa tepi hutan.'], bg: 'bg-stone-100 border-stone-200' },
  { who: 'petugas', name: 'Petugas Manggala Agni', lines: ['Dari Kementerian Kehutanan.', 'Memadamkan api.'], bg: 'bg-orange-50 border-orange-200' },
  { who: 'relawan', name: 'Relawan', lines: ['Membantu petugas.', 'Menanam bibit pohon.'], bg: 'bg-forest-50 border-forest-200' },
];

export const CharacterScreen: React.FC<CharacterScreenProps> = ({ onBack }) => (
  <div className="mx-auto max-w-4xl space-y-4 p-3 sm:p-6">
    <div className="flex items-center justify-between gap-2">
      <BigButton tone="white" icon="◀" onClick={onBack}>
        Kembali
      </BigButton>
      <h1 className="font-display text-2xl sm:text-4xl font-bold text-forest-800">Kenalan Tokoh</h1>
    </div>

    <div className="overflow-hidden rounded-[32px] border-4 border-white bg-white shadow-xl">
      <img
        src={ASSETS.charactersImg}
        alt="Para tokoh: Ola dan ibunya, Bima si bekantan, Rara si rangkong, bapak warga desa, petugas Manggala Agni, dan relawan."
        width={1280}
        height={714}
        className="block aspect-[1280/714] w-full object-cover"
      />
    </div>

    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {CHARACTERS.map((c) => (
        <li key={c.who} className={`flex items-center gap-3 rounded-[28px] border-4 p-3 shadow-md ${c.bg}`}>
          <Avatar who={c.who} size={84} />
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-2xl font-bold text-bark">{c.name}</h2>
            {c.lines.map((l) => (
              <p key={l} className="text-lg font-semibold text-bark/90 leading-snug">
                {l}
              </p>
            ))}
          </div>
          <button
            type="button"
            onClick={() => speechService.speak(`${c.name}. ${c.lines.join(' ')}`)}
            aria-label={`Dengar tentang ${c.name}`}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-2xl text-white shadow-[0_4px_0_#17628f]"
          >
            <span aria-hidden="true">🔊</span>
          </button>
        </li>
      ))}
    </ul>
  </div>
);
