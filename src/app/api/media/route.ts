import { HttpError, requireUser } from "@/lib/server/auth";
import { getSettings } from "@/lib/server/settings";
import { connectDB } from "@/lib/server/db";
import { Media } from "@/lib/server/models";
import { handle, json } from "@/lib/server/http";
import { sniffImage } from "@/lib/server/image";

const MAX = 5 * 1024 * 1024;

/** The signed-in user's recent uploads (for the "Photos" tab). */
export const GET = handle(async (req: Request) => {
  const user = await requireUser(req);
  await connectDB();
  const items = await Media.find({ ownerId: user.uid, kind: "upload" })
    .select("_id createdAt")
    .sort({ createdAt: -1 })
    .limit(60)
    .lean();
  return json({ items: items.map((m) => ({ id: String(m._id), url: `/api/media/${m._id}` })) });
});

export const POST = handle(async (req: Request) => {
  const user = await requireUser(req);
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) throw new HttpError(400, "No file uploaded");
  if (file.size > MAX) throw new HttpError(413, "Images must be under 5 MB");
  const buf = Buffer.from(await file.arrayBuffer());
  const mime = sniffImage(buf);
  if (!mime) throw new HttpError(400, "Please upload a JPG, PNG or WebP image");
  await connectDB();
  if ((await Media.countDocuments({ ownerId: user.uid, kind: "upload" })) >= (await getSettings()).maxUploadsPerUser) {
    throw new HttpError(400, "Upload limit reached");
  }
  const media = await Media.create({ ownerId: user.uid, kind: "upload", mime, size: buf.length, data: buf });
  return json({ id: String(media._id), url: `/api/media/${media._id}` }, 201);
});
