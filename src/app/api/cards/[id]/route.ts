import { requireUser } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { Media, Rsvp, type CardDoc } from "@/lib/server/models";
import { handle, json } from "@/lib/server/http";
import { findOwned, readLimited, toApi } from "@/lib/server/cards";
import { clientIp, logActivity, shouldLogOnce } from "@/lib/server/activity";
import { cardUpdateSchema } from "@/lib/design/schema";

export const GET = handle(async (req: Request, ctx: RouteContext<"/api/cards/[id]">) => {
  const user = await requireUser(req);
  const { id } = await ctx.params;
  await connectDB();
  const card = await findOwned(id, user.uid);
  return json({ card: toApi(card.toObject() as unknown as CardDoc) });
});

export const PUT = handle(async (req: Request, ctx: RouteContext<"/api/cards/[id]">) => {
  const user = await requireUser(req);
  const { id } = await ctx.params;
  const body = cardUpdateSchema.parse(JSON.parse(await readLimited(req, 4_000_000)));
  await connectDB();
  const card = await findOwned(id, user.uid);
  if (body.title !== undefined) card.title = body.title;
  if (body.design !== undefined) {
    card.design = body.design;
    card.markModified("design");
  }
  if (body.viewMode !== undefined) card.viewMode = body.viewMode;
  if (body.meta !== undefined) card.meta = body.meta;
  if (body.rsvpEnabled !== undefined) card.rsvpEnabled = body.rsvpEnabled;
  if (body.envelope !== undefined) card.envelope = body.envelope;
  await card.save();
  if (shouldLogOnce(`edit:${id}`, 30 * 60_000)) {
    await logActivity({
      actorType: "user",
      actorId: user.uid,
      actorEmail: user.email,
      action: "card.edited",
      targetType: "card",
      targetId: id,
      summary: `Edited “${card.title}”`,
      ip: clientIp(req),
    });
  }
  return json({ ok: true, updatedAt: card.updatedAt });
});

export const DELETE = handle(async (req: Request, ctx: RouteContext<"/api/cards/[id]">) => {
  const user = await requireUser(req);
  const { id } = await ctx.params;
  await connectDB();
  const card = await findOwned(id, user.uid);
  if (card.previewId) await Media.deleteOne({ _id: card.previewId, ownerId: user.uid });
  await Rsvp.deleteMany({ cardId: card._id });
  const title = card.title;
  await card.deleteOne();
  await logActivity({
    actorType: "user",
    actorId: user.uid,
    actorEmail: user.email,
    action: "card.deleted",
    targetType: "card",
    targetId: id,
    summary: `Deleted “${title}”`,
    ip: clientIp(req),
  });
  return json({ ok: true });
});
