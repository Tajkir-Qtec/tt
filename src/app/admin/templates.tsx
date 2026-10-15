"use client";
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Spinner } from "@/components/ui/kit";
import { api } from "@/lib/client/api";
import { fmt, H, SearchBox, Table } from "./ui";

interface Row {
  slug: string;
  name: string;
  categories: string[];
  pages: number;
  cards: number;
  published: number;
  views: number;
  replies: number;
  people: number;
}
type Key = "name" | "cards" | "published" | "views" | "replies" | "rate";

export function TemplatesTab() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [blank, setBlank] = useState<Omit<Row, "slug" | "name" | "categories" | "pages"> | null>(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [sort, setSort] = useState<{ k: Key; dir: 1 | -1 }>({ k: "cards", dir: -1 });
  useEffect(() => {
    api<{ templates: Row[]; blank: Omit<Row, "slug" | "name" | "categories" | "pages"> }>("/api/admin/templates").then((r) => (setRows(r.templates), setBlank(r.blank)));
  }, []);

  const cats = useMemo(() => [...new Set((rows ?? []).flatMap((r) => r.categories))].sort(), [rows]);
  const rate = (r: Row) => (r.cards ? r.published / r.cards : 0);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    const l = (rows ?? []).filter((r) => (!t || r.name.toLowerCase().includes(t) || r.slug.includes(t)) && (!cat || r.categories.includes(cat)));
    const val = (r: Row) => (sort.k === "name" ? r.name : sort.k === "rate" ? rate(r) : r[sort.k]);
    return l.sort((a, b) => (val(a) > val(b) ? 1 : val(a) < val(b) ? -1 : 0) * sort.dir);
  }, [rows, q, cat, sort]);

  if (!rows) return <Spinner className="mt-10 size-6 text-ink/40" />;
  const used = rows.filter((r) => r.cards > 0).length;
  const th = (k: Key, label: string) => (
    <button onClick={() => setSort((s) => (s.k === k ? { k, dir: (-s.dir) as 1 | -1 } : { k, dir: k === "name" ? 1 : -1 }))} className="inline-flex items-center gap-1 uppercase tracking-wider">
      {label}
      {sort.k === k && (sort.dir === 1 ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />)}
    </button>
  );

  return (
    <>
      <H
        title="Templates"
        sub={`${rows.length} templates · ${used} in use · ${rows.length - used} never used`}
        right={
          <div className="flex flex-wrap gap-2">
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="h-10 rounded-full border border-line bg-white px-3 text-sm">
              <option value="">All categories</option>
              {cats.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <SearchBox value={q} onChange={setQ} placeholder="Search templates" />
          </div>
        }
      />
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line bg-paper-2/60 text-xs text-ink/45">
            <tr>
              <th className="px-4 py-3 font-medium">{th("name", "Template")}</th>
              <th className="px-4 py-3 font-medium">{th("cards", "Cards")}</th>
              <th className="px-4 py-3 font-medium">{th("published", "Published")}</th>
              <th className="px-4 py-3 font-medium">{th("rate", "Publish rate")}</th>
              <th className="px-4 py-3 font-medium">{th("views", "Views")}</th>
              <th className="px-4 py-3 font-medium">{th("replies", "Replies")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((r) => (
              <tr key={r.slug}>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/templates/${r.slug}-0.jpg`} alt="" loading="lazy" className="h-14 w-10 rounded bg-paper-2 object-cover" />
                    <div className="min-w-0">
                      <a href={`/templates/${r.slug}`} target="_blank" rel="noreferrer" className="block truncate font-medium hover:text-brand">
                        {r.name}
                      </a>
                      <div className="truncate text-xs text-ink/45">
                        {r.pages} pages · {r.categories.join(", ")}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5 tabular-nums">{fmt(r.cards)}</td>
                <td className="px-4 py-2.5 tabular-nums">{fmt(r.published)}</td>
                <td className="px-4 py-2.5 tabular-nums text-ink/65">{r.cards ? `${Math.round(rate(r) * 100)}%` : "—"}</td>
                <td className="px-4 py-2.5 tabular-nums">{fmt(r.views)}</td>
                <td className="px-4 py-2.5 tabular-nums">{fmt(r.replies)}</td>
              </tr>
            ))}
            {blank && !q && !cat && (
              <tr className="bg-paper-2/40">
                <td className="px-4 py-2.5 text-ink/65">Blank canvas / uploaded cards</td>
                <td className="px-4 py-2.5 tabular-nums">{fmt(blank.cards)}</td>
                <td className="px-4 py-2.5 tabular-nums">{fmt(blank.published)}</td>
                <td className="px-4 py-2.5 tabular-nums text-ink/65">{blank.cards ? `${Math.round((blank.published / blank.cards) * 100)}%` : "—"}</td>
                <td className="px-4 py-2.5 tabular-nums">{fmt(blank.views)}</td>
                <td className="px-4 py-2.5 tabular-nums">{fmt(blank.replies)}</td>
              </tr>
            )}
          </tbody>
        </table>
        {!list.length && <div className="p-8 text-center text-ink/50">No templates match.</div>}
      </div>
      <p className="mt-3 text-xs text-ink/45">Templates ship with the app. Use this to see which designs guests and couples actually pick, and which to improve next.</p>
    </>
  );
}

export { Table };
