import { HttpError, requireUser } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { Media } from "@/lib/server/models";
import { handle, json } from "@/lib/server/http";
import { findOwned } from "@/lib/server/cards";
import { sniffImage } from "@/lib/server/image";

/** The client renders a link-preview image (JPEG) and uploads it here when saving/publishing. */
export const PUT = handle(async (req: Request, ctx: RouteContext<"/api/cards/[id]/preview">) => {
  const user = await requireUser(req);
  const { id } = await ctx.params;
  const buf = Buffer.from(await req.arrayBuffer());
  if (buf.length > 800_000) throw new HttpError(413, "Preview too large");
  if (sniffImage(buf) !== "image/jpeg") throw new HttpError(400, "Preview must be a JPEG");
  await connectDB();
  const card = await findOwned(id, user.uid);
  const media = await Media.create({ ownerId: user.uid, kind: "preview", mime: "image/jpeg", size: buf.length, data: buf });
  const old = card.previewId;
  card.previewId = String(media._id);
  await card.save();
  if (old) await Media.deleteOne({ _id: old, ownerId: user.uid, kind: "preview" });
  return json({ previewId: card.previewId });
});
