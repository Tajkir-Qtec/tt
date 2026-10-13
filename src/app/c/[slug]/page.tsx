import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CardViewer } from "@/components/viewer/CardViewer";
import { connectDB } from "@/lib/server/db";
import { Card } from "@/lib/server/models";
import { SITE } from "@/lib/site";
import type { CardDesign, CardMeta, ViewMode } from "@/lib/design/types";
import type { EnvelopeColorId } from "@/lib/envelopes";

interface PublicCard {
  slug: string;
  title: string;
  design: CardDesign;
  viewMode: ViewMode;
  meta: CardMeta;
  previewId: string | null;
  rsvpEnabled: boolean;
  envelope: { enabled: boolean; color: EnvelopeColorId };
}

async function getCard(slug: string): Promise<PublicCard | null> {
  if (!/^[a-z0-9-]{3,80}$/.test(slug)) return null;
  await connectDB();
  const c = await Card.findOne({ slug, published: true, adminHidden: { $ne: true } }).select("slug title design viewMode meta previewId rsvpEnabled envelope").lean();
  if (!c) return null;
  // Strip Mongo-specific values so the object can cross the server→client boundary.
  return JSON.parse(
    JSON.stringify({
      slug: c.slug,
      title: c.title,
      design: c.design,
      viewMode: c.viewMode,
      meta: c.meta,
      previewId: c.previewId,
      rsvpEnabled: c.rsvpEnabled ?? true,
      envelope: { enabled: c.envelope?.enabled ?? true, color: c.envelope?.color ?? "ivory" },
    }),
  );
}

function describe(c: PublicCard) {
  const m = c.meta;
  const names = m.coupleNames?.trim();
  const when = m.eventDate ? new Date(m.eventDate + "T12:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }) : "";
  const where = [m.venue, m.city].filter(Boolean).join(", ");
  const head = names ? `${names} are getting married` : "You’re invited";
  const parts = [head, when && `on ${when}`, where && `at ${where}`].filter(Boolean).join(" ");
  return { names, title: names ? `You’re invited — ${names}` : c.title, description: m.description?.trim() || `${parts}. Open your invitation.` };
}

export async function generateMetadata({ params }: PageProps<"/c/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const card = await getCard(slug);
  if (!card) return { title: "Invitation not found", robots: { index: false } };
  const d = describe(card);
  const image = card.previewId ? `${SITE.url}/api/media/${card.previewId}` : undefined;
  return {
    title: d.title,
    description: d.description,
    // Invitations contain personal details; keep them out of search results (link previews still work).
    robots: { index: false, follow: false, nocache: true },
    openGraph: { type: "website", title: d.title, description: d.description, images: image ? [{ url: image, width: 1200, height: 630 }] : undefined, siteName: SITE.name },
    twitter: { card: "summary_large_image", title: d.title, description: d.description, images: image ? [image] : undefined },
  };
}

export default async function PublicCardPage({ params }: PageProps<"/c/[slug]">) {
  const { slug } = await params;
  const card = await getCard(slug);
  if (!card) notFound();
  const d = describe(card);
  return (
    <>
      <Suspense fallback={<div className="min-h-svh bg-[#2a2420]" />}>
        <CardViewer
          design={card.design}
          viewMode={card.viewMode}
          title={card.title}
          slug={card.slug}
          rsvpEnabled={card.rsvpEnabled}
          envelope={card.envelope}
          coupleNames={card.meta?.coupleNames ?? ""}
        />
      </Suspense>
      {/* Readable text for screen readers and link unfurlers; the card itself is drawn as images. */}
      <section className="sr-only">
        <h1>{d.title}</h1>
        <p>{d.description}</p>
      </section>
    </>
  );
}
