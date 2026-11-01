"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ayahAudioUrls,
  cleanTranslation,
  fetchSurahVerses,
  type Verse,
  type Word,
} from "@/lib/api";
import { useSettings } from "@/lib/language";
import { getSurah, type Surah } from "@/data/surahs";
import { RECITERS } from "@/data/reciters";
import {
  AYAH_LESSONS,
  SURAH_INTROS,
  WORD_NOTES,
  type AyahLesson,
  type WordNote,
} from "@/data/lessons";

type Selected = { key: string; position: number } | null;

export function Reader({ surahNumber }: { surahNumber: number }) {
  const surah = getSurah(surahNumber)!;
  const { lang, kids, tr, reciter } = useSettings();

  const [verses, setVerses] = useState<Verse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Selected>(null);
  const [playing, setPlaying] = useState<number | null>(null); // index into verses
  const [continuous, setContinuous] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wordAudioRef = useRef<HTMLAudioElement | null>(null);
  // Remaining candidate URLs for the ayah currently playing.
  const candidatesRef = useRef<string[]>([]);

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchSurahVerses(surahNumber)
      .then((v) => {
        if (!cancelled) setVerses(v);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [surahNumber, attempt]);

  const load = useCallback(() => {
    setError(null);
    setVerses(null);
    setAttempt((a) => a + 1);
  }, []);

  // ---- ayah audio ----
  const stop = useCallback(() => {
    audioRef.current?.pause();
    candidatesRef.current = [];
    setPlaying(null);
    setContinuous(false);
  }, []);

  /** Load the next candidate URL into the player; returns false when none are left. */
  const tryNextSource = useCallback(() => {
    const el = audioRef.current;
    const next = candidatesRef.current.shift();
    if (!el || !next) return false;
    el.src = next;
    el.play().catch(() => {
      /* handled by the error listener */
    });
    return true;
  }, []);

  const playIndex = useCallback(
    (i: number, keepGoing: boolean) => {
      if (!verses || !verses[i]) {
        stop();
        return;
      }
      setAudioError(false);
      candidatesRef.current = ayahAudioUrls(verses[i].id, reciter);
      tryNextSource();
      setPlaying(i);
      setContinuous(keepGoing);
      document
        .getElementById(`ayah-${verses[i].verse_key}`)
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
    },
    [verses, stop, reciter, tryNextSource],
  );

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnded = () => {
      if (continuous && playing !== null) playIndex(playing + 1, true);
      else setPlaying(null);
    };
    const onError = () => {
      if (!tryNextSource()) {
        setAudioError(true);
        stop();
      }
    };
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);
    return () => {
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onError);
    };
  }, [continuous, playing, playIndex, tryNextSource, stop]);

  useEffect(() => () => audioRef.current?.pause(), []);

  const playWord = useCallback((w: Word) => {
    if (!w.audio_url) return;
    const el = wordAudioRef.current;
    if (!el) return;
    el.src = w.audio_url;
    el.play().catch(() => undefined);
  }, []);

  const intro = SURAH_INTROS[surahNumber];

  return (
    <article className="mx-auto max-w-3xl px-4 pb-24">
      <audio ref={audioRef} preload="none" />
      <audio ref={wordAudioRef} preload="none" />

      <SurahHeader
        surah={surah}
        onPlayAll={() => (playing !== null ? stop() : playIndex(0, true))}
        isPlaying={playing !== null}
        audioError={audioError}
        onReciterChange={stop}
      />

      {intro && (
        <section className="mb-6 rounded-2xl bg-teal-soft p-4 text-ink">
          <p className="m-0 text-base leading-relaxed">{intro.intro[lang]}</p>
          <p className="mb-0 mt-2 text-sm font-bold text-teal">{intro.theme[lang]}</p>
        </section>
      )}

      {surahNumber !== 1 && surahNumber !== 9 && (
        <p className="quran mb-2 text-center text-3xl text-teal" lang="ar">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
        </p>
      )}

      {!verses && !error && (
        <p className="py-16 text-center text-ink-2" role="status">
          {tr("loading")}
        </p>
      )}
      {error && (
        <div className="rounded-2xl border border-line bg-card p-6 text-center">
          <p className="mb-3">{tr("loadError")}</p>
          <button
            type="button"
            onClick={load}
            className="rounded-full bg-teal px-4 py-2 font-bold text-white"
          >
            {tr("retry")}
          </button>
        </div>
      )}

      {verses && (
        <p className="mb-3 text-center text-sm text-ink-3">{tr("tapHint")}</p>
      )}

      <ol className="m-0 list-none p-0">
        {verses?.map((v, i) => (
          <Ayah
            key={v.verse_key}
            verse={v}
            isPlaying={playing === i}
            onPlay={() => (playing === i ? stop() : playIndex(i, false))}
            selected={selected}
            onSelect={(position) =>
              setSelected((s) =>
                s && s.key === v.verse_key && s.position === position
                  ? null
                  : { key: v.verse_key, position },
              )
            }
            onPlayWord={playWord}
            lang={lang}
            kids={kids}
            tr={tr}
          />
        ))}
      </ol>

      <SurahNav n={surahNumber} />
    </article>
  );
}

