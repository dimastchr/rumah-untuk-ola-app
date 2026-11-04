export type ReadingLevel = 'mudah' | 'sedang';

export interface UserProgress {
  readingLevel: ReadingLevel;
  currentScene: number; // 0 = Cover, 1-7 = Scenes, 8 = Ending, 9 = Characters, 10 = Teacher Guide
  unlockedScenes: number[];
  earnedStars: number[]; // scene IDs that earned stars
  olaMessage: string;
  isUppercase: boolean;
  soundEnabled: boolean;
}

export interface SceneData {
  id: number;
  title: string;
  subTitle: string;
  bgImage: string;
  narrationAudio: string;
  narrationText: string;
  easyText: string;
  mediumText: string;
}

export const ASSETS = {
  charactersImg: 'https://cdn.jsdelivr.net/gh/dimastchr/rumah-untuk-ola@main/assets/1_karakter.jpg',
  coverImg: 'https://cdn.jsdelivr.net/gh/dimastchr/rumah-untuk-ola@main/assets/2_sampul.jpg',
  scene1Img: 'https://cdn.jsdelivr.net/gh/dimastchr/rumah-untuk-ola@main/assets/3_adegan-1.jpg',
  scene2Img: 'https://cdn.jsdelivr.net/gh/dimastchr/rumah-untuk-ola@main/assets/4_adegan-2.jpg',
  scene3Img: 'https://cdn.jsdelivr.net/gh/dimastchr/rumah-untuk-ola@main/assets/5_adegan-3.jpg',
  scene4Img: 'https://cdn.jsdelivr.net/gh/dimastchr/rumah-untuk-ola@main/assets/6_adegan-4.jpg',
  scene5Img: 'https://cdn.jsdelivr.net/gh/dimastchr/rumah-untuk-ola@main/assets/7_adegan-5.jpg',
  scene6Img: 'https://cdn.jsdelivr.net/gh/dimastchr/rumah-untuk-ola@main/assets/8_adegan-6.jpg',
  scene7Img: 'https://cdn.jsdelivr.net/gh/dimastchr/rumah-untuk-ola@main/assets/9_adegan-7.jpg',
  audio: {
    1: 'https://cdn.jsdelivr.net/gh/dimastchr/rumah-untuk-ola@main/assets/narasi_adegan-1.mp3',
    2: 'https://cdn.jsdelivr.net/gh/dimastchr/rumah-untuk-ola@main/assets/narasi_adegan-2.mp3',
    3: 'https://cdn.jsdelivr.net/gh/dimastchr/rumah-untuk-ola@main/assets/narasi_adegan-3.mp3',
    4: 'https://cdn.jsdelivr.net/gh/dimastchr/rumah-untuk-ola@main/assets/narasi_adegan-4.mp3',
    5: 'https://cdn.jsdelivr.net/gh/dimastchr/rumah-untuk-ola@main/assets/narasi_adegan-5.mp3',
    6: 'https://cdn.jsdelivr.net/gh/dimastchr/rumah-untuk-ola@main/assets/narasi_adegan-6.mp3',
    7: 'https://cdn.jsdelivr.net/gh/dimastchr/rumah-untuk-ola@main/assets/narasi_adegan-7.mp3',
  }
};

export const SCENES: Record<number, SceneData> = {
  1: {
    id: 1,
    title: 'Adegan 1: Pagi di Hutan',
    subTitle: 'Ola Belajar Membuat Sarang',
    bgImage: ASSETS.scene1Img,
    narrationAudio: ASSETS.audio[1],
    narrationText: 'Selamat pagi! Ini Ola, anak orangutan dari hutan Kalimantan. Pagi ini, Ola belajar membuat sarang dari ranting dan daun bersama ibunya.',
    easyText: 'Ola anak orangutan. Ola buat sarang daun.',
    mediumText: 'Ola belajar membuat sarang dari daun.',
  },
  2: {
    id: 2,
    title: 'Adegan 2: Asap Datang',
    subTitle: 'Ola Harus Memilih Jalan Aman',
    bgImage: ASSETS.scene2Img,
    narrationAudio: ASSETS.audio[2],
    narrationText: 'Awas, asap tebal masuk ke hutan! Mata Ola perih dan batuk-batuk. Ola terpisah dari ibunya. Ke mana Ola harus pergi?',
    easyText: 'Asap tebal datang. Ola harus memilih.',
    mediumText: 'Asap tebal datang. Ola harus memilih.',
  },
  3: {
    id: 3,
    title: 'Adegan 3: Tanah yang Berasap',
    subTitle: 'Misteri Spons Tanah Gambut',
    bgImage: ASSETS.scene3Img,
    narrationAudio: ASSETS.audio[3],
    narrationText: 'Tanah ini seperti spons dari daun lama. Kalau terbakar, apinya bersembunyi di dalam tanah dan sulit dipadamkan.',
    easyText: 'Api ada di tanah gambut.',
    mediumText: 'Api bersembunyi di dalam tanah gambut.',
  },
  4: {
    id: 4,
    title: 'Adegan 4: Teman Baru',
    subTitle: 'Makanan untuk Sahabat Hutan',
    bgImage: ASSETS.scene4Img,
    narrationAudio: ASSETS.audio[4],
    narrationText: 'Ola bertemu Bima si bekantan dan Rara si rangkong. Mereka lapar karena rumahnya terganggu asap. Ayo beri mereka makanan yang tepat!',
    easyText: 'Bima dan Rara lapar. Beri makanan yang tepat.',
    mediumText: 'Ayo beri makanan tepat untuk teman Ola.',
  },
  5: {
    id: 5,
    title: 'Adegan 5: Di Desa Tepi Hutan',
    subTitle: 'Suara Santun Menjaga Rumah',
    bgImage: ASSETS.scene5Img,
    narrationAudio: ASSETS.audio[5],
    narrationText: 'Di tepi desa, seorang bapak hendak membakar lahan. Ola dan teman-teman cemas. Ayo bantu Ola mengucapkan kalimat ajakan yang santun!',
    easyText: 'Jangan bakar hutan kami.',
    mediumText: 'Jangan bakar, Pak. Hutan rumah kami.',
  },
  6: {
    id: 6,
    title: 'Adegan 6: Penjaga Hutan Datang',
    subTitle: 'Manggala Agni dan Relawan Beraksi',
    bgImage: ASSETS.scene6Img,
    narrationAudio: ASSETS.audio[6],
    narrationText: 'Petugas Manggala Agni dari Kementerian Kehutanan dan relawan datang! Mari bantu mereka memadamkan api, membasahi gambut, dan menanam bibit.',
    easyText: 'Petugas padamkan api hutan. Relawan tanam bibit pohon.',
    mediumText: 'Petugas dan relawan bersama menjaga hutan.',
  },
  7: {
    id: 7,
    title: 'Adegan 7: Rumah Baru',
    subTitle: 'Pelukan Hangat di Hutan Hijau',
    bgImage: ASSETS.scene7Img,
    narrationAudio: ASSETS.audio[7],
    narrationText: 'Hujan turun menyejukkan hutan. Pohon-pohon kembali tumbuh hijau. Ola bertemu lagi dengan ibunya! Malam ini Ola membuat sarang baru di atas pohon. Ola punya rumah lagi.',
    easyText: 'Hutan hijau kembali. Ola punya rumah lagi.',
    mediumText: 'Ola gembira punya rumah lagi.',
  },
};
