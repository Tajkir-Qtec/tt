import { requireAdmin } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { AppUser, Card } from "@/lib/server/models";
import { handle, json } from "@/lib/server/http";

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const GET = handle(async (req: Request) => {
  await requireAdmin(req);
  await connectDB();
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim().slice(0, 60);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const limit = 25;
  const status = url.searchParams.get("status") ?? "all";
  const sort = url.searchParams.get("sort") === "firstSeen" ? "firstSeen" : "lastSeen";
  const filter: Record<string, unknown> = q ? { $or: [{ email: new RegExp(esc(q), "i") }, { name: new RegExp(esc(q), "i") }, { uid: q }] } : {};
  if (status === "blocked") filter.blocked = true;
  if (status === "active") filter.lastSeen = { $gte: new Date(Date.now() - 7 * 86_400_000) };
  if (status === "new") filter.firstSeen = { $gte: new Date(Date.now() - 7 * 86_400_000) };
  const [total, users] = await Promise.all([
    AppUser.countDocuments(filter),
    AppUser.find(filter)
      .sort({ [sort]: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);
  const counts = await Card.aggregate<{ _id: string; cards: number; published: number; views: number }>([
    { $match: { ownerId: { $in: users.map((u) => u.uid) } } },
    { $group: { _id: "$ownerId", cards: { $sum: 1 }, published: { $sum: { $cond: ["$published", 1, 0] } }, views: { $sum: "$views" } } },
  ]);
  const cm = new Map(counts.map((c) => [c._id, c]));
  return json({
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    users: users.map((u) => ({
      uid: u.uid,
      email: u.email,
      name: u.name,
      firstSeen: u.firstSeen,
      lastSeen: u.lastSeen,
      blocked: u.blocked,
      blockedReason: u.blockedReason,
      note: u.note ?? "",
      cards: cm.get(u.uid)?.cards ?? 0,
      published: cm.get(u.uid)?.published ?? 0,
      views: cm.get(u.uid)?.views ?? 0,
    })),
  });
});
