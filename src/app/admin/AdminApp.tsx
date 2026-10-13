"use client";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { Activity, Flag, LogOut, LayoutDashboard, LayoutTemplate, Search, ShieldAlert, Users } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Btn, Modal, Spinner, Toast } from "@/components/ui/kit";
import { api } from "@/lib/client/api";

type Tab = "overview" | "users" | "cards" | "activity" | "reports";

const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "cards", label: "Cards", icon: LayoutTemplate },
  { id: "activity", label: "Audit log", icon: Activity },
  { id: "reports", label: "Reports", icon: Flag },
];

const fmt = (n: number) => new Intl.NumberFormat().format(n);
const when = (d: string | Date) => new Date(d).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const ago = (d: string | Date) => {
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export default function AdminApp() {
  const auth = useAuth();
  const [state, setState] = useState<"checking" | "ok" | "denied">("checking");
  const [tab, setTab] = useState<Tab>("overview");
  const [cardOwner, setCardOwner] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (auth.loading) return;
    if (!auth.user) {
      window.location.replace("/admin/login");
      return;
    }
    api("/api/admin/me")
      .then(() => setState("ok"))
      .catch(() => setState("denied"));
  }, [auth.user, auth.loading]);

  if (state === "checking")
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner className="size-6 text-ink/40" />
      </div>
    );
  if (state === "denied")
    return (
      <div className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center px-6 text-center">
        <ShieldAlert className="size-10 text-ink/30" />
        <h1 className="mt-4 font-display text-4xl font-semibold">Admin access only</h1>
        <p className="mt-2 text-ink/60">
          This account isn’t an administrator. Sign out and sign in with an admin account.
        </p>
        <button
          className="mt-6 text-brand underline"
          onClick={async () => {
            await auth.signOut();
            window.location.replace("/admin/login");
          }}
        >
          Switch account
        </button>
      </div>
    );

  return (
    <div className="flex min-h-svh bg-paper-2">
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r border-line bg-white p-4 md:flex">
        <Link href="/" className="mb-6 flex items-center gap-2 px-2 font-display text-2xl font-semibold">
          Marriage Cards <span className="rounded bg-ink px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-white">Admin</span>
        </Link>
        <nav className="grid gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => (setTab(t.id), t.id !== "cards" && setCardOwner(""))}
              className={clsx("flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] transition", tab === t.id ? "bg-brand/10 font-medium text-brand" : "text-ink/70 hover:bg-ink/5")}
            >
              <t.icon className="size-[18px]" /> {t.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto px-2">
          <div className="mb-2 truncate text-xs text-ink/45">{auth.user?.email}</div>
          <button
            onClick={async () => {
              await auth.signOut();
              window.location.replace("/admin/login");
            }}
            className="flex items-center gap-2 text-sm text-ink/55 hover:text-brand"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <nav className="sticky top-0 z-20 flex gap-1 overflow-x-auto border-b border-line bg-white px-2 py-2 md:hidden">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={clsx("flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm", tab === t.id ? "bg-ink text-white" : "text-ink/70")}>
              <t.icon className="size-4" /> {t.label}
            </button>
          ))}
        </nav>
        <main className="mx-auto max-w-6xl p-4 sm:p-8">
          {tab === "overview" && <Overview go={setTab} />}
          {tab === "users" && (
            <UsersTab
              toast={setToast}
              viewCards={(uid) => {
                setCardOwner(uid);
                setTab("cards");
              }}
            />
          )}
          {tab === "cards" && <CardsTab owner={cardOwner} clearOwner={() => setCardOwner("")} toast={setToast} />}
          {tab === "activity" && <ActivityTab />}
          {tab === "reports" && <ReportsTab toast={setToast} />}
        </main>
      </div>
      {toast && <Toast message={toast} onDone={() => setToast("")} />}
    </div>
  );
}

/* ------------------------------ shared bits ------------------------------ */

function H({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-4xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 text-ink/55">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-10 w-64 max-w-full rounded-full border border-line bg-white pl-9 pr-3 text-sm outline-none focus:border-brand" />
    </div>
  );
}

function Pager({ page, pages, setPage }: { page: number; pages: number; setPage: (p: number) => void }) {
  if (pages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-end gap-2 text-sm">
      <Btn size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
        Previous
      </Btn>
      <span className="text-ink/55">
        {page} / {pages}
      </span>
      <Btn size="sm" disabled={page >= pages} onClick={() => setPage(page + 1)}>
        Next
      </Btn>
    </div>
  );
}

