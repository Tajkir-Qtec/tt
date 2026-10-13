import { archFrame, divider, rainbow, scallops, sunburst } from "../design/ornaments";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";

const CREAM = "#f8efe1";
const SAND = "#ead7b8";
const TERRA = "#bf5a38";
const ORANGE = "#d98241";
const MUSTARD = "#e2a93c";
const BROWN = "#4b2a1e";
const SOFT = "#7a5444";

/** Stack of nested filled arches centred on the page. */
function archStack(x: number, y: number, w: number, h: number, fills: string[], step: number) {
  return fills.map((fill, i) => {
    const aw = w - i * step * 2;
    const ah = h - i * step * 2;
    return lock(O(archFrame({ w: aw, h: ah, fill, stroke: null, strokeWidth: 0 }), { x: x + i * step, y: y + i * step, width: aw, height: ah }));
  });
}

export default function build(): TemplateDef {
  const bg = linear(90, [0, "#faf1e3"], [1, "#f0dfc5"]);
  const rays = (size: number, color: string, opacity: number, cx: number, cy: number, rot = 0) =>
    lock(O(sunburst({ color, rays: 36, size, core: 0.3 }), { x: cx - size / 2, y: cy - size / 2, width: size, rotation: rot, opacity }));

  const label = (text: string, y: number, o: Record<string, unknown> = {}) =>
    T(text, y, { x: 230, width: 540, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 17, letterSpacing: 8, uppercase: true, fill: SOFT, ...o });

  /* ------------------------------- cover ------------------------------- */
  const cover = P(
    bg,
    [
      rays(1700, MUSTARD, 0.16, 500, 540),
      ...archStack(120, 100, 760, 1150, [TERRA, ORANGE, MUSTARD, SAND, CREAM], 24),
      // rising sun & rainbow inside the arch
      lock(O(rainbow({ colors: [TERRA, ORANGE, MUSTARD, "#f0c987"], size: 340 }), { cx: 500, y: 270, width: 340 })),
      lock(O(sunburst({ color: MUSTARD, rays: 20, size: 110, core: 0.5 }), { x: 445, y: 385, width: 110 })),
      lock(S({ x: 420, y: 440, width: 160, height: 60, fill: CREAM })),

      label("Together with their families", 490, { fontSize: 15, letterSpacing: 7 }),
      T("Amara", 524, { x: 200, width: 600, fontFamily: "DM Serif Display", fontSize: 128, fill: BROWN, lineHeight: 1 }),
      T("&", 648, { x: 200, width: 600, fontFamily: "Fraunces", italic: true, fontWeight: 400, fontSize: 60, fill: TERRA, lineHeight: 1 }),
      T("Rafael", 696, { x: 200, width: 600, fontFamily: "DM Serif Display", fontSize: 128, fill: BROWN, lineHeight: 1 }),

      lock(O(divider({ style: "dots", w: 220, color: ORANGE }), { cx: W / 2, y: 846, width: 220 })),
      label("Saturday", 884, { fontSize: 19, fill: TERRA }),
      T("21 · 10 · 2027", 916, { x: 200, width: 600, fontFamily: "Fraunces", fontWeight: 500, fontSize: 56, fill: BROWN }),
      T("at five in the evening, as the sun sets", 992, { x: 200, width: 600, fontFamily: "Fraunces", italic: true, fontWeight: 300, fontSize: 25, fill: SOFT }),
      T("Casa del Desierto", 1042, { x: 200, width: 600, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 22, letterSpacing: 7, uppercase: true, fill: BROWN }),
      T("Joshua Tree, California", 1080, { x: 200, width: 600, fontFamily: "Jost", fontSize: 21, letterSpacing: 2, fill: SOFT }),

      T("Dear {to},", 1292, { x: 200, width: 600, fontFamily: "Fraunces", italic: true, fontSize: 36, fill: TERRA }),
    ],
    "Invitation",
  );

  /* ------------------------------- details ------------------------------- */
  const details = P(
    bg,
    [
      rays(1500, MUSTARD, 0.14, 500, 1480),
      lock(O(scallops({ color: MUSTARD, w: 1000, r: 36, fill: true }), { x: 0, y: 18, width: 1008 })),
      lock(O(scallops({ color: TERRA, w: 1000, r: 36, fill: true }), { x: 0, y: 0, width: 1008 })),
      T("The Details", 150, { x: 180, width: 640, fontFamily: "DM Serif Display", fontSize: 96, fill: BROWN }),
      lock(O(divider({ style: "wave", w: 360, color: ORANGE }), { cx: W / 2, y: 290, width: 360 })),
      ...[
        ["Ceremony", "5:00 PM", 350],
        ["Sunset Cocktails", "6:00 PM", 460],
        ["Dinner & Dancing", "7:30 PM", 570],
      ].flatMap(([n, t, y]) => [
        T(n as string, y as number, { x: 180, width: 640, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 19, letterSpacing: 8, uppercase: true, fill: TERRA }),
        T(t as string, (y as number) + 36, { x: 180, width: 640, fontFamily: "Fraunces", fontWeight: 500, fontSize: 48, fill: BROWN }),
      ]),
      lock(O(divider({ style: "dots", w: 300, color: ORANGE }), { cx: W / 2, y: 704, width: 300 })),
      T("Venue", 750, { x: 180, width: 640, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 19, letterSpacing: 8, uppercase: true, fill: TERRA }),
      T("Casa del Desierto", 786, { x: 180, width: 640, fontFamily: "DM Serif Display", fontSize: 44, fill: BROWN }),
      T("4120 Sunrise Mesa Road\nJoshua Tree, California 92252", 846, { x: 180, width: 640, fontFamily: "Jost", fontSize: 24, lineHeight: 1.45, fill: SOFT }),
      T("Celebration", 960, { x: 180, width: 640, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 19, letterSpacing: 8, uppercase: true, fill: TERRA }),
      T("Celebration to follow", 996, { x: 180, width: 640, fontFamily: "Fraunces", italic: true, fontSize: 30, fill: BROWN }),
      T("Parking available on the property", 1044, { x: 180, width: 640, fontFamily: "Jost", fontSize: 21, fill: SOFT }),
      T("Dress Code", 1120, { x: 180, width: 640, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 19, letterSpacing: 8, uppercase: true, fill: TERRA }),
      T("Desert chic - earth tones welcome", 1156, { x: 180, width: 640, fontFamily: "Jost", fontSize: 24, fill: SOFT }),
      lock(O(rainbow({ colors: [TERRA, ORANGE, MUSTARD, SAND], size: 220 }), { cx: 90, y: H - 110, width: 220, opacity: 1 })),
      lock(O(rainbow({ colors: [TERRA, ORANGE, MUSTARD, SAND], size: 220 }), { cx: 910, y: H - 110, width: 220, opacity: 1 })),
    ],
    "Details",
  );

  /* ------------------------------- photo ------------------------------- */
  const photo = P(
    bg,
    [
      rays(1500, MUSTARD, 0.14, 500, 560),
      ...archStack(150, 120, 700, 880, [TERRA, MUSTARD, SAND], 26),
      I({ x: 228, y: 198, width: 544, height: 724, mask: "arch", placeholderFill: "#e6c9a2", name: "Photo" }),
      T("Two hearts,", 1050, { x: 150, width: 700, fontFamily: "DM Serif Display", fontSize: 84, fill: BROWN, lineHeight: 1 }),
      T("one wild adventure", 1136, { x: 150, width: 700, fontFamily: "Fraunces", italic: true, fontWeight: 300, fontSize: 50, fill: TERRA, lineHeight: 1 }),
      lock(O(divider({ style: "dots", w: 220, color: ORANGE }), { cx: W / 2, y: 1240, width: 220 })),
      T("Amara & Rafael · 21.10.2027", 1276, { x: 150, width: 700, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 16, letterSpacing: 8, uppercase: true, fill: SOFT }),
    ],
    "Portrait",
  );

  return {
    slug: "terracotta-boho",
    name: "Terracotta Boho",
    tagline: "Sunny desert boho wedding invitation with layered arches",
    description:
      "A warm modern-boho wedding invitation in terracotta, burnt orange, mustard and cream, with nested arches, a rising-sun rainbow motif and soft serif lettering.",
    categories: ["boho", "modern", "minimal"],
    keywords: ["boho wedding invitation", "terracotta wedding invitation", "desert wedding invitation", "rainbow arch wedding card"],
    palette: [CREAM, TERRA, ORANGE, MUSTARD, BROWN],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
