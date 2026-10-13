import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { TemplateCard } from "@/components/site/TemplateCard";
import { allCategories, categoryLabel } from "@/lib/categories";
import { getTemplates } from "@/lib/templates";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Wedding Invitation Templates — Edit Online & Share",
  description:
    "Browse professional digital wedding invitation templates: floral, minimal, luxury, nikah, Indian shaadi, boho and more. Edit text, fonts and colors, personalise for each guest, share by link or download as PDF.",
  alternates: { canonical: "/templates" },
  keywords: ["wedding invitation templates", "free wedding card templates", "digital wedding invitation", "editable wedding invitation"],
};

export default function TemplatesPage() {
  const templates = getTemplates();
  const cats = allCategories();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Wedding invitation templates",
    itemListElement: templates.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE.url}/templates/${t.slug}`,
      name: `${t.name} wedding invitation template`,
    })),
  };
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">Wedding invitation templates</h1>
        <p className="mt-3 max-w-2xl text-lg text-ink/65">
          {templates.length} professionally designed, fully editable invitations. Pick one, change the words, fonts and colors, and share it in minutes.
        </p>
        <nav aria-label="Categories" className="mt-8 flex flex-wrap gap-2">
          <span className="rounded-full bg-ink px-4 py-1.5 text-sm text-white">All</span>
          {cats.map((c) => (
            <Link
              key={c.slug}
              href={`/templates/category/${c.slug}`}
              className="rounded-full border border-line bg-white px-4 py-1.5 text-sm text-ink/70 transition hover:border-brand hover:text-brand"
            >
              {categoryLabel(c.slug)} <span className="text-ink/35">{c.count}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {templates.map((t, i) => (
            <TemplateCard key={t.slug} t={t} priority={i < 4} />
          ))}
        </div>
        <div className="mt-16 rounded-3xl border border-dashed border-gold/50 bg-white/60 p-8 text-center">
          <h2 className="font-display text-3xl font-semibold">Want something completely your own?</h2>
          <p className="mx-auto mt-2 max-w-lg text-ink/60">Start with a blank canvas and design every detail — text, photos, frames, florals and patterns.</p>
          <Link href="/create" className="mt-5 inline-flex h-11 items-center rounded-full bg-brand px-6 font-medium text-white hover:bg-brand-dark">
            Design from scratch
          </Link>
        </div>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
