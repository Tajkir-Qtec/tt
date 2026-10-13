import { requireAdmin } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { AppUser, Card, Rsvp } from "@/lib/server/models";
import { handle, json } from "@/lib/server/http";

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const GET = handle(async (req: Request) => {
  await requireAdmin(req);
  await connectDB();
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim().slice(0, 60);
  const status = url.searchParams.get("status") ?? "all";
  const owner = url.searchParams.get("owner") ?? "";
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const limit = 25;
  const filter: Record<string, unknown> = {};
  if (q) filter.$or = [{ title: new RegExp(esc(q), "i") }, { slug: new RegExp(esc(q), "i") }, { "meta.coupleNames": new RegExp(esc(q), "i") }];
  if (status === "published") filter.published = true;
  if (status === "draft") filter.published = false;
  if (status === "hidden") filter.adminHidden = true;
  if (owner) filter.ownerId = owner;
  const [total, cards] = await Promise.all([
    Card.countDocuments(filter),
    Card.find(filter)
      .select("-design")
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);
  const owners = await AppUser.find({ uid: { $in: cards.map((c) => c.ownerId) } })
    .select("uid email name")
    .lean();
  const om = new Map(owners.map((o) => [o.uid, o]));
  const rs = await Rsvp.aggregate<{ _id: unknown; n: number; people: number }>([
    { $match: { cardId: { $in: cards.map((c) => c._id) }, attending: true } },
    { $group: { _id: "$cardId", n: { $sum: 1 }, people: { $sum: "$guests" } } },
  ]);
  const rm = new Map(rs.map((r) => [String(r._id), r]));
  return json({
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    cards: cards.map((c) => ({
      id: String(c._id),
      title: c.title,
      slug: c.slug,
      coupleNames: c.meta?.coupleNames ?? "",
      templateSlug: c.templateSlug,
      published: c.published,
      adminHidden: !!c.adminHidden,
      views: c.views,
      ownerId: c.ownerId,
      ownerEmail: om.get(c.ownerId)?.email ?? "",
      ownerName: om.get(c.ownerId)?.name ?? "",
      rsvpComing: rm.get(String(c._id))?.n ?? 0,
      rsvpPeople: rm.get(String(c._id))?.people ?? 0,
      createdAt: (c as unknown as { createdAt: Date }).createdAt,
      updatedAt: (c as unknown as { updatedAt: Date }).updatedAt,
    })),
  });
});
