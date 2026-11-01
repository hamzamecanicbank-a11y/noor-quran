// Ayah-level reciters. Slugs follow the alquran.cloud edition naming, which
// both audio CDNs we use understand. Order = order shown in the picker.
export type Reciter = {
  id: string;
  name: { en: string; ar: string };
  style?: { en: string; ar: string };
};

export const RECITERS: Reciter[] = [
  {
    id: "ar.minshawi",
    name: { en: "Mohamed Siddiq Al-Minshawi", ar: "محمد صديق المنشاوي" },
    style: { en: "Murattal", ar: "مرتل" },
  },
  {
    id: "ar.minshawimujawwad",
    name: { en: "Mohamed Siddiq Al-Minshawi", ar: "محمد صديق المنشاوي" },
    style: { en: "Mujawwad", ar: "مجوّد" },
  },
  {
    id: "ar.husary",
    name: { en: "Mahmoud Khalil Al-Husary", ar: "محمود خليل الحصري" },
    style: { en: "Murattal", ar: "مرتل" },
  },
  {
    id: "ar.abdulbasitmurattal",
    name: { en: "Abdul Basit Abdus Samad", ar: "عبد الباسط عبد الصمد" },
    style: { en: "Murattal", ar: "مرتل" },
  },
  {
    id: "ar.alafasy",
    name: { en: "Mishary Rashid Alafasy", ar: "مشاري راشد العفاسي" },
  },
  {
    id: "ar.abdurrahmaansudais",
    name: { en: "Abdurrahman As-Sudais", ar: "عبد الرحمن السديس" },
  },
  {
    id: "ar.mahermuaiqly",
    name: { en: "Maher Al-Muaiqly", ar: "ماهر المعيقلي" },
  },
  {
    id: "ar.hudhaify",
    name: { en: "Ali Al-Hudhaify", ar: "علي الحذيفي" },
  },
];

export const DEFAULT_RECITER = "ar.minshawi";

export function getReciter(id: string): Reciter {
  return RECITERS.find((r) => r.id === id) ?? RECITERS[0];
}
