import { crescent, divider, islamicPattern, islamicStar, sparkle, ticketFrame } from "../design/ornaments";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";
import { sections } from "./premium-details";

const DEEP = "#073328";
const DARKER = "#04211a";
const GOLDC = "#d8b86e";
const IVORY = "#f3ead6";
const MUTED = "#b9c9bd";

const shadow = { color: "#000000", blur: 10, offsetX: 0, offsetY: 3, opacity: 0.45 };

function backdrop(strength = 1) {
  return [
    lock(O(islamicPattern({ color: GOLDC, w: 1000, h: 1400, cell: 125, strokeWidth: 1.3 }), { x: 0, y: 0, width: 1000, opacity: 0.17 * strength })),
    lock(S({ x: -200, y: 120, width: 1400, height: 900, shape: "ellipse", fill: radial([0, "#1d7a5f"], [0.75, "rgba(7,51,40,0)"]), opacity: 0.55 })),
    lock(O(ticketFrame({ w: 820, h: 1220, r: 46, stroke: GOLDC, strokeWidth: 3, lines: 2, gap: 14 }), { x: 90, y: 90, width: 820 })),
  ];
}

export default function build(): TemplateDef {
  const bg = linear(90, [0, "#0b4a39"], [0.55, DEEP], [1, DARKER]);

  const star = (size: number, cx: number, cy: number, op = 1) =>
    lock(O(islamicStar({ color: GOLDC, size, strokeWidth: 2.2 }), { cx, y: cy - size / 2, width: size, opacity: op }));

  const cover = P(
    bg,
    [
      ...backdrop(),
      // medallion: star behind crescent
      star(210, 500, 215, 0.9),
      lock(O(crescent({ color: GOLDC, size: 96 }), { cx: 494, y: 167, width: 96 })),
      lock(O(sparkle({ color: GOLDC, size: 26 }), { cx: 548, y: 190, width: 26 })),
      T("بسم الله الرحمن الرحيم", 348, { x: 160, width: 680, fontFamily: "Amiri", fontSize: 58, fill: GOLD, lineHeight: 1.4, shadow }),
      T("Dear {to},", 436, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: IVORY }),
      T("Together with their families", 500, { x: 200, width: 600, fontFamily: "Jost", fontSize: 17, fill: MUTED, letterSpacing: 7, uppercase: true }),
      T("request the honour of your presence at the Nikah of", 538, { x: 180, width: 640, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: MUTED }),
      T("Aisha", 585, { x: 160, width: 680, fontFamily: "Cinzel", fontWeight: 500, fontSize: 104, fill: GOLD, letterSpacing: 6, shadow }),
      T("&", 710, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 66, fill: IVORY }),
      T("Omar", 770, { x: 160, width: 680, fontFamily: "Cinzel", fontWeight: 500, fontSize: 104, fill: GOLD, letterSpacing: 6, shadow }),
      O(divider({ style: "stars", w: 420, color: GOLDC }), { cx: W / 2, y: 925, width: 420 }),
      T("Saturday", 995, { x: 200, width: 600, fontFamily: "Jost", fontSize: 19, fill: GOLDC, letterSpacing: 10, uppercase: true }),
      T("12 · 09 · 2027", 1030, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 72, fill: IVORY }),
      T("Nikah at four o'clock in the afternoon", 1120, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, fill: MUTED }),
      T("Al Noor Banquet Hall", 1178, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 28, fill: GOLD, letterSpacing: 5 }),
      T("48 Crescent Avenue, Dubai", 1226, { x: 200, width: 600, fontFamily: "Jost", fontSize: 18, fill: MUTED, letterSpacing: 2 }),
    ],
    "Invitation",
  );

  const sec = sections(
    [
      { label: "Nikah Ceremony", strong: "4:00 PM", after: 54 },
      { label: "Walima Reception", strong: "7:00 PM", after: 54 },
      { label: "Dinner Served", strong: "8:30 PM", after: 60 },
      { label: "Venue", strong: "Al Noor Banquet Hall", body: ["48 Crescent Avenue", "Dubai, United Arab Emirates"], after: 50 },
      { label: "Celebration", body: ["Dinner & celebration to follow", "Complimentary valet parking on arrival"], after: 50 },
      { label: "Dress Code", body: ["Modest formal  ·  jewel tones welcome"] },
    ],
    {
      x: 180,
      width: 640,
      y0: 385,
      label: { font: "Jost", size: 17, fill: GOLDC, spacing: 8, weight: 500 },
      strong: { font: "Cormorant Garamond", size: 40, fill: IVORY, weight: 500 },
      body: { font: "Jost", size: 21, fill: MUTED, weight: 300, lineHeight: 1.55 },
      sep: (y) => O(divider({ style: "diamond", w: 220, color: GOLDC, strokeWidth: 1.6 }), { cx: W / 2, y, width: 220, opacity: 0.8 }),
    },
  );

  const details = P(
    bg,
    [
      ...backdrop(),
      star(150, 500, 185, 0.85),
      lock(O(crescent({ color: GOLDC, size: 68 }), { cx: 495, y: 151, width: 68 })),
      T("The Celebration", 290, { x: 160, width: 680, fontFamily: "Cinzel", fontWeight: 500, fontSize: 48, fill: GOLD, letterSpacing: 5, shadow }),
      ...sec.layers,
    ],
    "Details",
  );

  const photo = P(
    bg,
    [
      ...backdrop(0.8),
      I({ x: 250, y: 190, width: 500, height: 640, mask: "arch", placeholderFill: "#0f5a45", borderColor: GOLDC, borderWidth: 3 }),
      star(150, 500, 930, 0.85),
      lock(O(crescent({ color: GOLDC, size: 64 }), { cx: 496, y: 898, width: 64 })),
      T("And among His signs is that He created for you mates from among yourselves, that you may find tranquillity in them, and He placed between you love and mercy.", 1030, {
        x: 200,
        width: 600,
        fontFamily: "Cormorant Garamond",
        italic: true,
        fontSize: 29,
        lineHeight: 1.4,
        fill: IVORY,
      }),
      T("Surah Ar-Rum  ·  30:21", 1182, { x: 200, width: 600, fontFamily: "Jost", fontSize: 16, fill: GOLDC, letterSpacing: 8, uppercase: true }),
    ],
    "Blessing",
  );

  return {
    slug: "emerald-nikah",
    name: "Emerald Nikah",
    tagline: "Emerald and gold Islamic nikah & walima invitation with Bismillah",
    description:
      "An elegant Islamic wedding invitation in deep emerald green and warm gold foil, framed by a lattice of eight-pointed stars with a crescent medallion and Arabic Bismillah. Ideal for nikah and walima celebrations.",
    categories: ["islamic", "luxury", "geometric", "dark"],
    keywords: ["islamic wedding invitation", "nikah invitation card", "emerald green and gold wedding invitation", "walima invitation online", "muslim wedding card with bismillah"],
    palette: [DEEP, "#0b4a39", GOLDC, IVORY, DARKER],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
