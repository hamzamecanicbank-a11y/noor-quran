// Server-only helpers for the art Studio: prompt building, Gemini image
// generation, and the storage layout for approved pictures.

import { getSurah } from "@/data/surahs";
import { THEME_LABEL, themeForAyah } from "@/data/themes";
import { AYAH_LESSONS } from "@/data/lessons";

export type ArtStyle = "sketch" | "cartoon";

export const STYLES: Record<ArtStyle, string> = {
  sketch:
    "a gentle pencil sketch for a children's book: soft graphite lines, light cross-hatching, warm cream paper, a few touches of watercolour wash",
  cartoon:
    "a friendly flat cartoon for young children: rounded shapes, thick clean outlines, soft pastel colours (teal, gold, sand, sky blue), simple composition",
};

// Hard rules that go into every prompt. Kept explicit and repetitive on purpose.
const RULES = `STRICT RULES:
- Do not draw any human beings at all: no people, no faces, no hands, no silhouettes, no crowds.
- Never depict God, prophets, messengers, angels, or companions in any form.
- No text, letters, calligraphy, numbers or Arabic script anywhere in the image.
- Nothing frightening: no fire, weapons, blood, monsters or dark scary scenes.
- Show the scene through nature, animals, objects, landscapes, sky, light and symbols.
- Square image, uncluttered, suitable for a child aged 5 to 10.`;

export function buildPrompt(verseKey: string, translation: string, style: ArtStyle): string {
  const [s] = verseKey.split(":").map(Number);
  const surah = getSurah(s);
  const theme = themeForAyah(verseKey, translation);
  const lesson = AYAH_LESSONS[verseKey]?.lesson.en;
  return [
    `Illustrate the meaning of a verse from the Quran for children, in the style of ${STYLES[style]}.`,
    `Surah: ${surah?.name ?? s} (${surah?.en ?? ""}).`,
    `Verse meaning (English): "${translation}"`,
    `Visual theme: ${THEME_LABEL[theme].en}.`,
    lesson ? `The lesson children should feel: ${lesson}` : "",
    RULES,
  ]
    .filter(Boolean)
    .join("\n");
}

const MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image";

export async function generateImage(prompt: string): Promise<{ mimeType: string; data: string }> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "1:1" } },
      }),
    },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini ${res.status}: ${text.slice(0, 300)}`);
  }
  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { inlineData?: { mimeType: string; data: string } }[] } }[];
    promptFeedback?: { blockReason?: string };
  };
  const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part?.inlineData) {
    throw new Error(
      json.promptFeedback?.blockReason
        ? `Blocked by Gemini: ${json.promptFeedback.blockReason}`
        : "Gemini returned no image",
    );
  }
  return part.inlineData;
}

/** Blob path for an approved picture. One picture per ayah. */
export function artPath(verseKey: string) {
  const [s, a] = verseKey.split(":");
  return `art/${s}/${a}.png`;
}

export function isAuthorized(req: Request): boolean {
  const expected = process.env.STUDIO_PASSWORD;
  if (!expected) return false;
  const given = req.headers.get("x-studio-password") ?? "";
  return given.length === expected.length && given === expected;
}
