"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { clsx } from "clsx";

interface Cfg {
  announcement: { level: "info" | "success" | "warning"; text: string } | null;
  maintenance: { message: string } | null;
}

const STYLE = {
  info: ["bg-sky-600 text-white", Info],
  success: ["bg-green-700 text-white", CheckCircle2],
  warning: ["bg-amber-500 text-ink", AlertTriangle],
} as const;

/** Admin announcement / maintenance notice, shown on the marketing and dashboard pages (never on a guest's invitation). */
export function SiteBanner() {
  const [cfg, setCfg] = useState<Cfg | null>(null);
  const path = usePathname();
  useEffect(() => {
    fetch("/api/public/config")
      .then((r) => r.json())
      .then(setCfg)
      .catch(() => {});
  }, [path]);
  if (!cfg || path.startsWith("/c/") || path.startsWith("/admin")) return null;
  const m = cfg.maintenance;
  const a = cfg.announcement;
  if (!m && !a) return null;
  const [cls, Icon] = m ? (["bg-red-700 text-white", AlertTriangle] as const) : STYLE[a!.level];
  return (
    <div role="status" className={clsx("flex items-center justify-center gap-2 px-4 py-2 text-center text-sm", cls)}>
      <Icon className="size-4 shrink-0" /> {m ? m.message : a!.text}
    </div>
  );
}
