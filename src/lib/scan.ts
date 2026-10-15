/** In-browser "document scanner": find the card in a photo, straighten it, tidy the colours. */

export interface Pt {
  x: number;
  y: number;
}
/** Corners in order TL, TR, BR, BL, as fractions (0..1) of the image. */
export type Quad = [Pt, Pt, Pt, Pt];

export const insetQuad = (m = 0.04): Quad => [
  { x: m, y: m },
  { x: 1 - m, y: m },
  { x: 1 - m, y: 1 - m },
  { x: m, y: 1 - m },
];

type Src = HTMLCanvasElement | HTMLImageElement | ImageBitmap;
const size = (s: Src) => ("naturalWidth" in s ? { w: s.naturalWidth, h: s.naturalHeight } : { w: s.width, h: s.height });

/** Draw a source onto a canvas, optionally turned by a multiple of 90 degrees and capped in size. */
export function toCanvas(src: Src, maxSide = 3000, rotate = 0): HTMLCanvasElement {
  const { w, h } = size(src);
  const k = Math.min(1, maxSide / Math.max(w, h));
  const turn = ((rotate % 360) + 360) % 360;
  const swap = turn === 90 || turn === 270;
  const c = document.createElement("canvas");
  c.width = Math.round((swap ? h : w) * k);
  c.height = Math.round((swap ? w : h) * k);
  const g = c.getContext("2d")!;
  g.translate(c.width / 2, c.height / 2);
  g.rotate((turn * Math.PI) / 180);
  g.drawImage(src, (-w * k) / 2, (-h * k) / 2, w * k, h * k);
  return c;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Guess where the card is: it is whatever differs most from the surface it lies on. */
export function detectQuad(src: Src): { quad: Quad; confident: boolean } {
  const { w, h } = size(src);
  const k = 260 / Math.max(w, h);
  const sw = Math.max(40, Math.round(w * k));
  const sh = Math.max(40, Math.round(h * k));
  const c = document.createElement("canvas");
  c.width = sw;
  c.height = sh;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.drawImage(src, 0, 0, sw, sh);
  const px = g.getImageData(0, 0, sw, sh).data;

  // background colour = median of the outer frame
  const edge: number[][] = [[], [], []];
  const band = Math.max(2, Math.round(Math.min(sw, sh) * 0.04));
  for (let y = 0; y < sh; y++)
    for (let x = 0; x < sw; x++) {
      if (x >= band && x < sw - band && y >= band && y < sh - band) continue;
      const i = (y * sw + x) * 4;
      edge[0].push(px[i]);
      edge[1].push(px[i + 1]);
      edge[2].push(px[i + 2]);
    }
  const med = edge.map((a) => a.sort((p, q) => p - q)[a.length >> 1]);

  const hist = new Array(256).fill(0);
  const dist = new Float32Array(sw * sh);
  for (let p = 0; p < sw * sh; p++) {
    const i = p * 4;
    const d = Math.hypot(px[i] - med[0], px[i + 1] - med[1], px[i + 2] - med[2]);
    dist[p] = d;
    hist[Math.min(255, Math.round(d / 1.75))]++;
  }
  const t = otsu(hist) * 1.75;
  let mask = new Uint8Array(sw * sh);
  const cut = Math.max(24, t * 0.85);
  for (let p = 0; p < mask.length; p++) mask[p] = dist[p] > cut ? 1 : 0;
  mask = erode(erode(dilate(dilate(mask, sw, sh), sw, sh), sw, sh), sw, sh);
  const comp = largestComponent(mask, sw, sh);
  const area = comp.count / (sw * sh);
  if (area < 0.12 || area > 0.985) return { quad: insetQuad(0.04), confident: false };

  const [tl, tr, br, bl] = comp.corners;
  // pull the corners in a little so the shadow and table edge stay out of the crop
  const raw = [tl, tr, br, bl].map((p) => ({ x: p.x / sw, y: p.y / sh }));
  const cx = raw.reduce((n, p) => n + p.x, 0) / 4;
  const cy = raw.reduce((n, p) => n + p.y, 0) / 4;
  const pull = 0.018;
  const quad = raw.map((p) => ({ x: clamp01(p.x + (cx - p.x) * pull * 2), y: clamp01(p.y + (cy - p.y) * pull * 2) })) as Quad;
  return { quad, confident: area > 0.2 };
}

function otsu(hist: number[]): number {
  const total = hist.reduce((a, b) => a + b, 0);
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * hist[i];
  let sumB = 0;
  let wB = 0;
  let best = 0;
  let thr = 0;
  for (let i = 0; i < 256; i++) {
    wB += hist[i];
    if (!wB) continue;
    const wF = total - wB;
    if (!wF) break;
    sumB += i * hist[i];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const v = wB * wF * (mB - mF) * (mB - mF);
    if (v > best) {
      best = v;
      thr = i;
    }
  }
  return thr;
}

function dilate(m: Uint8Array, w: number, h: number) {
  const o = new Uint8Array(m.length);
  for (let y = 1; y < h - 1; y++)
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x;
      if (m[p] || m[p - 1] || m[p + 1] || m[p - w] || m[p + w]) o[p] = 1;
    }
  return o;
}

