export type ReadingLevel = 'mudah' | 'sedang' | 'menantang';

export const READING_LEVELS: ReadingLevel[] = ['mudah', 'sedang', 'menantang'];

export interface UserProgress {
  readingLevel: ReadingLevel;
  currentScene: number; // 0 = Sampul, 1-7 = Adegan, 8 = Layar Akhir, 9 = Kenalan Tokoh, 10 = Panduan Guru
  unlockedScenes: number[];
  earnedStars: number[]; // id adegan yang sudah selesai (bintang hanya diberikan saat adegan selesai)
  olaMessage: string;
  isUppercase: boolean;
  soundEnabled: boolean;
}

export interface SceneData {
  id: number;
  emoji: string;
  title: string; // judul adegan persis naskah Dev1
  bgImage: string;
  imageAlt: string;
  narrationAudio: string;
  /** Narasi Suara (VO) persis naskah Dev1 */
  narrationText: string;
  /** Batas bicara di file mp3 (detik), diukur dari file asli, untuk sinkron sorot kata */
  speechStart: number;
  speechEnd: number;
  /** Kalimat Bacaan Anak di Layar, persis naskah Dev1 */
  easyLines: string[];
  /** Level Sedang (3 kalimat), persis spek revisi HOTS 2026-11-05 */
  mediumLines: string[];
  /** Level Menantang (5–6 kalimat, ada kata hubung), persis spek revisi HOTS 2026-11-05 */
  hardLines: string[];
}

export const linesFor = (scene: SceneData, level: ReadingLevel) =>
  level === 'mudah' ? scene.easyLines : level === 'menantang' ? scene.hardLines : scene.mediumLines;

const CDN = 'https://cdn.jsdelivr.net/gh/dimastchr/rumah-untuk-ola@main/assets/';

export const ASSETS = {
  charactersImg: `${CDN}1_karakter.jpg`,
  coverImg: `${CDN}2_sampul.jpg`,
  scene: (n: number) => `${CDN}${n + 2}_adegan-${n}.jpg`,
  audio: (n: number) => `${CDN}narasi_adegan-${n}.mp3`,
  /** Adegan 7: gambar transparan Ola, Ibu, dan Ola-Ibu berpelukan */
  olaSendiri: `${CDN}ola_sendiri.webp`,
  ibuSendiri: `${CDN}ibu_sendiri.webp`,
  olaIbuPeluk: `${CDN}ola_ibu_peluk.webp`,
};

