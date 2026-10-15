import { getSettings } from "@/lib/server/settings";
import { handle, json } from "@/lib/server/http";

/** What every visitor needs to know: announcement banner and maintenance state. */
export const GET = handle(async () => {
  const s = await getSettings();
  return json({ announcement: s.announcement.active && s.announcement.text ? s.announcement : null, maintenance: s.maintenance.on ? s.maintenance : null, signupsOpen: s.signupsOpen });
});
