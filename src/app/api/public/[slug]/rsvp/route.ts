import { z } from "zod";
import { connectDB } from "@/lib/server/db";
import { Card, Rsvp } from "@/lib/server/models";
import { handle, json } from "@/lib/server/http";
import { HttpError } from "@/lib/server/auth";
import { bumpStat, clientIp, ipHash, logActivity, rateLimit } from "@/lib/server/activity";
import { sanitizeGuestName } from "@/lib/design/layers";

const schema = z.object({
  attending: z.boolean(),
  maybe: z.boolean().optional().default(false),
  name: z.string().min(1).max(80),
  phone: z.string().max(30).optional().default(""),
  guests: z.number().int().min(1).max(20).optional().default(1),
  from: z.string().max(60).optional().default(""),
  website: z.string().max(200).optional().default(""), // honeypot: real people leave it empty
});

const MAX_PER_CARD = 2000;

/** A guest replies to a card — no account needed. */
export const POST = handle(async (req: Request, ctx: RouteContext<"/api/public/[slug]/rsvp">) => {
  const { slug } = await ctx.params;
  if (!/^[a-z0-9-]{3,80}$/.test(slug)) throw new HttpError(404, "Card not found");
  const body = schema.parse(await req.json());
  if (body.website) return json({ ok: true }); // bot: pretend success
  if (!rateLimit(`rsvp:${ipHash(req)}:${slug}`, 8, 60 * 60_000)) throw new HttpError(429, "Too many replies from this device. Please try again later.");

  const name = sanitizeGuestName(body.name) || body.name.replace(/[<>]/g, "").trim().slice(0, 60);
  if (!name) throw new HttpError(400, "Please enter your name.");
  const phone = body.phone.replace(/[^\d+()\-\s.]/g, "").trim();
  const phoneKey = phone.replace(/\D/g, "");
  if (body.attending) {
    if (phoneKey.length < 6 || phoneKey.length > 16) throw new HttpError(400, "Please enter a phone number so the family can reach you.");
  }

  await connectDB();
  const card = await Card.findOne({ slug, published: true, adminHidden: { $ne: true } }).select("_id ownerId title rsvpEnabled");
  if (!card || card.rsvpEnabled === false) throw new HttpError(404, "Replies are not open for this card.");
  if ((await Rsvp.countDocuments({ cardId: card._id })) >= MAX_PER_CARD) throw new HttpError(400, "This card has reached its reply limit.");

  const guests = body.attending ? body.guests : 0;
  const existing = phoneKey
    ? await Rsvp.findOne({ cardId: card._id, phoneKey })
    : await Rsvp.findOne({ cardId: card._id, phoneKey: "", name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") });
  if (existing) {
    existing.attending = body.attending;
    existing.maybe = !body.attending && body.maybe;
    existing.name = name;
    existing.phone = phone;
    existing.guests = guests;
    await existing.save();
  } else {
    await Rsvp.create({
      cardId: card._id,
      ownerId: card.ownerId,
      attending: body.attending,
      maybe: !body.attending && body.maybe,
      name,
      phone,
      phoneKey,
      guests,
      fromLink: sanitizeGuestName(body.from),
    });
    await bumpStat("rsvps");
  }
  await logActivity({
    actorType: "guest",
    actorId: ipHash(req),
    action: existing ? "rsvp.updated" : "rsvp.submitted",
    targetType: "card",
    targetId: String(card._id),
    summary: `${name} — ${body.attending ? `coming (${guests})` : body.maybe ? "not sure yet" : "can't make it"} · “${card.title}”`,
    ip: clientIp(req),
  });
  return json({ ok: true, updated: !!existing }, existing ? 200 : 201);
});
