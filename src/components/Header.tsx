"use client";

import Link from "next/link";
import { useSettings } from "@/lib/language";

export function Header() {
  const { lang, toggleLang, kids, setKids, tr } = useSettings();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="medallion grid h-9 w-9 place-items-center text-sm font-extrabold">
            ن
          </span>
          <span className="text-xl font-extrabold tracking-tight text-ink">
            {tr("appName")}
          </span>
        </Link>

        <nav className="ms-auto flex items-center gap-2">
          <Link
            href="/about"
            className="hidden rounded-full px-3 py-1.5 text-sm font-semibold text-ink-2 hover:bg-paper-2 sm:block"
          >
            {tr("about")}
          </Link>

          <button
            type="button"
            onClick={() => setKids(!kids)}
            aria-pressed={kids}
            className={`rounded-full border px-3 py-1.5 text-sm font-bold transition ${
              kids
                ? "border-gold bg-gold-soft text-ink"
                : "border-line bg-card text-ink-2 hover:border-gold"
            }`}
          >
            {kids ? "★ " : ""}
            {tr("kidsMode")}
          </button>

          <button
            type="button"
            onClick={toggleLang}
            className="rounded-full bg-teal px-3 py-1.5 text-sm font-bold text-white hover:opacity-90"
            lang={lang === "en" ? "ar" : "en"}
            aria-label={lang === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
          >
            {tr("language")}
          </button>
        </nav>
      </div>
    </header>
  );
}
