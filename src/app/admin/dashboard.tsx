"use client";
import { useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, ChevronRight, Eye, FileText, Flag, Heart, UserPlus, Users } from "lucide-react";
import { Spinner } from "@/components/ui/kit";
import { api } from "@/lib/client/api";
import { AreaChart, BarList, Spark } from "./charts";
import { actionTone, ago, Badge, fmt } from "./ui";

interface Day {
  day: string;
  views: number;
  signups: number;
  cards: number;
  published: number;
  rsvps: number;
  reports: number;
}
export interface OverviewData {
  totals: Record<string, number>;
  series: Day[];
  funnel: { users: number; usersWithCards: number; usersWithLive: number; cardsWithReplies: number };
  activeToday: number;
  templates: { slug: string; count: number }[];
  topCards: { id: string; title: string; slug: string; views: number }[];
  recent: { id: string; at: string; action: string; summary: string; actorType: string; actorEmail: string }[];
}

type Metric = "views" | "signups" | "cards" | "published" | "rsvps";
const METRICS: { id: Metric; label: string; noun: string }[] = [
  { id: "views", label: "Card views", noun: "views" },
  { id: "signups", label: "Sign-ups", noun: "sign-ups" },
  { id: "cards", label: "Cards created", noun: "cards" },
  { id: "published", label: "Published", noun: "published" },
  { id: "rsvps", label: "Guest replies", noun: "replies" },
];

