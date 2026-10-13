import { connectDB } from "@/lib/server/db";
import { Card } from "@/lib/server/models";
import { json } from "@/lib/server/http";
import { bumpStat, ipHash, rateLimit } from "@/lib/server/activity";

/** Anonymous view counter (best effort; the viewer calls it once per browser session). */
export async function POST(req: Request, ctx: RouteContext<"/api/public/[slug]/view">) {
  const { slug } = await ctx.params;
  if (!/^[a-z0-9-]{3,80}$/.test(slug)) return json({ ok: false }, 400);
  if (!rateLimit(`view:${ipHash(req)}:${slug}`, 5, 10 * 60_000)) return json({ ok: true });
  await connectDB();
  const res = await Card.updateOne({ slug, published: true, adminHidden: { $ne: true } }, { $inc: { views: 1 } });
  if (res.modifiedCount) await bumpStat("views");
  return json({ ok: true });
}
