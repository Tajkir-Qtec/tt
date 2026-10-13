import { makeImage, makeOrnament, makePage, makeShape, makeText, uid } from "../design/layers";
import type { OrnamentData } from "../design/path";
import type { ImageLayer, Layer, OrnamentLayer, Page, Paint, ShapeLayer, TextLayer } from "../design/types";

export const W = 1000;
export const H = 1400;

export interface TemplateDef {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** e.g. "floral", "islamic", "minimal" */
  categories: string[];
  keywords: string[];
  palette: string[];
  width: number;
  height: number;
  pages: Page[];
}

export const GOLD: Paint = {
  kind: "linear",
  angle: 100,
  stops: [
    [0, "#8a6a2f"],
    [0.22, "#e9cf8a"],
    [0.45, "#b88a3e"],
    [0.7, "#f3dfa2"],
    [1, "#9a7433"],
  ],
};

export const ROSE_GOLD: Paint = {
  kind: "linear",
  angle: 100,
  stops: [
    [0, "#a8665c"],
    [0.3, "#f0c3b0"],
    [0.55, "#c8857a"],
    [0.8, "#f6d5c4"],
    [1, "#b0726a"],
  ],
};

export const SILVER: Paint = {
  kind: "linear",
  angle: 100,
  stops: [
    [0, "#8b929c"],
    [0.3, "#eef1f5"],
    [0.55, "#aab1bb"],
    [0.8, "#f5f7fa"],
    [1, "#8b929c"],
  ],
};

export const linear = (angle: number, ...stops: [number, string][]): Paint => ({ kind: "linear", angle, stops });
export const radial = (...stops: [number, string][]): Paint => ({ kind: "radial", stops });

type TextOpts = Partial<Omit<TextLayer, "type" | "text">>;

/** Centered text spanning the page width minus `margin` on each side. */
export function T(text: string, y: number, o: TextOpts = {}): TextLayer {
  const margin = 120;
  return makeText({ text, y, x: o.x ?? margin, width: o.width ?? W - (o.x ?? margin) * 2, ...o });
}

export function S(o: Partial<Omit<ShapeLayer, "type">>): ShapeLayer {
  return makeShape(o);
}

/** Ornament centred horizontally unless x is given. */
export function O(data: OrnamentData, o: Partial<Omit<OrnamentLayer, "type" | "parts" | "vbW" | "vbH">> & { cx?: number }): OrnamentLayer {
  const { cx, ...rest } = o;
  const layer = makeOrnament(data, rest);
  if (cx != null) layer.x = cx - layer.width / 2;
  return layer;
}

export function I(o: Partial<Omit<ImageLayer, "type">>): ImageLayer {
  return makeImage(o);
}

export function P(background: Paint, layers: Layer[], name?: string): Page {
  return makePage({ background, layers, name });
}

/** Mark layers as locked (decorative backgrounds shouldn't be grabbed by accident). */
export const lock = <T extends Layer>(l: T): T => ({ ...l, locked: true });

export const stableId = (slug: string, i: number) => `${slug}-${i}`;
export { uid };