function erode(m: Uint8Array, w: number, h: number) {
  const o = new Uint8Array(m.length);
  for (let y = 1; y < h - 1; y++)
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x;
      if (m[p] && m[p - 1] && m[p + 1] && m[p - w] && m[p + w]) o[p] = 1;
    }
  return o;
}

function largestComponent(m: Uint8Array, w: number, h: number) {
  const seen = new Uint8Array(m.length);
  let best: { count: number; corners: Pt[] } = {
    count: 0,
    corners: [
      { x: 0, y: 0 },
      { x: w, y: 0 },
      { x: w, y: h },
      { x: 0, y: h },
    ],
  };
  const stack: number[] = [];
  for (let s = 0; s < m.length; s++) {
    if (!m[s] || seen[s]) continue;
    let count = 0;
    let minSum = Infinity;
    let maxSum = -Infinity;
    let minDiff = Infinity;
    let maxDiff = -Infinity;
    let tl: Pt = { x: 0, y: 0 };
    let br = tl;
    let tr = tl;
    let bl = tl;
    stack.push(s);
    seen[s] = 1;
    while (stack.length) {
      const p = stack.pop()!;
      const x = p % w;
      const y = (p / w) | 0;
      count++;
      const sum = x + y;
      const diff = x - y;
      if (sum < minSum) {
        minSum = sum;
        tl = { x, y };
      }
      if (sum > maxSum) {
        maxSum = sum;
        br = { x, y };
      }
      if (diff > maxDiff) {
        maxDiff = diff;
        tr = { x, y };
      }
      if (diff < minDiff) {
        minDiff = diff;
        bl = { x, y };
      }
      const nb = [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, p - w, p + w];
      for (const q of nb) {
        if (q >= 0 && q < m.length && m[q] && !seen[q]) {
          seen[q] = 1;
          stack.push(q);
        }
      }
    }
    if (count > best.count) best = { count, corners: [tl, tr, br, bl] };
  }
  return best;
}

/** Projective transform taking the unit square (u,v) onto the quad TL,TR,BR,BL. */
function homography(q: Pt[]): number[] {
  const [p0, p1, p2, p3] = q;
  const dx1 = p1.x - p2.x;
  const dx2 = p3.x - p2.x;
  const dx3 = p0.x - p1.x + p2.x - p3.x;
  const dy1 = p1.y - p2.y;
  const dy2 = p3.y - p2.y;
  const dy3 = p0.y - p1.y + p2.y - p3.y;
  if (Math.abs(dx3) < 1e-9 && Math.abs(dy3) < 1e-9) {
    return [p1.x - p0.x, p3.x - p0.x, p0.x, p1.y - p0.y, p3.y - p0.y, p0.y, 0, 0];
  }
  const det = dx1 * dy2 - dx2 * dy1 || 1e-9;
  const g = (dx3 * dy2 - dx2 * dy3) / det;
  const h = (dx1 * dy3 - dx3 * dy1) / det;
  return [p1.x - p0.x + g * p1.x, p3.x - p0.x + h * p3.x, p0.x, p1.y - p0.y + g * p1.y, p3.y - p0.y + h * p3.y, p0.y, g, h];
}

