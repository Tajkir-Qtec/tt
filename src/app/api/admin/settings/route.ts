import { z } from "zod";
import { requireAdmin } from "@/lib/server/auth";
import { handle, json } from "@/lib/server/http";
import { getSettings, saveSettings } from "@/lib/server/settings";
import { clientIp, logActivity } from "@/lib/server/activity";

const schema = z
  .object({
    announcement: z.object({ active: z.boolean(), level: z.enum(["info", "success", "warning"]), text: z.string().max(240) }),
    maintenance: z.object({ on: z.boolean(), message: z.string().max(240) }),
    signupsOpen: z.boolean(),
    rsvpOpen: z.boolean(),
    maxCardsPerUser: z.number().int().min(1).max(5000),
    maxUploadsPerUser: z.number().int().min(1).max(20000),
  })
  .partial();

export const GET = handle(async (req: Request) => {
  await requireAdmin(req);
  return json({ settings: await getSettings() });
});

export const PUT = handle(async (req: Request) => {
  const admin = await requireAdmin(req);
  const patch = schema.parse(await req.json());
  const before = await getSettings();
  const settings = await saveSettings(patch);
  const changed = Object.keys(patch).filter((k) => JSON.stringify((before as never)[k]) !== JSON.stringify((settings as never)[k]));
  if (changed.length)
    await logActivity({ actorType: "admin", actorId: admin.uid, actorEmail: admin.email, action: "settings.updated", targetType: "settings", targetId: "app", summary: `Changed settings: ${changed.join(", ")}`, ip: clientIp(req) });
  return json({ settings });
});
