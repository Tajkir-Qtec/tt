import { GUEST_TOKEN } from "../design/types";
import type { Layer } from "../design/types";
import { H, I, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { ticketFrame } from "../design/ornaments";
import { Path, type PartSpec } from "../design/path";
import { airmail, BROWN, dashedTrail, NAVY, PAPER, perforations, pg, plane, RED, stamp, suitcase, type StampKind } from "./farewell-bon-voyage.art";

const INK = "#2a2118";
const GREEN = "#3f7a4f";
const PURPLE = "#6b3f86";

const bebas = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { fontFamily: "Bebas Neue", fontSize: 40, letterSpacing: 6, fill: NAVY, ...o });

/** Faint globe lines used as a watermark. */
function globe(cx: number, cy: number, R: number): PartSpec[] {
  const out: PartSpec[] = [];
  const c = new Path();
  c.circle(cx, cy, R);
  out.push({ path: c, stroke: NAVY, strokeWidth: 2.5, opacity: 0.12 });
  const m = new Path();
  for (const k of [0.35, 0.7]) {
    m.M(cx - R * k, cy).A(R * k, R, 0, 1, 1, cx + R * k, cy).A(R * k, R, 0, 1, 1, cx - R * k, cy);
  }
  m.M(cx, cy - R).L(cx, cy + R);
  for (const k of [-0.6, -0.3, 0, 0.3, 0.6]) {
    const half = Math.sqrt(1 - k * k) * R;
    m.M(cx - half, cy + k * R).L(cx + half, cy + k * R);
  }
  out.push({ path: m, stroke: NAVY, strokeWidth: 1.8, opacity: 0.1 });
  return out;
}