function SurahHeader({
  surah,
  onPlayAll,
  isPlaying,
  audioError,
  onReciterChange,
}: {
  surah: Surah;
  onPlayAll: () => void;
  isPlaying: boolean;
  audioError: boolean;
  onReciterChange: () => void;
}) {
  const { lang, tr, reciter, setReciter } = useSettings();
  return (
    <header className="mb-6 flex flex-col items-center gap-3 pt-8 text-center">
      <span className="medallion grid h-16 w-16 place-items-center text-xl font-extrabold">
        {surah.n}
      </span>
      <h1 className="quran m-0 text-5xl text-ink" lang="ar">
        {surah.ar}
      </h1>
      <p className="m-0 text-lg font-bold text-ink-2">
        {lang === "ar" ? surah.name : `${surah.name} — ${surah.en}`}
      </p>
      <p className="m-0 text-sm text-ink-3">
        {tr("revealedIn")} {surah.place === "makkah" ? tr("meccan") : tr("medinan")} ·{" "}
        {surah.ayahs} {tr("ayahs")}
      </p>
      <button
        type="button"
        onClick={onPlayAll}
        className="mt-1 rounded-full bg-teal px-5 py-2.5 text-base font-extrabold text-white hover:opacity-90"
      >
        {isPlaying ? `■ ${tr("stop")}` : `▶ ${tr("playSurah")}`}
      </button>
      <label className="flex items-center gap-2 text-sm text-ink-2">
        <span>{tr("reciter")}</span>
        <select
          value={reciter}
          onChange={(e) => {
            onReciterChange();
            setReciter(e.target.value);
          }}
          aria-label={tr("chooseReciter")}
          className="rounded-full border border-line bg-card px-3 py-1.5 text-sm font-bold text-ink outline-none focus:border-gold"
        >
          {RECITERS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name[lang]}
              {r.style ? ` — ${r.style[lang]}` : ""}
            </option>
          ))}
        </select>
      </label>
      {audioError && (
        <p className="m-0 rounded-xl bg-gold-soft px-3 py-2 text-sm text-ink" role="alert">
          {tr("audioUnavailable")}
        </p>
      )}
    </header>
  );
}

