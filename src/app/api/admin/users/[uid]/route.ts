import { z } from "zod";
import { HttpError, forgetUser, requireAdmin } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { Activity, AppUser, Card, Rsvp } from "@/lib/server/models";
import { handle, json } from "@/lib/server/http";
import { clientIp, logActivity } from "@/lib/server/activity";

const schema = z.object({ action: z.enum(["block", "unblock", "note"]), reason: z.string().max(200).optional().default(""), note: z.string().max(500).optional() });

export const POST = handle(async (req: Request, ctx: RouteContext<"/api/admin/users/[uid]">) => {
  const admin = await requireAdmin(req);
  const { uid } = await ctx.params;
  const { action, reason, note } = schema.parse(await req.json());
  await connectDB();
  const user = await AppUser.findOne({ uid });
  if (!user) throw new HttpError(404, "User not found");
  if (action === "note") {
    user.note = (note ?? "").trim();
    await user.save();
    return json({ ok: true });
  }
  if (user.email && admin.email && user.email.toLowerCase() === admin.email.toLowerCase()) throw new HttpError(400, "You can't suspend your own account.");
  if (action === "block") {
    user.blocked = true;
    user.blockedReason = reason;
    await Card.updateMany({ ownerId: uid, published: true }, { $set: { published: false } });
  } else {
    user.blocked = false;
    user.blockedReason = "";
  }
  await user.save();
  forgetUser(uid);
  await logActivity({
    actorType: "admin",
    actorId: admin.uid,
    actorEmail: admin.email,
    action: action === "block" ? "user.blocked" : "user.unblocked",
    targetType: "user",
    targetId: uid,
    summary: `${action === "block" ? "Suspended" : "Reinstated"} ${user.email || uid}${reason ? ` — ${reason}` : ""}`,
    ip: clientIp(req),
  });
  return json({ ok: true });
});

/** Everything about one account: profile, cards, replies received and recent activity. */
export const GET = handle(async (req: Request, ctx: RouteContext<"/api/admin/users/[uid]">) => {
  await requireAdmin(req);
  const { uid } = await ctx.params;
  await connectDB();
  const user = await AppUser.findOne({ uid }).lean();
  if (!user) throw new HttpError(404, "User not found");
  const [cards, replies, activity] = await Promise.all([
    Card.find({ ownerId: uid }).select("-design").sort({ updatedAt: -1 }).limit(50).lean(),
    Rsvp.aggregate<{ _id: boolean; n: number; people: number }>([{ $match: { ownerId: uid } }, { $group: { _id: "$attending", n: { $sum: 1 }, people: { $sum: "$guests" } } }]),
    Activity.find({ $or: [{ actorId: uid }, { targetId: uid }] }).sort({ at: -1 }).limit(25).lean(),
  ]);
  const yes = replies.find((r) => r._id === true);
  return json({
    user: { uid: user.uid, email: user.email, name: user.name, firstSeen: user.firstSeen, lastSeen: user.lastSeen, blocked: user.blocked, blockedReason: user.blockedReason, note: user.note ?? "" },
    cards: cards.map((c) => ({ id: String(c._id), title: c.title, slug: c.slug, published: c.published, adminHidden: !!c.adminHidden, views: c.views, templateSlug: c.templateSlug, updatedAt: (c as unknown as { updatedAt: Date }).updatedAt })),
    replies: { coming: yes?.n ?? 0, people: yes?.people ?? 0, other: replies.filter((r) => r._id !== true).reduce((n, r) => n + r.n, 0) },
    activity: activity.map((a) => ({ id: String(a._id), at: a.at, action: a.action, summary: a.summary })),
  });
});
