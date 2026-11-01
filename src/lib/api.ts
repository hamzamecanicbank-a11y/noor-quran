// Data layer. All Quran text, word-by-word data and audio come from
// api.islamic.app — a free, keyless, CORS-enabled mirror of the Quran.com
// v4 corpus. Swap BASE to another v4-compatible host if you ever need to.

import { DEFAULT_RECITER } from "@/data/reciters";

export const BASE = "https://api.islamic.app/v1";
// Two CDNs carry the same ayah-by-ayah recordings under the same slugs.
// The player tries them in order, so a missing file on one is covered by the other.
export const AUDIO_CDNS = [
  (reciter: string, n: number) => `https://cdn.islamic.app/quran/audio/${reciter}/${n}.mp3`,
  (reciter: string, n: number) =>
    `https://cdn.islamic.network/quran/audio/128/${reciter}/${n}.mp3`,
];

export type Word = {
  position: number;
  text_uthmani: string;
  char_type_name: "word" | "end" | string;
  transliteration?: { text: string | null };
  translation?: { text: string | null };
  audio_url?: string | null;
};

export type Verse = {
  id: number; // global ayah number 1..6236
  verse_number: number;
  verse_key: string;
  chapter_id: number;
  page: number;
  juz: number;
  text_uthmani: string;
  translations?: { resource_id: number; resource_name: string; text: string }[];
  words?: Word[];
};

type Envelope<T> = { code: number; status: string; data: T };

const cache = new Map<string, Promise<unknown>>();

async function get<T>(path: string): Promise<T> {
  const url = `${BASE}${path}`;
  if (!cache.has(url)) {
    cache.set(
      url,
      fetch(url, { headers: { Accept: "application/json" } }).then(async (r) => {
        if (!r.ok) {
          cache.delete(url);
          throw new Error(`API ${r.status} for ${path}`);
        }
        const body = (await r.json()) as Envelope<T>;
        return body.data;
      }),
    );
  }
  return cache.get(url) as Promise<T>;
}

export async function fetchSurahVerses(
  chapter: number,
  translation = "en-sahih-international",
): Promise<Verse[]> {
  const data = await get<{ verses: Verse[] } | Verse[]>(
    `/verses/by_chapter/${chapter}?translations=${translation}&words=true&fields=text_uthmani`,
  );
  const verses = Array.isArray(data) ? data : data.verses;
  // Some mirrors return the global ayah number in verse_number; the key is authoritative.
  return verses.map((v) => ({ ...v, verse_number: Number(v.verse_key.split(":")[1]) }));
}

/** All candidate URLs for one ayah, in the order to try them. */
export function ayahAudioUrls(globalAyah: number, reciter = DEFAULT_RECITER): string[] {
  return AUDIO_CDNS.map((f) => f(reciter, globalAyah));
}

/** Strip the HTML footnote markup some translations carry. */
export function cleanTranslation(html: string): string {
  return html
    .replace(/<sup[^>]*>.*?<\/sup>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
