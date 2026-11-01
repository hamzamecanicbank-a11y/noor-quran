import { list } from "@vercel/blob";

// Public: which ayahs of a surah have approved art, and where it lives.
export async function GET(req: Request) {
  const surah = Number(new URL(req.url).searchParams.get("surah"));
  if (!Number.isInteger(surah) || surah < 1 || surah > 114)
    return Response.json({ error: "surah must be 1-114" }, { status: 400 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return Response.json({ art: {} });
  const out: Record<string, string> = {};
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: `art/${surah}/`, cursor, limit: 1000 });
    for (const b of page.blobs) {
      const m = b.pathname.match(/^art\/(\d+)\/(\d+)\.png$/);
      if (m) out[`${m[1]}:${m[2]}`] = b.url;
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return Response.json({ art: out }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