function Table({ head, children, empty }: { head: string[]; children: ReactNode; empty?: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-line bg-paper-2/60 text-xs uppercase tracking-wider text-ink/45">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
      {empty && <div className="p-8 text-center text-ink/50">{empty}</div>}
    </div>
  );
}

function Badge({ tone, children }: { tone: "green" | "gray" | "red" | "amber" | "blue"; children: ReactNode }) {
  const map = { green: "bg-green-100 text-green-800", gray: "bg-ink/8 text-ink/65", red: "bg-red-100 text-red-700", amber: "bg-amber-100 text-amber-800", blue: "bg-sky-100 text-sky-800" };
  return <span className={clsx("inline-block rounded-full px-2.5 py-0.5 text-xs font-medium", map[tone])}>{children}</span>;
}

function actionTone(a: string): "green" | "gray" | "red" | "amber" | "blue" {
  if (a.startsWith("user.block") || a.includes("admin_") || a.includes("deleted")) return "red";
  if (a.startsWith("report")) return "amber";
  if (a.startsWith("rsvp")) return "green";
  if (a.startsWith("user.")) return "blue";
  return "gray";
}

/* -------------------------------- overview -------------------------------- */

interface Overview {
  totals: Record<string, number>;
  series: { day: string; views: number; signups: number; cards: number; published: number; rsvps: number; reports: number }[];
  templates: { slug: string; count: number }[];
  topCards: { id: string; title: string; slug: string; views: number }[];
  recent: { id: string; at: string; action: string; summary: string; actorType: string; actorEmail: string }[];
}