const base = (): Layer[] => [pg(airmail())];

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const label = (text: string, x: number, y: number, w = 200) =>
    T(text, y, { x, width: w, align: "left", fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 18, letterSpacing: 5, fill: BROWN });
  const barcode = new Path();
  for (let i = 0, x = 752; x < 868; i++) {
    const w = 2 + ((i * 7) % 4);
    barcode.M(x, 905).L(x, 985);
    x += w + 3;
  }
  const cover = P(
    PAPER,
    [
      ...base(),
      pg(globe(500, 560, 330)),
      pg([dashedTrail([130, 360], [300, 120], [560, 205], 40)]),
      pg(plane(690, 200, 0.95, -0.28)),
      T("you are invited to a", 338, { fontFamily: "Cormorant Garamond", italic: true, fontSize: 36, fill: BROWN, letterSpacing: 2 }),
      T("Bon Voyage", 372, { x: 40, width: 920, fontFamily: "Playfair Display", italic: true, fontWeight: 700, fontSize: 150, lineHeight: 1.2, fill: NAVY }),
      T("Farewell Party", 590, { fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 44, letterSpacing: 18, uppercase: true, fill: RED }),
      T("for Nusrat Jahan", 660, { fontFamily: "Cormorant Garamond", fontWeight: 600, italic: true, fontSize: 42, fill: INK }),
      // boarding pass
      lock(O(ticketFrame({ w: 780, h: 310, r: 36, stroke: NAVY, strokeWidth: 3.5, lines: 2, gap: 9, fill: "#fffaf0" }), { x: 110, y: 740 })),
      lock(S({ x: 128, y: 758, width: 744, height: 62, cornerRadius: 10, fill: NAVY })),
      bebas("Boarding Pass", 768, { x: 150, width: 400, align: "left", fontSize: 42, fill: "#f4e8d0", letterSpacing: 10 }),
      bebas("Flight NF 2709", 774, { x: 540, width: 310, align: "right", fontSize: 30, fill: "#e6c36a", letterSpacing: 6 }),
      label("DATE", 150, 846),
      label("TIME", 385, 846),
      label("GATE", 565, 846),
      bebas("12 Sep 2027", 876, { x: 150, width: 230, align: "left", fontSize: 44, letterSpacing: 2 }),
      bebas("7:00 PM", 876, { x: 385, width: 160, align: "left", fontSize: 44, letterSpacing: 2 }),
      bebas("Rooftop", 876, { x: 565, width: 160, align: "left", fontSize: 44, letterSpacing: 2 }),
      label("VENUE", 150, 962),
      T("The Rooftop Lounge  ·  Gulshan 2, Dhaka", 988, { x: 150, width: 570, align: "left", fontFamily: "Cormorant Garamond", fontWeight: 700, fontSize: 32, fill: INK }),
      lock(S({ x: 726, y: 836, width: 3, height: 190, fill: null, stroke: BROWN, strokeWidth: 2, dash: [8, 8] })),
      bebas("DAC → YYZ", 844, { x: 736, width: 140, fontSize: 30, letterSpacing: 2 }),
      pg([{ path: barcode, stroke: INK, strokeWidth: 2.5, lineCap: "butt" }]),
      T(GUEST_TOKEN, 1074, { fontFamily: "Pinyon Script", fontSize: 58, lineHeight: 1.1, fill: NAVY }),
      ...suitcase(150, 1236, 200, 106, "#3f8a8f", "#24585c", -5),
      ...suitcase(650, 1226, 190, 116, "#b9533f", "#7c2f21", 5),
      ...suitcase(340, 1186, 330, 160),
      pg(stamp("circle", 170, 175, 150, 150, RED)),
      T("DHAKA", 128, { x: 100, width: 140, fontFamily: "Bebas Neue", fontSize: 30, letterSpacing: 4, fill: RED }),
      T("DEPARTURE", 164, { x: 100, width: 140, fontFamily: "Bebas Neue", fontSize: 24, letterSpacing: 3, fill: RED }),
      T("12·09·27", 192, { x: 100, width: 140, fontFamily: "Bebas Neue", fontSize: 24, letterSpacing: 3, fill: RED }),
    ],
    "Invitation",
  );

  /* -------------------------------- details -------------------------------- */
  const cell = (kind: StampKind, cx: number, cy: number, w: number, h: number, color: string, tag: string, time: string, sub: string): Layer[] => {
    const tw = kind === "circle" ? 200 : kind === "octagon" ? 230 : 260;
    return [
      pg(stamp(kind, cx, cy, w, h, color)),
      T(tag, cy - 98, { x: cx - tw / 2, width: tw, fontFamily: "Bebas Neue", fontSize: 32, letterSpacing: 6, fill: color }),
      T(time, cy - 60, { x: cx - tw / 2, width: tw, fontFamily: "Bebas Neue", fontSize: 84, letterSpacing: 2, lineHeight: 1.05, fill: color }),
      T(sub, cy + 44, { x: cx - tw / 2, width: tw, fontFamily: "Cormorant Garamond", fontWeight: 700, fontSize: 28, lineHeight: 1.15, fill: INK }),
    ];
  };
  const details = P(
    PAPER,
    [
      ...base(),
      pg(globe(500, 760, 380)),
      T("Travel Itinerary", 110, { x: 40, width: 920, fontFamily: "Playfair Display", italic: true, fontWeight: 700, fontSize: 96, lineHeight: 1.2, fill: NAVY }),
      T("your passport to the evening", 250, { fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 22, letterSpacing: 10, uppercase: true, fill: RED }),
      ...cell("circle", 295, 520, 300, 300, NAVY, "CHECK-IN", "7:00", "Welcome drinks"),
      ...cell("rect", 705, 520, 370, 290, RED, "DEPARTURES", "8:00", "Dinner & speeches"),
      ...cell("oval", 295, 870, 400, 300, GREEN, "IN-FLIGHT", "9:30", "Music & stories"),
      ...cell("octagon", 705, 870, 330, 330, PURPLE, "TAKE-OFF", "10:30", "Sparkler send-off"),
      pg([dashedTrail([120, 1090], [400, 1010], [690, 1085], 44)]),
      pg(plane(810, 1100, 0.62, 0.5)),
      T("Dress code: travel chic", 1210, { fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 24, letterSpacing: 8, uppercase: true, fill: RED }),
      T("Pack a story to share with Nusrat", 1262, { fontFamily: "Cormorant Garamond", italic: true, fontWeight: 600, fontSize: 38, fill: INK }),
    ],
    "Details",
  );

  /* ------------------------------ photo page ------------------------------ */
  const cancel = new Path();
  for (let k = 0; k < 5; k++) {
    const y = 250 + k * 26;
    cancel.M(640, y).C(700, y - 18, 740, y + 18, 800, y).C(850, y - 16, 890, y + 16, 940, y);
  }
  const photo = P(
    PAPER,
    [
      ...base(),
      pg(globe(500, 560, 360)),
      T("Safe Travels", 62, { x: 40, width: 920, fontFamily: "Playfair Display", italic: true, fontWeight: 700, fontSize: 92, lineHeight: 1.2, fill: NAVY }),
      lock(S({ x: 242, y: 218, width: 540, height: 640, fill: "rgba(80,50,20,0.22)" })),
      lock(S({ x: 230, y: 206, width: 540, height: 640, fill: "#fffaf0" })),
      pg([perforations(230, 206, 540, 640)]),
      I({ x: 262, y: 238, width: 476, height: 500, mask: "rect", placeholderFill: "#b9c9d8", borderColor: NAVY, borderWidth: 3 }),
      bebas("Bon Voyage", 752, { x: 262, width: 476, fontSize: 56, letterSpacing: 10 }),
      T("FAREWELL 2027", 810, { x: 262, width: 476, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 18, letterSpacing: 8, fill: RED }),
      pg([{ path: cancel, stroke: INK, strokeWidth: 3, opacity: 0.55 }, ...stamp("circle", 790, 330, 180, 180, RED)]),
      T("DHAKA", 280, { x: 700, width: 180, fontFamily: "Bebas Neue", fontSize: 28, letterSpacing: 4, fill: RED }),
      T("12 SEP", 316, { x: 700, width: 180, fontFamily: "Bebas Neue", fontSize: 36, letterSpacing: 3, fill: RED }),
      T("2027", 360, { x: 700, width: 180, fontFamily: "Bebas Neue", fontSize: 28, letterSpacing: 4, fill: RED }),
      T("Wherever the road takes you,", 900, { fontFamily: "Cormorant Garamond", italic: true, fontWeight: 600, fontSize: 42, fill: INK }),
      T("there will always be a seat at our table.", 954, { fontFamily: "Cormorant Garamond", italic: true, fontWeight: 600, fontSize: 42, fill: INK }),
      T("Bon voyage!", 1010, { fontFamily: "Pinyon Script", fontSize: 100, lineHeight: 1.2, fill: RED }),
      ...suitcase(160, 1210, 190, 106, "#3f8a8f", "#24585c", -4),
      ...suitcase(640, 1210, 200, 106, "#b9533f", "#7c2f21", 4),
      ...suitcase(360, 1170, 280, 150),
    ],
    "Photo",
  );

  return {
    slug: "farewell-bon-voyage",
    name: "Farewell Bon Voyage",
    tagline: "Vintage travel farewell party invitation with boarding pass and passport stamps",
    description:
      "A vintage-travel farewell and bon voyage party invitation with an airmail border, propeller plane, boarding-pass details, ink passport stamps and a perforated postage-stamp photo. Perfect for going-away parties, relocation send-offs and overseas study farewells.",
    categories: ["party", "vintage"],
    keywords: ["farewell party invitation template", "bon voyage party invite", "going away party boarding pass invitation", "vintage travel passport stamp invitation", "airmail farewell card", "online goodbye party invitation"],
    palette: ["#f4e8d0", "#1f3a6e", "#c4382f", "#3f7a4f", "#6b4a2b"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
