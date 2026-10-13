import type { Paint } from "@/lib/design/types";

type Props = Record<string, unknown>;

/**
 * Convert a Paint into Konva fill props. `origin` tells where the local (0,0) is:
 * "tl" for top-left anchored nodes (Rect, Text, Path) or "center" for Ellipse.
 */
export function fillProps(paint: Paint | null | undefined, w: number, h: number, origin: "tl" | "center" = "tl"): Props {
  if (paint == null) return {};
  if (typeof paint === "string") return { fill: paint };
  const stops = paint.stops.flatMap(([o, c]) => [o, c]);
  const cx = origin === "center" ? 0 : w / 2;
  const cy = origin === "center" ? 0 : h / 2;
  if (paint.kind === "radial") {
    const r = Math.max(w, h) / 2;
    return {
      fillRadialGradientStartPoint: { x: cx, y: cy },
      fillRadialGradientEndPoint: { x: cx, y: cy },
      fillRadialGradientStartRadius: 0,
      fillRadialGradientEndRadius: r,
      fillRadialGradientColorStops: stops,
    };
  }
  const a = (paint.angle * Math.PI) / 180;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const half = (Math.abs(w * dx) + Math.abs(h * dy)) / 2;
  return {
    fillLinearGradientStartPoint: { x: cx - dx * half, y: cy - dy * half },
    fillLinearGradientEndPoint: { x: cx + dx * half, y: cy + dy * half },
    fillLinearGradientColorStops: stops,
  };
}

/** Stroke only supports solid colors in our model. */
export function strokeProps(color: string | null | undefined, width: number): Props {
  if (!color || width <= 0) return {};
  return { stroke: color, strokeWidth: width };
}
