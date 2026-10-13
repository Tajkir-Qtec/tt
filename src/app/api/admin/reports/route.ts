import { requireAdmin } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { Card, Report } from "@/lib/server/models";
import { handle, json } from "@/lib/server/http";

export const GET = handle(async (req: Request) => {
  await requireAdmin(req);
  await connectDB();
  const status = new URL(req.url).searchParams.get("status") ?? "open";
  const filter = status === "all" ? {} : { status };
  const reports = await Report.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  const cards = await Card.find({ _id: { $in: reports.map((r) => r.cardId) } })
    .select("title slug published adminHidden ownerId")
    .lean();
  const cm = new Map(cards.map((c) => [String(c._id), c]));
  return json({
    reports: reports.map((r) => {
      const c = cm.get(String(r.cardId));
      return {
        id: String(r._id),
        cardId: String(r.cardId),
        slug: r.slug,
        reason: r.reason,
        details: r.details,
        status: r.status,
        createdAt: (r as unknown as { createdAt: Date }).createdAt,
        cardTitle: c?.title ?? "(deleted)",
        cardExists: !!c,
        published: !!c?.published,
        adminHidden: !!c?.adminHidden,
      };
    }),
  });
});
