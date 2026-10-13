import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Card, Report } from "@/lib/server/models";
import { handle, json } from "@/lib/server/http";
import { HttpError } from "@/lib/server/auth";
import { bumpStat, clientIp, ipHash, logActivity, rateLimit } from "@/lib/server/activity";

const schema = z.object({
  reason: z.enum(["offensive", "spam", "private-info", "impersonation", "other"]),
  details: z.string().max(500).optional().default(""),
});

/** Anyone can flag a card for the moderators. */
export const POST = handle(async (req: Request, ctx: RouteContext<"/api/public/[slug]/report">) => {
  const { slug } = await ctx.params;
  if (!/^[a-z0-9-]{3,80}$/.test(slug)) throw new HttpError(404, "Card not found");
  const body = schema.parse(await req.json());
  if (!rateLimit(`report:${ipHash(req)}`, 5, 60 * 60_000)) throw new HttpError(429, "Too many reports. Please try again later.");
  await connectDB();
  const card = await Card.findOne({ slug, published: true }).select("_id title");
  if (!card) throw new HttpError(404, "Card not found");
  await Report.create({ cardId: card._id, slug, reason: body.reason, details: body.details, ip: ipHash(req) });
  await bumpStat("reports");
  await logActivity({
    actorType: "guest",
    actorId: ipHash(req),
    action: "report.submitted",
    targetType: "card",
    targetId: String(card._id),
    summary: `Report (${body.reason}) on “${card.title}”`,
    ip: clientIp(req),
  });
  return json({ ok: true }, 201);
});
