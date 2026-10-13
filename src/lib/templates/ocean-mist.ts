import { divider } from "../design/ornaments";
import type { Layer } from "../design/types";
import { H, I, GOLD, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";
import { compassRose, shell, starfish, waveBand } from "./ocean-mist.art";

const NAVY = "#0f2b46";
const SEA = "#1b4d6e";
const FOAM = "#8fd3c8";
const SAND = "#f4ecdc";
const GOLDC = "#d7b573";
const MIST = "#cfe3e6";

const bg = linear(170, [0, "#0a2038"], [0.5, "#123a5a"], [1, "#1c5a78"]);

const glow = (cx: number, cy: number, r: number, c: string, a: number): Layer =>
  lock(S({ shape: "ellipse", x: cx - r, y: cy - r, width: r * 2, height: r * 2, fill: radial([0, `rgba(${c},${a})`], [0.5, `rgba(${c},${a * 0.4})`], [1, `rgba(${c},0)`]) }));

function bottomWaves(shift = 0, squash = 1): Layer[] {
  const defs: { y: number; amp: number; per: number; ph: number; fill: ReturnType<typeof linear>; foam?: string }[] = [
    { y: 1120, amp: 30, per: 1.6, ph: 0.1, fill: linear(90, [0, "rgba(143,211,200,0.38)"], [1, "rgba(143,211,200,0.04)"]), foam: "rgba(255,255,255,0.6)" },
    { y: 1175, amp: 26, per: 2.1, ph: 0.55, fill: linear(90, [0, "rgba(84,176,186,0.6)"], [1, "rgba(20,74,104,0.85)"]), foam: "rgba(255,255,255,0.7)" },
    { y: 1232, amp: 22, per: 2.7, ph: 0.3, fill: linear(90, [0, "rgba(34,108,138,0.8)"], [1, "rgba(12,48,78,0.97)"]), foam: "rgba(255,255,255,0.75)" },
    { y: 1288, amp: 18, per: 3.3, ph: 0.8, fill: linear(90, [0, "rgba(143,211,200,0.8)"], [1, "rgba(104,182,178,0.95)"]), foam: "rgba(255,255,255,0.9)" },
    { y: 1343, amp: 13, per: 4.1, ph: 0.2, fill: linear(90, [0, "#f8f1e3"], [1, "#e6d8ba"]), foam: "rgba(255,255,255,0.95)" },
  ];
  return defs.map((d) => {
    const top = (d.y - d.amp - 6) * squash + shift;
    const h = 1400 - top;
    return lock(O(waveBand({ h, base: d.amp + 6, amp: d.amp * squash, periods: d.per, phase: d.ph, fill: d.fill, foam: d.foam, foamWidth: 2 }), { x: 0, y: top, width: W }));
  });
}

function topWaves(): Layer[] {
  const defs = [
    { base: 50, amp: 14, per: 1.8, ph: 0.2, fill: linear(90, [0, "rgba(143,211,200,0.05)"], [1, "rgba(143,211,200,0.4)"]) },
    { base: 80, amp: 12, per: 2.4, ph: 0.6, fill: linear(90, [0, "rgba(34,108,138,0.2)"], [1, "rgba(60,150,165,0.55)"]) },
    { base: 106, amp: 9, per: 3.0, ph: 0.1, fill: linear(90, [0, "rgba(8,32,56,0.9)"], [1, "rgba(24,82,110,0.7)"]) },
  ];
  return defs.map((d) =>
    lock(O(waveBand({ h: 170, base: d.base, amp: d.amp, periods: d.per, phase: d.ph, fill: d.fill, foam: "rgba(255,255,255,0.55)", foamWidth: 1.5 }), { x: 0, y: 0, width: W, flipY: true })),
  );
}

function borders(): Layer[] {
  return [
    lock(S({ x: 48, y: 48, width: 904, height: 1304, fill: null, stroke: "rgba(255,255,255,0.55)", strokeWidth: 1.5 })),
    lock(S({ x: 60, y: 60, width: 880, height: 1280, fill: null, stroke: "rgba(255,255,255,0.28)", strokeWidth: 1 })),
  ];
}

const shore = (): Layer[] => [
  lock(O(starfish(76, linear(120, [0, "#f1d7a8"], [1, "#d29a62"]), "#fff3d6"), { x: 790, y: 1292, width: 76, rotation: 18, opacity: 0.95 })),
  lock(O(starfish(40, linear(120, [0, "#f1d7a8"], [1, "#d29a62"]), "#fff3d6"), { x: 868, y: 1336, width: 40, rotation: -24, opacity: 0.9 })),
  lock(O(shell(64, linear(120, [0, "#fbefd8"], [1, "#e3b98c"]), "#b27d4c"), { x: 150, y: 1290, width: 64, rotation: -14, opacity: 0.95 })),
];

const compass = (cx: number, y: number, size: number): Layer => lock(O(compassRose(size, GOLD, GOLDC), { cx, y, width: size }));

function chrome(): Layer[] {
  return [glow(500, 420, 520, "120,200,205", 0.22), glow(900, 1000, 400, "143,211,200", 0.18), ...topWaves(), ...bottomWaves(30), ...borders()];
}

const nameFill = linear(100, [0, "#ffffff"], [1, "#e6efef"]);

function detailsPage(): Layer[] {
  const x = 200;
  const width = 600;
  const lab = (t: string, y: number) => T(t, y, { x, width, fontFamily: "Jost", fontWeight: 400, fontSize: 18, fill: FOAM, letterSpacing: 9, uppercase: true });
  const big = (t: string, y: number, size = 46) => T(t, y, { x, width, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: size, fill: SAND, lineHeight: 1.15 });
  const body = (t: string, y: number) => T(t, y, { x, width, fontFamily: "Jost", fontWeight: 300, fontSize: 23, fill: MIST, lineHeight: 1.5 });
  const out: Layer[] = [
    T("The Day", 180, { x, width, fontFamily: "Playfair Display", italic: true, fontSize: 92, fill: nameFill }),
    compass(W / 2, 308, 54),
  ];
  const ev: [string, string][] = [
    ["Ceremony on the Shore", "4:00 PM"],
    ["Sunset Reception", "5:30 PM"],
    ["Dinner & Dancing", "7:00 PM"],
  ];
  ev.forEach(([n, t], i) => out.push(lab(n, 410 + i * 108), big(t, 444 + i * 108)));
  out.push(O(divider({ style: "dots", w: 300, color: GOLDC }), { cx: W / 2, y: 748, width: 300 }));
  out.push(lab("Venue", 805), big("The Lighthouse Pavilion", 842, 42), body("14 Harbor Point Road\nCape Alder, Maine", 898));
  out.push(lab("Attire", 1000), body("Coastal formal – linen, navy and soft sand", 1036));
  return out;
}

export default function build(): TemplateDef {
  const shadow = { color: "#04121f", blur: 18, offsetX: 0, offsetY: 6, opacity: 0.45 };
  const cover = P(
    bg,
    [
      ...chrome(),
      ...shore(),
      T("Dear {to},", 140, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 36, fill: MIST }),
      T("Together with their families", 208, { x: 150, width: 700, fontFamily: "Jost", fontSize: 17, fill: FOAM, letterSpacing: 8, uppercase: true }),
      T("invite you to celebrate the wedding of", 246, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, fill: MIST }),
      T("Marina", 312, { x: 100, width: 800, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 172, fill: nameFill, letterSpacing: 4, lineHeight: 1, shadow }),
      T("&", 482, { x: 100, width: 800, fontFamily: "Playfair Display", italic: true, fontSize: 64, fill: GOLD, lineHeight: 1 }),
      T("Theodore", 560, { x: 100, width: 800, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 138, fill: nameFill, letterSpacing: 4, lineHeight: 1, shadow }),
      lock(S({ x: 220, y: 788, width: 230, height: 1.5, fill: "rgba(215,181,115,0.75)" })),
      lock(S({ x: 550, y: 788, width: 230, height: 1.5, fill: "rgba(215,181,115,0.75)" })),
      compass(W / 2, 760, 56),
      T("Saturday", 842, { x: 200, width: 600, fontFamily: "Jost", fontSize: 19, fill: FOAM, letterSpacing: 13, uppercase: true }),
      T("12 · 09 · 2027", 876, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 80, fill: SAND }),
      T("at five o'clock in the evening", 972, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: MIST }),
      T("The Lighthouse Pavilion", 1032, { x: 150, width: 700, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 31, fill: GOLD, letterSpacing: 6, uppercase: true }),
      T("Harbor Point, Cape Alder, Maine", 1078, { x: 200, width: 600, fontFamily: "Jost", fontWeight: 300, fontSize: 19, fill: MIST, letterSpacing: 3 }),
    ],
    "Invitation",
  );

  const details = P(bg, [glow(500, 500, 520, "120,200,205", 0.2), ...topWaves(), ...bottomWaves(30), ...borders(), ...detailsPage()], "Details");

  const photo = P(
    bg,
    [
      ...chrome(),
      ...shore(),
      T("Our Journey", 148, { x: 200, width: 600, fontFamily: "Playfair Display", italic: true, fontSize: 64, fill: nameFill }),
      lock(S({ shape: "ellipse", x: 220, y: 248, width: 560, height: 560, fill: null, stroke: "rgba(215,181,115,0.8)", strokeWidth: 1.5 })),
      lock(S({ shape: "ellipse", x: 232, y: 260, width: 536, height: 536, fill: null, stroke: "rgba(255,255,255,0.35)", strokeWidth: 1 })),
      I({ x: 250, y: 278, width: 500, height: 500, mask: "ellipse", placeholderFill: "#3f7f95", borderColor: "#f4ecdc", borderWidth: 5 }),
      compass(W / 2, 836, 50),
      T("“Like the tide, our love comes home to the shore.”", 912, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 36, fill: SAND, lineHeight: 1.25 }),
      T("Marina & Theodore", 1018, { x: 150, width: 700, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 28, fill: GOLD, letterSpacing: 8, uppercase: true }),
      T("12 · 09 · 2027", 1062, { x: 200, width: 600, fontFamily: "Jost", fontWeight: 300, fontSize: 18, fill: MIST, letterSpacing: 8 }),
    ],
    "Photo",
  );

  return {
    slug: "ocean-mist",
    name: "Ocean Mist",
    tagline: "Coastal beach wedding invitation in navy, seafoam and gold",
    description:
      "A serene seaside invitation with layered translucent waves, a gold compass-rose accent and delicate serif lettering in navy, seafoam, sand and a touch of gold.",
    categories: ["beach", "nature", "luxury"],
    keywords: ["beach wedding invitation", "navy and gold coastal invitation", "nautical wedding card", "seaside destination wedding"],
    palette: [NAVY, SEA, FOAM, SAND, GOLDC],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
