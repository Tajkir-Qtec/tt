import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Download, Globe2, LayoutTemplate, Link2, Palette, Smartphone, Sparkles } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { TemplateCard } from "@/components/site/TemplateCard";
import { SITE } from "@/lib/site";
import { getTemplates } from "@/lib/templates";

const FAQ = [
  {
    q: "Is Marriage Cards really free?",
    a: "Yes. You can create, edit, share and download unlimited digital wedding invitations for free. Guests never need an account to view your card.",
  },
  {
    q: "How do I send a personal invitation to each guest?",
    a: "Add a “Dear {to}” text to your card, then add the guest's name to your link (for example ?to=Sarah+Khan). The card shows their name when they open it. You can generate hundreds of personal links at once from a pasted list of names.",
  },
  {
    q: "Can I download my wedding invitation as a PDF?",
    a: "Yes. Every card can be downloaded as a high-resolution, print-ready PDF — you or your guests can save it from the card page.",
  },
  {
    q: "Can I design my own invitation from scratch?",
    a: "Absolutely. Start from a blank canvas and add text, photos, shapes, frames, florals and patterns, or open any template and change every word, font, size and color.",
  },
  {
    q: "Does it work with Urdu, Arabic, Hindi and Bangla?",
    a: "Yes. The editor includes fonts for Arabic and Urdu (Nastaliq, Naskh, Kufi), Devanagari, Bengali, Gurmukhi and Tamil, alongside dozens of English script and serif fonts.",
  },
  {
    q: "How will guests see my invitation?",
    a: "You choose: a single image card, a page-turning flip card, or a smooth scrolling story. Guests open a simple link on any phone or computer.",
  },
];

const FEATURES = [
  { icon: LayoutTemplate, title: "Designer templates", text: "Elegant, modern layouts for every culture — floral, minimalist, Art Deco, Nikah, shaadi and more." },
  { icon: Palette, title: "Edit everything", text: "Change words, fonts, sizes and colors, swap photos, or re-theme the whole card with one color tap." },
  { icon: Sparkles, title: "Design from scratch", text: "A Canva-style canvas with frames, florals, dividers and patterns — build a card that is entirely yours." },
  { icon: Link2, title: "Personal links", text: "Add a guest's name to the link and their card greets them personally. Make 100 links in seconds." },
  { icon: Download, title: "PDF download", text: "Print-ready PDF for you and your guests, straight from the card page." },
  { icon: Smartphone, title: "Made for phones", text: "Edit on desktop or mobile. Guests get a fast, beautiful card on any screen — no sign-in." },
  { icon: Globe2, title: "Every language", text: "Urdu, Arabic, Hindi, Bangla, Tamil, Punjabi and Latin scripts with proper fonts." },
];

