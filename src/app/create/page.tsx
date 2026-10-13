import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { UseTemplateButton } from "@/components/site/UseTemplate";
import { SIZE_PRESETS } from "@/lib/design/types";

export const metadata: Metadata = {
  title: "Design Your Own Wedding Invitation — Free Online Card Maker",
  description:
    "Start from a blank canvas and design your own wedding invitation: add text, photos, frames, florals and patterns, pick any font and color, then share online or download a PDF.",
  alternates: { canonical: "/create" },
  keywords: ["design wedding invitation", "wedding card maker online", "create invitation from scratch", "custom wedding card design"],
};

const SHAPES: Record<string, string> = {
  portrait: "aspect-[5/7] w-16",
  tall: "aspect-[4/9] w-12",
  square: "aspect-square w-20",
  story: "aspect-[9/16] w-14",
  landscape: "aspect-[7/5] w-24",
};

export default function CreatePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">Design your own invitation</h1>
        <p className="mt-3 max-w-2xl text-lg text-ink/65">
          Choose a size and start with a blank canvas. Add text, photos, frames, florals, dividers and patterns — every detail is yours.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SIZE_PRESETS.map((s) => (
            <div key={s.id} className="flex flex-col items-center rounded-3xl border border-line bg-white p-6 text-center">
              <div className="flex h-32 items-center justify-center">
                <div className={`${SHAPES[s.id]} rounded-sm border border-line bg-paper-2 shadow-md`} />
              </div>
              <h2 className="mt-4 font-medium">{s.label}</h2>
              <p className="text-xs text-ink/45">
                {s.width} × {s.height} px
              </p>
              <UseTemplateButton blank={{ width: s.width, height: s.height }} label="Start designing" size="md" className="mt-4" />
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-ink/55">
          Prefer a head start? <Link href="/templates" className="text-brand underline">Browse professional templates</Link>.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
