import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[60svh] max-w-xl flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-7xl text-gold">404</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">We couldn’t find that page</h1>
        <p className="mt-3 text-ink/60">The link may be mistyped, or the invitation has been taken down by its owner.</p>
        <Link href="/" className="mt-7 inline-flex h-11 items-center rounded-full bg-brand px-6 font-medium text-white hover:bg-brand-dark">
          Back to home
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
