import { nanoid } from "nanoid";
import type {
  CardDesign,
  Gradient,
  ImageLayer,
  Layer,
  OrnamentLayer,
  Page,
  Paint,
  ShapeLayer,
  TextLayer,
} from "./types";
import { GUEST_TOKEN } from "./types";
import type { OrnamentData } from "./path";

export const uid = () => nanoid(10);

const base = () => ({ id: uid(), rotation: 0, opacity: 1 });

export function makeText(p: Partial<TextLayer> & { text: string }): TextLayer {
  return {
    ...base(),
    type: "text",
    x: 0,
    y: 0,
    width: 600,
    height: 0,
    fontFamily: "Cormorant Garamond",
    fontSize: 48,
    fontWeight: 400,
    italic: false,
    fill: "#222222",
    align: "center",
    letterSpacing: 0,
    lineHeight: 1.2,
    ...p,
  };
}

export function makeShape(p: Partial<ShapeLayer> = {}): ShapeLayer {
  return {
    ...base(),
    type: "shape",
    shape: "rect",
    x: 0,
    y: 0,
    width: 200,
    height: 200,
    fill: "#cccccc",
    stroke: null,
    strokeWidth: 0,
    cornerRadius: 0,
    ...p,
  };
}

/**
 * Place ornament data on the page. If only `width` is given the height keeps the
 * artwork's aspect ratio (and vice versa).
 */
export function makeOrnament(
  data: OrnamentData,
  p: Partial<Omit<OrnamentLayer, "type" | "parts" | "vbW" | "vbH">> = {},
): OrnamentLayer {
  let { width, height } = p;
  const ratio = data.vbW / data.vbH;
  if (width != null && height == null) height = width / ratio;
  else if (height != null && width == null) width = height * ratio;
  else if (width == null && height == null) {
    width = data.vbW;
    height = data.vbH;
  }
  return {
    ...base(),
    type: "ornament",
    x: 0,
    y: 0,
    ...p,
    width: width!,
    height: height!,
    vbW: data.vbW,
    vbH: data.vbH,
    parts: data.parts,
  };
}

export function makeImage(p: Partial<ImageLayer> = {}): ImageLayer {
  return {
    ...base(),
    type: "image",
    src: "",
    mask: "rect",
    cornerRadius: 0,
    placeholderFill: "#e8e2d8",
    borderColor: null,
    borderWidth: 0,
    zoom: 1,
    focusX: 0.5,
    focusY: 0.5,
    x: 0,
    y: 0,
    width: 400,
    height: 400,
    ...p,
  };
}

export function makePage(p: Partial<Page> = {}): Page {
  return { id: uid(), background: "#ffffff", layers: [], ...p };
}

/** Return the layer rotated about its centre, with x/y computed so (cx, cy) is the pivot. */
export function centerRotate<T extends Layer>(layer: T, cx: number, cy: number, deg: number): T {
  const a = (deg * Math.PI) / 180;
  const hw = layer.width / 2;
  const hh = layer.height / 2;
  const x = cx - (hw * Math.cos(a) - hh * Math.sin(a));
  const y = cy - (hw * Math.sin(a) + hh * Math.cos(a));
  return { ...layer, x, y, rotation: deg };
}

export function cloneLayer<T extends Layer>(layer: T): T {
  return { ...structuredClone(layer), id: uid() };
}

/** Deep-clone a design assigning fresh ids (used when creating a card from a template). */
export function cloneDesign(design: CardDesign): CardDesign {
  const d = structuredClone(design);
  d.pages = d.pages.map((pg) => ({ ...pg, id: uid(), layers: pg.layers.map((l) => ({ ...l, id: uid() })) }));
  return d;
}

/* ------------------------------ colors ------------------------------ */

export function isGradient(p: Paint | null | undefined): p is Gradient {
  return typeof p === "object" && p !== null;
}

export function normColor(c: string): string {
  return c.trim().toLowerCase();
}

function mapPaint(p: Paint | null, fn: (c: string) => string): Paint | null {
  if (p == null) return p;
  if (typeof p === "string") return fn(p);
  return { ...p, stops: p.stops.map(([o, c]) => [o, fn(c)] as [number, string]) } as Gradient;
}

