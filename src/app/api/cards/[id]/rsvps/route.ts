import { requireUser } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { Rsvp } from "@/lib/server/models";
import { handle, json } from "@/lib/server/http";
import { findOwned } from "@/lib/server/cards";

/** The owner's guest list: who's coming, how many people, who can't make it. */
export const GET = handle(async (req: Request, ctx: RouteContext<"/api/cards/[id]/rsvps">) => {
  const user = await requireUser(req);
  const { id } = await ctx.params;
  await connectDB();
  const card = await findOwned(id, user.uid);
  const items = await Rsvp.find({ cardId: card._id }).sort({ updatedAt: -1 }).limit(2000).lean();
  const coming = items.filter((r) => r.attending);
  const maybes = items.filter((r) => !r.attending && r.maybe);
  const declined = items.filter((r) => !r.attending && !r.maybe);
  return json({
    card: { id, title: card.title, slug: card.slug, published: card.published, rsvpEnabled: card.rsvpEnabled ?? true },
    summary: {
      comingResponses: coming.length,
      comingPeople: coming.reduce((n, r) => n + (r.guests || 0), 0),
      notComing: declined.length,
      maybe: maybes.length,
      total: items.length,
    },
    items: items.map((r) => ({
      id: String(r._id),
      attending: r.attending,
      maybe: !r.attending && !!r.maybe,
      name: r.name,
      phone: r.phone,
      guests: r.guests,
      fromLink: r.fromLink,
      at: (r as unknown as { updatedAt: Date }).updatedAt,
    })),
  });
});
