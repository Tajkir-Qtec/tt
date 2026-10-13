import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { TemplateCard } from "@/components/site/TemplateCard";
import { UseTemplateButton } from "@/components/site/UseTemplate";
import { categoryLabel } from "@/lib/categories";
import { SITE } from "@/lib/site";
import { getTemplate, getTemplates } from "@/lib/templates";

export function generateStaticParams() {
  return getTemplates().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/templates/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) return {};
  const title = `${t.name} Wedding Invitation Template`;
  return {
    title,
    description: `${t.description} Edit online for free, personalise for each guest, share by link or download as PDF.`,
    keywords: t.keywords,
    alternates: { canonical: `/templates/${t.slug}` },
    openGraph: { title, description: t.description, images: [{ url: `/templates/${t.slug}-0.jpg`, width: 600, height: 840 }], type: "website" },
    twitter: { card: "summary_large_image", title, description: t.description, images: [`/templates/${t.slug}-0.jpg`] },
  };
}

const PAGE_NAMES = ["cover", "details", "photo page", "page 4"];

export default async function TemplatePage({ params }: PageProps<"/templates/[slug]">) {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) notFound();
  const related = getTemplates()
    .filter((o) => o.slug !== t.slug)
    .map((o) => ({ o, score: o.categories.filter((c) => t.categories.includes(c)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => x.o);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${t.name} wedding invitation template`,
    description: t.description,
    image: `${SITE.url}/templates/${t.slug}-0.jpg`,
    url: `${SITE.url}/templates/${t.slug}`,
    keywords: t.keywords.join(", "),
    isAccessibleForFree: true,
  };
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink/50">
          <Link href="/templates" className="hover:text-brand">
            Templates
          </Link>{" "}
          / {t.name}
        </nav>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {t.pages.map((_, i) => (
              <div
                key={i}
                className={`relative aspect-[5/7] overflow-hidden rounded-xl bg-paper-3 shadow-[0_6px_28px_rgba(60,40,20,.18)] ring-1 ring-black/5 ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              >
                <Image
                  src={`/templates/${t.slug}-${i}.jpg`}
                  alt={`${t.name} wedding invitation template — ${PAGE_NAMES[i] ?? `page ${i + 1}`}`}
                  fill
                  sizes={i === 0 ? "(max-width: 1024px) 90vw, 440px" : "220px"}
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{t.categories.map(categoryLabel).join(" · ")}</p>
            <h1 className="mt-2 font-display text-5xl font-semibold leading-[1.05] tracking-tight">{t.name} wedding invitation template</h1>
            <p className="mt-4 text-lg leading-relaxed text-ink/70">{t.description}</p>
            <ul className="mt-6 space-y-2.5 text-[15px] text-ink/75">
              {[
                `${t.pages.length} pages: invitation, details${t.pages.length > 2 ? " and photo page" : ""}`,
                "Edit every word, font, size and color",
                "Share as a flip card, scrolling story or single image",
                "Personal guest links and PDF download",
              ].map((x) => (
                <li key={x} className="flex gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" /> {x}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-ink/45">Palette</span>
              {t.palette.map((c) => (
                <span key={c} className="size-6 rounded-full border border-black/10" style={{ background: c }} title={c} />
              ))}
            </div>
            <UseTemplateButton templateSlug={t.slug} className="mt-8" />
            <p className="mt-3 text-sm text-ink/50">Free. You’ll be asked to sign in so we can save your card.</p>
          </div>
        </div>

        <section className="mt-20">
          <h2 className="mb-6 font-display text-3xl font-semibold">More templates you may like</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {related.map((o) => (
              <TemplateCard key={o.slug} t={o} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
