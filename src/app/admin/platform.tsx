"use client";
import { useEffect, useState, type ReactNode } from "react";
import { clsx } from "clsx";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { Btn, Spinner, Toggle } from "@/components/ui/kit";
import { api } from "@/lib/client/api";
import { fmt, H } from "./ui";

interface Settings {
  announcement: { active: boolean; level: "info" | "success" | "warning"; text: string };
  maintenance: { on: boolean; message: string };
  signupsOpen: boolean;
  rsvpOpen: boolean;
  maxCardsPerUser: number;
  maxUploadsPerUser: number;
}

function Card({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <h2 className="font-medium">{title}</h2>
      {sub && <p className="mb-4 text-sm text-ink/50">{sub}</p>}
      <div className={sub ? "" : "mt-4"}>{children}</div>
    </section>
  );
}

const LEVEL = {
  info: { cls: "bg-sky-50 text-sky-900 border-sky-200", icon: Info },
  success: { cls: "bg-green-50 text-green-900 border-green-200", icon: CheckCircle2 },
  warning: { cls: "bg-amber-50 text-amber-900 border-amber-200", icon: AlertTriangle },
};

export function SettingsTab({ toast }: { toast: (s: string) => void }) {
  const [s, setS] = useState<Settings | null>(null);
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    api<{ settings: Settings }>("/api/admin/settings").then((r) => (setS(r.settings), setSaved(JSON.stringify(r.settings))));
  }, []);
  if (!s) return <Spinner className="mt-10 size-6 text-ink/40" />;
  const dirty = JSON.stringify(s) !== saved;
  const set = (p: Partial<Settings>) => setS({ ...s, ...p });
  const save = async () => {
    setBusy(true);
    try {
      const r = await api<{ settings: Settings }>("/api/admin/settings", { method: "PUT", json: s });
      setS(r.settings);
      setSaved(JSON.stringify(r.settings));
      toast("Settings saved");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not save");
    }
    setBusy(false);
  };
  const L = LEVEL[s.announcement.level];
  const field = "h-11 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none focus:border-brand";

  return (
    <>
      <H title="Settings" sub="Platform switches. Changes apply within seconds and are written to the audit log." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Announcement banner" sub="Shown at the top of every signed-in page.">
          <Toggle checked={s.announcement.active} onChange={(v) => set({ announcement: { ...s.announcement, active: v } })} label="Show banner" />
          <div className="mt-4 flex gap-2">
            {(["info", "success", "warning"] as const).map((l) => (
              <button key={l} onClick={() => set({ announcement: { ...s.announcement, level: l } })} className={clsx("rounded-full border px-3 py-1 text-sm capitalize", s.announcement.level === l ? "border-brand bg-brand/5 text-brand" : "border-line")}>
                {l}
              </button>
            ))}
          </div>
          <input className={clsx(field, "mt-3")} value={s.announcement.text} maxLength={240} placeholder="e.g. New Bengali templates are here!" onChange={(e) => set({ announcement: { ...s.announcement, text: e.target.value } })} />
          {s.announcement.text && (
            <div className={clsx("mt-3 flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm", L.cls)}>
              <L.icon className="size-4 shrink-0" /> {s.announcement.text}
            </div>
          )}
        </Card>

        <Card title="Maintenance mode" sub="Pauses sign-in and editing for everyone except admins. Published invitations stay viewable.">
          <Toggle checked={s.maintenance.on} onChange={(v) => set({ maintenance: { ...s.maintenance, on: v } })} label="Maintenance mode" />
          <input className={clsx(field, "mt-4")} value={s.maintenance.message} maxLength={240} onChange={(e) => set({ maintenance: { ...s.maintenance, message: e.target.value } })} />
          {s.maintenance.on && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">Maintenance mode is ON — regular users are locked out of their dashboard and editor.</p>}
        </Card>

        <Card title="Access" sub="Control who can join and what guests can do.">
          <div className="grid gap-4">
            <Toggle checked={s.signupsOpen} onChange={(v) => set({ signupsOpen: v })} label="Allow new sign-ups" />
            <Toggle checked={s.rsvpOpen} onChange={(v) => set({ rsvpOpen: v })} label="Allow guest replies (RSVP)" />
          </div>
        </Card>

        <Card title="Limits" sub="Per account. Protects storage while the app is free.">
          <div className="grid grid-cols-2 gap-4">
            <label className="text-sm">
              Max cards
              <input type="number" min={1} max={5000} className={clsx(field, "mt-1")} value={s.maxCardsPerUser} onChange={(e) => set({ maxCardsPerUser: Math.max(1, Number(e.target.value) || 1) })} />
            </label>
            <label className="text-sm">
              Max uploaded images
              <input type="number" min={1} max={20000} className={clsx(field, "mt-1")} value={s.maxUploadsPerUser} onChange={(e) => set({ maxUploadsPerUser: Math.max(1, Number(e.target.value) || 1) })} />
            </label>
          </div>
        </Card>
      </div>

      <div className={clsx("sticky bottom-4 mt-6 flex items-center justify-between rounded-2xl bg-ink px-5 py-3 text-white shadow-xl transition", dirty ? "opacity-100" : "pointer-events-none opacity-0")}>
        <span className="text-sm">You have unsaved changes</span>
        <div className="flex gap-2">
          <Btn size="sm" onClick={() => setS(JSON.parse(saved))}>
            Discard
          </Btn>
          <Btn size="sm" variant="gold" onClick={save} disabled={busy}>
            {busy && <Spinner />} Save changes
          </Btn>
        </div>
      </div>
    </>
  );
}