export function mapLayerColors<T extends Layer>(layer: T, fn: (c: string) => string): T {
  switch (layer.type) {
    case "text": {
      const l = layer as TextLayer;
      return {
        ...l,
        fill: mapPaint(l.fill, fn) as Paint,
        shadow: l.shadow ? { ...l.shadow, color: fn(l.shadow.color) } : undefined,
      } as unknown as T;
    }
    case "shape": {
      const l = layer as ShapeLayer;
      return { ...l, fill: mapPaint(l.fill, fn), stroke: l.stroke ? fn(l.stroke) : null } as unknown as T;
    }
    case "ornament": {
      const l = layer as OrnamentLayer;
      return {
        ...l,
        parts: l.parts.map((pt) => ({ ...pt, fill: mapPaint(pt.fill, fn), stroke: pt.stroke ? fn(pt.stroke) : null })),
      } as unknown as T;
    }
    case "image": {
      const l = layer as ImageLayer;
      return {
        ...l,
        placeholderFill: fn(l.placeholderFill),
        borderColor: l.borderColor ? fn(l.borderColor) : null,
      } as unknown as T;
    }
  }
}

export function mapPageColors(page: Page, fn: (c: string) => string): Page {
  return { ...page, background: mapPaint(page.background, fn) as Paint, layers: page.layers.map((l) => mapLayerColors(l, fn)) };
}

/** Distinct solid colors used on the page(s), most frequent first. */
export function collectColors(pages: Page[]): string[] {
  const counts = new Map<string, number>();
  const add = (c: string) => {
    const k = normColor(c);
    counts.set(k, (counts.get(k) ?? 0) + 1);
    return c;
  };
  for (const pg of pages) mapPageColors(pg, add);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c);
}

export function replaceColor(pages: Page[], from: string, to: string): Page[] {
  const key = normColor(from);
  return pages.map((pg) => mapPageColors(pg, (c) => (normColor(c) === key ? to : c)));
}

/* ----------------------------- guest name ---------------------------- */

export function hasGuestToken(pages: Page[]): boolean {
  return pages.some((p) => p.layers.some((l) => l.type === "text" && l.text.includes(GUEST_TOKEN)));
}

/** Only letters, marks, digits and a few punctuation characters; max 40 chars. */
export function sanitizeGuestName(raw: string | null | undefined): string {
  if (!raw) return "";
  const cleaned = raw
    .normalize("NFC")
    .replace(/[^\p{L}\p{M}\p{N} .,'&\-]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  return [...cleaned].slice(0, 40).join("");
}

/**
 * Apply the guest's name to a design. Layers containing {to} are hidden when no
 * name was given; a design with no {to} token is returned untouched, so a stray
 * ?to= parameter can never alter a card that wasn't designed for it.
 */
export function applyGuestName(pages: Page[], guest: string): Page[] {
  if (!hasGuestToken(pages)) return pages;
  return pages.map((pg) => ({
    ...pg,
    layers: pg.layers.flatMap((l) => {
      if (l.type !== "text" || !l.text.includes(GUEST_TOKEN)) return [l];
      if (!guest) return [];
      return [{ ...l, text: l.text.split(GUEST_TOKEN).join(guest) }];
    }),
  }));
}

/* ------------------------------- fonts ------------------------------- */

export function collectFonts(pages: Page[]): { family: string; weight: number; italic: boolean }[] {
  const seen = new Map<string, { family: string; weight: number; italic: boolean }>();
  for (const pg of pages)
    for (const l of pg.layers)
      if (l.type === "text") {
        const k = `${l.fontFamily}|${l.fontWeight}|${l.italic}`;
        if (!seen.has(k)) seen.set(k, { family: l.fontFamily, weight: l.fontWeight, italic: l.italic });
      }
  return [...seen.values()];
}

export function collectImages(pages: Page[]): string[] {
  const out = new Set<string>();
  for (const pg of pages) {
    if (pg.bgImage) out.add(pg.bgImage);
    for (const l of pg.layers) if (l.type === "image" && l.src) out.add(l.src);
  }
  return [...out];
}
