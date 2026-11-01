import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Reader } from "@/components/Reader";
import { SURAHS, getSurah } from "@/data/surahs";

export function generateStaticParams() {
  return SURAHS.map((s) => ({ id: String(s.n) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const s = getSurah(Number(id));
  if (!s) return {};
  return {
    title: `${s.name} (${s.ar}) — ${s.en} | Noor`,
    description: `Read Surah ${s.name} word by word with meanings, audio and lessons for children and new learners.`,
  };
}

export default async function SurahPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1 || n > 114) notFound();
  return <Reader surahNumber={n} />;
}
