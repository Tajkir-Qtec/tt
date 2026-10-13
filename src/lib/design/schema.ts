import { z } from "zod";

const color = z.string().min(1).max(64);
const num = z.number().finite();
const stop = z.tuple([z.number().min(0).max(1), color]);

const gradient = z.union([
  z.object({ kind: z.literal("linear"), angle: num, stops: z.array(stop).min(2).max(12) }),
  z.object({ kind: z.literal("radial"), stops: z.array(stop).min(2).max(12) }),
]);
const paint = z.union([color, gradient]);

/** Only our own media endpoint or https images are allowed. */
const imageSrc = z
  .string()
  .max(500)
  .refine((s) => s === "" || s.startsWith("/api/media/") || s.startsWith("https://"), "Invalid image source");

const base = {
  id: z.string().min(1).max(40),
  name: z.string().max(80).optional(),
  x: num,
  y: num,
  width: num.min(0).max(20000),
  height: num.min(0).max(20000),
  rotation: num,
  opacity: z.number().min(0).max(1),
  locked: z.boolean().optional(),
  hidden: z.boolean().optional(),
};

const textLayer = z.object({
  ...base,
  type: z.literal("text"),
  text: z.string().max(2000),
  fontFamily: z.string().min(1).max(80),
  fontSize: num.min(1).max(1000),
  fontWeight: num.min(100).max(900),
  italic: z.boolean(),
  fill: paint,
  align: z.enum(["left", "center", "right", "justify"]),
  letterSpacing: num.min(-50).max(200),
  lineHeight: num.min(0.5).max(4),
  uppercase: z.boolean().optional(),
  shadow: z
    .object({ color, blur: num.min(0).max(200), offsetX: num, offsetY: num, opacity: z.number().min(0).max(1) })
    .optional(),
});

const shapeLayer = z.object({
  ...base,
  type: z.literal("shape"),
  shape: z.enum(["rect", "ellipse"]),
  fill: paint.nullable(),
  stroke: color.nullable(),
  strokeWidth: num.min(0).max(500),
  cornerRadius: num.min(0).max(5000),
  dash: z.array(num.min(0).max(1000)).max(8).optional(),
});

const ornamentLayer = z.object({
  ...base,
  type: z.literal("ornament"),
  vbW: num.min(1).max(20000),
  vbH: num.min(1).max(20000),
  parts: z
    .array(
      z.object({
        d: z.string().max(400_000),
        fill: paint.nullable(),
        stroke: color.nullable(),
        strokeWidth: num.min(0).max(500),
        opacity: z.number().min(0).max(1).optional(),
        lineCap: z.enum(["butt", "round", "square"]).optional(),
        lineJoin: z.enum(["miter", "round", "bevel"]).optional(),
      }),
    )
    .min(1)
    .max(40),
  flipX: z.boolean().optional(),
  flipY: z.boolean().optional(),
});

const imageLayer = z.object({
  ...base,
  type: z.literal("image"),
  src: imageSrc,
  mask: z.enum(["rect", "rounded", "ellipse", "arch"]),
  cornerRadius: num.min(0).max(5000),
  placeholderFill: color,
  borderColor: color.nullable(),
  borderWidth: num.min(0).max(500),
  zoom: num.min(1).max(10),
  focusX: z.number().min(0).max(1),
  focusY: z.number().min(0).max(1),
});

const layer = z.discriminatedUnion("type", [textLayer, shapeLayer, ornamentLayer, imageLayer]);

const page = z.object({
  id: z.string().min(1).max(40),
  name: z.string().max(80).optional(),
  background: paint,
  bgImage: imageSrc.nullable().optional(),
  layers: z.array(layer).max(400),
});

export const designSchema = z.object({
  version: z.literal(1),
  width: num.min(200).max(4000),
  height: num.min(200).max(4000),
  pages: z.array(page).min(1).max(12),
});

export const viewModeSchema = z.enum(["single", "flip", "scroll"]);

export const metaSchema = z.object({
  coupleNames: z.string().max(160),
  eventDate: z.string().max(10),
  venue: z.string().max(200),
  city: z.string().max(120),
  description: z.string().max(400),
});

export const envelopeSchema = z.object({
  enabled: z.boolean(),
  color: z.enum(["ivory", "blush", "sage", "navy", "burgundy", "emerald", "charcoal", "gold"]),
});

export const cardUpdateSchema = z
  .object({
    title: z.string().min(1).max(120),
    rsvpEnabled: z.boolean(),
    envelope: envelopeSchema,
    design: designSchema,
    viewMode: viewModeSchema,
    meta: metaSchema,
  })
  .partial();