export default function Home() {
  const templates = getTemplates();
  const hero = ["midnight-gold", "blush-peony", "emerald-nikah"].map((s) => templates.find((t) => t.slug === s)!).filter(Boolean);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", name: SITE.name, url: SITE.url },
      { "@type": "Organization", name: SITE.name, url: SITE.url, logo: `${SITE.url}/icon.svg` },
      {
        "@type": "SoftwareApplication",
        name: SITE.name,
        applicationCategory: "DesignApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description: SITE.description,
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      <SiteHeader />
      <main>
        {/* hero */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_80%_0%,#f3dfe3_0%,transparent_60%),radial-gradient(60%_50%_at_0%_100%,#efe3c9_0%,transparent_60%)]" />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-20">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/60 px-3.5 py-1.5 text-xs font-medium tracking-wide text-ink/70">
                <span className="size-1.5 rounded-full bg-gold" /> Free digital wedding invitations
              </p>
              <h1 className="font-display text-[44px] font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                Invitations your guests will <em className="text-brand">keep</em>.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
                Choose a stunning template or design your own, personalise it for every guest, and share it with one link — or download a print-ready PDF.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/templates" className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-7 text-base font-medium text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark">
                  Browse templates <ArrowRight className="size-4" />
                </Link>
                <Link href="/create" className="inline-flex h-12 items-center rounded-full border border-ink/15 bg-white/70 px-7 text-base font-medium transition hover:bg-white">
                  Design your own
                </Link>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/60">
                {["Free to use", "No sign-in for guests", "Works on mobile", "PDF download"].map((x) => (
                  <li key={x} className="flex items-center gap-1.5">
                    <Check className="size-4 text-gold" /> {x}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative mx-auto h-[460px] w-full max-w-[520px] sm:h-[560px]" aria-hidden>
              {hero.map((t, i) => (
                <div
                  key={t.slug}
                  className="absolute w-[46%] overflow-hidden rounded-xl shadow-[0_24px_60px_rgba(50,30,20,.3)] ring-1 ring-black/5"
                  style={{
                    left: ["0%", "27%", "54%"][i],
                    top: ["12%", "0%", "16%"][i],
                    transform: `rotate(${[-7, 0, 7][i]}deg)`,
                    zIndex: i === 1 ? 2 : 1,
                  }}
                >
                  <Image src={`/templates/${t.slug}-0.jpg`} alt="" width={600} height={840} priority sizes="240px" className="h-auto w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* how it works */}
        <section className="border-y border-line bg-white/60">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
            {[
              ["1", "Pick a design", "Start from a professional template, or a blank canvas."],
              ["2", "Make it yours", "Edit words, fonts, colors and photos right on the card."],
              ["3", "Share with everyone", "Send one link, personal links for each guest, or a PDF."],
            ].map(([n, t, d]) => (
              <div key={n} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-gold/50 font-display text-xl text-gold">{n}</span>
                <div>
                  <h2 className="font-display text-2xl font-semibold">{t}</h2>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink/60">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* templates */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Wedding invitation templates</h2>
              <p className="mt-2 max-w-xl text-ink/60">Every design is fully editable. Change the names, date, venue, fonts and colors in a few taps.</p>
            </div>
            <Link href="/templates" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
              See all {templates.length} templates <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 lg:grid-cols-4">
            {templates.slice(0, 8).map((t, i) => (
              <TemplateCard key={t.slug} t={t} priority={i < 4} />
            ))}
          </div>
        </section>

        {/* personal links */}
        <section className="bg-ink text-white">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">One card. A personal greeting for every guest.</h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/70">
                Guests don’t need accounts or emails. Add their name to the link and the card says “Dear Sarah Khan” when they open it. Paste your guest list and copy
                every personal link in one go — then send them on WhatsApp, email or SMS.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="mb-3 text-xs uppercase tracking-widest text-white/50">Your link</p>
              <div className="break-all rounded-xl bg-black/30 p-4 font-mono text-sm text-white/90">
                marriagecards.app/c/amelia-and-james<span className="text-gold">?to=Sarah+Khan</span>
              </div>
              <div className="mt-6 rounded-2xl bg-paper p-6 text-center text-ink">
                <p className="font-display text-2xl italic text-ink/70">Dear Sarah Khan,</p>
                <p className="mt-2 font-display text-4xl text-brand">Amelia &amp; James</p>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-ink/50">request the pleasure of your company</p>
              </div>
            </div>
          </div>
        </section>

        {/* features */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="mb-12 text-center font-display text-4xl font-semibold tracking-tight sm:text-5xl">Everything for the perfect e-invite</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-line bg-white p-6 transition hover:shadow-md">
                <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <f.icon className="size-5" />
                </span>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink/60">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* faq */}
        <section className="border-t border-line bg-white/60">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <h2 className="mb-8 text-center font-display text-4xl font-semibold tracking-tight">Questions, answered</h2>
            <div className="divide-y divide-line rounded-2xl border border-line bg-white">
              {FAQ.map((f) => (
                <details key={f.q} className="group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium">
                    {f.q}
                    <span className="text-xl text-gold transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-ink/65">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">Your invitation is a few minutes away.</h2>
          <Link href="/templates" className="mt-8 inline-flex h-14 items-center gap-2 rounded-full bg-brand px-9 text-lg font-medium text-white shadow-lg shadow-brand/25 hover:bg-brand-dark">
            Start designing — it’s free <ArrowRight className="size-5" />
          </Link>
        </section>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
