"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Eye, ExternalLink, Pencil, Plus, Share2, Trash2, Users } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import { SharePanel } from "@/components/share/SharePanel";
import { useRequireAuth } from "@/components/auth/AuthProvider";
import { Btn, Modal, Spinner, Toast } from "@/components/ui/kit";
import { api } from "@/lib/client/api";
import { hasGuestToken } from "@/lib/design/layers";
import type { CardDesign } from "@/lib/design/types";

interface Summary {
  id: string;
  slug: string;
  title: string;
  templateSlug: string | null;
  viewMode: string;
  published: boolean;
  previewId: string | null;
  views: number;
  pageCount: number;
  updatedAt: string;
  adminHidden?: boolean;
  rsvp?: { coming: number; people: number; declined: number };
}

function thumb(c: Summary) {
  if (c.previewId) return `/api/media/${c.previewId}`;
  if (c.templateSlug) return `/templates/${c.templateSlug}-0.jpg`;
  return null;
}

export default function Dashboard() {
  const auth = useRequireAuth();
  const router = useRouter();
  const [cards, setCards] = useState<Summary[] | null>(null);
  const [error, setError] = useState("");
  const [share, setShare] = useState<{ card: Summary; slot: boolean } | null>(null);
  const [del, setDel] = useState<Summary | null>(null);
  const [toast, setToast] = useState("");

  const load = useCallback(() => {
    api<{ cards: Summary[] }>("/api/cards")
      .then((r) => setCards(r.cards))
      .catch((e) => setError(e.message));
  }, []);
  useEffect(() => {
    if (auth.user) load();
  }, [auth.user, load]);

  const openShare = async (c: Summary) => {
    try {
      const { card } = await api<{ card: { design: CardDesign } }>(`/api/cards/${c.id}`);
      setShare({ card: c, slot: hasGuestToken(card.design.pages) });
    } catch {
      setShare({ card: c, slot: true });
    }
  };

  const duplicate = async (c: Summary) => {
    try {
      await api(`/api/cards/${c.id}/duplicate`, { method: "POST" });
      load();
      setToast("Card duplicated");
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Could not duplicate");
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-[70svh] max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl font-semibold tracking-tight">My cards</h1>
            <p className="mt-1 text-ink/60">{auth.user?.name ? `Welcome, ${auth.user.name.split(" ")[0]}.` : "Welcome back."} Your invitations live here.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/create">
              <Btn>Blank canvas</Btn>
            </Link>
            <Link href="/templates">
              <Btn variant="primary">
                <Plus className="size-4" /> New from template
              </Btn>
            </Link>
          </div>
        </div>

        {error && <p className="mt-8 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
        {!cards && !error && (
          <div className="mt-16 flex justify-center">
            <Spinner className="size-6 text-ink/40" />
          </div>
        )}
        {cards && cards.length === 0 && (
          <div className="mt-12 rounded-3xl border border-dashed border-gold/50 bg-white/60 p-12 text-center">
            <h2 className="font-display text-3xl font-semibold">Create your first invitation</h2>
            <p className="mx-auto mt-2 max-w-md text-ink/60">Choose a professional template and make it yours, or start from a blank canvas.</p>
            <Link href="/templates" className="mt-6 inline-flex h-11 items-center rounded-full bg-brand px-6 font-medium text-white hover:bg-brand-dark">
              Browse templates
            </Link>
          </div>
        )}
        {cards && cards.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {cards.map((c) => {
              const src = thumb(c);
              return (
                <div key={c.id} className="group">
                  <Link href={`/editor/${c.id}`} className="relative block aspect-[5/7] overflow-hidden rounded-xl bg-paper-3 shadow-[0_2px_12px_rgba(60,40,20,.12)] ring-1 ring-black/5 transition group-hover:shadow-[0_14px_36px_rgba(60,40,20,.22)]">
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={src} alt={c.title} className="size-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex size-full items-center justify-center text-sm text-ink/40">Blank card</div>
                    )}
                    <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${c.published ? "bg-green-600 text-white" : "bg-white/90 text-ink/60"}`}>
                      {c.adminHidden ? "Taken down" : c.published ? "Live" : "Draft"}
                    </span>
                  </Link>
                  <div className="mt-3">
                    <h3 className="truncate font-medium">{c.title}</h3>
                    <p className="mt-0.5 flex items-center gap-3 text-xs text-ink/50">
                      <span>{c.pageCount} {c.pageCount === 1 ? "page" : "pages"}</span>
                      {c.published && (
                        <span className="flex items-center gap-1">
                          <Eye className="size-3.5" /> {c.views}
                        </span>
                      )}
                    </p>
                    {c.published && (
                      <Link href={`/guests/${c.id}`} className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-800 hover:bg-green-100">
                        <Users className="size-3.5" /> {c.rsvp?.people ?? 0} coming{(c.rsvp?.declined ?? 0) > 0 ? ` · ${c.rsvp?.declined} can’t` : ""}
                      </Link>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-0.5">
                    <Btn size="sm" variant="ghost" onClick={() => router.push(`/editor/${c.id}`)}>
                      <Pencil className="size-3.5" /> Edit
                    </Btn>
                    {c.published && (
                      <Btn size="sm" variant="ghost" onClick={() => openShare(c)}>
                        <Share2 className="size-3.5" /> Share
                      </Btn>
                    )}
                    <Btn size="sm" variant="ghost" className="px-2" onClick={() => duplicate(c)} aria-label="Duplicate" title="Duplicate">
                      <Copy className="size-3.5" />
                    </Btn>
                    <Btn size="sm" variant="ghost" className="px-2 hover:!text-red-600" onClick={() => setDel(c)} aria-label="Delete" title="Delete">
                      <Trash2 className="size-3.5" />
                    </Btn>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <SiteFooter />

      <Modal open={!!share} onClose={() => setShare(null)} title="Share your invitation" wide>
        {share && (
          <>
            <SharePanel slug={share.card.slug} title={share.card.title} hasGuestSlot={share.slot} />
            <a href={`/c/${share.card.slug}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm text-brand hover:underline">
              <ExternalLink className="size-4" /> View as a guest
            </a>
          </>
        )}
      </Modal>

      <Modal open={!!del} onClose={() => setDel(null)} title="Delete this card?">
        <p className="text-ink/70">
          “{del?.title}” will be permanently deleted{del?.published ? ", and its public link will stop working" : ""}. This can’t be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Btn onClick={() => setDel(null)}>Cancel</Btn>
          <Btn
            variant="primary"
            className="!bg-red-600 hover:!bg-red-700"
            onClick={async () => {
              if (!del) return;
              try {
                await api(`/api/cards/${del.id}`, { method: "DELETE" });
                setCards((cs) => cs?.filter((x) => x.id !== del.id) ?? null);
              } catch (e) {
                setToast(e instanceof Error ? e.message : "Could not delete");
              }
              setDel(null);
            }}
          >
            Delete card
          </Btn>
        </div>
      </Modal>
      {toast && <Toast message={toast} onDone={() => setToast("")} />}
    </>
  );
}
