import mongoose, { Schema, type Model } from "mongoose";

const cardSchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, default: "Untitled card", maxlength: 120 },
    templateSlug: { type: String, default: null },
    design: { type: Schema.Types.Mixed, required: true },
    viewMode: { type: String, enum: ["single", "flip", "scroll"], default: "flip" },
    meta: {
      coupleNames: { type: String, default: "", maxlength: 160 },
      eventDate: { type: String, default: "", maxlength: 10 },
      venue: { type: String, default: "", maxlength: 200 },
      city: { type: String, default: "", maxlength: 120 },
      description: { type: String, default: "", maxlength: 400 },
    },
    rsvpEnabled: { type: Boolean, default: true },
    envelope: {
      enabled: { type: Boolean, default: true },
      color: { type: String, default: "ivory", maxlength: 20 },
    },
    published: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, default: null },
    /** Set by an admin takedown; the public link stops working until restored. */
    adminHidden: { type: Boolean, default: false },
    previewId: { type: String, default: null },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);
cardSchema.index({ updatedAt: -1 });

const mediaSchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true },
    kind: { type: String, enum: ["upload", "preview"], required: true },
    mime: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const rsvpSchema = new Schema(
  {
    cardId: { type: Schema.Types.ObjectId, required: true, index: true },
    ownerId: { type: String, required: true, index: true },
    attending: { type: Boolean, required: true },
    /** "Not sure yet": attending is false and maybe is true. */
    maybe: { type: Boolean, default: false },
    name: { type: String, required: true, maxlength: 80 },
    phone: { type: String, default: "", maxlength: 30 },
    /** Digits only; used to de-duplicate a guest who replies twice. */
    phoneKey: { type: String, default: "", index: true },
    guests: { type: Number, default: 1, min: 0, max: 20 },
    fromLink: { type: String, default: "", maxlength: 40 },
  },
  { timestamps: true },
);

const appUserSchema = new Schema(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, default: "", index: true },
    name: { type: String, default: "" },
    firstSeen: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now },
    blocked: { type: Boolean, default: false },
    blockedReason: { type: String, default: "" },
  },
  { timestamps: false },
);

const activitySchema = new Schema({
  at: { type: Date, default: Date.now, index: true },
  actorType: { type: String, enum: ["user", "admin", "guest", "system"], required: true },
  actorId: { type: String, default: "", index: true },
  actorEmail: { type: String, default: "" },
  action: { type: String, required: true, index: true },
  targetType: { type: String, default: "" },
  targetId: { type: String, default: "" },
  summary: { type: String, default: "", maxlength: 300 },
  meta: { type: Schema.Types.Mixed, default: null },
  ip: { type: String, default: "" },
});

const reportSchema = new Schema(
  {
    cardId: { type: Schema.Types.ObjectId, required: true, index: true },
    slug: { type: String, required: true },
    reason: { type: String, required: true, maxlength: 40 },
    details: { type: String, default: "", maxlength: 500 },
    ip: { type: String, default: "" },
    status: { type: String, enum: ["open", "resolved", "dismissed"], default: "open", index: true },
    handledBy: { type: String, default: "" },
    handledAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const dailyStatSchema = new Schema({
  day: { type: String, required: true, unique: true },
  views: { type: Number, default: 0 },
  signups: { type: Number, default: 0 },
  cards: { type: Number, default: 0 },
  published: { type: Number, default: 0 },
  rsvps: { type: Number, default: 0 },
  reports: { type: Number, default: 0 },
});

// Explicit types: InferSchemaType over these schemas makes tsc run out of memory.
export interface CardFields {
  ownerId: string;
  slug: string;
  title: string;
  templateSlug: string | null;
  design: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  viewMode: "single" | "flip" | "scroll";
  meta: { coupleNames: string; eventDate: string; venue: string; city: string; description: string };
  rsvpEnabled: boolean;
  envelope: { enabled: boolean; color: string };
  published: boolean;
  publishedAt: Date | null;
  adminHidden: boolean;
  previewId: string | null;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface MediaFields { ownerId: string; kind: "upload" | "preview"; mime: string; size: number; data: Buffer; createdAt: Date }
export interface RsvpFields { cardId: mongoose.Types.ObjectId; ownerId: string; attending: boolean; maybe?: boolean; name: string; phone: string; phoneKey: string; guests: number; fromLink: string }
export interface AppUserFields { uid: string; email: string; name: string; firstSeen: Date; lastSeen: Date; blocked: boolean; blockedReason: string }
export interface ActivityFields {
  at: Date; actorType: "user" | "admin" | "guest" | "system"; actorId: string; actorEmail: string; action: string;
  targetType: string; targetId: string; summary: string; meta: any; ip: string; // eslint-disable-line @typescript-eslint/no-explicit-any
}
export interface ReportFields { cardId: mongoose.Types.ObjectId; slug: string; reason: string; details: string; ip: string; status: string; handledBy: string; handledAt: Date | null; createdAt: Date }
export interface DailyStatFields { day: string; views: number; signups: number; cards: number; published: number; rsvps: number; reports: number }

type Stamped = { _id: mongoose.Types.ObjectId; createdAt: Date; updatedAt: Date };
export type CardDoc = CardFields & Stamped;
export type RsvpDoc = RsvpFields & Stamped;

function model<T>(name: string, schema: Schema): Model<T> {
  return (mongoose.models[name] as Model<T>) || mongoose.model<T>(name, schema as never);
}

export const Card = model<CardFields>("Card", cardSchema);
export const Media = model<MediaFields>("Media", mediaSchema);
export const Rsvp = model<RsvpFields>("Rsvp", rsvpSchema);
export const AppUser = model<AppUserFields>("AppUser", appUserSchema);
export const Activity = model<ActivityFields>("Activity", activitySchema);
export const Report = model<ReportFields>("Report", reportSchema);
export const DailyStat = model<DailyStatFields>("DailyStat", dailyStatSchema);
