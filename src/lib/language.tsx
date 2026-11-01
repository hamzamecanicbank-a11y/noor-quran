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

type Settings = {
  lang: Lang;
  kids: boolean;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  setKids: (k: boolean) => void;
  tr: (key: StringKey) => string;
};

const Ctx = createContext<Settings | null>(null);

const KEY = "noor:settings";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [kids, setKidsState] = useState(false);

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
        const s = JSON.parse(raw!) as Partial<{ lang: Lang; kids: boolean }>;
        if (s.lang === "ar" || s.lang === "en") setLangState(s.lang);
        if (typeof s.kids === "boolean") setKidsState(s.kids);
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
      localStorage.setItem(KEY, JSON.stringify({ lang, kids }));
    } catch {
      /* storage unavailable */
    }
  }, [lang, kids]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(
    () => setLangState((l) => (l === "en" ? "ar" : "en")),
    [],
  );
  const setKids = useCallback((k: boolean) => setKidsState(k), []);

  const value = useMemo<Settings>(
    () => ({
      lang,
      kids,
      setLang,
      toggleLang,
      setKids,
      tr: (key) => t(lang, key),
    }),
    [lang, kids, setLang, toggleLang, setKids],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings(): Settings {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSettings must be used inside LanguageProvider");
  return v;
}
