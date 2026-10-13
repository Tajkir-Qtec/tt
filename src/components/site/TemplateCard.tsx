import Image from "next/image";
import Link from "next/link";
import type { TemplateDef } from "@/lib/templates";

export function TemplateCard({ t, priority }: { t: Pick<TemplateDef, "slug" | "name" | "tagline" | "palette" | "categories" | "pages">; priority?: boolean }) {
  return (
    <Link href={`/templates/${t.slug}`} className="group block">
      <div className="relative aspect-[5/7] overflow-hidden rounded-xl bg-paper-3 shadow-[0_2px_12px_rgba(60,40,20,.12)] ring-1 ring-black/5 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_rgba(60,40,20,.22)]">
        <Image
          src={`/templates/${t.slug}-0.jpg`}
          alt={`${t.name} wedding invitation template — ${t.tagline}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
          priority={priority}
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-ink shadow-sm backdrop-blur">
          {t.pages.length} pages
        </span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-display text-xl font-semibold leading-tight">{t.name}</h3>
          <p className="mt-0.5 line-clamp-1 text-[13px] text-ink/55">{t.categories.slice(0, 2).join(" · ")}</p>
        </div>
        <div className="mt-1.5 flex shrink-0 -space-x-1.5">
          {t.palette.slice(0, 4).map((c) => (
            <span key={c} className="size-4 rounded-full border border-white shadow-sm" style={{ background: c }} />
          ))}
        </div>
      </div>
    </Link>
  );
}
