import { divider, type DividerStyle } from "../design/ornaments";
import type { Layer, Paint } from "../design/types";
import { O, T, W } from "./kit";

export interface WDetails {
  heading: string;
  headFont: string;
  headSize: number;
  headFill: Paint;
  headItalic?: boolean;
  headWeight?: number;
  labelFont: string;
  labelFill: Paint;
  labelWeight?: number;
  labelSpacing?: number;
  strongFont: string;
  strongFill: Paint;
  strongWeight?: number;
  strongItalic?: boolean;
  bodyFont: string;
  bodyFill: string;
  bodyItalic?: boolean;
  accent: string;
  divider: DividerStyle;
  dividerAfter?: DividerStyle;
  events: [string, string][];
  venue: string;
  address: string;
  dress: [string, string];
  closing: [string, string];
  y0: number;
  x?: number;
  width?: number;
  gap?: number;
}

/** Custom details page: schedule, venue, dress code and a closing line (no RSVP / contacts). */
export function wDetails(s: WDetails): Layer[] {
  const x = s.x ?? 180;
  const width = s.width ?? W - x * 2;
  const g = s.gap ?? 1;
  const out: Layer[] = [];
  let y = s.y0;
  const label = (t: string, yy: number) =>
    T(t, yy, { x, width, fontFamily: s.labelFont, fontWeight: s.labelWeight ?? 500, fontSize: 19, fill: s.labelFill, letterSpacing: s.labelSpacing ?? 7, uppercase: true });
  const strong = (t: string, yy: number, size: number) =>
    T(t, yy, { x, width, fontFamily: s.strongFont, fontWeight: s.strongWeight ?? 500, italic: s.strongItalic, fontSize: size, fill: s.strongFill, lineHeight: 1.15 });
  const body = (t: string, yy: number, size = 25) =>
    T(t, yy, { x, width, fontFamily: s.bodyFont, italic: s.bodyItalic, fontSize: size, fill: s.bodyFill, lineHeight: 1.45 });

  out.push(T(s.heading, y, { x, width, fontFamily: s.headFont, fontWeight: s.headWeight ?? 400, italic: s.headItalic, fontSize: s.headSize, fill: s.headFill }));
  y += s.headSize * 1.4;
  out.push(O(divider({ style: s.divider, w: 360, color: s.accent }), { cx: W / 2, y, width: 360 }));
  y += 85 * g;
  for (const [name, time] of s.events) {
    out.push(label(name, y));
    out.push(strong(time, y + 38, 50));
    y += 124 * g;
  }
  y += 4;
  out.push(O(divider({ style: s.dividerAfter ?? "dots", w: 300, color: s.accent }), { cx: W / 2, y, width: 300 }));
  y += 66 * g;
  out.push(label("Venue", y));
  out.push(strong(s.venue, y + 38, 44));
  out.push(body(s.address, y + 100));
  y += 230 * g;
  out.push(label(s.dress[0], y));
  out.push(body(s.dress[1], y + 38, 27));
  y += 118 * g;
  out.push(label(s.closing[0], y));
  out.push(body(s.closing[1], y + 38, 27));
  return out;
}
