import { z } from "zod";
import { HttpError, requireUser } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { handle, json } from "@/lib/server/http";
import { findOwned } from "@/lib/server/cards";
import { bumpStat, clientIp, logActivity } from "@/lib/server/activity";

const schema = z.object({ published: z.boolean() });

export const POST = handle(async (req: Request, ctx: RouteContext<"/api/cards/[id]/publish">) => {
  const user = await requireUser(req);
  const { id } = await ctx.params;
  const { published } = schema.parse(await req.json());
  await connectDB();
  const card = await findOwned(id, user.uid);
  if (published && card.adminHidden) {
    throw new HttpError(403, "This card was taken down by a moderator and can't be published. Please contact support.");
  }
  const changed = card.published !== published;
  if (published && !card.publishedAt) card.publishedAt = new Date();
  card.published = published;
  await card.save();
  if (changed) {
    if (published) await bumpStat("published");
    await logActivity({
      actorType: "user",
      actorId: user.uid,
      actorEmail: user.email,
      action: published ? "card.published" : "card.unpublished",
      targetType: "card",
      targetId: id,
      summary: `${published ? "Published" : "Unpublished"} “${card.title}” (/c/${card.slug})`,
      ip: clientIp(req),
    });
  }
  return json({ ok: true, slug: card.slug, published: card.published });
});
