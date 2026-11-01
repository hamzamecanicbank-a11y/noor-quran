import { buildPrompt, generateImage, isAuthorized, type ArtStyle } from "@/lib/art";

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!isAuthorized(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json()) as { verseKey?: string; translation?: string; style?: ArtStyle; extra?: string };
  if (!body.verseKey || !/^\d+:\d+$/.test(body.verseKey) || !body.translation)
    return Response.json({ error: "verseKey and translation are required" }, { status: 400 });
  const style: ArtStyle = body.style === "cartoon" ? "cartoon" : "sketch";
  const prompt = buildPrompt(body.verseKey, body.translation, style) + (body.extra ? `\nExtra direction: ${body.extra}` : "");
  try {
    const img = await generateImage(prompt);
    return Response.json({ ...img, prompt });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 502 });
  }
}