function SurahNav({ n }: { n: number }) {
  const { tr } = useSettings();
  const prev = n > 1 ? getSurah(n - 1) : null;
  const next = n < 114 ? getSurah(n + 1) : null;
  return (
    <nav className="mt-12 flex justify-between gap-3">
      {prev ? (
        <Link
          href={`/surah/${prev.n}`}
          className="rounded-full border border-line bg-card px-4 py-2 font-bold no-underline hover:border-gold"
        >
          ← {tr("previousSurah")}: {prev.name}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/surah/${next.n}`}
          className="rounded-full border border-line bg-card px-4 py-2 font-bold no-underline hover:border-gold"
        >
          {tr("nextSurah")}: {next.name} →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

type AyahProps = {
  verse: Verse;
  isPlaying: boolean;
  onPlay: () => void;
  selected: Selected;
  onSelect: (position: number) => void;
  onPlayWord: (w: Word) => void;
  lang: "en" | "ar";
  kids: boolean;
  tr: (k: Parameters<ReturnType<typeof useSettings>["tr"]>[0]) => string;
};

function Ayah({
  verse,
  isPlaying,
  onPlay,
  selected,
  onSelect,
  onPlayWord,
  lang,
  kids,
  tr,
}: AyahProps) {
  const words = useMemo(
    () => (verse.words ?? []).filter((w) => w.char_type_name === "word"),
    [verse.words],
  );
  const translation = cleanTranslation(verse.translations?.[0]?.text ?? "");
  const selectedWord =
    selected?.key === verse.verse_key
      ? words.find((w) => w.position === selected.position)
      : undefined;
  const lesson: AyahLesson | undefined = AYAH_LESSONS[verse.verse_key];

  return (
    <li
      id={`ayah-${verse.verse_key}`}
      className="ayah mb-3 rounded-2xl border border-line bg-card p-4 sm:p-5"
      data-playing={isPlaying}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-paper-2 px-3 py-1 text-xs font-bold text-ink-2">
          {tr("verse")} {verse.verse_number}
        </span>
        <button
          type="button"
          onClick={onPlay}
          aria-label={isPlaying ? tr("stop") : tr("play")}
          className="grid h-9 w-9 place-items-center rounded-full bg-teal text-white hover:opacity-90"
        >
          {isPlaying ? "■" : "▶"}
        </button>
      </div>

      {/* The interlinear word row — the heart of the app */}
      <div className="flex flex-wrap justify-start gap-x-1 gap-y-2" dir="rtl">
        {words.map((w) => {
          const active =
            selected?.key === verse.verse_key && selected.position === w.position;
          return (
            <button
              key={w.position}
              type="button"
              onClick={() => onSelect(w.position)}
              data-active={active}
              className="word-tile flex min-w-[3rem] flex-col items-center rounded-xl px-2 py-1 text-ink"
            >
              <span
                className={`quran ${kids ? "text-[2.4rem]" : "text-[2rem]"} leading-[1.9]`}
                lang="ar"
              >
                {w.text_uthmani}
              </span>
              {lang === "en" && (
                <span
                  className={`${kids ? "text-sm" : "text-xs"} max-w-[8rem] text-center leading-tight text-ink-2`}
                  dir="ltr"
                >
                  {w.translation?.text}
                </span>
              )}
              {kids && (
                <span className="text-[11px] italic text-ink-3" dir="ltr">
                  {w.transliteration?.text}
                </span>
              )}
            </button>
          );
        })}
        <span className="quran self-center text-2xl text-gold" aria-hidden>
          ﴿{toArabicDigits(verse.verse_number)}﴾
        </span>
      </div>

      {selectedWord && (
        <WordCard
          verseKey={verse.verse_key}
          word={selectedWord}
          onPlay={() => onPlayWord(selectedWord)}
          onClose={() => onSelect(selectedWord.position)}
          lang={lang}
          tr={tr}
        />
      )}

      {lang === "en" && translation && (
        <p className={`mb-0 mt-4 ${kids ? "text-lg" : "text-base"} leading-relaxed text-ink`}>
          {translation}
        </p>
      )}

      <LessonPanel lesson={lesson} verseKey={verse.verse_key} defaultOpen={kids} lang={lang} tr={tr} />
    </li>
  );
}

function WordCard({
  verseKey,
  word,
  onPlay,
  onClose,
  lang,
  tr,
}: {
  verseKey: string;
  word: Word;
  onPlay: () => void;
  onClose: () => void;
  lang: "en" | "ar";
  tr: AyahProps["tr"];
}) {
  const note: WordNote | undefined = WORD_NOTES[`${verseKey}:${word.position}`];
  return (
    <div className="mt-3 rounded-2xl border border-gold bg-gold-soft/60 p-4" role="region">
      <div className="flex items-start gap-3">
        <span className="quran text-4xl text-ink" lang="ar">
          {word.text_uthmani}
        </span>
        <div className="min-w-0 flex-1">
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            <dt className="font-bold text-ink-2">{tr("transliteration")}</dt>
            <dd className="m-0 italic" dir="ltr">
              {word.transliteration?.text ?? "—"}
            </dd>
            <dt className="font-bold text-ink-2">{tr("wordMeaning")}</dt>
            <dd className="m-0" dir="ltr">
              {word.translation?.text ?? "—"}
            </dd>
            {note?.root && (
              <>
                <dt className="font-bold text-ink-2">{tr("root")}</dt>
                <dd className="m-0">
                  <span className="quran text-xl" lang="ar" dir="rtl">
                    {note.root}
                  </span>
                  {note.rootMeaning && (
                    <span className="ms-2 text-ink-2">{note.rootMeaning[lang]}</span>
                  )}
                </dd>
              </>
            )}
          </dl>
          {note?.kid?.[lang] && (
            <p className="mb-0 mt-2 rounded-xl bg-card px-3 py-2 text-base leading-snug">
              <span className="me-1">★</span>
              {note.kid[lang]}
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {word.audio_url && (
          <button
            type="button"
            onClick={onPlay}
            className="rounded-full bg-teal px-4 py-1.5 text-sm font-bold text-white"
          >
            🔊 {tr("hearWord")}
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-line bg-card px-4 py-1.5 text-sm font-bold"
        >
          {tr("close")}
        </button>
      </div>
    </div>
  );
}

function LessonPanel({
  lesson,
  verseKey,
  defaultOpen,
  lang,
  tr,
}: {
  lesson?: AyahLesson;
  verseKey: string;
  defaultOpen: boolean;
  lang: "en" | "ar";
  tr: AyahProps["tr"];
}) {
  const [tab, setTab] = useState<"lesson" | "story" | "visual">("lesson");
  const tabs: { id: typeof tab; label: string; show: boolean }[] = [
    { id: "lesson", label: tr("lesson"), show: true },
    { id: "story", label: tr("story"), show: !!lesson?.story },
    { id: "visual", label: tr("visual"), show: true },
  ];

  return (
    <details className="mt-4 rounded-xl bg-paper-2" open={defaultOpen}>
      <summary className="cursor-pointer select-none px-4 py-2 text-sm font-extrabold text-teal">
        {tr("lesson")} · {tr("visual")}
      </summary>
      <div className="px-4 pb-4">
        <div className="mb-3 flex gap-1" role="tablist">
          {tabs
            .filter((t) => t.show)
            .map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`rounded-full px-3 py-1 text-sm font-bold ${
                  tab === t.id ? "bg-teal text-white" : "bg-card text-ink-2"
                }`}
              >
                {t.label}
              </button>
            ))}
        </div>

        {tab === "lesson" &&
          (lesson ? (
            <>
              <p className="m-0 text-base leading-relaxed">{lesson.lesson[lang]}</p>
              {lesson.didYouKnow && (
                <p className="mb-0 mt-3 rounded-xl border border-line bg-card px-3 py-2 text-sm">
                  <strong>{tr("didYouKnow")}</strong> {lesson.didYouKnow[lang]}
                </p>
              )}
              <ReviewBadge status={lesson.status} tr={tr} />
            </>
          ) : (
            <Empty text={tr("comingSoon")} cta={tr("contribute")} verseKey={verseKey} />
          ))}

        {tab === "story" && lesson?.story && (
          <>
            <p className="m-0 text-base leading-relaxed">{lesson.story[lang]}</p>
            <ReviewBadge status={lesson.status} tr={tr} />
          </>
        )}

        {tab === "visual" &&
          (lesson?.media?.image || lesson?.media?.video ? (
            <div className="grid gap-3">
              {lesson.media.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={lesson.media.image.src}
                  alt={lesson.media.image.alt[lang]}
                  className="w-full rounded-xl"
                />
              )}
              {lesson.media.video && (
                <div className="aspect-video overflow-hidden rounded-xl">
                  <iframe
                    src={lesson.media.video.url}
                    title={lesson.media.video.title[lang]}
                    className="h-full w-full border-0"
                    allow="accelerometer; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          ) : (
            <Empty text={tr("noVisualYet")} cta={tr("contribute")} verseKey={verseKey} />
          ))}
      </div>
    </details>
  );
}

function ReviewBadge({ status, tr }: { status: "reviewed" | "draft"; tr: AyahProps["tr"] }) {
  return (
    <p
      className={`mb-0 mt-3 inline-block rounded-full px-3 py-0.5 text-xs font-bold ${
        status === "reviewed" ? "bg-teal-soft text-teal" : "bg-gold-soft text-ink-2"
      }`}
    >
      {status === "reviewed" ? "✓ " : "✎ "}
      {tr(status === "reviewed" ? "reviewed" : "draft")}
    </p>
  );
}

function Empty({ text, cta, verseKey }: { text: string; cta: string; verseKey: string }) {
  return (
    <div className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-ink-2">
      <p className="m-0">{text}</p>
      <Link
        href={`/about#contribute-${verseKey}`}
        className="mt-2 inline-block font-bold text-teal"
      >
        {cta}
      </Link>
    </div>
  );
}

function toArabicDigits(n: number) {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}
