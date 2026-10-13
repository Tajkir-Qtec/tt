import { divider, sprig } from "../design/ornaments";
import { centerRotate } from "../design/layers";
import type { Layer, Paint } from "../design/types";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";
import { flurry, snowflake } from "./winter-frost.art";

const NAVY = "#0f1f3f";
const NAVY2 = "#1b3157";
const ICE = "#d6e6f4";
const FROST = "#f1f7fc";
const STEEL = "#8ea4bf";
const PINE = "#6f9296";

export default function build(): TemplateDef {
  /* ------------------------------ shared bits ------------------------------ */
  const nightBg = linear(90, [0, "#0b1832"], [0.55, NAVY2], [1, "#2d4b73"]);
  const iceBg = linear(90, [0, FROST], [0.6, "#e1edf7"], [1, "#c9ddef"]);

  const pine = sprig({ color: PINE, length: 360, leaves: 12, leafLen: 64, leafW: 6, curve: 22, spread: 52, alternate: false, stemWidth: 2.2, berryColor: "#e9f1f8", opacity: 0.95 });
  const pineFrost = sprig({ color: "#f4f9fd", length: 360, leaves: 12, leafLen: 64, leafW: 2.4, curve: 22, spread: 52, alternate: false, stemWidth: 0.8, berryColor: null, opacity: 0.55 });

  const sprigPair = (cx: number, cy: number, spreadDeg: number, scale: number, light = false): Layer[] => {
    const w = 360 * scale;
    const mk = (flip: boolean, rot: number) => {
      const base = light ? pine : pine;
      const a = centerRotate(O(base, { x: 0, y: 0, width: w, flipX: flip }), cx + (flip ? w * 0.42 : -w * 0.42), cy, rot);
      const b = centerRotate(O(pineFrost, { x: 0, y: 0, width: w, flipX: flip, opacity: 0.8 }), cx + (flip ? w * 0.42 : -w * 0.42), cy - 3, rot);
      return [lock(a), lock(b)];
    };
    return [...mk(false, -spreadDeg), ...mk(true, spreadDeg)];
  };

  const frostPanel = (x: number, y: number, w: number, h: number, dark: boolean): Layer[] => [
    lock(
      S({
        x,
        y,
        width: w,
        height: h,
        cornerRadius: 6,
        fill: dark
          ? linear(100, [0, "#ffffff"], [0.5, "#cfe0f2"], [1, "#ffffff"])
          : linear(100, [0, "#ffffff"], [1, "#f4f9fd"]),
        opacity: dark ? 0.075 : 0.62,
        stroke: dark ? "#c9d6e6" : "#ffffff",
        strokeWidth: 1.4,
      }),
    ),
    lock(S({ x: x + 16, y: y + 16, width: w - 32, height: h - 32, cornerRadius: 3, fill: null, stroke: dark ? "#b7c6da" : STEEL, strokeWidth: 0.9, opacity: dark ? 0.55 : 0.5 })),
  ];

  const glow = (cx: number, cy: number, r: number, color: string, op: number): Layer =>
    lock(S({ shape: "ellipse", x: cx - r, y: cy - r, width: r * 2, height: r * 2, fill: radial([0, color], [0.5, color + "66"], [1, color + "00"]), opacity: op }));

  const BRIGHT: Paint = linear(100, [0, "#aeb9c9"], [0.28, "#ffffff"], [0.52, "#cdd7e4"], [0.78, "#ffffff"], [1, "#a3afc1"]);
  const silverText: Partial<{ fill: Paint }> = { fill: BRIGHT };

  /* --------------------------------- cover --------------------------------- */
  const coverAvoid: [number, number, number, number][] = [[250, 60, 750, 120]];
  const cover = P(
    nightBg,
    [
      glow(500, 560, 520, "#7fa6d4", 0.38),
      glow(500, 1420, 520, "#a9c7e6", 0.35),
      lock(O(snowflake({ R: 330, color: "#cfe0f3", sw: 5, variant: 0 }), { cx: 860, y: -10, width: 700, opacity: 0.075 })),
      lock(O(snowflake({ R: 260, color: "#cfe0f3", sw: 4, variant: 2 }), { cx: 90, y: 940, width: 540, opacity: 0.07 })),
      ...frostPanel(90, 90, 820, 1220, true),
      ...flurry(11, 15, [[84, 84, 916, 1316]], ["#e4eefa", "#b9cfe8"], [12, 40]),
      ...flurry(23, 10, [[0, 0, 0, 0]], ["#e4eefa", "#b9cfe8"], [10, 22]).filter((l) => l.x < 70 || l.x > 880 || l.y > 1330 || l.y < 60),
      lock(O(snowflake({ R: 34, color: "#e8f0fa", sw: 1.6, variant: 0 }), { cx: W / 2, y: 148, width: 74 })),
      T("Dear {to},", 252, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 34, fill: ICE }),
      T("Together with their families", 318, { x: 200, width: 600, fontFamily: "Jost", fontSize: 17, fontWeight: 400, fill: "#a9bcd3", letterSpacing: 7, uppercase: true }),
      T("invite you to celebrate the wedding of", 358, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, fill: ICE }),
      T("Eleanor", 428, { x: 140, width: 720, fontFamily: "Cormorant Garamond", fontWeight: 400, fontSize: 150, lineHeight: 1.1, ...silverText, shadow: { color: "#000000", blur: 14, offsetX: 0, offsetY: 5, opacity: 0.35 } }),
      T("&", 590, { x: 140, width: 720, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 300, fontSize: 70, fill: "#9fb7d3" }),
      T("Sebastian", 650, { x: 140, width: 720, fontFamily: "Cormorant Garamond", fontWeight: 400, fontSize: 150, lineHeight: 1.1, ...silverText, shadow: { color: "#000000", blur: 14, offsetX: 0, offsetY: 5, opacity: 0.35 } }),
      O(divider({ style: "diamond", w: 380, color: "#b9c9de" }), { cx: W / 2, y: 862, width: 380 }),
      T("Saturday", 922, { x: 200, width: 600, fontFamily: "Jost", fontSize: 20, fill: "#a9bcd3", letterSpacing: 11, uppercase: true }),
      T("18 December 2027", 956, { x: 150, width: 700, fontFamily: "Cinzel", fontWeight: 400, fontSize: 52, letterSpacing: 4, ...silverText }),
      T("at half past five in the evening", 1034, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: ICE }),
      T("The Glasshouse at Alderbrook", 1096, { x: 160, width: 680, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 30, fill: "#e6eff9", letterSpacing: 3, uppercase: true }),
      T("Lake Tahoe, Nevada", 1142, { x: 200, width: 600, fontFamily: "Jost", fontSize: 19, fill: "#a9bcd3", letterSpacing: 3 }),
      ...sprigPair(500, 1262, 16, 0.9),
    ],
    "Invitation",
  );
  void coverAvoid;

  /* -------------------------------- details -------------------------------- */
  const LAB = "#6d86a6";
  const row = (label: string, time: string, y: number): Layer[] => [
    T(label, y, { x: 200, width: 600, fontFamily: "Jost", fontWeight: 500, fontSize: 18, fill: LAB, letterSpacing: 8, uppercase: true }),
    T(time, y + 36, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 50, fill: NAVY }),
  ];
  const details = P(
    iceBg,
    [
      glow(500, 80, 600, "#ffffff", 0.9),
      lock(O(snowflake({ R: 300, color: "#9db8d6", sw: 4, variant: 1 }), { cx: 150, y: 780, width: 640, opacity: 0.12 })),
      lock(O(snowflake({ R: 240, color: "#9db8d6", sw: 4, variant: 0 }), { cx: 880, y: 20, width: 500, opacity: 0.12 })),
      ...frostPanel(90, 90, 820, 1220, false),
      ...flurry(5, 12, [[84, 84, 916, 1316]], ["#9db8d6", "#b6cce4"], [12, 34]),
      lock(O(snowflake({ R: 26, color: STEEL, sw: 1.5, variant: 0 }), { cx: W / 2, y: 140, width: 58 })),
      T("The Celebration", 206, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 400, fontSize: 82, fill: NAVY }),
      O(divider({ style: "diamond", w: 360, color: STEEL }), { cx: W / 2, y: 322, width: 360 }),
      ...row("Ceremony", "5:30 PM", 392),
      ...row("Cocktails & Canapés", "6:30 PM", 524),
      ...row("Dinner & Dancing", "7:30 PM", 656),
      O(divider({ style: "dots", w: 300, color: STEEL }), { cx: W / 2, y: 798, width: 300 }),
      T("Venue", 864, { x: 200, width: 600, fontFamily: "Jost", fontWeight: 500, fontSize: 18, fill: LAB, letterSpacing: 8, uppercase: true }),
      T("The Glasshouse at Alderbrook", 902, { x: 160, width: 680, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 42, fill: NAVY }),
      T("48 Pinecrest Road, Lake Tahoe\nNevada 89449", 966, { x: 200, width: 600, fontFamily: "Jost", fontSize: 23, lineHeight: 1.5, fill: "#3d5373" }),
      T("Attire", 1098, { x: 200, width: 600, fontFamily: "Jost", fontWeight: 500, fontSize: 18, fill: LAB, letterSpacing: 8, uppercase: true }),
      T("Black tie, with a touch of winter", 1136, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 34, fill: NAVY }),
      T("Warm wraps are welcome. The terrace is heated.", 1184, { x: 200, width: 600, fontFamily: "Jost", fontSize: 20, fill: "#3d5373" }),
      ...sprigPair(500, 1268, 12, 0.5),
    ],
    "Details",
  );

  /* ------------------------------- blessing -------------------------------- */
  const blessing = P(
    nightBg,
    [
      glow(500, 500, 560, "#7fa6d4", 0.34),
      glow(500, 1400, 500, "#a9c7e6", 0.32),
      lock(O(snowflake({ R: 380, color: "#cfe0f3", sw: 5, variant: 1 }), { cx: 500, y: 400, width: 800, opacity: 0.06 })),
      ...frostPanel(90, 90, 820, 1220, true),
      ...flurry(41, 14, [[84, 84, 916, 1316]], ["#e4eefa", "#b9cfe8"], [12, 38]),
      // photo in an arch with a silver keyline
      lock(S({ x: 288, y: 170, width: 424, height: 560, cornerRadius: 212, fill: null, stroke: "#c9d6e6", strokeWidth: 1.2, opacity: 0.75 })),
      I({ x: 306, y: 188, width: 388, height: 524, mask: "arch", placeholderFill: "#5d7fa6", borderColor: "#dfe9f5", borderWidth: 2 }),
      T("Our Winter Promise", 776, { x: 200, width: 600, fontFamily: "Jost", fontSize: 18, fill: "#a9bcd3", letterSpacing: 9, uppercase: true }),
      T("Like snowflakes, no two stories are alike. Ours began with a single quiet winter evening, and we would love you beside us for the next chapter.", 828, {
        x: 190,
        width: 620,
        fontFamily: "Cormorant Garamond",
        italic: true,
        fontSize: 35,
        lineHeight: 1.4,
        fill: ICE,
      }),
      O(divider({ style: "diamond", w: 300, color: "#b9c9de" }), { cx: W / 2, y: 1090, width: 300 }),
      T("Eleanor & Sebastian", 1150, { x: 150, width: 700, fontFamily: "Cormorant Garamond", fontWeight: 400, fontSize: 64, ...silverText }),
      T("18 · 12 · 2027", 1236, { x: 200, width: 600, fontFamily: "Cinzel", fontSize: 22, letterSpacing: 9, fill: "#a9bcd3" }),
    ],
    "Blessing",
  );

  return {
    slug: "winter-frost",
    name: "Winter Frost",
    tagline: "Silver and icy blue winter wedding invitation with snowflakes",
    description:
      "A quiet, crystalline winter invitation: deep navy and icy blue, hand-built snowflakes, a frosted-glass panel, frosted evergreen sprigs and silver foil lettering.",
    categories: ["seasonal", "luxury", "classic"],
    keywords: ["winter wedding invitation", "silver snowflake wedding card", "icy blue navy wedding invite", "frosted winter wedding"],
    palette: ["#0f1f3f", "#1b3157", "#d6e6f4", "#aab1bb", "#6f9296"],
    width: W,
    height: H,
    pages: [cover, details, blessing],
  };
}