function Overview({ go }: { go: (t: Tab) => void }) {
  const [d, setD] = useState<Overview | null>(null);
  const [metric, setMetric] = useState<"views" | "signups" | "cards" | "rsvps">("views");
  useEffect(() => {
    api<Overview>("/api/admin/overview").then(setD).catch(() => {});
  }, []);
  if (!d) return <Spinner className="size-6 text-ink/40" />;
  const t = d.totals;
  const max = Math.max(1, ...d.series.map((s) => s[metric]));
  const maxT = Math.max(1, ...d.templates.map((x) => x.count));
  return (
    <>
      <H title="Overview" sub="How the platform is doing right now." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Users" value={t.users} sub={`+${t.newUsers7} this week · ${t.active7} active`} />
        <Stat label="Cards" value={t.cards} sub={`${t.published} live · ${t.drafts} drafts · +${t.newCards7} this week`} />
        <Stat label="Card views" value={t.views} sub="all time" />
        <Stat label="People coming" value={t.rsvpPeople} sub={`${t.rsvpComing} replies · ${t.rsvpDeclined} declined`} />
        <Stat label="Open reports" value={t.openReports} sub={t.openReports ? "needs attention" : "all clear"} tone={t.openReports ? "warn" : undefined} onClick={() => go("reports")} />
        <Stat label="Suspended users" value={t.blockedUsers} sub="blocked accounts" />
        <Stat label="Taken-down cards" value={t.hidden} sub="hidden by moderators" />
        <Stat label="Storage" value={Math.round((t.mediaBytes / 1048576) * 10) / 10} suffix=" MB" sub={`${fmt(t.mediaCount)} images`} />
      </div>

      <section className="mt-6 rounded-2xl border border-line bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-medium">Last 30 days</h2>
          <div className="flex rounded-full border border-line p-0.5 text-sm">
            {(["views", "signups", "cards", "rsvps"] as const).map((m) => (
              <button key={m} onClick={() => setMetric(m)} className={clsx("rounded-full px-3 py-1 capitalize", metric === m ? "bg-ink text-white" : "text-ink/60")}>
                {m === "cards" ? "New cards" : m === "signups" ? "Sign-ups" : m === "rsvps" ? "Replies" : "Views"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex h-44 items-end gap-1" role="img" aria-label={`${metric} per day for the last 30 days`}>
          {d.series.map((s) => (
            <div key={s.day} className="group relative flex h-full flex-1 items-end">
              <div className="w-full rounded-t bg-brand/80 transition group-hover:bg-brand" style={{ height: `${Math.max(2, (s[metric] / max) * 100)}%`, opacity: s[metric] ? 1 : 0.25 }} />
              <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 text-xs text-white group-hover:block">
                {s.day.slice(5)} · {s[metric]}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-ink/40">
          <span>{d.series[0].day.slice(5)}</span>
          <span>Today</span>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-4 font-medium">Most used templates</h2>
          <div className="grid gap-2.5">
            {d.templates.map((x) => (
              <div key={x.slug} className="flex items-center gap-3 text-sm">
                <span className="w-40 shrink-0 truncate text-ink/75">{x.slug}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-paper-2">
                  <div className="h-full rounded-full bg-gold" style={{ width: `${(x.count / maxT) * 100}%` }} />
                </div>
                <span className="w-8 text-right tabular-nums text-ink/55">{x.count}</span>
              </div>
            ))}
            {d.templates.length === 0 && <p className="text-sm text-ink/50">No cards yet.</p>}
          </div>
        </section>
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-4 font-medium">Most viewed cards</h2>
          <ul className="divide-y divide-line text-sm">
            {d.topCards.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-2.5">
                <a href={`/c/${c.slug}`} target="_blank" rel="noreferrer" className="min-w-0 truncate hover:text-brand">
                  {c.title}
                </a>
                <span className="shrink-0 tabular-nums text-ink/55">{fmt(c.views)} views</span>
              </li>
            ))}
            {d.topCards.length === 0 && <p className="text-ink/50">No published cards yet.</p>}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-line bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-medium">Recent activity</h2>
          <button onClick={() => go("activity")} className="text-sm text-brand hover:underline">
            Open audit log
          </button>
        </div>
        <ul className="divide-y divide-line text-sm">
          {d.recent.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
              <Badge tone={actionTone(a.action)}>{a.action}</Badge>
              <span className="min-w-0 flex-1 truncate text-ink/75">{a.summary}</span>
              <span className="text-xs text-ink/40">{ago(a.at)}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function Stat({ label, value, sub, suffix, tone, onClick }: { label: string; value: number; sub: string; suffix?: string; tone?: "warn"; onClick?: () => void }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag onClick={onClick} className={clsx("rounded-2xl border bg-white p-4 text-left", tone === "warn" ? "border-amber-300 bg-amber-50" : "border-line", onClick && "transition hover:shadow-md")}>
      <div className="text-xs font-medium uppercase tracking-wider text-ink/45">{label}</div>
      <div className="mt-1 font-display text-4xl font-semibold tabular-nums">
        {fmt(value)}
        {suffix}
      </div>
      <div className="mt-0.5 text-xs text-ink/50">{sub}</div>
    </Tag>
  );
}

/* --------------------------------- users --------------------------------- */

interface UserRow {
  uid: string;
  email: string;
  name: string;
  firstSeen: string;
  lastSeen: string;
  blocked: boolean;
  blockedReason: string;
  cards: number;
  published: number;
  views: number;
}

function usePaged<T>(url: string, deps: unknown[]) {
  const [data, setData] = useState<(T & { page: number; pages: number; total: number }) | null>(null);
  const [page, setPage] = useState(1);
  const [tick, setTick] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPage(1), deps);
  useEffect(() => {
    let alive = true;
    api<T & { page: number; pages: number; total: number }>(`${url}${url.includes("?") ? "&" : "?"}page=${page}`)
      .then((r) => alive && setData(r))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [url, page, tick]);
  return { data, page, setPage, reload: () => setTick((t) => t + 1) };
}

function UsersTab({ toast, viewCards }: { toast: (s: string) => void; viewCards: (uid: string) => void }) {
  const [q, setQ] = useState("");
  const { data, page, setPage, reload } = usePaged<{ users: UserRow[] }>(`/api/admin/users?q=${encodeURIComponent(q)}`, [q]);
  const [target, setTarget] = useState<UserRow | null>(null);
  const [reason, setReason] = useState("");
  const act = async (u: UserRow, action: "block" | "unblock", why = "") => {
    try {
      await api(`/api/admin/users/${u.uid}`, { method: "POST", json: { action, reason: why } });
      toast(action === "block" ? "User suspended and their cards unpublished" : "User reinstated");
      reload();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed");
    }
    setTarget(null);
    setReason("");
  };
  return (
    <>
      <H title="Users" sub={data ? `${fmt(data.total)} accounts` : ""} right={<SearchBox value={q} onChange={setQ} placeholder="Search email or name" />} />
      <Table head={["User", "Joined", "Last active", "Cards", "Views", "Status", ""]} empty={data && data.users.length === 0 ? "No users found." : undefined}>
        {data?.users.map((u) => (
          <tr key={u.uid} className="align-middle">
            <td className="px-4 py-3">
              <div className="font-medium">{u.name || "—"}</div>
              <div className="text-xs text-ink/50">{u.email || u.uid}</div>
            </td>
            <td className="px-4 py-3 text-ink/60">{when(u.firstSeen)}</td>
            <td className="px-4 py-3 text-ink/60">{ago(u.lastSeen)}</td>
            <td className="px-4 py-3 tabular-nums">
              {u.cards} <span className="text-ink/40">({u.published} live)</span>
            </td>
            <td className="px-4 py-3 tabular-nums">{fmt(u.views)}</td>
            <td className="px-4 py-3">{u.blocked ? <Badge tone="red">Suspended</Badge> : <Badge tone="green">Active</Badge>}</td>
            <td className="space-x-1 px-4 py-3 text-right">
              <Btn size="sm" variant="ghost" onClick={() => viewCards(u.uid)}>
                Cards
              </Btn>
              {u.blocked ? (
                <Btn size="sm" onClick={() => act(u, "unblock")}>
                  Reinstate
                </Btn>
              ) : (
                <Btn size="sm" variant="danger" onClick={() => setTarget(u)}>
                  Suspend
                </Btn>
              )}
            </td>
          </tr>
        ))}
      </Table>
      {!data && <Spinner className="mt-6 size-5 text-ink/40" />}
      {data && <Pager page={page} pages={data.pages} setPage={setPage} />}
      <Modal open={!!target} onClose={() => setTarget(null)} title="Suspend this user?">
        <p className="text-ink/70">
          {target?.email || target?.uid} won’t be able to use the app, and all their published cards will be unpublished.
        </p>
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (kept in the audit log)" maxLength={200} className="mt-4 h-11 w-full rounded-xl border border-line px-4 text-sm outline-none focus:border-brand" />
        <div className="mt-5 flex justify-end gap-2">
          <Btn onClick={() => setTarget(null)}>Cancel</Btn>
          <Btn variant="primary" className="!bg-red-600 hover:!bg-red-700" onClick={() => target && act(target, "block", reason)}>
            Suspend
          </Btn>
        </div>
      </Modal>
    </>
  );
}

/* --------------------------------- cards --------------------------------- */

interface CardRow {
  id: string;
  title: string;
  slug: string;
  coupleNames: string;
  templateSlug: string | null;
  published: boolean;
  adminHidden: boolean;
  views: number;
  ownerId: string;
  ownerEmail: string;
  ownerName: string;
  rsvpComing: number;
  rsvpPeople: number;
  updatedAt: string;
}

function CardsTab({ owner, clearOwner, toast }: { owner: string; clearOwner: () => void; toast: (s: string) => void }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const { data, page, setPage, reload } = usePaged<{ cards: CardRow[] }>(`/api/admin/cards?q=${encodeURIComponent(q)}&status=${status}&owner=${encodeURIComponent(owner)}`, [q, status, owner]);
  const [confirm, setConfirm] = useState<{ card: CardRow; action: "takedown" | "delete" } | null>(null);
  const [reason, setReason] = useState("");
  const run = async (card: CardRow, action: "takedown" | "restore" | "delete", why = "") => {
    try {
      await api(`/api/admin/cards/${card.id}`, { method: "POST", json: { action, reason: why } });
      toast(action === "delete" ? "Card deleted" : action === "takedown" ? "Card taken down" : "Card restored");
      reload();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed");
    }
    setConfirm(null);
    setReason("");
  };
  return (
    <>
      <H
        title="Cards"
        sub={data ? `${fmt(data.total)} cards${owner ? " for one user" : ""}` : ""}
        right={
          <div className="flex flex-wrap items-center gap-2">
            {owner && (
              <button onClick={clearOwner} className="rounded-full bg-brand/10 px-3 py-1.5 text-sm text-brand">
                Filtered by user ✕
              </button>
            )}
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-full border border-line bg-white px-3 text-sm">
              <option value="all">All</option>
              <option value="published">Live</option>
              <option value="draft">Drafts</option>
              <option value="hidden">Taken down</option>
            </select>
            <SearchBox value={q} onChange={setQ} placeholder="Search title, link, names" />
          </div>
        }
      />
      <Table head={["Card", "Owner", "Status", "Views", "Coming", "Updated", ""]} empty={data && data.cards.length === 0 ? "No cards found." : undefined}>
        {data?.cards.map((c) => (
          <tr key={c.id}>
            <td className="px-4 py-3">
              <div className="max-w-[240px] truncate font-medium">{c.coupleNames || c.title}</div>
              <div className="text-xs text-ink/50">{c.templateSlug ?? "blank canvas"} · /c/{c.slug}</div>
            </td>
            <td className="px-4 py-3 text-ink/65">
              <div className="max-w-[180px] truncate">{c.ownerEmail || c.ownerId}</div>
            </td>
            <td className="px-4 py-3">{c.adminHidden ? <Badge tone="red">Taken down</Badge> : c.published ? <Badge tone="green">Live</Badge> : <Badge tone="gray">Draft</Badge>}</td>
            <td className="px-4 py-3 tabular-nums">{fmt(c.views)}</td>
            <td className="px-4 py-3 tabular-nums">{c.rsvpPeople}</td>
            <td className="px-4 py-3 text-ink/55">{ago(c.updatedAt)}</td>
            <td className="space-x-1 whitespace-nowrap px-4 py-3 text-right">
              {c.published && (
                <a href={`/c/${c.slug}`} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center rounded-full px-3 text-[13px] hover:bg-ink/5">
                  Open
                </a>
              )}
              {c.adminHidden ? (
                <Btn size="sm" onClick={() => run(c, "restore")}>
                  Restore
                </Btn>
              ) : (
                <Btn size="sm" variant="danger" onClick={() => setConfirm({ card: c, action: "takedown" })}>
                  Take down
                </Btn>
              )}
              <Btn size="sm" variant="ghost" className="hover:!text-red-600" onClick={() => setConfirm({ card: c, action: "delete" })}>
                Delete
              </Btn>
            </td>
          </tr>
        ))}
      </Table>
      {!data && <Spinner className="mt-6 size-5 text-ink/40" />}
      {data && <Pager page={page} pages={data.pages} setPage={setPage} />}
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title={confirm?.action === "delete" ? "Delete this card permanently?" : "Take this card down?"}>
        <p className="text-ink/70">
          {confirm?.action === "delete"
            ? `“${confirm?.card.title}” and its replies will be deleted for good.`
            : `“${confirm?.card.title}” goes offline immediately and its owner can't publish it again until you restore it.`}
        </p>
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (kept in the audit log)" maxLength={200} className="mt-4 h-11 w-full rounded-xl border border-line px-4 text-sm outline-none focus:border-brand" />
        <div className="mt-5 flex justify-end gap-2">
          <Btn onClick={() => setConfirm(null)}>Cancel</Btn>
          <Btn variant="primary" className="!bg-red-600 hover:!bg-red-700" onClick={() => confirm && run(confirm.card, confirm.action, reason)}>
            {confirm?.action === "delete" ? "Delete" : "Take down"}
          </Btn>
        </div>
      </Modal>
    </>
  );
}

/* -------------------------------- activity -------------------------------- */

interface ActRow {
  id: string;
  at: string;
  action: string;
  actorType: string;
  actorEmail: string;
  actorId: string;
  targetType: string;
  targetId: string;
  summary: string;
  ip: string;
}

function ActivityTab() {
  const [q, setQ] = useState("");
  const [action, setAction] = useState("");
  const [actor, setActor] = useState("");
  const { data, page, setPage } = usePaged<{ items: ActRow[] }>(`/api/admin/activity?q=${encodeURIComponent(q)}&action=${encodeURIComponent(action)}&actor=${actor}`, [q, action, actor]);
  return (
    <>
      <H
        title="Audit log"
        sub="Every important action, who did it and when."
        right={
          <div className="flex flex-wrap items-center gap-2">
            <select value={action} onChange={(e) => setAction(e.target.value)} className="h-10 rounded-full border border-line bg-white px-3 text-sm">
              <option value="">All events</option>
              <option value="user.">Accounts</option>
              <option value="card.">Cards</option>
              <option value="rsvp.">Replies</option>
              <option value="report.">Reports</option>
              <option value="card.admin_">Moderation</option>
            </select>
            <select value={actor} onChange={(e) => setActor(e.target.value)} className="h-10 rounded-full border border-line bg-white px-3 text-sm">
              <option value="">Anyone</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
              <option value="guest">Guests</option>
            </select>
            <SearchBox value={q} onChange={setQ} placeholder="Search text or email" />
          </div>
        }
      />
      <Table head={["When", "Event", "Who", "What happened"]} empty={data && data.items.length === 0 ? "Nothing here yet." : undefined}>
        {data?.items.map((a) => (
          <tr key={a.id} className="align-top">
            <td className="whitespace-nowrap px-4 py-3 text-ink/55">{when(a.at)}</td>
            <td className="px-4 py-3">
              <Badge tone={actionTone(a.action)}>{a.action}</Badge>
            </td>
            <td className="px-4 py-3 text-ink/65">
              <div className="max-w-[200px] truncate">{a.actorEmail || (a.actorType === "guest" ? "Guest" : a.actorId || a.actorType)}</div>
              <div className="text-xs capitalize text-ink/40">{a.actorType}{a.ip ? ` · ${a.ip}` : ""}</div>
            </td>
            <td className="px-4 py-3 text-ink/80">{a.summary}</td>
          </tr>
        ))}
      </Table>
      {!data && <Spinner className="mt-6 size-5 text-ink/40" />}
      {data && <Pager page={page} pages={data.pages} setPage={setPage} />}
    </>
  );
}

/* -------------------------------- reports -------------------------------- */

interface ReportRow {
  id: string;
  cardId: string;
  slug: string;
  reason: string;
  details: string;
  status: "open" | "resolved" | "dismissed";
  createdAt: string;
  cardTitle: string;
  cardExists: boolean;
  published: boolean;
  adminHidden: boolean;
}

function ReportsTab({ toast }: { toast: (s: string) => void }) {
  const [status, setStatus] = useState("open");
  const [rows, setRows] = useState<ReportRow[] | null>(null);
  const load = useCallback(() => {
    api<{ reports: ReportRow[] }>(`/api/admin/reports?status=${status}`)
      .then((r) => setRows(r.reports))
      .catch(() => {});
  }, [status]);
  useEffect(() => {
    setRows(null);
    load();
  }, [load]);
  const handle = async (r: ReportRow, s: "resolved" | "dismissed", takedown = false) => {
    try {
      if (takedown) await api(`/api/admin/cards/${r.cardId}`, { method: "POST", json: { action: "takedown", reason: `Report: ${r.reason}` } });
      await api(`/api/admin/reports/${r.id}`, { method: "POST", json: { status: s } });
      toast(takedown ? "Card taken down and report resolved" : "Report updated");
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed");
    }
  };
  return (
    <>
      <H
        title="Reports"
        sub="Cards flagged by visitors."
        right={
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-full border border-line bg-white px-3 text-sm">
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
            <option value="all">All</option>
          </select>
        }
      />
      {!rows && <Spinner className="size-5 text-ink/40" />}
      {rows && rows.length === 0 && <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-ink/50">No reports here. 🎉</div>}
      <div className="grid gap-3">
        {rows?.map((r) => (
          <div key={r.id} className="rounded-2xl border border-line bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="amber">{r.reason}</Badge>
              {r.status !== "open" && <Badge tone="gray">{r.status}</Badge>}
              {r.adminHidden && <Badge tone="red">Taken down</Badge>}
              <span className="text-xs text-ink/45">{when(r.createdAt)}</span>
            </div>
            <div className="mt-2 font-medium">{r.cardTitle}</div>
            <div className="text-sm text-ink/55">/c/{r.slug}</div>
            {r.details && <p className="mt-2 rounded-lg bg-paper-2 p-3 text-sm text-ink/75">{r.details}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              {r.cardExists && r.published && (
                <a href={`/c/${r.slug}`} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center rounded-full border border-line px-3 text-[13px] hover:bg-paper-2">
                  View card
                </a>
              )}
              {r.status === "open" && (
                <>
                  {r.cardExists && !r.adminHidden && (
                    <Btn size="sm" variant="danger" onClick={() => handle(r, "resolved", true)}>
                      Take down &amp; resolve
                    </Btn>
                  )}
                  <Btn size="sm" onClick={() => handle(r, "resolved")}>
                    Mark resolved
                  </Btn>
                  <Btn size="sm" variant="ghost" onClick={() => handle(r, "dismissed")}>
                    Dismiss
                  </Btn>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
