import { put } from "@vercel/blob";
import { artPath, isAuthorized } from "@/lib/art";

export async function POST(req: Request) {
  if (!isAuthorized(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json()) as { verseKey?: string; data?: string; mimeType?: string };
  if (!body.verseKey || !/^\d+:\d+$/.test(body.verseKey) || !body.data)
    return Response.json({ error: "verseKey and data are required" }, { status: 400 });
  const bytes = Buffer.from(body.data, "base64");
  const blob = await put(artPath(body.verseKey), bytes, {
    access: "public",
    contentType: body.mimeType ?? "image/png",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
  return Response.json({ url: blob.url });
}
