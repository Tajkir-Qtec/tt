import mongoose from "mongoose";
import { HttpError, requireUser } from "@/lib/server/auth";
import { connectDB } from "@/lib/server/db";
import { Rsvp } from "@/lib/server/models";
import { handle, json } from "@/lib/server/http";
import { findOwned } from "@/lib/server/cards";

export const DELETE = handle(async (req: Request, ctx: RouteContext<"/api/cards/[id]/rsvps/[rid]">) => {
  const user = await requireUser(req);
  const { id, rid } = await ctx.params;
  if (!mongoose.isValidObjectId(rid)) throw new HttpError(404, "Not found");
  await connectDB();
  const card = await findOwned(id, user.uid);
  await Rsvp.deleteOne({ _id: rid, cardId: card._id });
  return json({ ok: true });
});
