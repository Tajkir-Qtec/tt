import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { TemplateCard } from "@/components/site/TemplateCard";
import { CATEGORY_INFO, allCategories, categoryLabel } from "@/lib/categories";
import { getTemplates } from "@/lib/templates";

export function generateStaticParams() {
  return allCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/templates/category/[category]">): Promise<Metadata> {
  const { category } = await params;
  const info = CATEGORY_INFO[category];
  const label = categoryLabel(category);
  return {
    title: info?.h1 ?? `${label} Wedding Invitation Templates`,
    description: info?.intro ?? `Browse ${label.toLowerCase()} wedding invitation templates. Edit online, personalise per guest and share or download as PDF.`,
    keywords: info?.keywords,
    alternates: { canonical: `/templates/category/${category}` },
  };
}

export default async function CategoryPage({ params }: PageProps<"/templates/category/[category]">) {
  const { category } = await params;
  const templates = getTemplates().filter((t) => t.categories.includes(category));
  if (!templates.length) notFound();
  const info = CATEGORY_INFO[category];
  const cats = allCategories();
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink/50">
          <Link href="/templates" className="hover:text-brand">
            Templates
          </Link>{" "}
          / {categoryLabel(category)}
        </nav>
        <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">{info?.h1 ?? `${categoryLabel(category)} Wedding Invitation Templates`}</h1>
        <p className="mt-3 max-w-2xl text-lg text-ink/65">{info?.intro}</p>
        <nav aria-label="Categories" className="mt-8 flex flex-wrap gap-2">
          <Link href="/templates" className="rounded-full border border-line bg-white px-4 py-1.5 text-sm text-ink/70 hover:border-brand hover:text-brand">
            All
          </Link>
          {cats.map((c) => (
            <Link
              key={c.slug}
              href={`/templates/category/${c.slug}`}
              className={
                c.slug === category
                  ? "rounded-full bg-ink px-4 py-1.5 text-sm text-white"
                  : "rounded-full border border-line bg-white px-4 py-1.5 text-sm text-ink/70 hover:border-brand hover:text-brand"
              }
            >
              {categoryLabel(c.slug)}
            </Link>
          ))}
        </nav>
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {templates.map((t, i) => (
            <TemplateCard key={t.slug} t={t} priority={i < 4} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
