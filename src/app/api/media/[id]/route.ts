import mongoose from "mongoose";
import { connectDB } from "@/lib/server/db";
import { Media } from "@/lib/server/models";

export async function GET(_req: Request, ctx: RouteContext<"/api/media/[id]">) {
  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return new Response("Not found", { status: 404 });
  await connectDB();
  const media = await Media.findById(id).lean();
  if (!media) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(toBytes(media.data)), {
    headers: {
      "Content-Type": media.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "Cross-Origin-Resource-Policy": "cross-origin",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

/** .lean() hands back a BSON Binary, not a Buffer. */
function toBytes(d: unknown): Uint8Array {
  if (d instanceof Uint8Array) return d;
  const b = (d as { buffer?: Uint8Array }).buffer;
  return b instanceof Uint8Array ? b : new Uint8Array(0);
}
