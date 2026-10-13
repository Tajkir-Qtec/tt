import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

declare global {
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const cached = (globalThis._mongoose ??= { conn: null, promise: null });

export async function connectDB() {
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (cached.conn) return cached.conn;
  cached.promise ??= mongoose.connect(uri, { bufferCommands: false, maxPoolSize: 10 });
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // allow a retry once the database is reachable again
    throw e;
  }
  return cached.conn;
}
