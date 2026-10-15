"use client";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { ExternalLink, X } from "lucide-react";
import { Btn, Modal, Spinner } from "@/components/ui/kit";
import { api } from "@/lib/client/api";
import { actionTone, ago, Badge, fmt, H, Pager, SearchBox, Table, usePaged, when } from "./ui";

interface UserRow {
  uid: string;
  email: string;
  name: string;
  firstSeen: string;
  lastSeen: string;
  blocked: boolean;
  blockedReason: string;
  note: string;
  cards: number;
  published: number;
  views: number;
}

const FILTERS = [
  ["all", "All"],
  ["active", "Active this week"],
  ["new", "New this week"],
  ["blocked", "Suspended"],
] as const;

export function UsersTab({ toast, viewCards, initialQuery = "" }: { toast: (s: string) => void; viewCards: (uid: string) => void; initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const [status, setStatus] = useState<(typeof FILTERS)[number][0]>("all");
  const [sort, setSort] = useState("lastSeen");
  const { data, page, setPage, reload } = usePaged<{ users: UserRow[] }>(`/api/admin/users?q=${encodeURIComponent(q)}&status=${status}&sort=${sort}`, [q, status, sort]);
  const [open, setOpen] = useState<string | null>(null);
  const [target, setTarget] = useState<UserRow | null>(null);
  const [reason, setReason] = useState("");

  const act = async (uid: string, action: "block" | "unblock", why = "") => {
    try {
      await api(`/api/admin/users/${uid}`, { method: "POST", json: { action, reason: why } });
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
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex rounded-full border border-line bg-white p-0.5 text-sm">
          {FILTERS.map(([k, label]) => (
            <button key={k} onClick={() => setStatus(k)} className={clsx("rounded-full px-3.5 py-1.5 transition", status === k ? "bg-ink text-white" : "text-ink/65 hover:text-ink")}>
              {label}
            </button>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-9 rounded-full border border-line bg-white px-3 text-sm">
          <option value="lastSeen">Last active</option>
          <option value="firstSeen">Newest first</option>
        </select>
      </div>
      <Table head={["User", "Joined", "Last active", "Cards", "Views", "Status"]} empty={data && data.users.length === 0 ? "No users found." : undefined}>
        {data?.users.map((u) => (
          <tr key={u.uid} onClick={() => setOpen(u.uid)} className="cursor-pointer align-middle transition hover:bg-paper-2/50">
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
            <td className="px-4 py-3">
              {u.blocked ? <Badge tone="red">Suspended</Badge> : <Badge tone="green">Active</Badge>} {u.note && <Badge tone="amber">Note</Badge>}
            </td>
          </tr>
        ))}
      </Table>
      {!data && <Spinner className="mt-6 size-5 text-ink/40" />}
      {data && <Pager page={page} pages={data.pages} setPage={setPage} />}

      {open && (
        <UserDrawer
          uid={open}
          onClose={() => setOpen(null)}
          viewCards={(uid) => (setOpen(null), viewCards(uid))}
          onSuspend={(u) => setTarget(u as UserRow)}
          onReinstate={(uid) => act(uid, "unblock")}
          toast={toast}
          refreshKey={data?.users.length}
          onChanged={reload}
        />
      )}

      <Modal open={!!target} onClose={() => setTarget(null)} title="Suspend this user?">
        <p className="text-ink/70">{target?.email || target?.uid} won’t be able to use the app, and all their published cards will be unpublished.</p>
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (kept in the audit log)" maxLength={200} className="mt-4 h-11 w-full rounded-xl border border-line px-4 text-sm outline-none focus:border-brand" />
        <div className="mt-5 flex justify-end gap-2">
          <Btn onClick={() => setTarget(null)}>Cancel</Btn>
          <Btn variant="primary" className="!bg-red-600 hover:!bg-red-700" onClick={() => target && act(target.uid, "block", reason)}>
            Suspend
          </Btn>
        </div>
      </Modal>
    </>
  );
}

interface Detail {
  user: { uid: string; email: string; name: string; firstSeen: string; lastSeen: string; blocked: boolean; blockedReason: string; note: string };
  cards: { id: string; title: string; slug: string; published: boolean; adminHidden: boolean; views: number; templateSlug: string | null; updatedAt: string }[];
  replies: { coming: number; people: number; other: number };
  activity: { id: string; at: string; action: string; summary: string }[];
}

function UserDrawer({
  uid,
  onClose,
  viewCards,
  onSuspend,
  onReinstate,
  toast,
  onChanged,
}: {
  uid: string;
  onClose: () => void;
  viewCards: (uid: string) => void;
  onSuspend: (u: { uid: string; email: string }) => void;
  onReinstate: (uid: string) => void;
  toast: (s: string) => void;
  refreshKey?: number;
  onChanged: () => void;
}) {
  const [d, setD] = useState<Detail | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    api<Detail>(`/api/admin/users/${uid}`).then((r) => (setD(r), setNote(r.user.note)));
  }, [uid]);

  const saveNote = async () => {
    setSaving(true);
    try {
      await api(`/api/admin/users/${uid}`, { method: "POST", json: { action: "note", note } });
      toast("Note saved");
      onChanged();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <aside className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <h2 className="font-display text-3xl font-semibold">{d?.user.name || d?.user.email || "User"}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5 hover:bg-ink/5">
            <X className="size-5" />
          </button>
        </div>
        {!d ? (
          <Spinner className="mt-8 size-5 text-ink/40" />
        ) : (
          <div className="mt-2 grid gap-6">
            <div className="text-sm text-ink/60">
              {d.user.email || d.user.uid}
              <div className="mt-1">
                Joined {when(d.user.firstSeen)} · last active {ago(d.user.lastSeen)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                [d.cards.length, "cards"],
                [d.cards.reduce((n, c) => n + c.views, 0), "views"],
                [d.replies.people, "guests coming"],
              ].map(([v, l]) => (
                <div key={l as string} className="rounded-xl bg-paper-2 p-3">
                  <div className="font-display text-3xl font-semibold tabular-nums">{fmt(v as number)}</div>
                  <div className="text-xs text-ink/50">{l}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {d.user.blocked ? (
                <>
                  <Badge tone="red">Suspended</Badge>
                  <span className="text-sm text-ink/55">{d.user.blockedReason}</span>
                  <Btn size="sm" className="ml-auto" onClick={() => onReinstate(uid)}>
                    Reinstate
                  </Btn>
                </>
              ) : (
                <>
                  <Badge tone="green">Active</Badge>
                  <Btn size="sm" variant="danger" className="ml-auto" onClick={() => onSuspend({ uid, email: d.user.email })}>
                    Suspend
                  </Btn>
                </>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="note">
                Private note
              </label>
              <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} rows={3} placeholder="Only admins see this" className="w-full rounded-xl border border-line p-3 text-sm outline-none focus:border-brand" />
              <Btn size="sm" className="mt-2" onClick={saveNote} disabled={saving || note === d.user.note}>
                Save note
              </Btn>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-medium">
                Cards
                <button className="text-xs font-normal text-brand" onClick={() => viewCards(uid)}>
                  Manage in Cards
                </button>
              </div>
              <ul className="divide-y divide-line rounded-xl border border-line text-sm">
                {d.cards.slice(0, 8).map((c) => (
                  <li key={c.id} className="flex items-center gap-2 px-3 py-2">
                    <span className="min-w-0 flex-1 truncate">{c.title}</span>
                    {c.adminHidden ? <Badge tone="red">Taken down</Badge> : c.published ? <Badge tone="green">Live</Badge> : <Badge tone="gray">Draft</Badge>}
                    {c.published && !c.adminHidden && (
                      <a href={`/c/${c.slug}`} target="_blank" rel="noreferrer" aria-label="Open card" className="text-ink/45 hover:text-brand">
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </li>
                ))}
                {!d.cards.length && <li className="px-3 py-4 text-center text-ink/50">No cards yet.</li>}
              </ul>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium">Recent activity</div>
              <ul className="grid gap-2 text-sm">
                {d.activity.map((a) => (
                  <li key={a.id} className="flex items-start gap-2">
                    <Badge tone={actionTone(a.action)}>{a.action}</Badge>
                    <span className="min-w-0 flex-1 text-ink/70">{a.summary}</span>
                    <span className="shrink-0 text-xs text-ink/40">{ago(a.at)}</span>
                  </li>
                ))}
                {!d.activity.length && <li className="text-ink/50">Nothing yet.</li>}
              </ul>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
