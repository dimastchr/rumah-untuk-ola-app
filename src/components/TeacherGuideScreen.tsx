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
      'Buka sampul, pilih level bacaan: Mudah (kelas 1), Sedang (bawaan), atau Menantang (bacaan lebih panjang untuk kelas 2–3).',
      'Simak narasi bersama. Tunjukkan kata yang menyala saat dibacakan.',
      'Siswa memilah bahan: menyeret ranting dan daun ke dahan, bukan plastik dan batu (bisa juga ketuk bahan lalu ketuk dahan).',
      'Bahas pop-up “Tahukah Kamu?”: orangutan menghabiskan sebagian besar waktunya di pohon, lalu jawab pertanyaan 🧠 Ayo Berpikir.',
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
      'Adegan 2: siswa memilih jalan Ola. Pilihan kurang tepat dijawab lembut dan siswa boleh memilih ulang. Lalu jawab pertanyaan alasan (🧠 Ayo Berpikir).',
      'Adegan 3: dengarkan Rara, tekan “Spons Air” untuk membandingkan gambut kering dan gambut basah, lalu urutkan 4 kartu sebab-akibat dan jawab pertanyaan gambut.',
      'Adegan 4: siswa menyeret makanan ke satwa yang tepat (buah-buahan untuk Ola, daun muda untuk Bima, buah ara untuk Rara). Bila salah, makanan kembali dan ada petunjuk. Lalu jawab pertanyaan pohon ara.',
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
      'Adegan 5: siswa menilai tiga kalimat ajakan, lalu menyusun kalimat ajakan sendiri dari kartu kata. Setelah itu siswa menekan ● REC, membaca kalimat susunannya, lalu memutar ulang rekamannya.',
      'Rekaman hanya tersimpan sementara di perangkat dan tidak diunggah ke mana pun. Bila mikrofon tidak tersedia, pakai tombol “Ucapkan langsung”.',
      'Adegan 6: siswa mengikuti urutan: ketuk titik api, siram gambut, tanam bibit. Bila urutan keliru, ada pengingat lembut. Lalu jawab pertanyaan mengapa gambut tetap disiram.',
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
      'Adegan 7: siswa menyeret Ola ke ibunya (atau menekan “🤗 Dekatkan”) sampai keduanya berpelukan, lalu menyusun janji: satu aksi dan satu alasan.',
      'Layar akhir: lihat bintang perolehan dan janji siswa, bahas ajakan menanam pohon untuk Ola.',
      'Siswa menulis satu kalimat untuk Ola (persiapan LKPD 3 surat dukungan).',
    ],
    questions: ['Ceritakan lagi petualangan Ola dari awal.', 'Apa yang bisa kamu lakukan untuk pohon?'],
    follow: 'Menyalin kalimat untuk Ola ke LKPD 3 dan mengembangkannya menjadi surat dukungan.',
  },
};


