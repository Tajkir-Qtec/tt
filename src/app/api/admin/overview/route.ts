import { requireAdmin } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { Activity, AppUser, Card, DailyStat, Media, Report, Rsvp } from "@/lib/server/models";
import { handle, json } from "@/lib/server/http";

const DAY = 86_400_000;

export const GET = handle(async (req: Request) => {
  await requireAdmin(req);
  await connectDB();
  const now = Date.now();
  const d7 = new Date(now - 7 * DAY);
  const d30 = new Date(now - 30 * DAY);

  const [users, newUsers7, active7, blockedUsers, cards, published, hidden, newCards7, viewsAgg, rsvpAgg, openReports, mediaAgg, tplAgg, topCards, recent] = await Promise.all([
    AppUser.countDocuments({}),
    AppUser.countDocuments({ firstSeen: { $gte: d7 } }),
    AppUser.countDocuments({ lastSeen: { $gte: d7 } }),
    AppUser.countDocuments({ blocked: true }),
    Card.countDocuments({}),
    Card.countDocuments({ published: true }),
    Card.countDocuments({ adminHidden: true }),
    Card.countDocuments({ createdAt: { $gte: d7 } }),
    Card.aggregate<{ _id: null; views: number }>([{ $group: { _id: null, views: { $sum: "$views" } } }]),
    Rsvp.aggregate<{ _id: boolean; n: number; people: number }>([{ $group: { _id: "$attending", n: { $sum: 1 }, people: { $sum: "$guests" } } }]),
    Report.countDocuments({ status: "open" }),
    Media.aggregate<{ _id: null; bytes: number; n: number }>([{ $group: { _id: null, bytes: { $sum: "$size" }, n: { $sum: 1 } } }]),
    Card.aggregate<{ _id: string | null; n: number }>([{ $group: { _id: "$templateSlug", n: { $sum: 1 } } }, { $sort: { n: -1 } }, { $limit: 10 }]),
    Card.find({ published: true }).sort({ views: -1 }).limit(5).select("title slug views").lean(),
    Activity.find({}).sort({ at: -1 }).limit(12).lean(),
  ]);

  const stats = await DailyStat.find({ day: { $gte: d30.toISOString().slice(0, 10) } }).lean();
  const byDay = new Map(stats.map((s) => [s.day, s]));
  const series = Array.from({ length: 30 }, (_, i) => {
    const day = new Date(now - (29 - i) * DAY).toISOString().slice(0, 10);
    const s = byDay.get(day);
    return { day, views: s?.views ?? 0, signups: s?.signups ?? 0, cards: s?.cards ?? 0, published: s?.published ?? 0, rsvps: s?.rsvps ?? 0, reports: s?.reports ?? 0 };
  });

  const coming = rsvpAgg.find((r) => r._id === true);
  const declined = rsvpAgg.find((r) => r._id === false);
  return json({
    totals: {
      users,
      newUsers7,
      active7,
      blockedUsers,
      cards,
      published,
      drafts: cards - published,
      hidden,
      newCards7,
      views: viewsAgg[0]?.views ?? 0,
      rsvpComing: coming?.n ?? 0,
      rsvpPeople: coming?.people ?? 0,
      rsvpDeclined: declined?.n ?? 0,
      openReports,
      mediaCount: mediaAgg[0]?.n ?? 0,
      mediaBytes: mediaAgg[0]?.bytes ?? 0,
    },
    series,
    templates: tplAgg.map((t) => ({ slug: t._id ?? "(blank canvas)", count: t.n })),
    topCards: topCards.map((c) => ({ id: String(c._id), title: c.title, slug: c.slug, views: c.views })),
    recent: recent.map((a) => ({
      id: String(a._id),
      at: a.at,
      action: a.action,
      summary: a.summary,
      actorType: a.actorType,
      actorEmail: a.actorEmail,
    })),
  });
});
