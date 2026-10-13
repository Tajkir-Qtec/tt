import {
  archFrame,
  banner,
  blossom,
  corner,
  crescent,
  decoFrame,
  diamondLattice,
  divider,
  flower,
  heart,
  islamicPattern,
  islamicStar,
  mandala,
  paisley,
  rainbow,
  rings,
  ringsDots,
  scallops,
  sparkle,
  sprig,
  star,
  sunburst,
  ticketFrame,
  wreath,
} from "@/lib/design/ornaments";
import type { OrnamentData } from "@/lib/design/path";
import { makeOrnament, makeShape, makeText } from "@/lib/design/layers";
import type { Layer, TextLayer } from "@/lib/design/types";

export interface LibCtx {
  color: string;
  accent: string;
  W: number;
  H: number;
}

export interface LibItem {
  id: string;
  label: string;
  group: "Shapes" | "Frames" | "Corners" | "Dividers" | "Florals" | "Patterns" | "Symbols";
  /** Vector artwork (undefined for plain shapes). */
  data?: (c: LibCtx) => OrnamentData;
  /** Width as a fraction of the page width. */
  widthFrac?: number;
  /** Height as a fraction of the page height (frames that should fit the page). */
  heightFrac?: number;
  shape?: "rect" | "rounded" | "circle" | "line";
}

const o = (
  id: string,
  label: string,
  group: LibItem["group"],
  data: (c: LibCtx) => OrnamentData,
  widthFrac: number,
  heightFrac?: number,
): LibItem => ({ id, label, group, data, widthFrac, heightFrac });

export const LIBRARY: LibItem[] = [
  { id: "rect", label: "Rectangle", group: "Shapes", shape: "rect" },
  { id: "rounded", label: "Rounded", group: "Shapes", shape: "rounded" },
  { id: "circle", label: "Circle", group: "Shapes", shape: "circle" },
  { id: "line", label: "Line", group: "Shapes", shape: "line" },

  o("arch", "Arch frame", "Frames", (c) => archFrame({ w: c.W * 0.78, h: c.H * 0.86, stroke: c.color, strokeWidth: 3, lines: 2, gap: 14 }), 0.78),
  o("ticket", "Ticket border", "Frames", (c) => ticketFrame({ w: c.W * 0.86, h: c.H * 0.9, r: 44, stroke: c.color, strokeWidth: 2.5, lines: 2, gap: 14 }), 0.86),
  o("deco", "Deco border", "Frames", (c) => decoFrame({ w: c.W * 0.86, h: c.H * 0.9, cut: 46, stroke: c.color, strokeWidth: 3, lines: 2, gap: 16 }), 0.86),
  o("ring-dots", "Dotted ring", "Frames", (c) => ringsDots({ color: c.color, size: 400 }), 0.5),

  o("corner-fan", "Fan corner", "Corners", (c) => corner({ style: "fan", size: 220, color: c.color }), 0.22),
  o("corner-flourish", "Flourish", "Corners", (c) => corner({ style: "flourish", size: 220, color: c.color }), 0.22),
  o("corner-bracket", "Bracket", "Corners", (c) => corner({ style: "bracket", size: 220, color: c.color }), 0.2),
  o("corner-ornate", "Ornate", "Corners", (c) => corner({ style: "ornate", size: 220, color: c.color }), 0.22),

  o("div-diamond", "Diamond", "Dividers", (c) => divider({ style: "diamond", w: 420, color: c.color }), 0.4),
  o("div-leaf", "Leaf", "Dividers", (c) => divider({ style: "leaf", w: 420, color: c.color }), 0.4),
  o("div-wave", "Wave", "Dividers", (c) => divider({ style: "wave", w: 420, color: c.color }), 0.4),
  o("div-dots", "Dots", "Dividers", (c) => divider({ style: "dots", w: 420, color: c.color }), 0.4),
  o("div-stars", "Sparkle", "Dividers", (c) => divider({ style: "stars", w: 420, color: c.color }), 0.4),
  o("div-floral", "Floral", "Dividers", (c) => divider({ style: "floral", w: 420, color: c.color }), 0.4),
  o("div-double", "Double", "Dividers", (c) => divider({ style: "double", w: 420, color: c.color }), 0.4),

  o("sprig-olive", "Olive sprig", "Florals", (c) => sprig({ color: c.color, length: 420, leaves: 7, leafLen: 62, leafW: 16, berryColor: c.accent }), 0.5),
  o("sprig-euc", "Eucalyptus", "Florals", (c) => sprig({ color: c.color, length: 420, leaves: 8, leafLen: 50, leafW: 22, round: true, alternate: true, curve: 50 }), 0.5),
  o("wreath", "Laurel wreath", "Florals", (c) => wreath({ color: c.color, radius: 250, berryColor: c.accent }), 0.6),
  o("peony", "Peony", "Florals", (c) => flower({ color: c.color, stroke: "#ffffff", radius: 160 }), 0.34),
  o("blossom", "Blossom", "Florals", (c) => blossom({ color: c.color, center: c.accent, radius: 70 }), 0.14),
  o("paisley", "Paisley", "Florals", (c) => paisley({ color: c.color, size: 170 }), 0.18),

  o("mandala", "Mandala", "Patterns", (c) => mandala({ color: c.color, accent: c.accent, size: 440 }), 0.55),
  o("islamic-star", "Eight-point star", "Patterns", (c) => islamicStar({ color: c.color, size: 300 }), 0.3),
  o("islamic-pattern", "Star lattice", "Patterns", (c) => islamicPattern({ color: c.color, w: c.W, h: c.H, cell: 110 }), 1, 1),
  o("lattice", "Diamond lattice", "Patterns", (c) => diamondLattice({ color: c.color, w: c.W, h: c.H }), 1, 1),
  o("scallops", "Scallops", "Patterns", (c) => scallops({ color: c.color, w: c.W, r: 26 }), 1),
  o("sunburst", "Sunburst", "Patterns", (c) => sunburst({ color: c.color, size: 520 }), 0.6),
  o("rainbow", "Rainbow arcs", "Patterns", (c) => rainbow({ colors: [c.color, c.accent, c.color, c.accent], size: 500 }), 0.5),

  o("heart", "Heart", "Symbols", (c) => heart({ color: c.color, size: 140 }), 0.14),
  o("heart-line", "Heart outline", "Symbols", (c) => heart({ color: c.color, size: 140, fill: false }), 0.14),
  o("star", "Star", "Symbols", (c) => star({ color: c.color, size: 120 }), 0.12),
  o("sparkle", "Sparkle", "Symbols", (c) => sparkle({ color: c.color, size: 120 }), 0.12),
  o("crescent", "Crescent", "Symbols", (c) => crescent({ color: c.color, size: 160 }), 0.16),
  o("rings", "Wedding rings", "Symbols", (c) => rings({ color: c.color, size: 200 }), 0.2),
  o("banner", "Ribbon banner", "Symbols", (c) => banner({ color: c.color }), 0.56),
];

