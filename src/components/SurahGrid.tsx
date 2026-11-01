"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SURAHS, type Surah } from "@/data/surahs";
import { useSettings } from "@/lib/language";

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[ً-ْٰ]/g, "") // Arabic diacritics
    .replace(/[أإآ]/g, "ا")
    .replace(/[-'’ ]/g, "");
}

export function SurahCard({ s }: { s: Surah }) {
  const { lang, tr } = useSettings();
  return (
    <Link
      href={`/surah/${s.n}`}
      className="group flex items-center gap-3 rounded-2xl border border-line bg-card px-3 py-3 no-underline transition hover:border-gold"
    >
      <span className="medallion grid h-11 w-11 shrink-0 place-items-center text-sm font-extrabold">
        {s.n}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-extrabold text-ink">
          {lang === "ar" ? s.ar : s.name}
        </span>
        <span className="block truncate text-sm text-ink-2">
          {lang === "ar" ? s.name : s.en} · {s.ayahs} {tr("ayahs")}
        </span>
      </span>
      <span className="quran text-2xl text-teal" aria-hidden>
        {lang === "ar" ? "" : s.ar}
      </span>
    </Link>
  );
}

export function SurahGrid() {
  const [q, setQ] = useState("");
  const { tr } = useSettings();

  const list = useMemo(() => {
    const n = normalize(q.trim());
    if (!n) return SURAHS;
    return SURAHS.filter(
      (s) =>
        String(s.n) === n ||
        normalize(s.name).includes(n) ||
        normalize(s.en).includes(n) ||
        normalize(s.ar).includes(n),
    );
  }, [q]);

  return (
    <section aria-labelledby="surahs">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h2 id="surahs" className="text-2xl font-extrabold">
          {tr("surahs")}
        </h2>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={tr("searchSurahs")}
          className="w-full rounded-full border border-line bg-card px-4 py-2 text-base outline-none focus:border-gold sm:w-80"
        />
      </div>
      <ul className="grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <li key={s.n}>
            <SurahCard s={s} />
          </li>
        ))}
      </ul>
      {list.length === 0 && (
        <p className="mt-6 text-center text-ink-2">—</p>
      )}
    </section>
  );
}
