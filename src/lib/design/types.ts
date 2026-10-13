/**
 * The card design model. A card is plain JSON: pages -> layers.
 * Templates and user-made designs share this exact structure, which is what
 * lets one editor serve both "pick a template" and "design from scratch".
 */

export type GradientStop = [offset: number, color: string];

export type Gradient =
  | { kind: "linear"; angle: number; stops: GradientStop[] } // angle in degrees, 0 = left→right, 90 = top→bottom
  | { kind: "radial"; stops: GradientStop[] };

/** A solid CSS color or a gradient. */
export type Paint = string | Gradient;

export interface LayerBase {
  id: string;
  name?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked?: boolean;
  hidden?: boolean;
}

export interface TextShadow {
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
  opacity: number;
}

export interface TextLayer extends LayerBase {
  type: "text";
  /** Use {to} to place the guest's name (from the ?to= link parameter). */
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  italic: boolean;
  fill: Paint;
  align: "left" | "center" | "right" | "justify";
  letterSpacing: number;
  lineHeight: number;
  uppercase?: boolean;
  shadow?: TextShadow;
}

export interface ShapeLayer extends LayerBase {
  type: "shape";
  shape: "rect" | "ellipse";
  fill: Paint | null;
  stroke: string | null;
  strokeWidth: number;
  cornerRadius: number;
  dash?: number[];
}

export interface OrnamentPart {
  d: string;
  fill: Paint | null;
  stroke: string | null;
  strokeWidth: number;
  opacity?: number;
  lineCap?: "butt" | "round" | "square";
  lineJoin?: "miter" | "round" | "bevel";
}

/** Vector decoration made of one or more SVG paths in a shared viewBox. */
export interface OrnamentLayer extends LayerBase {
  type: "ornament";
  vbW: number;
  vbH: number;
  parts: OrnamentPart[];
  flipX?: boolean;
  flipY?: boolean;
}

export type ImageMask = "rect" | "rounded" | "ellipse" | "arch";

export interface ImageLayer extends LayerBase {
  type: "image";
  src: string;
  mask: ImageMask;
  cornerRadius: number;
  /** Fill drawn when no image has been chosen yet. */
  placeholderFill: string;
  borderColor: string | null;
  borderWidth: number;
  zoom: number; // >= 1
  focusX: number; // 0..1
  focusY: number; // 0..1
}

export type Layer = TextLayer | ShapeLayer | OrnamentLayer | ImageLayer;
export type LayerType = Layer["type"];

export interface Page {
  id: string;
  name?: string;
  background: Paint;
  bgImage?: string | null;
  layers: Layer[];
}

export interface CardDesign {
  version: 1;
  width: number;
  height: number;
  pages: Page[];
}

export type ViewMode = "single" | "flip" | "scroll";

export interface CardMeta {
  /** Shown in link previews and used for SEO / JSON-LD. All optional. */
  coupleNames: string;
  eventDate: string; // ISO date (YYYY-MM-DD) or ""
  venue: string;
  city: string;
  description: string;
}

export const SIZE_PRESETS: { id: string; label: string; width: number; height: number }[] = [
  { id: "portrait", label: "Portrait card (5×7)", width: 1000, height: 1400 },
  { id: "tall", label: "Tall card (4×9)", width: 900, height: 2025 },
  { id: "square", label: "Square (1:1)", width: 1200, height: 1200 },
  { id: "story", label: "Story (9:16)", width: 1080, height: 1920 },
  { id: "landscape", label: "Landscape (7×5)", width: 1400, height: 1000 },
];

export const GUEST_TOKEN = "{to}";
