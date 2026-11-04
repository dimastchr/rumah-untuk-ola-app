import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Calendar, HelpCircle, CheckCircle, Sparkles, HeartHandshake } from 'lucide-react';

interface TeacherGuideScreenProps {
  onBack: () => void;
  onJumpToScene: (sceneId: number) => void;
}

export const TeacherGuideScreen: React.FC<TeacherGuideScreenProps> = ({ onBack, onJumpToScene }) => {
  const [activeTab, setActiveTab] = useState<'p1' | 'p2' | 'p3' | 'p4'>('p1');

  const SESSIONS = {
    p1: {
      title: 'Pertemuan 1 (P1): Adegan 1 - Pagi di Hutan',
      sceneId: 1,
      badge: 'Alur Adegan 1',
      theme: 'Mengenal Hutan Kalimantan & Habitat Orangutan',
      goals: [
        'Siswa mengenali Ola sebagai anak orangutan khas hutan hujan Kalimantan.',
        'Siswa memahami bahwa orangutan membuat sarang baru dari dahan dan ranting pohon setiap malam.',
        'Melatih motorik halus dan kosakata dasar melalui aktivitas interaktif menyusun sarang.',
      ],
      questions: [
        'Di mana Ola dan ibunya tinggal?',
        'Dari bahan apa saja Ola membuat tempat tidurnya?',
        'Mengapa orangutan membuat sarang di atas dahan pohon?',
      ],
      steps: [
        'Buka sampul cerita dan pilih level bacaan (Level Mudah untuk siswa yang baru belajar membaca lancar; Level Sedang untuk pengayaan kosakata).',
        'Dengarkan narasi pembuka bersama-sama. Tunjukkan teks huruf besar yang menyala per kata agar siswa menyimak hubungan bunyi dan tulisan.',
        'Bimbing siswa menyeret ranting dan daun ke dahan pohon sampai sarang terbentuk sempurna.',
        'Diskusikan pop-up "Tahukah Kamu?": Orangutan menghabiskan sebagian besar waktunya di pohon.',
      ],
      activity: 'Menggambar pohon kesukaan dan ranting sarang burung/orangutan di buku gambar siswa.',
    },
    p2: {
      title: 'Pertemuan 2 (P2): Adegan 2–4 - Asap, Spons Gambut, & Teman Baru',
      sceneId: 2,
      badge: 'Alur Adegan 2, 3, & 4',
      theme: 'Bahaya Asap, Sifat Spons Tanah Gambut, & Makanan Hewan',
      goals: [
        'Siswa dapat mengambil keputusan logis menghindari bahaya asap di hutan (Adegan 2).',
        'Siswa memahami konsep sains tanah gambut: tanah yang tersusun dari daun purba dan bekerja bagaikan spons penyerap air (Adegan 3).',
        'Siswa mengelompokkan makanan yang tepat bagi hewan endemik: Buah untuk Ola (orangutan), Daun muda untuk Bima (bekantan), Buah ara untuk Rara (burung rangkong) (Adegan 4).',
      ],
      questions: [
        'Apa yang terjadi jika Ola turun ke tanah saat ada asap tebal?',
        'Mengapa api di tanah gambut sangat sulit dipadamkan bila tanahnya kering?',
        'Mengapa setiap jenis hewan memiliki kesukaan makanan yang berbeda?',
      ],
      steps: [
        'Adegan 2: Siswa mencoba opsi "Turun ke tanah" dan mendengar batuk Ola, lalu memilih ulang opsi "Berayun ke pohon hijau". Jelaskan bahwa membuat kesalahan adalah proses belajar.',
        'Adegan 3: Tekan tombol interaktif "Spons Air" untuk melihat perbandingan gambut kering berasap vs gambut basah yang menyerap air seperti spons raksasa.',
        'Adegan 4: Siswa menyeret makanan yang sesuai ke masing-masing hewan. Jika salah, siswa diberi kesempatan mencoba lagi dengan umpan balik lembut tanpa rasa takut.',
      ],
      activity: 'Eksperimen mini di kelas menggunakan spons cuci piring kering vs basah untuk mendemonstrasikan sifat tanah gambut.',
    },
    p3: {
      title: 'Pertemuan 3 (P3): Adegan 5–6 - Komunikasi Santun & Penjaga Hutan',
      sceneId: 5,
      badge: 'Alur Adegan 5 & 6',
      theme: 'Bahasa Persuasif Santun & Aksi Heroik Manggala Agni',
      goals: [
        'Siswa membedakan kalimat ajakan santun vs kurang santun dalam mencegah pembakaran lahan (Adegan 5).',
        'Siswa melatih keberanian berbicara melalui fitur perekam suara anak di browser.',
        'Siswa memahami urutan logis pemulihan hutan: Padamkan Api → Siram Gambut → Tanam Bibit Pohon (Adegan 6).',
      ],
      questions: [
        'Mengapa bapak warga desa mau mendengarkan saat diajak bicara dengan sopan dan santun?',
        'Apa tugas mulia Petugas Manggala Agni dan Relawan?',
        'Mengapa kita harus memadamkan api dan membasahi tanah terlebih dahulu sebelum menanam bibit baru?',
      ],
      steps: [
        'Adegan 5: Diskusikan kedua pilihan kalimat. Ajak siswa mencoba tombol mikrofon (● REC) untuk merekam suara mereka sendiri saat membaca kalimat ajakan santun.',
        'Dengarkan suara ramah bapak yang mengurungkan niat membakar lahan.',
        'Adegan 6: Siswa memainkan mini game berurutan: mengetuk titik api sampai padam, menyiram gambut sampai basah, lalu menanam bibit hingga memperoleh 3 bintang emas.',
      ],
      activity: 'Bermain peran (role-playing) singkat: seorang siswa menjadi penjaga hutan dan siswa lain menjadi warga yang saling mengingatkan pentingnya tidak membakar lahan.',
    },
    p4: {
      title: 'Pertemuan 4 (P4): Adegan 7 & Layar Akhir - Rumah Baru & Aksi Nyata',
      sceneId: 7,
      badge: 'Alur Adegan 7 & Akhir',
      theme: 'Hutan Lestari, Kasih Sayang Keluarga, & Komitmen Merawat Bumi',
      goals: [
        'Siswa merasakan kehangatan saat Ola kembali berkumpul bersama ibunya melalui interaksi "Pelukan Hati".',
        'Siswa merayakan capaian 7 bintang emas yang terkumpul.',
        'Siswa menulis satu kalimat pesan harapan/penyemangat untuk Ola di kolom refleksi.',
        'Siswa terinspirasi melakukan aksi nyata: merawat tanaman di sekolah atau rumah.',
      ],
      questions: [
        'Bagaimana perasaan Ola saat bisa memeluk ibunya lagi di sarang baru?',
        'Apa yang bisa kita lakukan di sekolah atau rumah agar pohon-pohon tetap tumbuh rindang?',
        'Pesan apa yang ingin kamu sampaikan kepada Ola?',
      ],
      steps: [
        'Adegan 7: Siswa mengetuk tombol "Pelukan Hati" dan mengamati animasi kehangatan Ola dan ibunya.',
        'Layar Akhir: Periksa 7 bintang emas hasil usaha siswa selama belajar.',
        'Bimbing siswa mengetik atau menyusun satu kalimat untuk Ola pada kolom interaktif.',
        'Simpan dan rayakan kartu pesan tersebut di kelas.',
      ],
      activity: 'Gerakan menanam satu tanaman/bunga di pot kecil di halaman sekolah bersama guru dan teman-teman sekelas.',
    },
  };

  const current = SESSIONS[activeTab];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 bg-white/90 p-4 rounded-2xl border border-emerald-200 shadow-sm backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-sm transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="text-center">
          <h1 className="font-display text-xl sm:text-2xl font-black text-emerald-950">
            Panduan Guru & Modul Ajar Tematik
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Pedoman Pembelajaran 4 Pertemuan (SD Kelas 1, 2, dan 3)
          </p>
        </div>

        <div className="w-16 hidden sm:block"></div>
      </div>

      {/* Overview Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-base">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <span>Konsep Integrasi Literasi & Pendidikan Lingkungan Hidup</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Aplikasi cerita bercabang <strong>"Rumah untuk Ola"</strong> dirancang ramah anak tanpa adegan menakutkan, berorientasi penguatan karakter profil pelajar Pancasila (Bernalar Kritis, Berakhlak Mulia pada Alam, Gotong Royong), serta mendukung pembelajaran membaca permulaan dengan umpan balik suara bahasa Indonesia (id-ID) dan penyorotan kata demi kata.
        </p>
      </div>

      {/* Session Tab Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(['p1', 'p2', 'p3', 'p4'] as const).map((tabKey) => {
          const item = SESSIONS[tabKey];
          const isActive = activeTab === tabKey;
          return (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`p-3 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-md font-bold'
                  : 'bg-white text-slate-700 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
            >
              <span className="block text-[11px] font-black uppercase tracking-wider text-emerald-300">
                {item.badge}
              </span>
              <span className="text-sm font-extrabold line-clamp-1 mt-0.5">
                {tabKey.toUpperCase()}: {tabKey === 'p1' ? 'Pagi di Hutan' : tabKey === 'p2' ? 'Asap & Gambut' : tabKey === 'p3' ? 'Manggala Agni' : 'Rumah Baru'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Session Content Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
          <div>
            <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">
              {current.theme}
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {current.title}
            </h2>
          </div>

          <button
            onClick={() => onJumpToScene(current.sceneId)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-sm transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
          >
            <Calendar className="w-4 h-4" />
            <span>Buka Adegan Ini Sekarang</span>
          </button>
        </div>

        {/* Goals */}
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Tujuan Pembelajaran:</span>
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700 list-disc list-inside">
            {current.goals.map((g, i) => (
              <li key={i} className="leading-relaxed">
                {g}
              </li>
            ))}
          </ul>
        </div>

        {/* Guiding Questions */}
        <div className="bg-amber-50/70 p-4 sm:p-5 rounded-2xl border border-amber-200">
          <h3 className="text-sm font-extrabold text-amber-950 flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>Pertanyaan Pemantik Diskusi Siswa:</span>
          </h3>
          <div className="space-y-2 text-xs sm:text-sm text-amber-900">
            {current.questions.map((q, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="font-bold text-amber-700">💬</span>
                <span className="font-medium italic">"{q}"</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructional Steps */}
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Langkah Pemanfaatan Aplikasi di Kelas:</span>
          </h3>
          <div className="space-y-2.5">
            {current.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center shrink-0 text-xs">
                  {idx + 1}
                </span>
                <p className="pt-0.5 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Extension Activity */}
        <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 flex items-start gap-3">
          <HeartHandshake className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black uppercase text-emerald-900 tracking-wide">
              Aktivitas Pengayaan / Tugas Tindak Lanjut:
            </h4>
            <p className="text-xs sm:text-sm text-emerald-950 mt-1 leading-relaxed">
              {current.activity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
