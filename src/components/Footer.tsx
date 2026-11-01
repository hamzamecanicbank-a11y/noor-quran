"use client";

import { useSettings } from "@/lib/language";

export function Footer() {
  const { tr } = useSettings();
  return (
    <footer className="border-t border-line px-4 py-8 text-center text-sm text-ink-3">
      <p className="mx-auto m-0 max-w-xl">{tr("footer")}</p>
    </footer>
  );
}