export type Enhance = "original" | "vivid" | "document";

/** Cut the quad out of `src` and flatten it into an upright rectangle. */
export function warpQuad(src: Src, quad: Quad, maxSide = 1800, enhance: Enhance = "original"): HTMLCanvasElement {
  const { w: sw, h: sh } = size(src);
  const pts = quad.map((p) => ({ x: p.x * sw, y: p.y * sh }));
  const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
  let ow = Math.max(dist(pts[0], pts[1]), dist(pts[3], pts[2]));
  let oh = Math.max(dist(pts[0], pts[3]), dist(pts[1], pts[2]));
  const k = Math.min(1, maxSide / Math.max(ow, oh));
  ow = Math.max(50, Math.round(ow * k));
  oh = Math.max(50, Math.round(oh * k));

  const sc = document.createElement("canvas");
  sc.width = sw;
  sc.height = sh;
  const sg = sc.getContext("2d", { willReadFrequently: true })!;
  sg.drawImage(src, 0, 0);
  const sd = sg.getImageData(0, 0, sw, sh).data;

  const out = document.createElement("canvas");
  out.width = ow;
  out.height = oh;
  const og = out.getContext("2d")!;
  const od = og.createImageData(ow, oh);
  const [a, b, c, d, e, f, g, h] = homography(pts);
  for (let y = 0; y < oh; y++) {
    const v = (y + 0.5) / oh;
    for (let x = 0; x < ow; x++) {
      const u = (x + 0.5) / ow;
      const den = g * u + h * v + 1;
      const X = (a * u + b * v + c) / den - 0.5;
      const Y = (d * u + e * v + f) / den - 0.5;
      const x0 = Math.max(0, Math.min(sw - 2, Math.floor(X)));
      const y0 = Math.max(0, Math.min(sh - 2, Math.floor(Y)));
      const fx = Math.min(1, Math.max(0, X - x0));
      const fy = Math.min(1, Math.max(0, Y - y0));
      const i00 = (y0 * sw + x0) * 4;
      const i01 = i00 + sw * 4;
      const o = (y * ow + x) * 4;
      for (let ch = 0; ch < 3; ch++) {
        const t = sd[i00 + ch] * (1 - fx) + sd[i00 + 4 + ch] * fx;
        const bt = sd[i01 + ch] * (1 - fx) + sd[i01 + 4 + ch] * fx;
        od.data[o + ch] = t * (1 - fy) + bt * fy;
      }
      od.data[o + 3] = 255;
    }
  }
  if (enhance !== "original") autoLevels(od, enhance === "document");
  og.putImageData(od, 0, 0);
  return out;
}

/** Stretch each channel between its 1st and 99th percentile; "document" also lifts the paper white. */
function autoLevels(img: ImageData, paper: boolean) {
  const d = img.data;
  const lo: number[] = [];
  const hi: number[] = [];
  const n = d.length / 4;
  for (let ch = 0; ch < 3; ch++) {
    const hist = new Uint32Array(256);
    for (let i = ch; i < d.length; i += 4) hist[d[i]]++;
    let acc = 0;
    let l = 0;
    let top = 255;
    for (let v = 0; v < 256; v++) {
      acc += hist[v];
      if (acc > n * 0.01) {
        l = v;
        break;
      }
    }
    acc = 0;
    for (let v = 255; v >= 0; v--) {
      acc += hist[v];
      if (acc > n * (paper ? 0.08 : 0.01)) {
        top = v;
        break;
      }
    }
    lo.push(l);
    hi.push(Math.max(l + 30, top));
  }
  for (let i = 0; i < d.length; i += 4)
    for (let ch = 0; ch < 3; ch++) d[i + ch] = Math.max(0, Math.min(255, ((d[i + ch] - lo[ch]) * 255) / (hi[ch] - lo[ch])));
}

export function canvasToFile(c: HTMLCanvasElement, name = "card.jpg", quality = 0.9): Promise<File> {
  return new Promise((res, rej) =>
    c.toBlob((b) => (b ? res(new File([b], name, { type: "image/jpeg" })) : rej(new Error("Could not export image"))), "image/jpeg", quality),
  );
}
