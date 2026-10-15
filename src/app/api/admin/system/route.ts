import mongoose from "mongoose";
import { requireAdmin } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { handle, json } from "@/lib/server/http";

const started = Date.now();

/** Health of the running app and its database. */
export const GET = handle(async (req: Request) => {
  await requireAdmin(req);
  const t0 = Date.now();
  await connectDB();
  const db = mongoose.connection.db!;
  await db.command({ ping: 1 });
  const ping = Date.now() - t0;
  const stats = await db.stats().catch(() => null);
  const cols = await db.listCollections().toArray();
  const collections = await Promise.all(
    cols
      .map((c) => c.name)
      .sort()
      .map(async (name) => ({ name, count: await db.collection(name).estimatedDocumentCount() })),
  );
  const mem = process.memoryUsage();
  return json({
    ping,
    uptimeSec: Math.round((Date.now() - started) / 1000),
    node: process.version,
    env: process.env.NODE_ENV,
    db: { name: db.databaseName, dataSize: stats?.dataSize ?? 0, storageSize: stats?.storageSize ?? 0, collections },
    memoryMb: Math.round(mem.rss / 1048576),
    config: {
      firebase: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      adminEmails: (process.env.ADMIN_EMAILS ?? "").split(",").filter((s) => s.trim()).length,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
      devBypass: process.env.AUTH_DEV_BYPASS === "1",
    },
  });
});
