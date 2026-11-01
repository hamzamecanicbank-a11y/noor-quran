// Picks a picture for an ayah. First by words in its English translation,
// then by the surah's overall theme. Every ayah gets a picture; real,
// hand-made art for a specific ayah (lessons.ts → media) always wins.

export type Theme =
  | "sky"
  | "dawn"
  | "rain"
  | "mountains"
  | "sea"
  | "tree"
  | "bee"
  | "ant"
  | "elephant"
  | "book"
  | "giving"
  | "kaaba"
  | "light"
  | "scale"
  | "heart"
  | "shield"
  | "desert";

export const THEME_LABEL: Record<Theme, { en: string; ar: string }> = {
  sky: { en: "The heavens, the night and the stars", ar: "السماء والليل والنجوم" },
  dawn: { en: "The sun, the day and new beginnings", ar: "الشمس والنهار والبدايات" },
  rain: { en: "Rain, growth and provision", ar: "المطر والنبات والرزق" },
  mountains: { en: "Mountains and the straight path", ar: "الجبال والصراط المستقيم" },
  sea: { en: "The sea and journeys", ar: "البحر والرحلات" },
  tree: { en: "Trees, fruit and gardens", ar: "الأشجار والثمار والجنات" },
  bee: { en: "The bee and the wonders of creation", ar: "النحل وعجائب الخلق" },
  ant: { en: "The ant and the small creatures", ar: "النملة والمخلوقات الصغيرة" },
  elephant: { en: "The elephant", ar: "الفيل" },
  book: { en: "The Book, knowledge and learning", ar: "الكتاب والعلم والتعلّم" },
  giving: { en: "Giving, kindness and good deeds", ar: "العطاء والإحسان والعمل الصالح" },
  kaaba: { en: "Worship and the House of Allah", ar: "العبادة وبيت الله" },
  light: { en: "Light and guidance", ar: "النور والهداية" },
  scale: { en: "Justice and the Day of Judgement", ar: "العدل ويوم الحساب" },
  heart: { en: "Mercy, love and patience", ar: "الرحمة والمحبة والصبر" },
  shield: { en: "Protection and seeking refuge", ar: "الحماية والاستعاذة" },
  desert: { en: "The prophets and their lands", ar: "الأنبياء وديارهم" },
};

// Order matters: more specific first.
const RULES: [RegExp, Theme][] = [
  [/\belephant\b/i, "elephant"],
  [/\b(ant|ants)\b/i, "ant"],
  [/\b(bee|bees|honey)\b/i, "bee"],
  [/\b(ship|ships|sea|seas|ocean|waves?|flood|ark|fish|whale)\b/i, "sea"],
  [/\b(rain|water|clouds?|crops?|harvest|grain|provision|sustenance|vegetation|springs?|rivers?)\b/i, "rain"],
  [/\b(garden|gardens|paradise|fruit|fruits|tree|trees|palm|olive|fig|grapes?|dates?|shade)\b/i, "tree"],
  [/\b(mountain|mountains|path|road|way|straight|firm|steadfast)\b/i, "mountains"],
  [/\b(night|stars?|moon|heavens?|sky|skies|constellations?|planets?)\b/i, "sky"],
  [/\b(sun|dawn|morning|daybreak|day|forenoon|light of day)\b/i, "dawn"],
  [/\b(light|lamp|guid(e|es|ed|ance)|illumin\w*)\b/i, "light"],
  [/\b(book|scripture|recite|recitation|read|pen|knowledge|teach|taught|learn|wisdom|revelation|revealed|qur'?an|verses?)\b/i, "book"],
  [/\b(charity|spend|give|giving|gave|orphan|orphans|needy|poor|kind|kindness|good deeds?|righteous deeds?|generous)\b/i, "giving"],
  [/\b(prayer|pray|prostrat\w*|worship|mosque|ka'?bah|house|pilgrimage|hajj|bow)\b/i, "kaaba"],
  [/\b(judg?ment|reckoning|account|scales?|balance|justice|just|weigh\w*|resurrection|hereafter|recompense|reward|punishment)\b/i, "scale"],
  [/\b(refuge|protect\w*|evil|whisper\w*|envier|envy|harm|guard\w*|safe|security)\b/i, "shield"],
  [/\b(mercy|merciful|forgiv\w*|patien\w*|love|loves|compassion\w*|gentle|peace|grateful|gratitude|thank\w*|hearts?)\b/i, "heart"],
  [/\b(moses|musa|pharaoh|abraham|ibrahim|noah|nuh|joseph|yusuf|jesus|isa|mary|maryam|david|solomon|jonah|jacob|lot|hud|salih|shu'?ayb|zachariah|john|job|ishmael|isaac|people of|tribe|camel|desert|egypt|madyan|thamud|'?ad\b)\b/i, "desert"],
];

// Default picture for each surah (1–114).
const SURAH_THEME: Theme[] = [
  "light", "book", "scale", "heart", "giving", "rain", "mountains", "scale", "desert", "sea", // 1–10
  "desert", "desert", "rain", "tree", "mountains", "bee", "sky", "mountains", "desert", "desert", // 11–20
  "desert", "kaaba", "heart", "light", "book", "desert", "ant", "desert", "sky", "dawn", // 21–30
  "heart", "sky", "shield", "desert", "rain", "book", "sky", "desert", "scale", "heart", // 31–40
  "book", "heart", "tree", "sky", "scale", "desert", "mountains", "kaaba", "heart", "sky", // 41–50
  "rain", "mountains", "sky", "sky", "rain", "scale", "scale", "heart", "giving", "heart", // 51–60
  "mountains", "kaaba", "shield", "scale", "heart", "heart", "sky", "book", "scale", "sky", // 61–70
  "sea", "sky", "light", "light", "scale", "giving", "sky", "sky", "scale", "book", // 71–80
  "sky", "sky", "scale", "sky", "sky", "sky", "dawn", "scale", "dawn", "mountains", // 81–90
  "dawn", "sky", "dawn", "heart", "tree", "book", "light", "book", "scale", "desert", // 91–100
  "scale", "scale", "heart", "giving", "elephant", "kaaba", "giving", "rain", "kaaba", "kaaba", // 101–110
  "scale", "light", "shield", "shield", // 111–114
];

export function themeForAyah(verseKey: string, translation: string): Theme {
  for (const [re, theme] of RULES) if (re.test(translation)) return theme;
  const surah = Number(verseKey.split(":")[0]);
  return SURAH_THEME[surah - 1] ?? "light";
}
