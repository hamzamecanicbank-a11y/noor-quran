"use client";

import { useEffect, useState } from "react";
import { fetchTafsir, sanitizeTafsirHtml } from "@/lib/api";
import { useSettings } from "@/lib/language";
import { DEFAULT_TAFSIR, TAFSIRS, getTafsir } from "@/data/tafsirs";

type State =
  | { kind: "loading" }
  | { kind: "ok"; html: string }
  | { kind: "empty" }
  | { kind: "error" };

export function TafsirPanel({ verseKey }: { verseKey: string }) {
  const { lang, tr } = useSettings();
  const [slug, setSlug] = useState<string>(DEFAULT_TAFSIR[lang]);
  const [state, setState] = useState<State>({ kind: "loading" });

  // When the UI language flips, move to that language's default tafsir.
  const [lastLang, setLastLang] = useState(lang);
  if (lang !== lastLang) {
    setLastLang(lang);
    setSlug(DEFAULT_TAFSIR[lang]);
  }

  useEffect(() => {
    let cancelled = false;
    fetchTafsir(verseKey, slug)
      .then((t) => {
        if (cancelled) return;
        const html = t?.text ? sanitizeTafsirHtml(t.text) : "";
        setState(html ? { kind: "ok", html } : { kind: "empty" });
      })
      .catch(() => {
        if (!cancelled) setState({ kind: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [verseKey, slug]);

  const source = getTafsir(slug);
  const sources = TAFSIRS.filter((t) => t.lang === lang).concat(
    TAFSIRS.filter((t) => t.lang !== lang),
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-ink-2">
          <span>{tr("tafsirSource")}</span>
          <select
            value={slug}
            onChange={(e) => {
              setState({ kind: "loading" });
              setSlug(e.target.value);
            }}
            className="rounded-full border border-line bg-card px-3 py-1 text-sm font-bold text-ink outline-none focus:border-gold"
          >
            {sources.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name[lang]}
              </option>
            ))}
          </select>
        </label>
        <span className="rounded-full bg-teal-soft px-3 py-0.5 text-xs font-bold text-teal">
          ✓ {tr("scholarly")}
        </span>
      </div>

      <p className="mb-3 mt-0 text-xs leading-snug text-ink-3">{source.about[lang]}</p>

      {state.kind === "loading" && <p className="m-0 text-sm text-ink-2">{tr("loading")}</p>}
      {state.kind === "error" && <p className="m-0 text-sm text-ink-2">{tr("loadError")}</p>}
      {state.kind === "empty" && <p className="m-0 text-sm text-ink-2">{tr("tafsirEmpty")}</p>}
      {state.kind === "ok" && (
        <div
          className="tafsir max-h-[28rem] overflow-y-auto rounded-xl border border-line bg-card px-4 py-3 text-base leading-relaxed"
          dir={source.lang === "ar" ? "rtl" : "ltr"}
          lang={source.lang}
          dangerouslySetInnerHTML={{ __html: state.html }}
        />
      )}
    </div>
  );
}
