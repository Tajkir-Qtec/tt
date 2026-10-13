"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Phone, Search, Trash2, Users } from "lucide-react";
import { clsx } from "clsx";
import { SiteHeader } from "@/components/site/SiteChrome";
import { useRequireAuth } from "@/components/auth/AuthProvider";
import { Btn, Modal, Spinner } from "@/components/ui/kit";
import { api } from "@/lib/client/api";

interface Item {
  id: string;
  attending: boolean;
  maybe: boolean;
  name: string;
  phone: string;
  guests: number;
  fromLink: string;
  at: string;
}
interface Data {
  card: { id: string; title: string; slug: string; published: boolean; rsvpEnabled: boolean };
  summary: { comingResponses: number; comingPeople: number; notComing: number; maybe: number; total: number };
  items: Item[];
}

export default function GuestList({ id }: { id: string }) {
  const auth = useRequireAuth();
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"all" | "yes" | "maybe" | "no">("all");
  const [q, setQ] = useState("");
  const [del, setDel] = useState<Item | null>(null);

  const load = useCallback(() => {
    api<Data>(`/api/cards/${id}/rsvps`)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [id]);
  useEffect(() => {
    if (!auth.user) return;
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, [auth.user, load]);

  const items = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data?.items ?? []).filter((i) => (tab === "all" || (tab === "yes" ? i.attending : tab === "maybe" ? i.maybe : !i.attending && !i.maybe)) && (!term || i.name.toLowerCase().includes(term) || i.phone.includes(term)));
  }, [data, tab, q]);

  const exportCsv = async () => {
    const blob = await fetch(`/api/cards/${id}/rsvps/export`, { headers: await authHeader() }).then((r) => r.blob());
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `guest-list-${data?.card.slug ?? "card"}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-[70svh] max-w-4xl px-4 py-10 sm:px-6">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-brand">
          <ArrowLeft className="size-4" /> My cards
        </Link>
        {error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
        {!data && !error && (
          <div className="mt-16 flex justify-center">
            <Spinner className="size-6 text-ink/40" />
          </div>
        )}
        {data && (
          <>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Guest list</h1>
            <p className="mt-1 text-ink/60">{data.card.title}</p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="People coming" value={data.summary.comingPeople} tone="green" sub={`${data.summary.comingResponses} ${data.summary.comingResponses === 1 ? "reply" : "replies"}`} />
              <Stat label="Can’t make it" value={data.summary.notComing} tone="rose" sub={data.summary.notComing === 1 ? "reply" : "replies"} />
              <Stat label="Not sure yet" value={data.summary.maybe} tone="ink" sub={data.summary.maybe === 1 ? "reply" : "replies"} />
              <Stat label="Total replies" value={data.summary.total} tone="ink" sub="so far" />
            </div>

            {!data.card.published && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">This card isn’t published yet, so guests can’t reply.</p>}
            {data.card.published && !data.card.rsvpEnabled && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Replies are switched off for this card. Turn them on in the editor → Details.</p>}

            <div className="mt-8 flex flex-wrap items-center gap-2">
              <div className="flex rounded-full border border-line bg-white p-0.5 text-sm">
                {(
                  [
                    ["all", `All (${data.summary.total})`],
                    ["yes", `Coming (${data.summary.comingResponses})`],
                    ["maybe", `Maybe (${data.summary.maybe})`],
                    ["no", `Can’t make it (${data.summary.notComing})`],
                  ] as const
                ).map(([k, label]) => (
                  <button key={k} onClick={() => setTab(k)} className={clsx("rounded-full px-3.5 py-1.5 transition", tab === k ? "bg-ink text-white" : "text-ink/65 hover:text-ink")}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="relative ml-auto min-w-[180px] flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or phone" className="h-10 w-full rounded-full border border-line bg-white pl-9 pr-3 text-sm outline-none focus:border-brand sm:w-64" />
              </div>
              <Btn size="sm" onClick={exportCsv} disabled={!data.items.length}>
                <Download className="size-4" /> Export CSV
              </Btn>
            </div>

            {items.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-dashed border-gold/50 bg-white/60 p-12 text-center">
                <Users className="mx-auto mb-3 size-8 text-ink/30" />
                <p className="text-ink/60">{data.items.length ? "No one matches that." : "No replies yet. They’ll appear here as guests respond."}</p>
              </div>
            ) : (
              <ul className="mt-5 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
                {items.map((i) => (
                  <li key={i.id} className="flex items-center gap-3 px-4 py-3.5">
                    <span className={clsx("flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold", i.attending ? "bg-green-100 text-green-700" : i.maybe ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700")}>
                      {i.attending ? i.guests : i.maybe ? "?" : "×"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{i.name}</div>
                      <div className="truncate text-xs text-ink/50">
                        {i.attending ? `Coming · ${i.guests} ${i.guests === 1 ? "person" : "people"}` : i.maybe ? "Not sure yet" : "Can’t make it"} · {new Date(i.at).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                      </div>
                    </div>
                    {i.phone && (
                      <a href={`tel:${i.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-ink/70 hover:bg-paper-2">
                        <Phone className="size-3.5" /> <span className="hidden sm:inline">{i.phone}</span>
                      </a>
                    )}
                    <button onClick={() => setDel(i)} aria-label="Remove" className="rounded-lg p-2 text-ink/40 hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
      <Modal open={!!del} onClose={() => setDel(null)} title="Remove this reply?">
        <p className="text-ink/70">{del?.name} will be removed from your list. They can reply again from the card.</p>
        <div className="mt-6 flex justify-end gap-2">
          <Btn onClick={() => setDel(null)}>Cancel</Btn>
          <Btn
            variant="primary"
            className="!bg-red-600 hover:!bg-red-700"
            onClick={async () => {
              if (del) await api(`/api/cards/${id}/rsvps/${del.id}`, { method: "DELETE" }).catch(() => {});
              setDel(null);
              load();
            }}
          >
            Remove
          </Btn>
        </div>
      </Modal>
    </>
  );
}

function Stat({ label, value, sub, tone }: { label: string; value: number; sub: string; tone: "green" | "rose" | "ink" }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 sm:p-5">
      <div className="text-xs font-medium uppercase tracking-wider text-ink/45">{label}</div>
      <div className={clsx("mt-1 font-display text-5xl font-semibold tabular-nums", tone === "green" && "text-green-700", tone === "rose" && "text-rose-600")}>{value}</div>
      <div className="text-xs text-ink/50">{sub}</div>
    </div>
  );
}

async function authHeader(): Promise<Record<string, string>> {
  const { getFirebaseAuth, devBypass } = await import("@/lib/client/firebase");
  const auth = getFirebaseAuth();
  if (auth) {
    await auth.authStateReady();
    return auth.currentUser ? { Authorization: `Bearer ${await auth.currentUser.getIdToken()}` } : {};
  }
  return devBypass ? { "x-dev-user": "demo" } : {};
}
