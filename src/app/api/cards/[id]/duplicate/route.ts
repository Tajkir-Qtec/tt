import { requireUser } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { Card, type CardDoc } from "@/lib/server/models";
import { handle, json } from "@/lib/server/http";
import { findOwned, toSummary, uniqueSlug } from "@/lib/server/cards";
import { bumpStat, clientIp, logActivity } from "@/lib/server/activity";
import { cloneDesign } from "@/lib/design/layers";
import type { CardDesign } from "@/lib/design/types";

export const POST = handle(async (req: Request, ctx: RouteContext<"/api/cards/[id]/duplicate">) => {
  const user = await requireUser(req);
  const { id } = await ctx.params;
  await connectDB();
  if ((await Card.countDocuments({ ownerId: user.uid })) >= 100) return json({ error: "Card limit reached." }, 400);
  const src = await findOwned(id, user.uid);
  const title = `${src.title} (copy)`.slice(0, 120);
  const design = cloneDesign(src.design as CardDesign);
  const copy = await Card.create({
    ownerId: user.uid,
    slug: await uniqueSlug(title),
    title,
    templateSlug: src.templateSlug,
    design,
    viewMode: src.viewMode,
    meta: src.meta,
    rsvpEnabled: src.rsvpEnabled,
    envelope: src.envelope,
  });
  await bumpStat("cards");
  await logActivity({
    actorType: "user",
    actorId: user.uid,
    actorEmail: user.email,
    action: "card.duplicated",
    targetType: "card",
    targetId: String(copy._id),
    summary: `Duplicated “${src.title}”`,
    ip: clientIp(req),
  });
  return json({ card: toSummary(copy.toObject() as unknown as CardDoc, design.pages.length) }, 201);
});
