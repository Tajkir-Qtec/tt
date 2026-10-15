"use client";
import { useCallback, useEffect, useState } from "react";
import { clsx } from "clsx";
import { Download } from "lucide-react";
import { Btn, Modal, Spinner } from "@/components/ui/kit";
import { api, apiBlob } from "@/lib/client/api";
import { ago, Badge, actionTone, fmt, H, Pager, SearchBox, Table, usePaged, when } from "./ui";

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

export function CardsTab({ owner, clearOwner, toast }: { owner: string; clearOwner: () => void; toast: (s: string) => void }) {
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

export function ActivityTab() {
  const [q, setQ] = useState("");
  const [action, setAction] = useState("");
  const [actor, setActor] = useState("");
  const { data, page, setPage } = usePaged<{ items: ActRow[] }>(`/api/admin/activity?q=${encodeURIComponent(q)}&action=${encodeURIComponent(action)}&actor=${actor}`, [q, action, actor]);
  const exportCsv = async () => {
    const blob = await apiBlob("/api/admin/activity/export");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "audit-log.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  return (
    <>
      <H
        title="Audit log"
        sub="Every important action, who did it and when."
        right={
          <div className="flex flex-wrap items-center gap-2">
            <Btn size="sm" onClick={exportCsv}>
              <Download className="size-4" /> Export CSV
            </Btn>
            <select value={action} onChange={(e) => setAction(e.target.value)} className="h-10 rounded-full border border-line bg-white px-3 text-sm">
              <option value="">All events</option>
              <option value="user.">Accounts</option>
              <option value="card.">Cards</option>
              <option value="rsvp.">Replies</option>
              <option value="report.">Reports</option>
              <option value="card.admin_">Moderation</option>
              <option value="settings.">Settings</option>
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

export function ReportsTab({ toast }: { toast: (s: string) => void }) {
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
