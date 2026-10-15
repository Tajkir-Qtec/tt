import { devBypass, getFirebaseAuth } from "./firebase";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function authHeaders(): Promise<Record<string, string>> {
  const auth = getFirebaseAuth();
  if (auth) {
    await auth.authStateReady();
    const user = auth.currentUser;
    if (user) return { Authorization: `Bearer ${await user.getIdToken()}` };
    return {};
  }
  if (devBypass) return { "x-dev-user": "demo" };
  return {};
}

export async function api<T = unknown>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const headers: Record<string, string> = { ...(await authHeaders()), ...(init.headers as Record<string, string>) };
  let body = init.body;
  if (init.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(init.json);
  }
  const res = await fetch(path, { ...init, headers, body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, (data as { error?: string }).error ?? `Request failed (${res.status})`);
  return data as T;
}

/** Resize in the browser before upload so phone photos don't bloat the database. */
export async function resizeImage(file: File, maxSide = 1800): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error("Please choose a JPG, PNG or WebP image.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  if (scale === 1 && file.size < 1_500_000) return file;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  const keepPng = file.type === "image/png";
  const blob = await new Promise<Blob>((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error("Could not process image"))), keepPng ? "image/png" : "image/jpeg", 0.88),
  );
  return new File([blob], keepPng ? "image.png" : "image.jpg", { type: blob.type });
}

export async function uploadImage(file: File): Promise<string> {
  const small = await resizeImage(file);
  const form = new FormData();
  form.append("file", small);
  const res = await api<{ url: string }>("/api/media", { method: "POST", body: form });
  return res.url;
}

/** Authenticated download (for CSV exports). */
export async function apiBlob(path: string): Promise<Blob> {
  const res = await fetch(path, { headers: await authHeaders() });
  if (!res.ok) throw new ApiError(res.status, "Download failed");
  return res.blob();
}
