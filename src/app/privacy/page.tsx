import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default function Privacy() {
  return (
    <>
      <SiteHeader />
      <main className="prose-page mx-auto max-w-3xl px-4 py-14 sm:px-6 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-ink/70 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-ink/70">
        <h1 className="font-display text-5xl font-semibold">Privacy Policy</h1>
        <p>This is a plain-language summary of how Marriage Cards handles information. Replace it with your final legal text before launch.</p>
        <h2>What we store</h2>
        <ul>
          <li>Your account (name, email) through Firebase Authentication.</li>
          <li>The invitation designs, photos and event details you create.</li>
          <li>A simple count of how many times a published card has been opened.</li>
        </ul>
        <h2>Guests</h2>
        <p>
          Guests who open a card link do not need an account and are not tracked individually. A guest name in a link (for example <code>?to=Sarah</code>) is shown only on that
          visitor’s screen and is not stored.
        </p>
        <h2>Public cards</h2>
        <p>Published cards can be opened by anyone who has the link. They are set to “noindex” so search engines are asked not to list them. Unpublish or delete a card at any time to remove access.</p>
        <h2>Contact</h2>
        <p>Questions? Reach us through the contact details on the site.</p>
      </main>
      <SiteFooter />
    </>
  );
}
