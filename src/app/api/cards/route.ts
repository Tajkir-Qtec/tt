import { z } from "zod";
import { getSettings } from "@/lib/server/settings";
import { requireUser } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { Card, Rsvp, type CardDoc } from "@/lib/server/models";
import { handle, json } from "@/lib/server/http";
import { toApi, toSummary, uniqueSlug } from "@/lib/server/cards";
import { bumpStat, clientIp, logActivity } from "@/lib/server/activity";
import { getTemplate } from "@/lib/templates";
import { cloneDesign, makePage } from "@/lib/design/layers";
import type { CardDesign } from "@/lib/design/types";

export const GET = handle(async (req: Request) => {
  const user = await requireUser(req);
  await connectDB();
  const cards = await Card.find({ ownerId: user.uid }).select("-design").sort({ updatedAt: -1 }).limit(200).lean<CardDoc[]>();
  const counts = await Card.aggregate<{ _id: unknown; n: number }>([
    { $match: { ownerId: user.uid } },
    { $project: { n: { $size: { $ifNull: ["$design.pages", []] } } } },
  ]);
  const pageMap = new Map(counts.map((c) => [String(c._id), c.n]));
  const rs = await Rsvp.aggregate<{ _id: { c: unknown; a: boolean; m?: boolean }; n: number; people: number }>([
    { $match: { ownerId: user.uid } },
    { $group: { _id: { c: "$cardId", a: "$attending", m: "$maybe" }, n: { $sum: 1 }, people: { $sum: "$guests" } } },
  ]);
  const rsvpMap = new Map<string, { coming: number; people: number; declined: number }>();
  for (const r of rs) {
    const k = String(r._id.c);
    const cur = rsvpMap.get(k) ?? { coming: 0, people: 0, declined: 0 };
    if (r._id.a) {
      cur.coming += r.n;
      cur.people += r.people;
    } else if (!r._id.m) cur.declined += r.n;
    rsvpMap.set(k, cur);
  }
  return json({ cards: cards.map((c) => toSummary(c, pageMap.get(String(c._id)) ?? 1, rsvpMap.get(String(c._id)))) });
});

const createSchema = z.object({
  templateSlug: z.string().max(80).optional(),
  title: z.string().min(1).max(120).optional(),
  blank: z.object({ width: z.number().min(300).max(4000), height: z.number().min(300).max(4000) }).optional(),
});

export const POST = handle(async (req: Request) => {
  const user = await requireUser(req);
  const body = createSchema.parse(await req.json());
  await connectDB();
  const cap = (await getSettings()).maxCardsPerUser;
  if ((await Card.countDocuments({ ownerId: user.uid })) >= cap) {
    return json({ error: `You have reached the limit of ${cap} cards. Delete one to create another.` }, 400);
  }
  let design: CardDesign;
  let title = body.title ?? "My invitation";
  let templateSlug: string | null = null;
  if (body.templateSlug) {
    const tpl = getTemplate(body.templateSlug);
    if (!tpl) return json({ error: "Template not found" }, 404);
    design = cloneDesign({ version: 1, width: tpl.width, height: tpl.height, pages: tpl.pages });
    title = body.title ?? `${tpl.name} invitation`;
    templateSlug = tpl.slug;
  } else {
    const size = body.blank ?? { width: 1000, height: 1400 };
    design = { version: 1, width: size.width, height: size.height, pages: [makePage({ background: "#ffffff", name: "Page 1" })] };
  }
  const card = await Card.create({
    ownerId: user.uid,
    slug: await uniqueSlug(title),
    title,
    templateSlug,
    design,
    viewMode: design.pages.length > 1 ? "flip" : "single",
    meta: { coupleNames: "", eventDate: "", venue: "", city: "", description: "" },
  });
  await bumpStat("cards");
  await logActivity({
    actorType: "user",
    actorId: user.uid,
    actorEmail: user.email,
    action: "card.created",
    targetType: "card",
    targetId: String(card._id),
    summary: templateSlug ? `Created a card from “${templateSlug}”` : "Created a blank card",
    meta: { templateSlug },
    ip: clientIp(req),
  });
  return json({ card: toApi(card.toObject() as unknown as CardDoc) }, 201);
});
