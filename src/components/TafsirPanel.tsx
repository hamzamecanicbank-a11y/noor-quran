"use client";

import { useEffect, useState } from "react";
import { fetchTafsirWithFallback, sanitizeTafsirHtml } from "@/lib/api";
import { useSettings } from "@/lib/language";
import { DEFAULT_TAFSIR, TAFSIRS, getTafsir } from "@/data/tafsirs";

type State =
  | { kind: "loading" }
  | { kind: "ok"; html: string; foundOn: string; usedSlug: string }
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
    const sameLang = TAFSIRS.filter((t) => t.lang === getTafsir(slug).lang).map((t) => t.slug);
    const otherLang = TAFSIRS.filter((t) => t.lang !== getTafsir(slug).lang).map((t) => t.slug);
    fetchTafsirWithFallback(verseKey, slug, [...sameLang, ...otherLang])
      .then((r) => {
        if (cancelled) return;
        const html = r ? sanitizeTafsirHtml(r.text.text) : "";
        setState(
          html && r ? { kind: "ok", html, foundOn: r.foundOn, usedSlug: r.slug } : { kind: "empty" },
        );
      })
      .catch(() => {
        if (!cancelled) setState({ kind: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [verseKey, slug]);

  const source = getTafsir(state.kind === "ok" ? state.usedSlug : slug);
  const ayahNumber = Number(verseKey.split(":")[1]);
  const foundOnNumber = state.kind === "ok" ? Number(state.foundOn.split(":")[1]) : ayahNumber;
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
      {state.kind === "ok" && state.usedSlug !== slug && (
        <p className="mb-2 mt-0 rounded-lg bg-gold-soft px-3 py-1.5 text-xs text-ink">
          {tr("tafsirSwitched")} {source.name[lang]}
        </p>
      )}
      {state.kind === "ok" && foundOnNumber !== ayahNumber && (
        <p className="mb-2 mt-0 text-xs text-ink-3">
          {tr("tafsirFromAyah")} {foundOnNumber}–{ayahNumber}
        </p>
      )}
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
