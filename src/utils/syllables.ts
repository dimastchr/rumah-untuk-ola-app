/**
 * Pemenggal suku kata sederhana bahasa Indonesia untuk Versi Mudah
 * (suku kata diberi warna berselang-seling sesuai naskah Dev1).
 */
const OVERRIDES: Record<string, string[]> = {
  orangutan: ['o', 'rang', 'u', 'tan'],
};

const VOWELS = 'aiueoAIUEO';
const isVowel = (c: string) => VOWELS.includes(c);

function tokenize(word: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < word.length) {
    const two = word.slice(i, i + 2).toLowerCase();
    if (['ng', 'ny', 'kh', 'sy'].includes(two)) {
      out.push(word.slice(i, i + 2));
      i += 2;
    } else {
      out.push(word[i]);
      i += 1;
    }
  }
  return out;
}

export function syllabify(raw: string): string[] {
  const m = raw.match(/^([^A-Za-z]*)([A-Za-z-]+)([^A-Za-z]*)$/);
  if (!m) return [raw];
  const [, pre, core, post] = m;
  if (core.includes('-')) {
    const parts = core.split('-').map((p) => syllabify(p));
    const flat: string[] = [];
    parts.forEach((p, idx) => {
      if (idx > 0) flat[flat.length - 1] += '-';
      flat.push(...p);
    });
    flat[0] = pre + flat[0];
    flat[flat.length - 1] += post;
    return flat;
  }
  const lower = core.toLowerCase();
  let syl: string[];
  if (OVERRIDES[lower]) {
    let pos = 0;
    syl = OVERRIDES[lower].map((s) => {
      const piece = core.slice(pos, pos + s.length);
      pos += s.length;
      return piece;
    });
  } else {
    const t = tokenize(core);
    const v = t.map((c) => c.length === 1 && isVowel(c));
    const vIdx = v.map((b, i) => (b ? i : -1)).filter((i) => i >= 0);
    if (vIdx.length <= 1) {
      syl = [core];
    } else {
      const cuts: number[] = [];
      for (let k = 0; k < vIdx.length - 1; k++) {
        const a = vIdx[k];
        const b = vIdx[k + 1];
        const cons = b - a - 1;
        // diftong di akhir kata (hijau, pantai) tidak dipenggal
        const pair = (t[a] + t[b]).toLowerCase();
        if (cons === 0 && b === t.length - 1 && ['au', 'ai', 'oi'].includes(pair)) continue;
        if (cons === 0) cuts.push(b);
        else if (cons === 1) cuts.push(a + 1);
        else cuts.push(a + 2);
      }
      syl = [];
      let start = 0;
      for (const c of cuts) {
        syl.push(t.slice(start, c).join(''));
        start = c;
      }
      syl.push(t.slice(start).join(''));
    }
  }
  syl[0] = pre + syl[0];
  syl[syl.length - 1] += post;
  return syl;
}
