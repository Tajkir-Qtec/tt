"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Btn } from "@/components/ui/kit";

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Marriage Cards home">
      <span className="flex size-8 items-center justify-center rounded-[10px] bg-brand">
        <svg viewBox="0 0 64 64" className="size-5" aria-hidden>
          <path d="M32 49C14 36 15 22 24 18c4-1.6 7 .5 8 4 1-3.5 4-5.6 8-4 9 4 10 18-8 31z" fill="#fbf8f3" />
        </svg>
      </span>
      <span className={`font-display text-[22px] font-semibold tracking-tight ${light ? "text-white" : "text-ink"}`}>Marriage Cards</span>
    </Link>
  );
}

export function SiteHeader() {
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/templates", label: "Templates" },
    { href: "/create", label: "Design your own" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-full px-4 py-2 text-sm text-ink/75 transition hover:bg-ink/5 hover:text-ink">
              {l.label}
            </Link>
          ))}
          <div className="mx-2 h-5 w-px bg-line" />
          {loading ? null : user ? (
            <>
              <Link href="/dashboard" className="rounded-full px-4 py-2 text-sm text-ink/75 hover:bg-ink/5">
                My cards
              </Link>
              <Btn size="sm" variant="ghost" onClick={() => signOut()}>
                Sign out
              </Btn>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-4 py-2 text-sm text-ink/75 hover:bg-ink/5">
                Sign in
              </Link>
              <Link href="/templates">
                <Btn size="sm" variant="primary">
                  Start free
                </Btn>
              </Link>
            </>
          )}
        </nav>
        <button className="rounded-lg p-2 md:hidden" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-line bg-paper px-4 pb-4 md:hidden">
          {[...links, user ? { href: "/dashboard", label: "My cards" } : { href: "/login", label: "Sign in" }].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block border-b border-line/60 py-3 text-[15px]">
              {l.label}
            </Link>
          ))}
          {user && (
            <button className="block w-full py-3 text-left text-[15px] text-ink/70" onClick={() => signOut()}>
              Sign out
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-2">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/60">
            Beautiful digital wedding invitations you can personalise for every guest, share in one tap and download as a PDF.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink/50">Explore</h3>
          <ul className="space-y-2 text-sm text-ink/75">
            <li><Link href="/templates" className="hover:text-brand">Wedding invitation templates</Link></li>
            <li><Link href="/templates?category=islamic" className="hover:text-brand">Nikah & Islamic invitations</Link></li>
            <li><Link href="/templates?category=indian" className="hover:text-brand">Indian shaadi cards</Link></li>
            <li><Link href="/create" className="hover:text-brand">Design from scratch</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink/50">Company</h3>
          <ul className="space-y-2 text-sm text-ink/75">
            <li><Link href="/privacy" className="hover:text-brand">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-brand">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-ink/45">© {new Date().getFullYear()} Marriage Cards. Made with love for every celebration.</div>
    </footer>
  );
}
