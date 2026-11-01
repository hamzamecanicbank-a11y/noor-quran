import type { Metadata } from "next";
import { Studio } from "@/components/Studio";

export const metadata: Metadata = { title: "Art Studio | Noor", robots: { index: false, follow: false } };

export default function StudioPage() {
  return <Studio />;
}
