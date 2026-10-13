import { requireAdmin } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { Activity } from "@/lib/server/models";
import { handle, json } from "@/lib/server/http";

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The audit trail. Filter by action prefix (e.g. "card."), actor type, or free text. */
export const GET = handle(async (req: Request) => {
  await requireAdmin(req);
  await connectDB();
  const url = new URL(req.url);
  const action = (url.searchParams.get("action") ?? "").trim().slice(0, 40);
  const actorType = url.searchParams.get("actor") ?? "";
  const q = (url.searchParams.get("q") ?? "").trim().slice(0, 60);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const limit = 40;
  const filter: Record<string, unknown> = {};
  if (action) filter.action = new RegExp("^" + esc(action));
  if (["user", "admin", "guest", "system"].includes(actorType)) filter.actorType = actorType;
  if (q) filter.$or = [{ summary: new RegExp(esc(q), "i") }, { actorEmail: new RegExp(esc(q), "i") }, { targetId: q }];
  const [total, items] = await Promise.all([
    Activity.countDocuments(filter),
    Activity.find(filter)
      .sort({ at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);
  return json({
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    items: items.map((a) => ({
      id: String(a._id),
      at: a.at,
      action: a.action,
      actorType: a.actorType,
      actorEmail: a.actorEmail,
      actorId: a.actorId,
      targetType: a.targetType,
      targetId: a.targetId,
      summary: a.summary,
      ip: a.ip,
    })),
  });
});
