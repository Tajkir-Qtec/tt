import { requireUser } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { Rsvp } from "@/lib/server/models";
import { handle } from "@/lib/server/http";
import { findOwned } from "@/lib/server/cards";

const esc = (v: unknown) => {
  let s = String(v ?? "");
  // Neutralise spreadsheet formula injection from guest-typed text.
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
};

export const GET = handle(async (req: Request, ctx: RouteContext<"/api/cards/[id]/rsvps/export">) => {
  const user = await requireUser(req);
  const { id } = await ctx.params;
  await connectDB();
  const card = await findOwned(id, user.uid);
  const items = await Rsvp.find({ cardId: card._id }).sort({ attending: -1, name: 1 }).lean();
  const rows = [["Name", "Response", "People", "Phone", "Replied at"].map(esc).join(",")];
  for (const r of items) {
    rows.push(
      [r.name, r.attending ? "Coming" : r.maybe ? "Maybe" : "Can't make it", r.guests, r.phone, (r as unknown as { updatedAt: Date }).updatedAt.toISOString()].map(esc).join(","),
    );
  }
  return new Response("﻿" + rows.join("\r\n"), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="guest-list.csv"' },
  });
});
