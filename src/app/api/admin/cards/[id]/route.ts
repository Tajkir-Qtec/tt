import { z } from "zod";
import { HttpError, requireAdmin } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { Card, Media, Rsvp } from "@/lib/server/models";
import { handle, json } from "@/lib/server/http";
import { parseId } from "@/lib/server/cards";
import { clientIp, logActivity } from "@/lib/server/activity";

const schema = z.object({ action: z.enum(["takedown", "restore", "delete"]), reason: z.string().max(200).optional().default("") });

/** Moderation: take a card offline (owner can't republish), restore it, or delete it. */
export const POST = handle(async (req: Request, ctx: RouteContext<"/api/admin/cards/[id]">) => {
  const admin = await requireAdmin(req);
  const { id } = await ctx.params;
  const { action, reason } = schema.parse(await req.json());
  await connectDB();
  const card = await Card.findById(parseId(id));
  if (!card) throw new HttpError(404, "Card not found");
  const label = `“${card.title}” (/c/${card.slug})`;
  if (action === "delete") {
    if (card.previewId) await Media.deleteOne({ _id: card.previewId });
    await Rsvp.deleteMany({ cardId: card._id });
    await card.deleteOne();
  } else if (action === "takedown") {
    card.adminHidden = true;
    card.published = false;
    await card.save();
  } else {
    card.adminHidden = false;
    await card.save();
  }
  await logActivity({
    actorType: "admin",
    actorId: admin.uid,
    actorEmail: admin.email,
    action: `card.admin_${action}`,
    targetType: "card",
    targetId: id,
    summary: `${action === "takedown" ? "Took down" : action === "restore" ? "Restored" : "Deleted"} ${label}${reason ? ` — ${reason}` : ""}`,
    ip: clientIp(req),
  });
  return json({ ok: true });
});
