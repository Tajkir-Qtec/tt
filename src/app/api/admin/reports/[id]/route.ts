import mongoose from "mongoose";
import { z } from "zod";
import { HttpError, requireAdmin } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { Report } from "@/lib/server/models";
import { handle, json } from "@/lib/server/http";
import { clientIp, logActivity } from "@/lib/server/activity";

const schema = z.object({ status: z.enum(["open", "resolved", "dismissed"]) });

export const POST = handle(async (req: Request, ctx: RouteContext<"/api/admin/reports/[id]">) => {
  const admin = await requireAdmin(req);
  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) throw new HttpError(404, "Report not found");
  const { status } = schema.parse(await req.json());
  await connectDB();
  const r = await Report.findById(id);
  if (!r) throw new HttpError(404, "Report not found");
  r.status = status;
  r.handledBy = admin.email ?? admin.uid;
  r.handledAt = new Date();
  await r.save();
  await logActivity({
    actorType: "admin",
    actorId: admin.uid,
    actorEmail: admin.email,
    action: "report.handled",
    targetType: "card",
    targetId: String(r.cardId),
    summary: `Marked report on /c/${r.slug} as ${status}`,
    ip: clientIp(req),
  });
  return json({ ok: true });
});
