import { Hero } from "@/components/Hero";
import { SurahGrid } from "@/components/SurahGrid";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20">
      <Hero />
      <SurahGrid />
    </div>
  );
}
