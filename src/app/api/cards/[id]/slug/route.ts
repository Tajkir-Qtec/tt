import { z } from "zod";
import { HttpError, requireUser } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { Card } from "@/lib/server/models";
import { handle, json } from "@/lib/server/http";
import { RESERVED_SLUGS, SLUG_RE, findOwned } from "@/lib/server/cards";
import { clientIp, logActivity } from "@/lib/server/activity";

const schema = z.object({ slug: z.string().min(3).max(60) });

/** Change the public link name. Old links stop working, so the UI warns first. */
export const PUT = handle(async (req: Request, ctx: RouteContext<"/api/cards/[id]/slug">) => {
  const user = await requireUser(req);
  const { id } = await ctx.params;
  const { slug: raw } = schema.parse(await req.json());
  const slug = raw.trim().toLowerCase();
  if (!SLUG_RE.test(slug)) throw new HttpError(400, "Use lowercase letters, numbers and single hyphens only.");
  if (RESERVED_SLUGS.has(slug)) throw new HttpError(400, "That name is reserved. Try another.");
  await connectDB();
  const card = await findOwned(id, user.uid);
  if (card.slug === slug) return json({ slug });
  if (await Card.exists({ slug })) throw new HttpError(409, "That link name is already taken. Try another.");
  const old = card.slug;
  card.slug = slug;
  await card.save();
  await logActivity({
    actorType: "user",
    actorId: user.uid,
    actorEmail: user.email,
    action: "card.slug_changed",
    targetType: "card",
    targetId: id,
    summary: `Link changed /c/${old} → /c/${slug}`,
    ip: clientIp(req),
  });
  return json({ slug });
});