const sum = (a: Day[], k: Metric) => a.reduce((n, d) => n + d[k], 0);
const short = (iso: string) => new Date(iso + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" });

function Delta({ now, prev }: { now: number; prev: number }) {
  if (!prev && !now) return <span className="text-xs text-ink/40">no change</span>;
  if (!prev) return <span className="text-xs text-green-700">new this week</span>;
  const pct = Math.round(((now - prev) / prev) * 100);
  const up = pct >= 0;
  return (
    <span className={clsx("inline-flex items-center gap-0.5 text-xs font-medium", up ? "text-green-700" : "text-red-600")}>
      {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
      {Math.abs(pct)}% <span className="font-normal text-ink/45">vs last week</span>
    </span>
  );
}

export function Dashboard({ go }: { go: (t: string) => void }) {
  const [d, setD] = useState<OverviewData | null>(null);
  const [metric, setMetric] = useState<Metric>("views");
  const [range, setRange] = useState<7 | 30>(30);
  const [err, setErr] = useState("");
  useEffect(() => {
    api<OverviewData>("/api/admin/overview")
      .then(setD)
      .catch((e) => setErr(e.message));
  }, []);

  const view = useMemo(() => (d ? d.series.slice(-range) : []), [d, range]);
  if (err) return <p className="text-red-600">{err}</p>;
  if (!d) return <Spinner className="mt-10 size-6 text-ink/40" />;

  const t = d.totals;
  const last7 = d.series.slice(-7);
  const prev7 = d.series.slice(-14, -7);
  const m = METRICS.find((x) => x.id === metric)!;
  const total = sum(view, metric);
  const prevTotal = range === 7 ? sum(prev7, metric) : null;

  const kpis = [
    { label: "Users", value: t.users, sub: `+${t.newUsers7} this week`, icon: Users, spark: d.series.map((x) => x.signups), go: "users" },
    { label: "Active today", value: d.activeToday, sub: `${fmt(t.active7)} in 7 days`, icon: UserPlus, spark: d.series.map((x) => x.signups), go: "users" },
    { label: "Cards", value: t.cards, sub: `${fmt(t.published)} live · ${fmt(t.drafts)} drafts`, icon: FileText, spark: d.series.map((x) => x.cards), go: "cards" },
    { label: "Card views", value: t.views, sub: <Delta now={sum(last7, "views")} prev={sum(prev7, "views")} />, icon: Eye, spark: d.series.map((x) => x.views), go: "templates" },
    { label: "People coming", value: t.rsvpPeople, sub: `${fmt(t.rsvpComing)} replies · ${fmt(t.rsvpDeclined)} declined`, icon: Heart, spark: d.series.map((x) => x.rsvps), go: "cards" },
    { label: "Open reports", value: t.openReports, sub: t.openReports ? "needs review" : "all clear", icon: Flag, spark: d.series.map((x) => x.reports), warn: t.openReports > 0, go: "reports" },
  ];

  const f = d.funnel;
  const funnel = [
    { label: "Signed up", value: f.users },
    { label: "Created a card", value: f.usersWithCards },
    { label: "Published a card", value: f.usersWithLive },
  ];
  const attention = [
    t.openReports > 0 && { text: `${t.openReports} open report${t.openReports > 1 ? "s" : ""} waiting`, to: "reports" },
    t.blockedUsers > 0 && { text: `${t.blockedUsers} suspended account${t.blockedUsers > 1 ? "s" : ""}`, to: "users" },
    t.hidden > 0 && { text: `${t.hidden} card${t.hidden > 1 ? "s" : ""} taken down`, to: "cards" },
  ].filter(Boolean) as { text: string; to: string }[];

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k) => (
          <button key={k.label} onClick={() => go(k.go)} className={clsx("rounded-2xl border bg-white p-4 text-left transition hover:shadow-md", k.warn ? "border-amber-300" : "border-line")}>
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-ink/45">
              {k.label} <k.icon className="size-4" />
            </div>
            <div className="mt-2 font-display text-4xl font-semibold tabular-nums">{fmt(k.value)}</div>
            <div className="mt-1 min-h-4 text-xs text-ink/55">{k.sub}</div>
            <div className="mt-2 opacity-80">
              <Spark values={k.spark.slice(-14)} className={k.warn ? "text-amber-600" : "text-brand"} />
            </div>
          </button>
        ))}
      </div>

      <section className="rounded-2xl border border-line bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium text-ink/55">{m.label}</h2>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="font-display text-4xl font-semibold tabular-nums">{fmt(total)}</span>
              {prevTotal !== null && <Delta now={total} prev={prevTotal} />}
              <span className="text-xs text-ink/45">last {range} days</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-full border border-line bg-paper p-0.5 text-sm">
              {METRICS.map((x) => (
                <button key={x.id} onClick={() => setMetric(x.id)} className={clsx("rounded-full px-3 py-1 transition", metric === x.id ? "bg-ink text-white" : "text-ink/65 hover:text-ink")}>
                  {x.label}
                </button>
              ))}
            </div>
            <div className="flex rounded-full border border-line bg-paper p-0.5 text-sm">
              {([7, 30] as const).map((r) => (
                <button key={r} onClick={() => setRange(r)} className={clsx("rounded-full px-3 py-1 transition", range === r ? "bg-ink text-white" : "text-ink/65 hover:text-ink")}>
                  {r}d
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <AreaChart data={view.map((x) => ({ label: short(x.day), value: x[metric] }))} noun={m.noun} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-medium">Activation funnel</h2>
          <p className="mb-4 text-sm text-ink/50">How far new users get.</p>
          <ul className="grid gap-4">
            {funnel.map((s, i) => (
              <li key={s.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{s.label}</span>
                  <span className="tabular-nums text-ink/60">
                    {fmt(s.value)}
                    {i > 0 && f.users > 0 && <span className="ml-1.5 text-xs text-ink/40">{Math.round((s.value / f.users) * 100)}%</span>}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-ink/6">
                  <div className="h-2.5 rounded-full bg-brand" style={{ width: `${f.users ? Math.max(2, (s.value / f.users) * 100) : 0}%`, opacity: 1 - i * 0.22 }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-ink/50">{fmt(f.cardsWithReplies)} cards have received at least one guest reply.</p>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Most used templates</h2>
            <button onClick={() => go("templates")} className="text-xs text-brand">
              All templates
            </button>
          </div>
          <div className="mt-4">
            <BarList rows={d.templates.slice(0, 6).map((x) => ({ label: x.slug, value: x.count }))} />
            {!d.templates.length && <p className="text-sm text-ink/50">No cards yet.</p>}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-medium">Needs attention</h2>
          {attention.length ? (
            <ul className="mt-3 grid gap-2">
              {attention.map((a) => (
                <li key={a.text}>
                  <button onClick={() => go(a.to)} className="flex w-full items-center gap-3 rounded-xl bg-amber-50 px-3 py-2.5 text-left text-sm text-amber-900 hover:bg-amber-100">
                    <AlertTriangle className="size-4 shrink-0" /> <span className="flex-1">{a.text}</span> <ChevronRight className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 rounded-xl bg-green-50 px-3 py-3 text-sm text-green-800">Nothing needs your attention. All clear.</p>
          )}
          <h3 className="mb-2 mt-6 text-sm font-medium text-ink/55">Most viewed cards</h3>
          <ul className="divide-y divide-line text-sm">
            {d.topCards.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-2">
                <a href={`/c/${c.slug}`} target="_blank" rel="noreferrer" className="truncate hover:text-brand">
                  {c.title}
                </a>
                <span className="shrink-0 tabular-nums text-ink/55">{fmt(c.views)}</span>
              </li>
            ))}
            {!d.topCards.length && <li className="py-2 text-ink/50">No published cards yet.</li>}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-line bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Live activity</h2>
          <button onClick={() => go("activity")} className="text-xs text-brand">
            Full audit log
          </button>
        </div>
        <ul className="mt-3 divide-y divide-line">
          {d.recent.map((a) => (
            <li key={a.id} className="flex items-center gap-3 py-2.5 text-sm">
              <Badge tone={actionTone(a.action)}>{a.action}</Badge>
              <span className="min-w-0 flex-1 truncate">{a.summary}</span>
              <span className="shrink-0 text-xs text-ink/45">{ago(a.at)}</span>
            </li>
          ))}
          {!d.recent.length && <li className="py-6 text-center text-ink/50">Nothing has happened yet.</li>}
        </ul>
      </section>
    </div>
  );
}
