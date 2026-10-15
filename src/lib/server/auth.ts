import { createRemoteJWKSet, jwtVerify } from "jose";
import { getSettings } from "./settings";
import { connectDB } from "./db";
import { bumpStat, logActivity, clientIp } from "./activity";
import { AppUser } from "./models";

export interface AuthUser {
  uid: string;
  email?: string;
  name?: string;
  emailVerified?: boolean;
}

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const jwks = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
);

const devBypass = process.env.AUTH_DEV_BYPASS === "1" && process.env.NODE_ENV !== "production";

/** Verify a Firebase ID token without needing a service account (only the project id). */
async function verifyFirebaseToken(token: string): Promise<AuthUser | null> {
  if (!projectId) return null;
  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });
    if (!payload.sub) return null;
    return {
      uid: payload.sub,
      email: payload.email as string | undefined,
      name: payload.name as string | undefined,
      emailVerified: payload.email_verified === true,
    };
  } catch {
    return null;
  }
}

export async function getUser(req: Request): Promise<AuthUser | null> {
  if (devBypass) {
    const dev = req.headers.get("x-dev-user");
    if (dev) return { uid: `dev-${dev.replace(/[^\w-]/g, "").slice(0, 40)}`, email: "dev@example.com", name: "Dev User", emailVerified: true };
  }
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return verifyFirebaseToken(header.slice(7));
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Admins are listed by verified email in ADMIN_EMAILS (comma separated). */
export function isAdmin(user: AuthUser): boolean {
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return !!user.email && list.includes(user.email.toLowerCase()) && user.emailVerified === true;
}

const seen = new Map<string, { at: number; blocked: boolean }>();

/** Records the user (first/last seen) and refuses suspended accounts. */
async function touchUser(user: AuthUser, req: Request) {
  const cached = seen.get(user.uid);
  const now = Date.now();
  if (cached && now - cached.at < 60_000 && !(await getSettings()).maintenance.on) {
    if (cached.blocked) throw new HttpError(403, "This account has been suspended. Contact support if you think this is a mistake.");
    return;
  }
  await connectDB();
  const cfg = await getSettings();
  if (!cached && !isAdmin(user) && (!cfg.signupsOpen || cfg.maintenance.on)) {
    const exists = await AppUser.exists({ uid: user.uid });
    if (!exists) throw new HttpError(403, cfg.signupsOpen ? cfg.maintenance.message : "New sign-ups are paused right now. Please check back soon.");
  }
  if (cfg.maintenance.on && !isAdmin(user)) throw new HttpError(503, cfg.maintenance.message);
  const res = await AppUser.findOneAndUpdate(
    { uid: user.uid },
    {
      $set: { lastSeen: new Date(), ...(user.email ? { email: user.email } : {}), ...(user.name ? { name: user.name } : {}) },
      $setOnInsert: { firstSeen: new Date() },
    },
    { upsert: true, new: true, includeResultMetadata: true },
  );
  const doc = res.value;
  if (res.lastErrorObject && res.lastErrorObject.updatedExisting === false) {
    await bumpStat("signups");
    await logActivity({
      actorType: "user",
      actorId: user.uid,
      actorEmail: user.email,
      action: "user.signup",
      targetType: "user",
      targetId: user.uid,
      summary: `New account${user.email ? `: ${user.email}` : ""}`,
      ip: clientIp(req),
    });
  }
  const blocked = !!doc?.blocked;
  seen.set(user.uid, { at: now, blocked });
  if (blocked) throw new HttpError(403, "This account has been suspended. Contact support if you think this is a mistake.");
}

export function forgetUser(uid: string) {
  seen.delete(uid);
}

export async function requireUser(req: Request): Promise<AuthUser> {
  const user = await getUser(req);
  if (!user) throw new HttpError(401, "Please sign in to continue.");
  await touchUser(user, req);
  return user;
}

export async function requireAdmin(req: Request): Promise<AuthUser> {
  const user = await getUser(req);
  if (!user) throw new HttpError(401, "Please sign in to continue.");
  if (!isAdmin(user)) throw new HttpError(403, "You don't have access to the admin area.");
  await touchUser(user, req).catch(() => {});
  return user;
}
