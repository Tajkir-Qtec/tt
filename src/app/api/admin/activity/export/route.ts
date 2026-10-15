import { requireAdmin } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { Activity } from "@/lib/server/models";
import { handle } from "@/lib/server/http";

const cell = (v: unknown) => {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
};

/** Last 5,000 audit events as CSV. */
export const GET = handle(async (req: Request) => {
  await requireAdmin(req);
  await connectDB();
  const items = await Activity.find({}).sort({ at: -1 }).limit(5000).lean();
  const rows = [["Time", "Action", "Actor type", "Actor", "Target", "Summary", "IP"], ...items.map((a) => [new Date(a.at).toISOString(), a.action, a.actorType, a.actorEmail || a.actorId, `${a.targetType}:${a.targetId}`, a.summary, a.ip])];
  return new Response("﻿" + rows.map((r) => r.map(cell).join(",")).join("\r\n"), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="audit-log.csv"', "Cache-Control": "no-store" },
  });
});