export const SCENES: Record<number, SceneData> = {
  1: {
    id: 1,
    emoji: '🌅',
    title: 'Pagi di Hutan',
    bgImage: ASSETS.scene(1),
    imageAlt: 'Ola, anak orangutan, duduk di dahan pohon tinggi bersama ibunya di hutan hijau.',
    narrationAudio: ASSETS.audio(1),
    narrationText:
      'Selamat pagi! Ini Ola, anak orangutan dari hutan Kalimantan. Pagi ini, Ola belajar membuat sarang dari ranting dan daun bersama ibunya.',
    speechStart: 0,
    speechEnd: 14.45,
    easyLines: ['Ola anak orangutan.', 'Ola buat sarang daun.'],
    mediumLines: ['Pagi ini Ola belajar bersama ibunya.', 'Mereka membuat sarang di atas pohon.', 'Sarang dibuat dari ranting dan daun.'],
    hardLines: ['Ola tinggal di hutan Kalimantan.', 'Ola dan ibunya tidur di atas pohon.', 'Setiap malam, mereka membuat sarang baru.', 'Ola menyusun ranting dan daun dengan rapi.', 'Sarang di pohon adalah rumah Ola.'],
  },
  2: {
    id: 2,
    emoji: '💨',
    title: 'Asap Datang',
    bgImage: ASSETS.scene(2),
    imageAlt: 'Asap masuk ke hutan. Ola menggosok matanya di dahan pohon.',
    narrationAudio: ASSETS.audio(2),
    narrationText:
      'Awas, asap tebal masuk ke hutan! Mata Ola perih dan batuk-batuk. Ola terpisah dari ibunya. Ke mana Ola harus pergi?',
    speechStart: 0.25,
    speechEnd: 14.17,
    easyLines: ['Asap tebal datang.', 'Ola harus memilih.'],
    mediumLines: ['Asap tebal masuk ke hutan.', 'Mata Ola perih dan Ola batuk.', 'Ola terpisah dari ibunya.'],
    hardLines: ['Tiba-tiba asap tebal masuk ke hutan.', 'Mata Ola perih dan Ola batuk-batuk.', 'Ola terpisah dari ibunya.', 'Di bawah, tanah penuh asap tebal.', 'Di pohon hijau, udaranya lebih bersih.', 'Ola harus memilih dengan cermat.'],
  },
  3: {
    id: 3,
    emoji: '🐦',
    title: 'Tanah yang Berasap',
    bgImage: ASSETS.scene(3),
    imageAlt: 'Ola di atas pohon bersama Rara si rangkong, memandang tanah gambut yang berasap.',
    narrationAudio: ASSETS.audio(3),
    narrationText:
      'Rara si rangkong terbang mendekat. Tanah ini seperti spons dari daun lama. Kalau terbakar, apinya bersembunyi di dalam tanah dan sulit dipadamkan.',
    speechStart: 0.31,
    speechEnd: 18.7,
    easyLines: ['Api ada di tanah gambut.'],
    mediumLines: ['Rara si rangkong terbang mendekat.', 'Rara bercerita tentang tanah gambut.', 'Api bisa bersembunyi di dalam gambut.'],
    hardLines: ['Rara si rangkong hinggap di dekat Ola.', 'Rara menunjuk tanah yang berasap.', 'Tanah itu bernama gambut.', 'Gambut basah menyimpan banyak air.', 'Kalau gambut kering terbakar, api bersembunyi di dalam tanah.', 'Api itu sulit dipadamkan.'],
  },
  4: {
    id: 4,
    emoji: '🍃',
    title: 'Teman Baru',
    bgImage: ASSETS.scene(4),
    imageAlt: 'Ola duduk di tepi sungai bersama Bima si bekantan dan Rara si rangkong.',
    narrationAudio: ASSETS.audio(4),
    narrationText:
      'Ola bertemu Bima si bekantan dan Rara si rangkong. Mereka lapar karena rumahnya terganggu asap. Ayo beri mereka makanan yang tepat!',
    speechStart: 0.34,
    speechEnd: 12.34,
    easyLines: ['Bima dan Rara lapar.', 'Beri makanan yang tepat.'],
    mediumLines: ['Ola bertemu Bima dan Rara.', 'Mereka lapar karena rumahnya terganggu asap.', 'Ayo beri makanan yang tepat.'],
    hardLines: ['Ola bertemu dua teman baru.', 'Bima si bekantan berhidung panjang.', 'Rara si rangkong berparuh besar.', 'Mereka lapar karena rumahnya terganggu asap.', 'Bima suka daun muda.', 'Rara suka buah ara.'],
  },
  5: {
    id: 5,
    emoji: '🏡',
    title: 'Di Desa Tepi Hutan',
    bgImage: ASSETS.scene(5),
    imageAlt: 'Ola, Bima, dan Rara mengintip dari balik semak di tepi desa. Ada seorang bapak warga desa.',
    narrationAudio: ASSETS.audio(5),
    narrationText:
      'Di tepi desa, seorang bapak hendak membakar lahan. Ola dan teman-teman cemas. Ayo bantu Ola mengucapkan kalimat ajakan yang santun!',
    speechStart: 0.27,
    speechEnd: 13.09,
    easyLines: ['Jangan bakar hutan kami.'],
    mediumLines: ['Di tepi desa ada seorang bapak.', 'Bapak itu hendak membakar lahan.', 'Ola dan teman-teman cemas.'],
    hardLines: ['Ola, Bima, dan Rara tiba di tepi desa.', 'Mereka melihat bapak membawa pemantik api.', 'Bapak itu hendak membakar lahan.', 'Ola dan teman-teman cemas.', 'Mereka ingin mengajak Bapak dengan santun.'],
  },
  6: {
    id: 6,
    emoji: '🧑‍🚒',
    title: 'Penjaga Hutan Datang',
    bgImage: ASSETS.scene(6),
    imageAlt: 'Petugas Manggala Agni berseragam dan relawan datang membawa alat pemadam dan bibit pohon.',
    narrationAudio: ASSETS.audio(6),
    narrationText:
      'Petugas Manggala Agni dari Kementerian Kehutanan dan relawan datang! Mari bantu mereka memadamkan api, membasahi gambut, dan menanam bibit.',
    speechStart: 0.27,
    speechEnd: 11.75,
    easyLines: ['Petugas padamkan api hutan.', 'Relawan tanam bibit pohon.'],
    mediumLines: ['Petugas Manggala Agni datang membantu.', 'Relawan datang membawa bibit pohon.', 'Mereka bekerja sama menjaga hutan.'],
    hardLines: ['Petugas Manggala Agni dan relawan datang.', 'Petugas memadamkan api dengan air.', 'Lalu gambut disiram sampai basah.', 'Setelah itu, relawan menanam bibit pohon.', 'Mereka bekerja sama menjaga hutan.'],
  },
  7: {
    id: 7,
    emoji: '🏠',
    title: 'Rumah Baru',
    bgImage: ASSETS.scene(7),
    imageAlt: 'Hutan hijau kembali. Ola memeluk ibunya di atas pohon.',
    narrationAudio: ASSETS.audio(7),
    narrationText:
      'Hujan turun menyejukkan hutan. Pohon-pohon kembali tumbuh hijau. Ola bertemu lagi dengan ibunya! Malam ini Ola membuat sarang baru di atas pohon. Ola punya rumah lagi.',
    speechStart: 0.31,
    speechEnd: 18.46,
    easyLines: ['Hutan hijau kembali.', 'Ola punya rumah lagi.'],
    mediumLines: ['Pohon-pohon tumbuh hijau kembali.', 'Ola bertemu lagi dengan ibunya.', 'Ola gembira punya rumah lagi.'],
    hardLines: ['Hutan perlahan hijau kembali.', 'Ola bertemu lagi dengan ibunya.', 'Mereka berpelukan dengan gembira.', 'Malam ini Ola membuat sarang baru.', 'Ola punya rumah lagi.', 'Ola ingin hutan tetap terjaga.'],
  },
};
