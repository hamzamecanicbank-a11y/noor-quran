import { del, list } from "@vercel/blob";
import { artPath, isAuthorized } from "@/lib/art";

export async function POST(req: Request) {
  if (!isAuthorized(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json()) as { verseKey?: string };
  if (!body.verseKey || !/^\d+:\d+$/.test(body.verseKey))
    return Response.json({ error: "verseKey is required" }, { status: 400 });
  const found = await list({ prefix: artPath(body.verseKey), limit: 1 });
  if (found.blobs[0]) await del(found.blobs[0].url);
  return Response.json({ ok: true });
}
