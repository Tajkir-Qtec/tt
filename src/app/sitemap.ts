import type { MetadataRoute } from "next";
import { allCategories } from "@/lib/categories";
import { SITE } from "@/lib/site";
import { getTemplates } from "@/lib/templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/templates`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/create`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/upload`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...allCategories().map((c) => ({ url: `${SITE.url}/templates/category/${c.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...getTemplates().map((t) => ({ url: `${SITE.url}/templates/${t.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${SITE.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE.url}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
