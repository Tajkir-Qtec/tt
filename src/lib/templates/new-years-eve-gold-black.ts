import { divider } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import type { Layer, Paint } from "../design/types";
import { H, I, linear, lock, O, P, radial, S, GOLD, T, W, type TemplateDef } from "./kit";
import { confetti } from "./birthday-balloons-bold.art";
import { burst, clockHands, flute, glitter, place, sparkAt, starAt } from "./winter-party.art";

/** New Year's Eve black & gold: art-deco clock face, fireworks starbursts, champagne flutes and foil confetti. */

const BLACK: Paint = radial([0, "#1c1509"], [0.55, "#0b0805"], [1, "#000000"]);
const G1 = "#f3d27a";
const G2 = "#c9993a";
const CREAM = "#fff3d4";
const CONF = ["#f3d27a", "#c9993a", "#e9cf8a", "#ffffff", "#8a6422"];
const FOIL = linear(100, [0, "#c9993a"], [0.35, "#fff0b0"], [0.6, "#d9a944"], [1, "#9a7433"]);

const fw = (cx: number, cy: number, R: number, n: number, op = 1, rot = 0, accent = "#ffffff"): Layer[] => [
  lock(place(burst(cx, cy, R * 1.12, n * 2, { color: G2, accent: G2, core: 0.3, rot: rot + 9 }), 2, { opacity: op * 0.35 })),
  lock(place(burst(cx, cy, R, n, { color: G1, accent, core: 0.16, rot }), 2, { opacity: op })),
];

function clock(cx: number, cy: number, R: number): Layer[] {
  const out: Layer[] = [
    lock(S({ shape: "ellipse", x: cx - R - 34, y: cy - R - 34, width: 2 * R + 68, height: 2 * R + 68, fill: G1, opacity: 0.07 })),
    lock(S({ shape: "ellipse", x: cx - R - 22, y: cy - R - 22, width: 2 * R + 44, height: 2 * R + 44, fill: FOIL })),
    lock(S({ shape: "ellipse", x: cx - R - 8, y: cy - R - 8, width: 2 * R + 16, height: 2 * R + 16, fill: "#080604" })),
    lock(S({ shape: "ellipse", x: cx - R - 4, y: cy - R - 4, width: 2 * R + 8, height: 2 * R + 8, fill: null, stroke: G1, strokeWidth: 2 })),
    lock(S({ shape: "ellipse", x: cx - R, y: cy - R, width: 2 * R, height: 2 * R, fill: radial([0, "#2b2210"], [1, "#0d0a05"]) })),
    lock(S({ shape: "ellipse", x: cx - R * 0.58, y: cy - R * 0.58, width: R * 1.16, height: R * 1.16, fill: null, stroke: G2, strokeWidth: 1.4, opacity: 0.6 })),
    lock(place(clockHands(cx, cy, R, { gold: G1, light: CREAM, hour: 358, min: 349, sec: 205, accent: "#ffffff" }), 2)),
  ];
  const nums = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
  nums.forEach((n, i) => {
    const a = ((i * 30 - 90) * Math.PI) / 180;
    const px = cx + Math.cos(a) * R * 0.68;
    const py = cy + Math.sin(a) * R * 0.68;
    out.push(T(n, py - 15, { x: px - 60, width: 120, fontFamily: "Cinzel", fontWeight: 600, fontSize: 28, lineHeight: 1, fill: GOLD }));
  });
  out.push(T("2028", cy + R * 0.2, { x: cx - 100, width: 200, fontFamily: "Cinzel", fontWeight: 700, fontSize: 34, letterSpacing: 8, lineHeight: 1, fill: GOLD }));
  return out;
}

