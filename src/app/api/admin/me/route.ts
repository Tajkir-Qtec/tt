import { requireAdmin } from "@/lib/server/auth";
import { handle, json } from "@/lib/server/http";

export const GET = handle(async (req: Request) => {
  const admin = await requireAdmin(req);
  return json({ admin: true, email: admin.email ?? "" });
});