/* ---------- Tabel HOTS per adegan (label Bloom hanya untuk guru) ---------- */
const HOTS: { adegan: string; level: string; pertanyaan: string; jawaban: string; alasan: string }[] = [
  {
    adegan: 'A1',
    level: 'C4 Menganalisis (memilah)',
    pertanyaan: 'Pilih bahan yang cocok untuk sarang Ola. (ranting, daun, plastik, batu)',
    jawaban: 'Ranting dan daun.',
    alasan: 'Siswa memilah bahan dari pohon dan bukan dari pohon; plastik dan batu adalah pengecoh.',
  },
  {
    adegan: 'A1',
    level: 'C4 Menganalisis (menyimpulkan)',
    pertanyaan: 'Mengapa Ola perlu hutan yang banyak pohonnya?',
    jawaban: 'Sarang Ola dibuat dari ranting dan daun pohon.',
    alasan: 'Siswa menghubungkan bahan sarang dengan pohon, lalu menyimpulkan bahwa tanpa pohon Ola tidak bisa membuat sarang.',
  },
  {
    adegan: 'A2',
    level: 'C5 Mengevaluasi (menilai alasan)',
    pertanyaan: 'Mengapa pohon hijau lebih aman untuk Ola?',
    jawaban: 'Asap di bawah lebih tebal.',
    alasan: 'Siswa menilai pilihan dengan bukti dari bacaan: di bawah tanah penuh asap tebal, di pohon hijau udaranya lebih bersih.',
  },
  {
    adegan: 'A3',
    level: 'C4 Menganalisis (sebab-akibat)',
    pertanyaan: 'Urutkan kejadiannya. Mana yang terjadi lebih dulu?',
    jawaban: 'Gambut kering terbakar → Api bersembunyi di dalam tanah → Asap tebal keluar → Ola terpisah dari ibunya.',
    alasan: 'Siswa menyusun rantai sebab-akibat dari kebakaran gambut sampai Ola terpisah dari ibunya.',
  },
  {
    adegan: 'A3',
    level: 'C4 Menganalisis (membandingkan)',
    pertanyaan: 'Gambut mana yang lebih sulit terbakar?',
    jawaban: 'Gambut basah.',
    alasan: 'Gambut basah menyimpan banyak air (simulasi spons dan bacaan Menantang).',
  },
  {
    adegan: 'A4',
    level: 'C4 Menganalisis (menghubungkan)',
    pertanyaan: 'Kalau pohon ara terbakar, siapa paling kesulitan makan?',
    jawaban: 'Rara si rangkong.',
    alasan: 'Siswa menghubungkan makanan satwa dengan pohonnya: Rara suka buah ara, jadi tanpa pohon ara Rara kesulitan makan.',
  },
  {
    adegan: 'A5',
    level: 'C5 Mengevaluasi',
    pertanyaan: 'Kalimat mana yang paling tepat untuk mengajak Bapak?',
    jawaban: '“Maaf, Pak, jangan bakar lahan karena asapnya membuat kami batuk.”',
    alasan: 'Kalimat ini santun (ada kata maaf dan sapaan Pak) dan memuat alasan. “Hei, jangan bakar!” kurang sopan; “Jangan bakar, Pak. Hutan rumah kami.” sudah santun tetapi belum memakai kata hubung karena.',
  },
  {
    adegan: 'A5',
    level: 'C6 Mencipta',
    pertanyaan: 'Susun kalimat ajakanmu sendiri.',
    jawaban: '“Maaf, Pak, jangan bakar lahan karena hutan rumah kami.”',
    alasan: 'Siswa merangkai kartu kata menjadi kalimat ajakan santun beralasan, lalu merekam dan memutar ulang ucapannya.',
  },
  {
    adegan: 'A6',
    level: 'C4/C5 Menganalisis dan Mengevaluasi',
    pertanyaan: 'Mengapa gambut tetap disiram setelah api padam?',
    jawaban: 'Api bisa bersembunyi di dalam tanah.',
    alasan: 'Siswa memakai informasi Rara (Adegan 3) untuk menilai langkah petugas: api di gambut bisa bersembunyi di dalam tanah.',
  },
  {
    adegan: 'A7',
    level: 'C6 Mencipta (merancang aksi)',
    pertanyaan: 'Apa yang bisa kamu lakukan untuk hutan? Susun janjimu.',
    jawaban: 'Terbuka: “Aku akan <aksi> karena <alasan>.” Semua pilihan diterima.',
    alasan: 'Siswa merancang aksi nyata beserta alasannya. Janji tersimpan di perangkat dan tampil di layar akhir sebagai bahan surat dukungan.',
  },
];

const LEVELS: { name: string; desc: string }[] = [
  { name: '🌱 Mudah', desc: '1–2 kalimat pendek, dipenggal suku kata berwarna. Cocok untuk kelas 1.' },
  { name: '🌿 Sedang (bawaan)', desc: '3 kalimat per adegan.' },
  { name: '🌳 Menantang', desc: '5–6 kalimat per adegan dengan kata hubung (karena, lalu, setelah itu, kalau). Untuk kelas 2–3 yang sudah lancar.' },
];

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
          Media cerita bercabang <strong>Rumah untuk Ola</strong> untuk Bahasa Indonesia Fase A (kelas 1–2). Dipakai dalam 4 pertemuan. Tanpa
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
      <section className="rounded-[28px] border-4 border-forest-200 bg-white p-4 sm:p-5 shadow-md text-lg text-bark space-y-2">
        <h2 className="font-display text-2xl font-bold text-forest-800">Level bacaan (3 tingkat)</h2>
        <ul className="space-y-1">
          {LEVELS.map((l) => (
            <li key={l.name}>
              <strong>{l.name}:</strong> {l.desc}
            </li>
          ))}
        </ul>
        <p className="text-base text-bark/80">Level bisa diganti kapan saja di sampul atau di kotak “Ayo Membaca” tiap adegan.</p>
      </section>

      <section className="rounded-[28px] border-4 border-forest-200 bg-white p-4 sm:p-5 shadow-md text-bark space-y-2">
        <h2 className="font-display text-2xl font-bold text-forest-800">🧠 Ayo Berpikir: tabel HOTS per adegan</h2>
        <p className="text-base text-bark/80">
          Pertanyaan muncul setelah aktivitas utama; tombol Lanjut baru aktif setelah dijawab benar. Pilihan diacak, jawaban salah diberi
          umpan balik lembut dan siswa boleh mencoba lagi. Label level Bloom hanya untuk guru.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-base">
            <thead>
              <tr className="bg-forest-700 text-white">
                <th scope="col" className="p-2">Adegan</th>
                <th scope="col" className="p-2">Level</th>
                <th scope="col" className="p-2">Pertanyaan / tugas</th>
                <th scope="col" className="p-2">Jawaban benar</th>
                <th scope="col" className="p-2">Alasan</th>
              </tr>
            </thead>
            <tbody>
              {HOTS.map((h, i) => (
                <tr key={i} className={i % 2 ? 'bg-forest-50' : 'bg-white'}>
                  <td className="p-2 align-top font-bold">{h.adegan}</td>
                  <td className="p-2 align-top">{h.level}</td>
                  <td className="p-2 align-top">{h.pertanyaan}</td>
                  <td className="p-2 align-top">{h.jawaban}</td>
                  <td className="p-2 align-top">{h.alasan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
