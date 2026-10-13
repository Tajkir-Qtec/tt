import { archFrame, divider, sparkle } from "../design/ornaments";
import { eventsLayers } from "./art-utils";
import { jewelCrest, peacockFeather, placeFeather } from "./royal-peacock.art";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const LINE = "#d6b565";
const IVORY = "#f1e8d0";
const MIST = "#b4c9c7";
const AQUA = "#6fd6c8";

export default function build(): TemplateDef {
  const bg = linear(90, [0, "#031820"], [0.5, "#06303a"], [1, "#04222c"]);
  const aura = (cy: number, d: number, a = 0.35) =>
    lock(
      S({
        shape: "ellipse",
        x: W / 2 - d / 2,
        y: cy - d / 2,
        width: d,
        height: d,
        fill: radial([0, `rgba(24,170,160,${a})`], [0.55, `rgba(16,110,120,${a * 0.4})`], [1, "rgba(10,80,90,0)"]),
      }),
    );
  const frame = (y = 70, h = 1260) => lock(O(archFrame({ w: 800, h, stroke: LINE, strokeWidth: 2.6, lines: 2, gap: 12 }), { x: 100, y, width: 800 }));
  const spark = (x: number, y: number, size: number, opacity = 0.9) => lock(O(sparkle({ color: "#e8cd82", size }), { cx: x, y, width: size, opacity }));

  const big = peacockFeather({ L: 520, k: 0.1 });
  const mid = peacockFeather({ L: 460, k: 0.09 });
  const small = peacockFeather({ L: 400, k: 0.08 });

  // ---------- cover: tail fan rising from the bottom centre ----------
  const bx = W / 2;
  const by = 1352;
  const cover = P(
    bg,
    [
      aura(1000, 1000, 0.4),
      frame(),
      placeFeather(small, 1, bx, by, -62, { opacity: 0.8 }),
      placeFeather(small, 1, bx, by, 62, { opacity: 0.8, flipX: true }),
      placeFeather(mid, 1, bx, by, -43),
      placeFeather(mid, 1, bx, by, 43, { flipX: true }),
      placeFeather(mid, 1, bx, by, -24),
      placeFeather(mid, 1, bx, by, 24, { flipX: true }),
      placeFeather(big, 1, bx, by, 0),
      lock(O(jewelCrest(130), { cx: bx, y: by - 66, width: 130 })),
      spark(250, 230, 26, 0.8),
      spark(760, 190, 20, 0.7),
      spark(820, 400, 16, 0.6),
      spark(190, 480, 18, 0.6),
      T("Dear {to},", 132, { x: 250, width: 500, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, fill: MIST }),
      T("Together with their families", 186, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 17, fill: AQUA, letterSpacing: 7, uppercase: true }),
      T("Zara", 222, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 124, fill: GOLD, lineHeight: 1.05, shadow: { color: "#000000", blur: 12, offsetX: 0, offsetY: 4, opacity: 0.45 } }),
      T("&", 342, { x: 150, width: 700, fontFamily: "Playfair Display", italic: true, fontSize: 48, fill: AQUA, lineHeight: 1 }),
      T("Rayan", 384, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 124, fill: GOLD, lineHeight: 1.05, shadow: { color: "#000000", blur: 12, offsetX: 0, offsetY: 4, opacity: 0.45 } }),
      O(divider({ style: "diamond", w: 340, color: LINE }), { cx: W / 2, y: 540, width: 340 }),
      T("Saturday  ·  20 February 2027", 596, { x: 150, width: 700, fontFamily: "Cinzel", fontWeight: 500, fontSize: 30, fill: IVORY, letterSpacing: 3 }),
      T("at seven o'clock in the evening", 646, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, fill: MIST }),
      T("The Jade Pavilion", 696, { x: 150, width: 700, fontFamily: "Cinzel", fontWeight: 600, fontSize: 24, fill: GOLD, letterSpacing: 6, uppercase: true }),
    ],
    "Invitation",
  );

  // ---------- details ----------
  const sideSmall = peacockFeather({ L: 330, k: 0.09 });
  const details = P(
    bg,
    [
      aura(700, 1000, 0.3),
      frame(),
      placeFeather(sideSmall, 0.75, 165, 1285, 6, { opacity: 0.95 }),
      placeFeather(sideSmall, 0.75, 835, 1285, -6, { opacity: 0.95, flipX: true }),
      placeFeather(sideSmall, 0.62, 150, 1290, 32, { opacity: 0.75 }),
      placeFeather(sideSmall, 0.62, 850, 1290, -32, { opacity: 0.75, flipX: true }),
      spark(230, 200, 20, 0.8),
      spark(780, 230, 24, 0.8),
      ...eventsLayers({
        eyebrow: "Join us for",
        heading: "The Celebration",
        headFont: "Cormorant Garamond",
        headItalic: true,
        headWeight: 500,
        headSize: 84,
        headFill: GOLD,
        labelFont: "Cinzel",
        labelFill: AQUA,
        labelSpacing: 6,
        strongFont: "Playfair Display",
        strongFill: IVORY,
        strongWeight: 400,
        bodyFont: "Cormorant Garamond",
        bodyFill: MIST,
        bodyItalic: true,
        events: [
          { name: "Ceremony", time: "5:00 PM", note: "Vows beneath the jade arches" },
          { name: "Cocktails & Canapes", time: "6:00 PM", note: "On the lantern terrace" },
          { name: "Dinner & Dancing", time: "7:30 PM", note: "Into the night, with live music" },
        ],
        venueName: "The Jade Pavilion",
        address: "27 Lakeside Drive, Emerald Bay\nSingapore 238883",
        extras: [["Dress Code", "Black tie  ·  jewel tones welcome"]],
        divider: divider({ style: "diamond", w: 340, color: LINE }),
        dividerW: 340,
        dividerH: 40,
        y0: 190,
        x: 220,
        width: 560,
        eventGap: 128,
        timeSize: 42,
        strongSize: 36,
      }),
    ],
    "Details",
  );

  // ---------- photo / blessing ----------
  const cb = 700;
  const crest = peacockFeather({ L: 400, k: 0.07 });
  const blessing = P(
    bg,
    [
      aura(640, 1000, 0.35),
      frame(),
      placeFeather(crest, 1, W / 2, cb, -66, { opacity: 0.85 }),
      placeFeather(crest, 1, W / 2, cb, 66, { opacity: 0.85, flipX: true }),
      placeFeather(crest, 1, W / 2, cb, -46),
      placeFeather(crest, 1, W / 2, cb, 46, { flipX: true }),
      placeFeather(crest, 1, W / 2, cb, -24),
      placeFeather(crest, 1, W / 2, cb, 24, { flipX: true }),
      placeFeather(crest, 1.12, W / 2, cb, 0),
      lock(O(archFrame({ w: 470, h: 600, stroke: LINE, strokeWidth: 3, lines: 3, gap: 11, fill: "#052d36" }), { cx: W / 2, y: 380, width: 470 })),
      I({ x: 268, y: 418, width: 464, height: 560, mask: "arch", placeholderFill: "#0e4a52", borderColor: LINE, borderWidth: 1.5 }),
      spark(220, 210, 22, 0.8),
      spark(800, 170, 18, 0.7),
      T("With the blessings of our families", 1065, { x: 150, width: 700, fontFamily: "Cinzel", fontWeight: 500, fontSize: 18, fill: AQUA, letterSpacing: 6, uppercase: true }),
      T("Two hearts, one story,\nand a lifetime of colour.", 1112, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 38, fill: IVORY, lineHeight: 1.25 }),
      T("Zara  &  Rayan", 1220, { x: 150, width: 700, fontFamily: "Cinzel", fontWeight: 600, fontSize: 26, fill: GOLD, letterSpacing: 8, uppercase: true }),
    ],
    "Blessing",
  );

  return {
    slug: "royal-peacock",
    name: "Royal Peacock",
    tagline: "Luxury peacock-feather wedding invitation in teal and gold foil",
    description:
      "A regal wedding invitation with a fan of layered peacock feathers, gold-foil lettering and an arched gold frame on deep navy-teal, in emerald, sapphire and gold.",
    categories: ["luxury", "indian", "dark"],
    keywords: ["peacock wedding invitation", "teal and gold wedding card", "royal indian wedding invite"],
    palette: ["#031820", "#0b7a63", "#1d4fa8", "#d6b565", "#6fd6c8"],
    width: W,
    height: H,
    pages: [cover, details, blessing],
  };
}