const label = (text: string, y: number, o: Record<string, unknown> = {}) =>
  T(text, y, { x: 120, width: 760, fontFamily: "Syncopate", fontSize: 16, letterSpacing: 9, uppercase: true, fill: G1, ...o });

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const cover = P(
    BLACK,
    [
      ...fw(160, 470, 215, 20, 0.9, 0),
      ...fw(850, 540, 195, 18, 0.9, 10),
      ...fw(870, 150, 100, 14, 0.75, 4),
      ...fw(120, 880, 100, 14, 0.7, 12),
      confetti({ seed: 4, count: 90, colors: CONF, area: [20, 20, 980, 1380], size: 0.9, skip: (x, y) => (x > 150 && x < 850 && y > 40 && y < 360) || (x > 280 && x < 720 && y > 380 && y < 840) || (x > 120 && x < 880 && y > 830 && y < 1200) }),
      glitter({ seed: 8, count: 60, area: [20, 20, 980, 1380], colors: [G1, "#ffffff", "#e9cf8a"], minS: 6, maxS: 18, skip: (x, y) => (x > 150 && x < 850 && y > 40 && y < 360) || (x > 280 && x < 720 && y > 380 && y < 840) || (x > 120 && x < 880 && y > 830 && y < 1200) }),
      lock(S({ x: 34, y: 34, width: 932, height: 1332, fill: null, stroke: G1, strokeWidth: 2, opacity: 0.8 })),
      lock(S({ x: 46, y: 46, width: 908, height: 1308, fill: null, stroke: G2, strokeWidth: 1, opacity: 0.7 })),
      label("You're invited to the", 76),
      T("New Year's Eve", 100, { x: 40, width: 920, fontFamily: "Bebas Neue", fontSize: 168, letterSpacing: 6, lineHeight: 1, fill: GOLD }),
      T("Black & Gold Party", 246, { x: 100, width: 800, fontFamily: "Great Vibes", fontSize: 88, lineHeight: 1.1, fill: "#ffffff" }),
      ...clock(500, 612, 190),
      starAt(318, 412, 30, G1, 0),
      sparkAt(690, 402, 34, "#ffffff"),
      T("Friday, 31 December 2027", 848, { x: 100, width: 800, fontFamily: "Syncopate", fontWeight: 700, fontSize: 25, letterSpacing: 5, fill: "#ffffff" }),
      T("Nine o'clock  ·  until the first sunrise", 892, { x: 100, width: 800, fontFamily: "Cormorant Garamond", italic: true, fontSize: 34, fill: G1 }),
      lock(O(divider({ style: "diamond", w: 280, color: G1, strokeWidth: 2 }), { cx: W / 2, y: 936 })),
      T("The Skyline Ballroom", 968, { x: 100, width: 800, fontFamily: "Bebas Neue", fontSize: 70, letterSpacing: 8, lineHeight: 1, fill: GOLD }),
      T("Level 28, Marlow Tower, Harbour City", 1040, { x: 100, width: 800, fontFamily: "Cormorant Garamond", fontSize: 29, fill: CREAM, opacity: 0.9 }),
      T("Black tie  ·  Gold sparkle", 1082, { x: 100, width: 800, fontFamily: "Syncopate", fontSize: 14, letterSpacing: 8, uppercase: true, fill: G1 }),
      T(GUEST_TOKEN, 1106, { x: 250, width: 500, fontFamily: "Great Vibes", fontSize: 50, lineHeight: 1.1, fill: "#ffffff" }),
      sparkAt(500, 1196, 44, "#ffffff"),
      lock(place(flute(436, 1176, 170, 14, { liquid: linear(90, [0, "#fbe39a"], [1, "#d9a944"]), seed: 3, glass: "#f4ead0" }), 2)),
      lock(place(flute(564, 1176, 170, -14, { liquid: linear(90, [0, "#fbe39a"], [1, "#d9a944"]), seed: 9, glass: "#f4ead0" }), 2)),
    ],
    "Invitation",
  );

  /* -------------------------------- schedule -------------------------------- */
  const items: [string, string, string][] = [
    ["9:00 PM", "Champagne Welcome", "Sparkling arrivals and canapés in the skyline lounge"],
    ["10:00 PM", "Dinner & Live Jazz", "A five-course tasting menu with the Velvet Quartet"],
    ["11:30 PM", "Dance Floor Opens", "The DJ spins the biggest hits through the final hour"],
    ["11:59 PM", "The Countdown", "Ten seconds, one toast and a midnight sky of fireworks"],
    ["12:30 AM", "Midnight Bites", "Late-night bites and fresh coffee to start the year right"],
  ];
  const rows: Layer[] = [];
  items.forEach(([time, title, desc], i) => {
    const y = 352 + i * 142;
    const hot = i === 3;
    if (hot) rows.push(lock(S({ x: 70, y: y - 18, width: 860, height: 130, cornerRadius: 4, fill: FOIL })));
    rows.push(
      T(time, y, { x: 80, width: 260, align: "right", fontFamily: "Bebas Neue", fontSize: 66, letterSpacing: 3, lineHeight: 1, fill: hot ? "#0a0805" : GOLD }),
      lock(S({ x: 366, y: y + 4, width: 2, height: 88, fill: hot ? "#0a0805" : G2, opacity: hot ? 0.7 : 0.8 })),
      T(title, y - 2, { x: 396, width: 520, align: "left", fontFamily: "Bebas Neue", fontSize: 50, letterSpacing: 3, lineHeight: 1, fill: hot ? "#0a0805" : "#ffffff" }),
      T(desc, y + 54, { x: 396, width: 500, align: "left", fontFamily: "Cormorant Garamond", italic: true, fontSize: 26, lineHeight: 1.15, fill: hot ? "#2a1d08" : "#d9c9a2" }),
    );
  });
  const details = P(
    BLACK,
    [
      ...fw(60, 120, 150, 18, 0.55, 0),
      ...fw(960, 1300, 160, 18, 0.55, 6),
      glitter({ seed: 12, count: 50, area: [20, 20, 980, 1380], colors: [G1, "#ffffff", "#e9cf8a"], minS: 5, maxS: 15, skip: (x, y) => x > 60 && x < 940 && y > 60 && y < 1280 }),
      lock(S({ x: 34, y: 34, width: 932, height: 1332, fill: null, stroke: G1, strokeWidth: 2, opacity: 0.8 })),
      lock(S({ x: 46, y: 46, width: 908, height: 1308, fill: null, stroke: G2, strokeWidth: 1, opacity: 0.7 })),
      label("Countdown to 2028", 100),
      T("The Night Ahead", 134, { x: 60, width: 880, fontFamily: "Bebas Neue", fontSize: 130, letterSpacing: 6, lineHeight: 1, fill: GOLD }),
      lock(O(divider({ style: "diamond", w: 320, color: G1, strokeWidth: 2 }), { cx: W / 2, y: 290 })),
      ...rows,
      lock(S({ x: 150, y: 1090, width: 700, height: 130, fill: null, stroke: G1, strokeWidth: 2 })),
      lock(S({ x: 158, y: 1098, width: 684, height: 114, fill: null, stroke: G2, strokeWidth: 1 })),
      T("Dress code", 1118, { x: 160, width: 680, fontFamily: "Syncopate", fontSize: 14, letterSpacing: 10, uppercase: true, fill: G1 }),
      T("Black tie, with a little gold sparkle", 1150, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 34, fill: "#ffffff" }),
      lock(place(flute(430, 1226, 120, 14, { liquid: linear(90, [0, "#fbe39a"], [1, "#d9a944"]), seed: 21, glass: "#f4ead0" }), 2)),
      lock(place(flute(570, 1226, 120, -14, { liquid: linear(90, [0, "#fbe39a"], [1, "#d9a944"]), seed: 22, glass: "#f4ead0" }), 2)),
    ],
    "Schedule",
  );

  /* --------------------------------- photo --------------------------------- */
  const photo = P(
    BLACK,
    [
      ...fw(500, 700, 470, 36, 0.5, 0),
      ...fw(130, 220, 120, 16, 0.8, 3),
      ...fw(880, 1160, 130, 16, 0.8, 9),
      confetti({ seed: 31, count: 80, colors: CONF, area: [20, 20, 980, 1380], size: 0.9, skip: (x, y) => (x > 260 && x < 740 && y > 440 && y < 960) || (x > 100 && x < 900 && y > 40 && y < 340) || (x > 100 && x < 900 && y > 1000 && y < 1260) }),
      glitter({ seed: 36, count: 40, area: [20, 20, 980, 1380], colors: [G1, "#ffffff"], minS: 6, maxS: 16, skip: (x, y) => (x > 260 && x < 740 && y > 440 && y < 960) || (x > 100 && x < 900 && y > 40 && y < 340) || (x > 100 && x < 900 && y > 1000 && y < 1260) }),
      lock(S({ x: 34, y: 34, width: 932, height: 1332, fill: null, stroke: G1, strokeWidth: 2, opacity: 0.8 })),
      lock(S({ x: 46, y: 46, width: 908, height: 1308, fill: null, stroke: G2, strokeWidth: 1, opacity: 0.7 })),
      T("Cheers", 76, { x: 60, width: 880, fontFamily: "Bebas Neue", fontSize: 200, letterSpacing: 10, lineHeight: 1, fill: GOLD }),
      T("to new beginnings", 254, { x: 100, width: 800, fontFamily: "Great Vibes", fontSize: 84, lineHeight: 1.1, fill: "#ffffff" }),
      lock(S({ shape: "ellipse", x: 500 - 238, y: 700 - 238, width: 476, height: 476, fill: FOIL })),
      lock(S({ shape: "ellipse", x: 500 - 226, y: 700 - 226, width: 452, height: 452, fill: "#080604" })),
      lock(S({ shape: "ellipse", x: 500 - 217, y: 700 - 217, width: 434, height: 434, fill: null, stroke: G1, strokeWidth: 1.6 })),
      I({ x: 500 - 205, y: 700 - 205, width: 410, height: 410, mask: "ellipse", placeholderFill: "#3a2d14" }),
      starAt(500, 462, 34, G1, 0),
      starAt(500, 938, 34, G1, 0),
      sparkAt(250, 700, 34, "#ffffff"),
      sparkAt(752, 700, 34, "#ffffff"),
      T("Here's to the memories we made,", 1024, { x: 100, width: 800, fontFamily: "Cormorant Garamond", italic: true, fontSize: 44, fill: "#ffffff" }),
      T("and the ones still waiting in 2028.", 1080, { x: 100, width: 800, fontFamily: "Cormorant Garamond", italic: true, fontSize: 44, fill: "#ffffff" }),
      lock(O(divider({ style: "diamond", w: 300, color: G1, strokeWidth: 2 }), { cx: W / 2, y: 1160 })),
      T("Hosted by Alexander & Sofia Hale", 1198, { x: 100, width: 800, fontFamily: "Syncopate", fontSize: 16, letterSpacing: 7, uppercase: true, fill: G1 }),
    ],
    "Message",
  );

  return {
    slug: "new-years-eve-gold-black",
    name: "New Year's Eve Gold & Black",
    tagline: "Glamorous black and gold NYE party invitation with a countdown clock",
    description:
      "A glamorous New Year's Eve party invitation in black and gold with a countdown clock face, fireworks starbursts, champagne flutes and foil confetti. Ideal for NYE galas, rooftop countdowns and midnight celebrations.",
    categories: ["party", "holiday", "winter", "luxury", "dark", "festive"],
    keywords: ["new years eve party invitation template", "black and gold nye invitation", "countdown clock new year invite", "champagne midnight party invitation", "new year gala invitation card", "2028 new year party invite"],
    palette: ["#000000", "#0b0805", "#f3d27a", "#c9993a", "#fff3d4"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
