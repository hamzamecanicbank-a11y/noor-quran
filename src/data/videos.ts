// Curated children's videos per surah. Empty until a human has watched and
// approved a video — nothing is embedded for kids on an algorithm's word.
//
// To add one: watch it, then add { url: "https://www.youtube-nocookie.com/embed/VIDEO_ID",
// title: { en, ar }, channel: "Channel name", reviewedBy: "Your name" }.
// youtube-nocookie keeps YouTube from setting tracking cookies on our pages.

export type SurahVideo = {
  url: string;
  title: { en: string; ar: string };
  channel: string;
  reviewedBy?: string;
};

export const SURAH_VIDEOS: Record<number, SurahVideo[]> = {};

/** A ready-made YouTube search for children's content on a surah. */
export function youtubeSearchUrl(surahName: string, lang: "en" | "ar", surahAr: string) {
  const q =
    lang === "ar"
      ? `سورة ${surahAr} للأطفال كرتون`
      : `surah ${surahName} for kids animation story`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}
