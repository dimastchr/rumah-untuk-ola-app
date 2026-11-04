import React, { useState } from 'react';
import { BigButton } from './ui';

interface TeacherGuideScreenProps {
  onBack: () => void;
  onJumpToScene: (sceneId: number) => void;
}

type Key = 'p1' | 'p2' | 'p3' | 'p4';

const SESSIONS: Record<Key, { label: string; scenes: string; sceneId: number; tp: string; steps: string[]; questions: string[]; follow: string }> = {
  p1: {
    label: 'P1',
    scenes: 'Adegan 1 – Pagi di Hutan',
    sceneId: 1,
    tp: 'TP 1 (menyimak, tokoh dan latar); TP 2 (membaca kata: hutan, sarang, daun, ranting).',
    steps: [
      'Buka sampul, pilih level bacaan (Mudah untuk kelas 1, Sedang untuk kelas 2–3).',
      'Simak narasi bersama. Tunjukkan kata yang menyala saat dibacakan.',
      'Siswa menyeret ranting dan daun ke dahan sampai sarang jadi (bisa juga ketuk-ketuk).',
      'Bahas pop-up “Tahukah Kamu?”: orangutan menghabiskan sebagian besar waktunya di pohon.',
    ],
    questions: ['Siapa tokoh dalam cerita?', 'Di mana Ola tinggal?', 'Ola membuat sarang dari apa?'],
    follow: 'Siswa membaca ulang kalimat bacaan dan menunjuk kata hutan, sarang, daun, ranting.',
  },
  p2: {
    label: 'P2',
    scenes: 'Adegan 2–4 – Asap Datang, Tanah yang Berasap, Teman Baru',
    sceneId: 2,
    tp: 'TP 2 (kata: asap, gambut, rangkong, bekantan, buah ara); TP 3 (sebab-akibat, fakta sains, pakan satwa); TP 4 (tindakan keselamatan).',
    steps: [
      'Adegan 2: siswa memilih jalan Ola. Pilihan kurang tepat dijawab lembut dan siswa boleh memilih ulang.',
      'Adegan 3: dengarkan Rara, lalu tekan “Spons Air” untuk membandingkan gambut kering dan gambut basah.',
      'Adegan 4: siswa menyeret makanan ke satwa yang tepat (buah-buahan untuk Ola, daun muda untuk Bima, buah ara untuk Rara). Bila salah, makanan kembali dan ada petunjuk.',
    ],
    questions: ['Mengapa Ola tidak turun ke tanah?', 'Tanah gambut seperti apa?', 'Apa makanan Bima dan Rara?'],
    follow: 'Peragaan sederhana dengan spons kering dan spons basah untuk menunjukkan gambut menyimpan air.',
  },
  p3: {
    label: 'P3',
    scenes: 'Adegan 5–6 – Di Desa Tepi Hutan, Penjaga Hutan Datang',
    sceneId: 5,
    tp: 'TP 4 (kesantunan berbahasa); TP 5 (mengucapkan dan merekam kalimat ajakan); TP 1 (pesan gotong royong); TP 3 (urutan menangani kebakaran).',
    steps: [
      'Adegan 5: bahas dua pilihan kalimat. Setelah memilih kalimat santun, siswa menekan ● REC, membaca kalimat, lalu memutar ulang rekamannya.',
      'Rekaman hanya tersimpan sementara di perangkat dan tidak diunggah ke mana pun. Bila mikrofon tidak tersedia, pakai tombol “Ucapkan langsung”.',
      'Adegan 6: siswa mengikuti urutan: ketuk titik api, siram gambut, tanam bibit. Bila urutan keliru, ada pengingat lembut.',
    ],
    questions: ['Kalimat mana yang santun? Mengapa?', 'Siapa yang datang membantu?', 'Apa urutan kerja mereka?'],
    follow: 'Bermain peran singkat: berlatih mengucapkan kalimat ajakan yang santun.',
  },
  p4: {
    label: 'P4',
    scenes: 'Adegan 7 – Rumah Baru, dan Layar Akhir',
    sceneId: 7,
    tp: 'TP 6 (menceritakan alur utuh); TP 7 (refleksi akhir dan kesiapan menulis surat dukungan).',
    steps: [
      'Adegan 7: siswa menekan “Pelukan Hati” untuk menyatukan Ola dan ibunya.',
      'Layar akhir: lihat bintang perolehan, bahas ajakan menanam pohon untuk Ola.',
      'Siswa menulis satu kalimat untuk Ola (persiapan LKPD 3 surat dukungan).',
    ],
    questions: ['Ceritakan lagi petualangan Ola dari awal.', 'Apa yang bisa kamu lakukan untuk pohon?'],
    follow: 'Menyalin kalimat untuk Ola ke LKPD 3 dan mengembangkannya menjadi surat dukungan.',
  },
};

export const TeacherGuideScreen: React.FC<TeacherGuideScreenProps> = ({ onBack, onJumpToScene }) => {
  const [tab, setTab] = useState<Key>('p1');
  const s = SESSIONS[tab];

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-3 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <BigButton tone="white" icon="◀" onClick={onBack}>
          Kembali
        </BigButton>
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-forest-800">Panduan Guru</h1>
      </div>

      <section className="rounded-[28px] border-4 border-forest-200 bg-white p-4 sm:p-5 shadow-md text-lg text-bark space-y-2">
        <p>
          Media cerita bercabang <strong>Rumah untuk Ola</strong> untuk Bahasa Indonesia Fase A (kelas 1–3). Dipakai dalam 4 pertemuan. Tanpa
          login; kemajuan siswa tersimpan di perangkat ini saja.
        </p>
        <p className="text-base text-bark/80">
          Catatan: pop-up “Tahukah Kamu?” Adegan 7 pada naskah belum ditampilkan karena masih menunggu keputusan guru dan belum ada sumber
          fakta.
        </p>
      </section>

      <div role="tablist" aria-label="Pertemuan" className="grid grid-cols-4 gap-2">
        {(Object.keys(SESSIONS) as Key[]).map((k) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`min-h-14 rounded-2xl font-display text-xl font-bold border-4 ${
              tab === k ? 'bg-forest-700 border-forest-700 text-white' : 'bg-white border-forest-100 text-forest-800'
            }`}
          >
            {SESSIONS[k].label}
          </button>
        ))}
      </div>

      <section role="tabpanel" className="rounded-[28px] border-4 border-forest-200 bg-white p-4 sm:p-6 shadow-md space-y-4 text-lg text-bark">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold text-forest-800">
            {s.label}: {s.scenes}
          </h2>
          <BigButton tone="green" icon="▶" onClick={() => onJumpToScene(s.sceneId)}>
            Buka Adegan {s.sceneId}
          </BigButton>
        </div>
        <p>
          <strong>Capaian:</strong> {s.tp}
        </p>
        <div>
          <h3 className="font-display text-xl font-bold text-forest-800">Langkah di kelas</h3>
          <ol className="mt-1 list-decimal space-y-1 pl-6">
            {s.steps.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl bg-sun-100 p-3">
          <h3 className="font-display text-xl font-bold text-bark">Pertanyaan pemantik</h3>
          <ul className="mt-1 list-disc space-y-1 pl-6">
            {s.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
        <p>
          <strong>Tindak lanjut:</strong> {s.follow}
        </p>
      </section>
    </div>
  );
};
