import { requireAdmin } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { Card, Rsvp } from "@/lib/server/models";
import { handle, json } from "@/lib/server/http";
import { getTemplates } from "@/lib/templates";

/** How each template performs: cards made, published, views and replies. */
export const GET = handle(async (req: Request) => {
  await requireAdmin(req);
  await connectDB();
  const perTpl = await Card.aggregate<{ _id: string | null; cards: number; published: number; views: number; ids: unknown[] }>([
    { $group: { _id: "$templateSlug", cards: { $sum: 1 }, published: { $sum: { $cond: ["$published", 1, 0] } }, views: { $sum: "$views" }, ids: { $push: "$_id" } } },
  ]);
  const replies = await Rsvp.aggregate<{ _id: unknown; n: number; people: number }>([
    { $group: { _id: "$cardId", n: { $sum: 1 }, people: { $sum: { $cond: ["$attending", "$guests", 0] } } } },
  ]);
  const rmap = new Map(replies.map((r) => [String(r._id), r]));
  const stat = new Map(
    perTpl.map((t) => {
      let n = 0;
      let people = 0;
      for (const id of t.ids) {
        const r = rmap.get(String(id));
        if (r) {
          n += r.n;
          people += r.people;
        }
      }
      return [t._id ?? "", { cards: t.cards, published: t.published, views: t.views, replies: n, people }];
    }),
  );
  const rows = getTemplates().map((t) => ({
    slug: t.slug,
    name: t.name,
    categories: t.categories,
    pages: t.pages.length,
    ...(stat.get(t.slug) ?? { cards: 0, published: 0, views: 0, replies: 0, people: 0 }),
  }));
  const blank = stat.get("");
  return json({ templates: rows, blank: blank ?? { cards: 0, published: 0, views: 0, replies: 0, people: 0 }, total: rows.length });
});
