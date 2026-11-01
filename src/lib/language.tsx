"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { t, type Lang, type StringKey } from "./i18n";
import { DEFAULT_RECITER, RECITERS } from "@/data/reciters";

type Settings = {
  lang: Lang;
  kids: boolean;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  setKids: (k: boolean) => void;
  reciter: string;
  setReciter: (id: string) => void;
  tr: (key: StringKey) => string;
};

const Ctx = createContext<Settings | null>(null);

const KEY = "noor:settings";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [kids, setKidsState] = useState(false);
  const [reciter, setReciterState] = useState<string>(DEFAULT_RECITER);

  useEffect(() => {
    // Restore saved settings after hydration so server and client markup match.
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(KEY);
    } catch {
      /* storage unavailable */
    }
    if (!raw) return;
    const id = window.setTimeout(() => {
      try {
        const s = JSON.parse(raw!) as Partial<{ lang: Lang; kids: boolean; reciter: string }>;
        if (s.lang === "ar" || s.lang === "en") setLangState(s.lang);
        if (typeof s.kids === "boolean") setKidsState(s.kids);
        if (s.reciter && RECITERS.some((r) => r.id === s.reciter)) setReciterState(s.reciter);
      } catch {
        /* corrupt value */
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem(KEY, JSON.stringify({ lang, kids, reciter }));
    } catch {
      /* storage unavailable */
    }
  }, [lang, kids, reciter]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(
    () => setLangState((l) => (l === "en" ? "ar" : "en")),
    [],
  );
  const setKids = useCallback((k: boolean) => setKidsState(k), []);
  const setReciter = useCallback((id: string) => setReciterState(id), []);

  const value = useMemo<Settings>(
    () => ({
      lang,
      kids,
      setLang,
      toggleLang,
      setKids,
      reciter,
      setReciter,
      tr: (key) => t(lang, key),
    }),
    [lang, kids, reciter, setLang, toggleLang, setKids, setReciter],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings(): Settings {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSettings must be used inside LanguageProvider");
  return v;
}
