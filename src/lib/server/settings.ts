import { connectDB } from "./db";
import { Setting } from "./models";

export interface AppSettings {
  announcement: { active: boolean; level: "info" | "success" | "warning"; text: string };
  maintenance: { on: boolean; message: string };
  signupsOpen: boolean;
  maxCardsPerUser: number;
  maxUploadsPerUser: number;
  rsvpOpen: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  announcement: { active: false, level: "info", text: "" },
  maintenance: { on: false, message: "We’re making a few improvements. Please check back shortly." },
  signupsOpen: true,
  maxCardsPerUser: 100,
  maxUploadsPerUser: 300,
  rsvpOpen: true,
};

let cache: { at: number; value: AppSettings } | null = null;

function merge(raw: Partial<AppSettings> | null | undefined): AppSettings {
  const r = raw ?? {};
  return {
    ...DEFAULT_SETTINGS,
    ...r,
    announcement: { ...DEFAULT_SETTINGS.announcement, ...(r.announcement ?? {}) },
    maintenance: { ...DEFAULT_SETTINGS.maintenance, ...(r.maintenance ?? {}) },
  };
}

/** Platform switches the admin can change at runtime (cached for a few seconds). */
export async function getSettings(): Promise<AppSettings> {
  if (cache && Date.now() - cache.at < 8000) return cache.value;
  await connectDB();
  const doc = await Setting.findOne({ key: "app" }).lean();
  const value = merge(doc?.value as Partial<AppSettings> | undefined);
  cache = { at: Date.now(), value };
  return value;
}

export async function saveSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
  const next = merge({ ...(await getSettings()), ...patch });
  await connectDB();
  await Setting.findOneAndUpdate({ key: "app" }, { $set: { value: next } }, { upsert: true });
  cache = { at: Date.now(), value: next };
  return next;
}
