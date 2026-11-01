// Classical, published tafsir works available per ayah from the data source.
// These are scholars' explanations — not AI text — and are shown with attribution.
export type TafsirSource = {
  slug: string;
  lang: "en" | "ar";
  name: { en: string; ar: string };
  /** One line on who wrote it / what it is, for learners. */
  about: { en: string; ar: string };
  /** Easiest reading first. */
  level: "simple" | "classic";
};

export const TAFSIRS: TafsirSource[] = [
  {
    slug: "en-tafisr-ibn-kathir",
    lang: "en",
    name: { en: "Ibn Kathir (abridged)", ar: "ابن كثير (مختصر، بالإنجليزية)" },
    about: {
      en: "Imam Ibn Kathir (d. 1373). The most widely read classical tafsir, explaining the Quran with the Quran and authentic hadith.",
      ar: "الإمام ابن كثير (ت 774هـ). أشهر التفاسير، يفسّر القرآن بالقرآن وبالحديث الصحيح.",
    },
    level: "classic",
  },
  {
    slug: "en-tafsir-maarif-ul-quran",
    lang: "en",
    name: { en: "Ma'arif al-Qur'an", ar: "معارف القرآن (بالإنجليزية)" },
    about: {
      en: "Mufti Muhammad Shafi (d. 1976). A detailed modern commentary widely taught in English.",
      ar: "المفتي محمد شفيع (ت 1396هـ). تفسير معاصر مفصّل يُدرَّس بالإنجليزية.",
    },
    level: "classic",
  },
  {
    slug: "ar-tafsir-muyassar",
    lang: "ar",
    name: { en: "Al-Muyassar (simple Arabic)", ar: "التفسير الميسّر" },
    about: {
      en: "Prepared by a committee of scholars at the King Fahd Quran Printing Complex, Madinah. Short, clear and reliable.",
      ar: "أعدّته لجنة من العلماء بمجمع الملك فهد لطباعة المصحف الشريف بالمدينة. مختصر وواضح وموثوق.",
    },
    level: "simple",
  },
  {
    slug: "ar-tafseer-al-saddi",
    lang: "ar",
    name: { en: "As-Sa'di", ar: "تفسير السعدي" },
    about: {
      en: "Shaykh Abd ar-Rahman as-Sa'di (d. 1956). Focused on meaning and lessons, in plain Arabic.",
      ar: "الشيخ عبد الرحمن السعدي (ت 1376هـ). يركّز على المعنى والفوائد بعبارة سهلة.",
    },
    level: "simple",
  },
  {
    slug: "ar-tafsir-ibn-kathir",
    lang: "ar",
    name: { en: "Ibn Kathir (Arabic)", ar: "تفسير ابن كثير" },
    about: {
      en: "Imam Ibn Kathir (d. 1373), full Arabic text.",
      ar: "الإمام ابن كثير (ت 774هـ)، النص الكامل.",
    },
    level: "classic",
  },
  {
    slug: "ar-tafsir-al-tabari",
    lang: "ar",
    name: { en: "At-Tabari", ar: "تفسير الطبري" },
    about: {
      en: "Imam at-Tabari (d. 923). The foundational encyclopaedic tafsir.",
      ar: "الإمام الطبري (ت 310هـ). أصل التفاسير وأوسعها.",
    },
    level: "classic",
  },
  {
    slug: "ar-tafseer-al-qurtubi",
    lang: "ar",
    name: { en: "Al-Qurtubi", ar: "تفسير القرطبي" },
    about: {
      en: "Imam al-Qurtubi (d. 1273). Strong on rulings and language.",
      ar: "الإمام القرطبي (ت 671هـ). يعتني بالأحكام واللغة.",
    },
    level: "classic",
  },
  {
    slug: "ar-tafsir-al-baghawi",
    lang: "ar",
    name: { en: "Al-Baghawi", ar: "تفسير البغوي" },
    about: {
      en: "Imam al-Baghawi (d. 1122). A concise, trusted classical commentary.",
      ar: "الإمام البغوي (ت 516هـ). تفسير مختصر موثوق.",
    },
    level: "classic",
  },
];

export const DEFAULT_TAFSIR: Record<"en" | "ar", string> = {
  en: "en-tafisr-ibn-kathir",
  ar: "ar-tafsir-muyassar",
};

export function getTafsir(slug: string): TafsirSource {
  return TAFSIRS.find((t) => t.slug === slug) ?? TAFSIRS[0];
}
