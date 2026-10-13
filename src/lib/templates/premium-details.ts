import type { Layer, OrnamentLayer, Paint } from "../design/types";
import { T } from "./kit";

export interface TextStyle {
  font: string;
  size: number;
  fill: Paint;
  weight?: number;
  italic?: boolean;
  spacing?: number;
  upper?: boolean;
  lineHeight?: number;
}

export interface Section {
  label: string;
  strong?: string;
  strongLines?: number;
  body?: string[];
  /** extra vertical space after this section (default: sectionGap) */
  after?: number;
}

export interface SectionOpts {
  x: number;
  width: number;
  y0: number;
  label: TextStyle;
  strong: TextStyle;
  body: TextStyle;
  sectionGap?: number;
  /** Called between sections with the y of the separator. */
  sep?: (y: number) => OrnamentLayer;
  sepSpace?: number;
}

/** Stacked label / headline / body sections with auto vertical flow. Returns layers and the final y. */
export function sections(secs: Section[], o: SectionOpts): { layers: Layer[]; endY: number } {
  const out: Layer[] = [];
  let y = o.y0;
  const gap = o.sectionGap ?? 56;
  const sepSpace = o.sepSpace ?? 0;
  secs.forEach((s, i) => {
    const l = o.label;
    out.push(
      T(s.label, y, {
        x: o.x,
        width: o.width,
        fontFamily: l.font,
        fontSize: l.size,
        fill: l.fill,
        fontWeight: l.weight ?? 500,
        letterSpacing: l.spacing ?? 6,
        uppercase: l.upper ?? true,
        italic: l.italic ?? false,
      }),
    );
    y += l.size * 1.2 + 14;
    if (s.strong) {
      const st = o.strong;
      const lh = st.lineHeight ?? 1.15;
      out.push(
        T(s.strong, y, {
          x: o.x,
          width: o.width,
          fontFamily: st.font,
          fontSize: st.size,
          fill: st.fill,
          fontWeight: st.weight ?? 500,
          italic: st.italic ?? false,
          letterSpacing: st.spacing ?? 0,
          uppercase: st.upper ?? false,
          lineHeight: lh,
        }),
      );
      y += st.size * lh * (s.strongLines ?? 1) + 8;
    }
    if (s.body?.length) {
      const b = o.body;
      const lh = b.lineHeight ?? 1.5;
      out.push(
        T(s.body.join("\n"), y, {
          x: o.x,
          width: o.width,
          fontFamily: b.font,
          fontSize: b.size,
          fill: b.fill,
          fontWeight: b.weight ?? 400,
          italic: b.italic ?? false,
          letterSpacing: b.spacing ?? 0,
          lineHeight: lh,
        }),
      );
      y += b.size * lh * s.body.length;
    }
    if (i < secs.length - 1) {
      if (o.sep) {
        const sy = y + (s.after ?? gap) / 2 - 20;
        out.push(o.sep(sy));
      }
      y += (s.after ?? gap) + sepSpace;
    }
  });
  return { layers: out, endY: y };
}