interface Sys {
  ping: number;
  uptimeSec: number;
  node: string;
  env: string;
  memoryMb: number;
  db: { name: string; dataSize: number; storageSize: number; collections: { name: string; count: number }[] };
  config: { firebase: boolean; adminEmails: number; siteUrl: string; devBypass: boolean };
}

const bytes = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);
const dur = (s: number) => (s > 86400 ? `${Math.floor(s / 86400)}d ${Math.floor((s % 86400) / 3600)}h` : s > 3600 ? `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m` : `${Math.floor(s / 60)}m`);

export function SystemTab() {
  const [d, setD] = useState<Sys | null>(null);
  const [err, setErr] = useState("");
  const load = () => api<Sys>("/api/admin/system").then(setD).catch((e) => setErr(e.message));
  useEffect(() => {
    load();
  }, []);
  if (err) return <p className="text-red-600">{err}</p>;
  if (!d) return <Spinner className="mt-10 size-6 text-ink/40" />;
  const checks = [
    { ok: d.config.firebase, text: "Firebase sign-in configured" },
    { ok: d.config.adminEmails > 0, text: `${d.config.adminEmails} admin email${d.config.adminEmails === 1 ? "" : "s"} allowed` },
    { ok: !d.config.devBypass, text: d.config.devBypass ? "Dev login bypass is ON — turn off before launch" : "Dev login bypass is off" },
    { ok: d.config.siteUrl.startsWith("https://"), text: d.config.siteUrl ? `Site URL ${d.config.siteUrl}` : "NEXT_PUBLIC_SITE_URL not set", warn: true },
  ];
  return (
    <>
      <H title="System" sub="Health of the app and its database." right={<Btn size="sm" onClick={load}>Refresh</Btn>} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Database", `${d.ping} ms`, `ping · ${d.db.name}`],
          ["Data size", bytes(d.db.dataSize), `${bytes(d.db.storageSize)} on disk`],
          ["Server uptime", dur(d.uptimeSec), `Node ${d.node}`],
          ["Memory", `${d.memoryMb} MB`, d.env],
        ].map(([l, v, s]) => (
          <div key={l} className="rounded-2xl border border-line bg-white p-4">
            <div className="text-xs uppercase tracking-wider text-ink/45">{l}</div>
            <div className="mt-2 font-display text-3xl font-semibold">{v}</div>
            <div className="text-xs text-ink/50">{s}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Readiness checklist">
          <ul className="grid gap-2.5 text-sm">
            {checks.map((c) => (
              <li key={c.text} className="flex items-center gap-2.5">
                {c.ok ? <CheckCircle2 className="size-4.5 text-green-600" /> : c.warn ? <AlertTriangle className="size-4.5 text-amber-600" /> : <XCircle className="size-4.5 text-red-600" />}
                {c.text}
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Collections">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-line">
              {d.db.collections.map((c) => (
                <tr key={c.name}>
                  <td className="py-2">{c.name}</td>
                  <td className="py-2 text-right tabular-nums text-ink/60">{fmt(c.count)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
