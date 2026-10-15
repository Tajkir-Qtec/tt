"use client";
import { useEffect, useState, type ReactNode } from "react";
import { clsx } from "clsx";
import { Search } from "lucide-react";
import { Btn } from "@/components/ui/kit";
import { api } from "@/lib/client/api";

export const fmt = (n: number) => new Intl.NumberFormat().format(n);
export const when = (d: string | Date) => new Date(d).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
export const ago = (d: string | Date) => {
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

/* ------------------------------ shared bits ------------------------------ */

export function H({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
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

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-10 w-64 max-w-full rounded-full border border-line bg-white pl-9 pr-3 text-sm outline-none focus:border-brand" />
    </div>
  );
}

export function Pager({ page, pages, setPage }: { page: number; pages: number; setPage: (p: number) => void }) {
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

export function Table({ head, children, empty }: { head: string[]; children: ReactNode; empty?: string }) {
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

export function Badge({ tone, children }: { tone: "green" | "gray" | "red" | "amber" | "blue"; children: ReactNode }) {
  const map = { green: "bg-green-100 text-green-800", gray: "bg-ink/8 text-ink/65", red: "bg-red-100 text-red-700", amber: "bg-amber-100 text-amber-800", blue: "bg-sky-100 text-sky-800" };
  return <span className={clsx("inline-block rounded-full px-2.5 py-0.5 text-xs font-medium", map[tone])}>{children}</span>;
}

export function actionTone(a: string): "green" | "gray" | "red" | "amber" | "blue" {
  if (a.startsWith("user.block") || a.includes("admin_") || a.includes("deleted")) return "red";
  if (a.startsWith("report")) return "amber";
  if (a.startsWith("rsvp")) return "green";
  if (a.startsWith("user.")) return "blue";
  return "gray";
}

export function usePaged<T>(url: string, deps: unknown[]) {
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

