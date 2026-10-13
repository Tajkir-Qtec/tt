import { divider, type DividerStyle } from "../design/ornaments";
import type { Layer, Paint } from "../design/types";
import { O, T, W } from "./kit";

export interface DetailsStyle {
  heading?: string;
  headFont: string;
  headWeight?: number;
  headItalic?: boolean;
  headSize?: number;
  headFill: Paint;
  headUpper?: boolean;
  headSpacing?: number;
  bodyFont: string;
  bodyWeight?: number;
  bodyFill: string;
  /** Large lines (times, venue name). */
  strongFont?: string;
  strongWeight?: number;
  strongFill?: Paint;
  strongSize?: number;
  labelFont?: string;
  labelWeight?: number;
  labelFill: string;
  labelSize?: number;
  labelSpacing?: number;
  accent: string;
  divider?: DividerStyle;
  y0?: number;
  x?: number;
  width?: number;
  gap?: number;
}

/** A consistent "details" page: events, venue and dress code. */
export function detailsLayers(s: DetailsStyle): Layer[] {
  const x = s.x ?? 150;
  const width = s.width ?? W - x * 2;
  const out: Layer[] = [];
  let y = s.y0 ?? 150;
  const gap = s.gap ?? 1;
  const strongSize = s.strongSize ?? 44;
  const labelSize = s.labelSize ?? 19;
  const labelFont = s.labelFont ?? s.bodyFont;
  const strongFont = s.strongFont ?? s.headFont;

  out.push(
    T(s.heading ?? "The Details", y, {
      x,
      width,
      fontFamily: s.headFont,
      fontWeight: s.headWeight ?? 400,
      italic: s.headItalic ?? false,
      fontSize: s.headSize ?? 78,
      fill: s.headFill,
      uppercase: s.headUpper,
      letterSpacing: s.headSpacing ?? 0,
    }),
  );
  y += (s.headSize ?? 78) * 1.45;
  out.push(O(divider({ style: s.divider ?? "diamond", w: 360, color: s.accent }), { cx: W / 2, y, width: 360 }));
  y += 80 * gap;

  const label = (text: string, yy: number) =>
    T(text, yy, {
      x,
      width,
      fontFamily: labelFont,
      fontWeight: s.labelWeight ?? 500,
      fontSize: labelSize,
      fill: s.labelFill,
      letterSpacing: s.labelSpacing ?? 6,
      uppercase: true,
    });
  const strong = (text: string, yy: number, size = strongSize) =>
    T(text, yy, {
      x,
      width,
      fontFamily: strongFont,
      fontWeight: s.strongWeight ?? 500,
      fontSize: size,
      fill: s.strongFill ?? s.headFill,
      lineHeight: 1.15,
    });
  const body = (text: string, yy: number, size = 24) =>
    T(text, yy, { x, width, fontFamily: s.bodyFont, fontWeight: s.bodyWeight ?? 400, fontSize: size, fill: s.bodyFill, lineHeight: 1.45 });

  const events: [string, string][] = [
    ["Ceremony", "4:00 PM"],
    ["Cocktail Hour", "5:00 PM"],
    ["Dinner & Dancing", "6:30 PM"],
  ];
  for (const [name, time] of events) {
    out.push(label(name, y));
    out.push(strong(time, y + labelSize * 1.9));
    y += 118 * gap;
  }
  y += 6;
  out.push(O(divider({ style: "dots", w: 300, color: s.accent }), { cx: W / 2, y, width: 300 }));
  y += 70 * gap;
  out.push(label("Venue", y));
  out.push(strong("Rosewood Gardens", y + labelSize * 1.9, strongSize * 0.9));
  out.push(body("12 Willow Lane, Napa Valley\nCalifornia 94558", y + labelSize * 1.9 + strongSize * 1.25));
  y += 205 * gap;
  out.push(label("Dress Code", y));
  out.push(body("Garden formal", y + labelSize * 1.9));
  y += 130 * gap;
  out.push(label("Dinner & Dancing", y));
  out.push(body("Celebrate with us into the evening", y + labelSize * 1.9));
  return out;
}
