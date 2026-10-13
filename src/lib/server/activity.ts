import { createHash } from "node:crypto";
import { Activity, DailyStat } from "./models";

export type StatField = "views" | "signups" | "cards" | "published" | "rsvps" | "reports";

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Increment a daily counter (best effort; never throws). */
export async function bumpStat(field: StatField, n = 1) {
  try {
    await DailyStat.updateOne({ day: today() }, { $inc: { [field]: n } }, { upsert: true });
  } catch (e) {
    console.error("bumpStat", e);
  }
}

export interface LogInput {
  actorType: "user" | "admin" | "guest" | "system";
  actorId?: string;
  actorEmail?: string;
  action: string;
  targetType?: string;
  targetId?: string;
  summary?: string;
  meta?: unknown;
  ip?: string;
}

/** Append to the audit log (best effort; never throws). */
export async function logActivity(entry: LogInput) {
  try {
    await Activity.create({ ...entry, at: new Date() });
  } catch (e) {
    console.error("logActivity", e);
  }
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "").trim().slice(0, 64);
}

/** A stable, non-reversible id for rate limiting / de-duplication without storing raw IPs. */
export function ipHash(req: Request): string {
  return createHash("sha256").update(clientIp(req) + (process.env.IP_SALT ?? "mc")).digest("hex").slice(0, 16);
}

/** Only log a repeated action for the same target once per window (e.g. continuous editing). */
const throttle = new Map<string, number>();
export function shouldLogOnce(key: string, windowMs: number): boolean {
  const now = Date.now();
  const last = throttle.get(key) ?? 0;
  if (now - last < windowMs) return false;
  throttle.set(key, now);
  if (throttle.size > 5000) for (const [k, t] of throttle) if (now - t > windowMs) throttle.delete(k);
  return true;
}

/** Tiny in-memory sliding-window limiter (per server instance). */
const hits = new Map<string, number[]>();
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= max) {
    hits.set(key, arr);
    return false;
  }
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > 10000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return true;
}
