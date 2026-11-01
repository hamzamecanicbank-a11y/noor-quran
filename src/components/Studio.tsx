"use client";

import { useCallback, useEffect, useState } from "react";
import { SURAHS, getSurah } from "@/data/surahs";
import { cleanTranslation, fetchSurahVerses, type Verse } from "@/lib/api";
import type { ArtStyle } from "@/lib/art";

type Gen = { data: string; mimeType: string; prompt: string };
type Row = {
  verse: Verse;
  translation: string;
  approvedUrl?: string;
  draft?: Gen;
  busy?: "generating" | "approving" | "removing";
  error?: string;
};

const PW_KEY = "noor:studio-password";

export function Studio() {
  const [password, setPassword] = useState(() => {
    try {
      return typeof window !== "undefined" ? (sessionStorage.getItem(PW_KEY) ?? "") : "";
    } catch {
      return "";
    }
  });
  const [surah, setSurah] = useState(1);
  const [style, setStyle] = useState<ArtStyle>("cartoon");
  const [extra, setExtra] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [batch, setBatch] = useState<{ running: boolean; done: number; total: number } | null>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(PW_KEY, password);
    } catch {
      /* ignore */
    }
  }, [password]);

  const load = useCallback(async (n: number) => {
    setLoading(true);
    setRows([]);
    try {
      const [verses, art] = await Promise.all([
        fetchSurahVerses(n),
        fetch(`/api/art/list?surah=${n}`).then((r) => r.json() as Promise<{ art: Record<string, string> }>),
      ]);
      setRows(
        verses.map((v) => ({
          verse: v,
          translation: cleanTranslation(v.translations?.[0]?.text ?? ""),
          approvedUrl: art.art[v.verse_key],
        })),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => void load(surah), 0);
    return () => window.clearTimeout(id);
  }, [surah, load]);

  const update = (key: string, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.verse.verse_key === key ? { ...r, ...patch } : r)));

  const headers = { "Content-Type": "application/json", "x-studio-password": password };

  const generate = useCallback(
    async (row: Row) => {
      update(row.verse.verse_key, { busy: "generating", error: undefined });
      const res = await fetch("/api/art/generate", {
        method: "POST",
        headers,
        body: JSON.stringify({ verseKey: row.verse.verse_key, translation: row.translation, style, extra }),
      });
      const json = (await res.json()) as Gen & { error?: string };
      if (!res.ok) update(row.verse.verse_key, { busy: undefined, error: json.error ?? `HTTP ${res.status}` });
      else update(row.verse.verse_key, { busy: undefined, draft: json });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [password, style, extra],
  );

  const approve = async (row: Row) => {
    if (!row.draft) return;
    update(row.verse.verse_key, { busy: "approving", error: undefined });
    const res = await fetch("/api/art/approve", {
      method: "POST",
      headers,
      body: JSON.stringify({ verseKey: row.verse.verse_key, data: row.draft.data, mimeType: row.draft.mimeType }),
    });
    const json = (await res.json()) as { url?: string; error?: string };
    if (!res.ok) update(row.verse.verse_key, { busy: undefined, error: json.error ?? `HTTP ${res.status}` });
    else update(row.verse.verse_key, { busy: undefined, draft: undefined, approvedUrl: `${json.url}?v=${Date.now()}` });
  };

  const remove = async (row: Row) => {
    update(row.verse.verse_key, { busy: "removing", error: undefined });
    const res = await fetch("/api/art/remove", { method: "POST", headers, body: JSON.stringify({ verseKey: row.verse.verse_key }) });
    if (!res.ok) update(row.verse.verse_key, { busy: undefined, error: `HTTP ${res.status}` });
    else update(row.verse.verse_key, { busy: undefined, approvedUrl: undefined });
  };

  const generateMissing = async () => {
    const todo = rows.filter((r) => !r.approvedUrl && !r.draft);
    setBatch({ running: true, done: 0, total: todo.length });
    for (const r of todo) {
      await generate(r);
      setBatch((b) => (b ? { ...b, done: b.done + 1 } : b));
    }
    setBatch((b) => (b ? { ...b, running: false } : b));
  };

  const s = getSurah(surah)!;
  const approvedCount = rows.filter((r) => r.approvedUrl).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-extrabold">Art Studio</h1>
      <p className="mt-1 text-ink-2">
        Generate a picture for each ayah with Gemini, look at it, and approve only what you want children to see.
        Approved pictures replace the themed placeholders in the reader.
      </p>

      <div className="mt-6 grid gap-3 rounded-2xl border border-line bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="grid gap-1 text-sm font-bold">
          Studio password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-line bg-paper px-3 py-2 font-normal"
            autoComplete="off"
          />
        </label>
        <label className="grid gap-1 text-sm font-bold">
          Surah
          <select value={surah} onChange={(e) => setSurah(Number(e.target.value))} className="rounded-xl border border-line bg-paper px-3 py-2 font-normal">
            {SURAHS.map((x) => (
              <option key={x.n} value={x.n}>
                {x.n}. {x.name} — {x.ayahs} ayahs
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold">
          Style
          <select value={style} onChange={(e) => setStyle(e.target.value as ArtStyle)} className="rounded-xl border border-line bg-paper px-3 py-2 font-normal">
            <option value="cartoon">Cartoon (flat, pastel)</option>
            <option value="sketch">Sketch (pencil, watercolour)</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold">
          Extra direction (optional)
          <input
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            placeholder="e.g. night scene, more gold"
            className="rounded-xl border border-line bg-paper px-3 py-2 font-normal"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-sm text-ink-2">
          {s.name}: {approvedCount}/{rows.length || s.ayahs} approved
        </span>
        <button
          type="button"
          disabled={!password || loading || batch?.running}
          onClick={generateMissing}
          className="rounded-full bg-teal px-4 py-2 text-sm font-extrabold text-white disabled:opacity-40"
        >
          Generate all missing in this surah
        </button>
        {batch && (
          <span className="text-sm text-ink-2">
            {batch.running ? "Generating" : "Done"} {batch.done}/{batch.total}
          </span>
        )}
      </div>

      {loading && <p className="mt-6 text-ink-2">Loading…</p>}

      <ul className="mt-6 grid list-none gap-4 p-0 md:grid-cols-2">
        {rows.map((r) => (
          <li key={r.verse.verse_key} className="rounded-2xl border border-line bg-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-full bg-paper-2 px-3 py-1 text-xs font-bold">Ayah {r.verse.verse_number}</span>
              {r.approvedUrl ? (
                <span className="rounded-full bg-teal-soft px-3 py-0.5 text-xs font-bold text-teal">✓ Approved</span>
              ) : (
                <span className="rounded-full bg-gold-soft px-3 py-0.5 text-xs font-bold">No picture yet</span>
              )}
            </div>
            <p className="quran m-0 text-2xl" lang="ar">
              {r.verse.text_uthmani}
            </p>
            <p className="mt-1 text-sm text-ink-2">{r.translation}</p>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <figure className="m-0">
                <figcaption className="mb-1 text-xs font-bold text-ink-3">Approved</figcaption>
                {r.approvedUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.approvedUrl} alt="" className="aspect-square w-full rounded-xl object-cover" />
                ) : (
                  <div className="aspect-square rounded-xl border border-dashed border-line" />
                )}
              </figure>
              <figure className="m-0">
                <figcaption className="mb-1 text-xs font-bold text-ink-3">New draft</figcaption>
                {r.draft ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`data:${r.draft.mimeType};base64,${r.draft.data}`} alt="" className="aspect-square w-full rounded-xl object-cover" />
                ) : (
                  <div className="grid aspect-square place-items-center rounded-xl border border-dashed border-line text-xs text-ink-3">
                    {r.busy === "generating" ? "Generating…" : "—"}
                  </div>
                )}
              </figure>
            </div>

            {r.error && <p className="mt-2 rounded-lg bg-gold-soft px-3 py-1.5 text-xs">{r.error}</p>}

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!password || !!r.busy}
                onClick={() => generate(r)}
                className="rounded-full border border-line bg-paper px-3 py-1.5 text-sm font-bold disabled:opacity-40"
              >
                {r.draft ? "Try again" : "Generate"}
              </button>
              {r.draft && (
                <button
                  type="button"
                  disabled={!!r.busy}
                  onClick={() => approve(r)}
                  className="rounded-full bg-teal px-3 py-1.5 text-sm font-bold text-white disabled:opacity-40"
                >
                  {r.busy === "approving" ? "Saving…" : "Approve — show to children"}
                </button>
              )}
              {r.approvedUrl && (
                <button
                  type="button"
                  disabled={!!r.busy}
                  onClick={() => remove(r)}
                  className="rounded-full border border-line px-3 py-1.5 text-sm font-bold text-ink-2 disabled:opacity-40"
                >
                  Remove approved
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
