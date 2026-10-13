import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";

export const metadata: Metadata = { title: "Terms of Use", alternates: { canonical: "/terms" } };

export default function Terms() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-ink/70">
        <h1 className="font-display text-5xl font-semibold">Terms of Use</h1>
        <p>A short summary of the rules for using Marriage Cards. Replace it with your final legal text before launch.</p>
        <h2>Your content</h2>
        <p>You own the invitations and photos you create. You confirm you have the right to use any text and images you upload, and that they are not unlawful, hateful or misleading.</p>
        <h2>Acceptable use</h2>
        <p>Don’t use the service to harass others, spread spam or impersonate people. We may remove cards that break these rules.</p>
        <h2>Availability</h2>
        <p>The service is provided as-is and may change. Keep a PDF copy of any card you rely on.</p>
      </main>
      <SiteFooter />
    </>
  );
}