export const LIB_GROUPS: LibItem["group"][] = ["Shapes", "Frames", "Corners", "Dividers", "Florals", "Patterns", "Symbols"];

/** Create the layer for a library item, centred on the page. */
export function buildLibLayer(item: LibItem, c: LibCtx): Layer {
  if (item.shape) {
    const size = c.W * 0.3;
    if (item.shape === "line") {
      return makeShape({ x: (c.W - c.W * 0.4) / 2, y: c.H / 2, width: c.W * 0.4, height: 3, fill: c.color, name: "Line" });
    }
    return makeShape({
      shape: item.shape === "circle" ? "ellipse" : "rect",
      cornerRadius: item.shape === "rounded" ? 40 : 0,
      x: (c.W - size) / 2,
      y: (c.H - size) / 2,
      width: size,
      height: size,
      fill: c.color,
      name: item.label,
    });
  }
  const data = item.data!(c);
  const width = c.W * (item.widthFrac ?? 0.4);
  const layer = makeOrnament(data, { width, name: item.label });
  if (item.heightFrac) {
    layer.height = c.H * item.heightFrac;
    layer.width = c.W * (item.widthFrac ?? 1);
  }
  layer.x = (c.W - layer.width) / 2;
  layer.y = (c.H - layer.height) / 2;
  return layer;
}

export interface TextPreset {
  id: string;
  label: string;
  sample: string;
  make: (c: { W: number; H: number; color: string }) => TextLayer;
}

const tp = (id: string, label: string, sample: string, build: Partial<TextLayer> & { text: string }): TextPreset => ({
  id,
  label,
  sample,
  make: ({ W, H, color }) => {
    const width = build.width ?? W * 0.7;
    return makeText({ fill: color, ...build, width, x: (W - width) / 2, y: H * 0.4, name: label });
  },
});

export const TEXT_PRESETS: TextPreset[] = [
  tp("heading", "Heading", "Heading", { text: "Heading", fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 96, lineHeight: 1.05 }),
  tp("script", "Script names", "Amelia & James", {
    text: "Amelia & James",
    fontFamily: "Pinyon Script",
    fontSize: 130,
    lineHeight: 1.1,
    width: 820,
  }),
  tp("sub", "Small caps", "SAVE THE DATE", {
    text: "Save the date",
    fontFamily: "Jost",
    fontSize: 26,
    letterSpacing: 9,
    uppercase: true,
    fontWeight: 400,
  }),
  tp("date", "Date", "14 · 06 · 2027", { text: "14 · 06 · 2027", fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 72 }),
  tp("body", "Body text", "Your message here", {
    text: "Join us as we celebrate our wedding with family and friends.",
    fontFamily: "Jost",
    fontSize: 28,
    lineHeight: 1.5,
    fontWeight: 300,
  }),
  tp("italic", "Italic line", "with love", { text: "with love", fontFamily: "Cormorant Garamond", italic: true, fontSize: 44 }),
  tp("guest", "Guest name", "Dear {to},", {
    text: "Dear {to},",
    fontFamily: "Cormorant Garamond",
    italic: true,
    fontSize: 44,
    name: "Guest name",
  }),
  tp("arabic", "Bismillah", "بسم الله", {
    text: "بسم الله الرحمن الرحيم",
    fontFamily: "Amiri",
    fontSize: 58,
    width: 820,
  }),
];
