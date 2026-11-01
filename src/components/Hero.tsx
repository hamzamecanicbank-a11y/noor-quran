"use client";

import Link from "next/link";
import { useState } from "react";
import { useSettings } from "@/lib/language";
import { WORD_NOTES } from "@/data/lessons";

// The basmala, pre-loaded so the home page teaches something before any
// network request finishes.
const BASMALA = [
  { p: 1, ar: "بِسْمِ", tl: "bismi", en: "In the name" },
  { p: 2, ar: "ٱللَّهِ", tl: "l-lahi", en: "of Allah" },
  { p: 3, ar: "ٱلرَّحْمَـٰنِ", tl: "r-raḥmāni", en: "the Most Merciful" },
  { p: 4, ar: "ٱلرَّحِيمِ", tl: "r-raḥīmi", en: "the Most Compassionate" },
];

export function Hero() {
  const { lang, tr } = useSettings();
  const [active, setActive] = useState<number>(3);
  const w = BASMALA[active - 1];
  const note = WORD_NOTES[`1:1:${active}`];

  return (
    <section className="grid items-center gap-8 py-12 md:grid-cols-[1.1fr_1fr] md:py-16">
      <div>
        <h1 className="m-0 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {tr("heroTitle")}
        </h1>
        <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink-2">{tr("heroBody")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/surah/1"
            className="rounded-full bg-teal px-5 py-3 text-base font-extrabold text-white no-underline hover:opacity-90"
          >
            {tr("startReading")}
          </Link>
          <a
            href="#surahs"
            className="rounded-full border border-line bg-card px-5 py-3 text-base font-extrabold text-ink no-underline hover:border-gold"
          >
            {tr("browseSurahs")}
          </a>
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-card p-5 shadow-[0_20px_60px_-30px_rgba(22,48,46,0.35)]">
        <p className="m-0 mb-2 text-center text-xs font-bold text-ink-3">{tr("tapHint")}</p>
        <div className="flex flex-wrap justify-center gap-1" dir="rtl">
          {BASMALA.map((b) => (
            <button
              key={b.p}
              type="button"
              onClick={() => setActive(b.p)}
              data-active={active === b.p}
              className="word-tile flex flex-col items-center rounded-xl px-2 py-1"
            >
              <span className="quran text-[2.2rem] leading-[1.9] text-ink" lang="ar">
                {b.ar}
              </span>
              {lang === "en" && (
                <span className="text-xs text-ink-2" dir="ltr">
                  {b.en}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-gold bg-gold-soft/60 p-4">
          <div className="flex items-baseline gap-3">
            <span className="quran text-3xl" lang="ar">
              {w.ar}
            </span>
            <span className="italic text-ink-2" dir="ltr">
              {w.tl}
            </span>
            <span className="font-bold" dir="ltr">
              {w.en}
            </span>
          </div>
          {note?.root && (
            <p className="mb-0 mt-2 text-sm text-ink-2">
              <span className="font-bold">{tr("root")}:</span>{" "}
              <span className="quran text-lg" lang="ar">
                {note.root}
              </span>
              {note.rootMeaning && <span className="ms-2">{note.rootMeaning[lang]}</span>}
            </p>
          )}
          {note?.kid && (
            <p className="mb-0 mt-2 rounded-xl bg-card px-3 py-2 text-base leading-snug">
              ★ {note.kid[lang]}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
