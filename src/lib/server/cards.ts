import { nanoid, customAlphabet } from "nanoid";
import mongoose from "mongoose";
import { HttpError } from "./auth";
import { Card, type CardDoc } from "./models";

const suffix = customAlphabet("abcdefghjkmnpqrstuvwxyz23456789", 6);

export function slugify(input: string): string {
  const s = input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
    .replace(/-+$/g, "");
  return s || "invitation";
}

export async function uniqueSlug(base: string): Promise<string> {
  const stem = slugify(base);
  for (let i = 0; i < 5; i++) {
    const slug = `${stem}-${suffix()}`;
    if (!(await Card.exists({ slug }))) return slug;
  }
  return `${stem}-${nanoid(10).toLowerCase().replace(/[^a-z0-9]/g, "x")}`;
}

export const RESERVED_SLUGS = new Set(["admin", "api", "login", "dashboard", "editor", "templates", "create", "privacy", "terms", "new"]);
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function parseId(id: string): mongoose.Types.ObjectId {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(404, "Card not found");
  return new mongoose.Types.ObjectId(id);
}

export async function findOwned(id: string, uid: string) {
  const card = await Card.findOne({ _id: parseId(id), ownerId: uid });
  if (!card) throw new HttpError(404, "Card not found");
  return card;
}

export function toApi(c: CardDoc) {
  return {
    id: String(c._id),
    slug: c.slug,
    title: c.title,
    templateSlug: c.templateSlug,
    design: c.design,
    viewMode: c.viewMode,
    meta: c.meta,
    rsvpEnabled: c.rsvpEnabled ?? true,
    envelope: { enabled: c.envelope?.enabled ?? true, color: c.envelope?.color ?? "ivory" },
    published: c.published,
    adminHidden: !!c.adminHidden,
    previewId: c.previewId,
    views: c.views,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

export function toSummary(c: CardDoc, pageCount = 1, rsvp?: { coming: number; people: number; declined: number }) {
  return {
    id: String(c._id),
    slug: c.slug,
    title: c.title,
    templateSlug: c.templateSlug,
    viewMode: c.viewMode,
    published: c.published,
    adminHidden: !!c.adminHidden,
    previewId: c.previewId,
    views: c.views,
    pageCount,
    updatedAt: c.updatedAt,
    rsvp: rsvp ?? { coming: 0, people: 0, declined: 0 },
  };
}

/** Reads a request body as text with a hard size cap. */
export async function readLimited(req: Request, maxBytes: number): Promise<string> {
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > maxBytes) throw new HttpError(413, "That request is too large.");
  const text = await req.text();
  if (text.length > maxBytes) throw new HttpError(413, "That request is too large.");
  return text;
}
