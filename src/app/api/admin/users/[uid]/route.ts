import { z } from "zod";
import { HttpError, forgetUser, requireAdmin } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { AppUser, Card } from "@/lib/server/models";
import { handle, json } from "@/lib/server/http";
import { clientIp, logActivity } from "@/lib/server/activity";

const schema = z.object({ action: z.enum(["block", "unblock"]), reason: z.string().max(200).optional().default("") });

export const POST = handle(async (req: Request, ctx: RouteContext<"/api/admin/users/[uid]">) => {
  const admin = await requireAdmin(req);
  const { uid } = await ctx.params;
  const { action, reason } = schema.parse(await req.json());
  await connectDB();
  const user = await AppUser.findOne({ uid });
  if (!user) throw new HttpError(404, "User not found");
  if (user.email && admin.email && user.email.toLowerCase() === admin.email.toLowerCase()) throw new HttpError(400, "You can't suspend your own account.");
  if (action === "block") {
    user.blocked = true;
    user.blockedReason = reason;
    await Card.updateMany({ ownerId: uid, published: true }, { $set: { published: false } });
  } else {
    user.blocked = false;
    user.blockedReason = "";
  }
  await user.save();
  forgetUser(uid);
  await logActivity({
    actorType: "admin",
    actorId: admin.uid,
    actorEmail: admin.email,
    action: action === "block" ? "user.blocked" : "user.unblocked",
    targetType: "user",
    targetId: uid,
    summary: `${action === "block" ? "Suspended" : "Reinstated"} ${user.email || uid}${reason ? ` — ${reason}` : ""}`,
    ip: clientIp(req),
  });
  return json({ ok: true });
});
