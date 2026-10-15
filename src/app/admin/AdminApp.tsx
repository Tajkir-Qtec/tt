"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { Activity, ExternalLink, Flag, LayoutDashboard, LayoutTemplate, LogOut, Search, Server, Settings, ShieldAlert, Users, Wand2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Spinner, Toast } from "@/components/ui/kit";
import { api } from "@/lib/client/api";
import { Dashboard } from "./dashboard";
import { UsersTab } from "./users";
import { TemplatesTab } from "./templates";
import { SettingsTab, SystemTab } from "./platform";
import { ActivityTab, CardsTab, ReportsTab } from "./tabs";

type Tab = "dashboard" | "users" | "cards" | "templates" | "reports" | "activity" | "settings" | "system";

const NAV: { group: string; items: { id: Tab; label: string; icon: typeof Users }[] }[] = [
  { group: "Overview", items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  {
    group: "Manage",
    items: [
      { id: "users", label: "Users", icon: Users },
      { id: "cards", label: "Cards", icon: Wand2 },
      { id: "templates", label: "Templates", icon: LayoutTemplate },
      { id: "reports", label: "Reports", icon: Flag },
    ],
  },
  { group: "Insight", items: [{ id: "activity", label: "Audit log", icon: Activity }] },
  {
    group: "Platform",
    items: [
      { id: "settings", label: "Settings", icon: Settings },
      { id: "system", label: "System", icon: Server },
    ],
  },
];
const ALL = NAV.flatMap((g) => g.items);
const isTab = (s: string): s is Tab => ALL.some((t) => t.id === s);

export default function AdminApp() {
  const auth = useAuth();
  const [state, setState] = useState<"checking" | "ok" | "denied">("checking");
  const [tab, setTabState] = useState<Tab>("dashboard");
  const [cardOwner, setCardOwner] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [openReports, setOpenReports] = useState(0);

  const setTab = useCallback((t: string) => {
    if (!isTab(t)) return;
    setTabState(t);
    try {
      history.replaceState(null, "", `#${t}`);
    } catch {}
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (isTab(h)) setTabState(h);
  }, []);

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

  useEffect(() => {
    if (state !== "ok") return;
    api<{ totals: { openReports: number } }>("/api/admin/overview")
      .then((r) => setOpenReports(r.totals.openReports))
      .catch(() => {});
  }, [state, tab]);

  const signOut = async () => {
    await auth.signOut();
    window.location.replace("/admin/login");
  };

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
        <p className="mt-2 text-ink/60">This account isn’t an administrator. Sign out and sign in with an admin account.</p>
        <button className="mt-6 text-brand underline" onClick={signOut}>
          Switch account
        </button>
      </div>
    );

  const current = ALL.find((t) => t.id === tab)!;
  const initial = (auth.user?.name || auth.user?.email || "A").slice(0, 1).toUpperCase();

  return (
    <div className="flex min-h-svh bg-[#f4f1ec]">
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col bg-[#17141c] p-4 text-white/80 md:flex">
        <Link href="/admin" className="mb-7 flex items-center gap-2.5 px-2 pt-1">
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand text-white">
            <ShieldAlert className="size-5" />
          </span>
          <span>
            <span className="block font-display text-xl font-semibold leading-none text-white">Marriage Cards</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">Admin console</span>
          </span>
        </Link>
        <nav className="grid gap-5 overflow-y-auto">
          {NAV.map((g) => (
            <div key={g.group}>
              <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">{g.group}</div>
              <div className="grid gap-0.5">
                {g.items.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => (setTab(t.id), t.id !== "cards" && setCardOwner(""))}
                    className={clsx("flex items-center gap-3 rounded-xl px-3 py-2 text-left text-[14px] transition", tab === t.id ? "bg-white/12 font-medium text-white" : "hover:bg-white/6 hover:text-white")}
                  >
                    <t.icon className="size-[17px]" />
                    <span className="flex-1">{t.label}</span>
                    {t.id === "reports" && openReports > 0 && <span className="rounded-full bg-amber-400 px-1.5 text-[11px] font-semibold text-ink">{openReports}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="mt-auto grid gap-1 border-t border-white/10 pt-4 text-sm">
          <Link href="/dashboard" className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-white/6 hover:text-white">
            <ExternalLink className="size-4" /> Open the app as a user
          </Link>
          <div className="flex items-center gap-3 px-3 pt-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white">{initial}</span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] text-white">{auth.user?.name || "Administrator"}</div>
              <div className="truncate text-[11px] text-white/45">{auth.user?.email}</div>
            </div>
            <button onClick={signOut} aria-label="Sign out" className="rounded-lg p-1.5 hover:bg-white/10">
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-[#f4f1ec]/90 px-4 py-3 backdrop-blur sm:px-8">
          <div className="min-w-0 flex-1">
            <div className="text-xs text-ink/45">Admin</div>
            <div className="truncate font-medium">{current.label}</div>
          </div>
          <form
            className="relative hidden sm:block"
            onSubmit={(e) => {
              e.preventDefault();
              if (!search.trim()) return;
              setUserQuery(search.trim());
              setTab("users");
              setSearch("");
            }}
          >
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find a user…" className="h-10 w-60 rounded-full border border-line bg-white pl-9 pr-3 text-sm outline-none focus:border-brand" />
          </form>
          <button onClick={signOut} className="md:hidden" aria-label="Sign out">
            <LogOut className="size-5" />
          </button>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-line bg-white px-2 py-2 md:hidden">
          {ALL.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={clsx("flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm", tab === t.id ? "bg-ink text-white" : "text-ink/70")}>
              <t.icon className="size-4" /> {t.label}
            </button>
          ))}
        </nav>

        <main className="mx-auto max-w-6xl p-4 sm:p-8">
          {tab === "dashboard" && <Dashboard go={setTab} />}
          {tab === "users" && (
            <UsersTab
              key={userQuery}
              toast={setToast}
              initialQuery={userQuery}
              viewCards={(uid) => {
                setCardOwner(uid);
                setTab("cards");
              }}
            />
          )}
          {tab === "cards" && <CardsTab owner={cardOwner} clearOwner={() => setCardOwner("")} toast={setToast} />}
          {tab === "templates" && <TemplatesTab />}
          {tab === "reports" && <ReportsTab toast={setToast} />}
          {tab === "activity" && <ActivityTab />}
          {tab === "settings" && <SettingsTab toast={setToast} />}
          {tab === "system" && <SystemTab />}
        </main>
      </div>
      {toast && <Toast message={toast} onDone={() => setToast("")} />}
    </div>
  );
}
