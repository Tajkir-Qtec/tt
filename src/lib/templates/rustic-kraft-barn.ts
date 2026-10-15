import { divider } from "../design/ornaments";
import { centerRotate } from "../design/layers";
import { GUEST_TOKEN } from "../design/types";
import type { Layer, Paint } from "../design/types";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";
import { bunch, fibers, paper, place, plank, quad, stringLights, tAtX, twine, WOOD_DARK, WOOD_MID } from "./rustic-kraft-barn.art";

/** Rustic barn wedding: kraft paper, jute twine, string lights, wooden-sign lettering, wildflowers. */

const KRAFT: Paint = linear(165, [0, "#d2ac7d"], [0.5, "#c19768"], [1, "#b08659"]);
const VIGN: Paint = { kind: "radial", stops: [[0, "rgba(70,40,12,0)"], [0.7, "rgba(70,40,12,0.1)"], [1, "rgba(70,40,12,0.42)"]] };
const BROWN = "#4a3222";
const RUST = "#9a5b34";
const CREAM = "#f8eed7";
const SIGN_SH = { color: "#1c0f05", blur: 4, offsetX: 1, offsetY: 3, opacity: 0.7 };

const base = (seed: number): Layer[] => [
  fibers(seed, 700, [0, 0, W, H], ["#8c6a3c", "#e6c999"]),
  lock(S({ x: 0, y: 0, width: W, height: H, fill: VIGN })),
];
const rule = (y: number, w = 200): Layer => lock(O(divider({ style: "diamond", w, color: RUST, strokeWidth: 1.8 }), { cx: W / 2, y }));
const cap = (text: string, y: number, o: Partial<Parameters<typeof T>[2]> = {}) =>
  T(text, y, { fontFamily: "Josefin Sans", fontSize: 18, letterSpacing: 8, uppercase: true, fill: BROWN, fontWeight: 600, ...o });
const tape = (x: number, y: number, deg: number): Layer =>
  centerRotate(lock(S({ x, y, width: 120, height: 38, fill: "rgba(240,226,190,0.78)", stroke: "rgba(190,165,110,0.6)", strokeWidth: 1 })), x + 60, y + 19, deg);

export default function build(): TemplateDef {
  /* --------------------------------- cover --------------------------------- */
  const L0: [number, number] = [-20, 50];
  const L1: [number, number] = [500, 200];
  const L2: [number, number] = [1020, 50];
  const ropeAt = (x: number, topY: number, tx: number): Layer => {
    const t = tAtX(L0, L1, L2, x);
    const [sx, sy] = quad(L0, L1, L2, t);
    return place(twine([sx, sy], [(sx + tx) / 2, (sy + topY) / 2], [tx, topY], 6, 8), 2);
  };
  const cover = P(KRAFT, [
    ...base(5),
    ropeAt(250, 308, 260),
    ropeAt(750, 308, 740),
    place(plank(150, 300, 700, 150, 3, WOOD_DARK), 2),
    place(plank(230, 462, 540, 88, 8, WOOD_MID), 2),
    T("EMMA & JACK", 322, { x: 160, width: 680, fontFamily: "DM Serif Display", fontSize: 98, letterSpacing: 5, lineHeight: 1.1, fill: CREAM, shadow: SIGN_SH }),
    T("ARE GETTING MARRIED", 490, { x: 240, width: 520, fontFamily: "Josefin Sans", fontWeight: 600, fontSize: 25, letterSpacing: 9, lineHeight: 1.2, fill: CREAM, shadow: SIGN_SH }),
    place(stringLights(L0, L1, L2, 9, 4), 2),
    place(paper(200, 600, 600, 610, 11), 2),
    tape(236, 586, -9),
    tape(644, 586, 8),
    T("join us for the celebration", 648, { x: 220, width: 560, fontFamily: "Sacramento", fontSize: 56, lineHeight: 1.1, fill: RUST }),
    cap("Saturday", 736, { x: 300, width: 400, fontSize: 18 }),
    T("October 16, 2027", 766, { x: 220, width: 560, fontFamily: "DM Serif Display", fontSize: 62, lineHeight: 1.1, fill: BROWN }),
    T("at half past four in the afternoon", 846, { x: 220, width: 560, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: BROWN }),
    rule(904, 200),
    cap("Willow Creek Barn", 940, { x: 220, width: 560, fontSize: 21, letterSpacing: 7 }),
    T("Hollow Oak Road, Woodstock, Vermont", 976, { x: 220, width: 560, fontFamily: "Cormorant Garamond", italic: true, fontSize: 29, fill: BROWN }),
    T("Hay bales, hot cider & barn dancing to follow", 1040, { x: 230, width: 540, fontFamily: "Cormorant Garamond", fontSize: 28, lineHeight: 1.2, fill: RUST }),
    T(GUEST_TOKEN, 1108, { x: 250, width: 500, fontFamily: "Sacramento", fontSize: 58, lineHeight: 1.1, fill: BROWN }),
    ...bunch(80, 1450, 1.2, false, 7),
    ...bunch(920, 1450, 1.2, true, 13),
  ], "Invitation");

  /* -------------------------------- schedule -------------------------------- */
  const items: [string, string, string][] = [
    ["4:00 PM", "Ceremony in the Orchard", "Say it with us beneath the apple trees"],
    ["5:00 PM", "Cider & Lawn Games", "Cornhole, croquet and sweet tea on the porch"],
    ["6:30 PM", "Farm Table Supper", "Long tables, family-style plates and pie"],
    ["8:30 PM", "Barn Dance", "Live band, string lights and a bonfire to finish"],
  ];
  const rows: Layer[] = [];
  items.forEach(([time, title, desc], i) => {
    const y = 476 + i * 164;
    rows.push(
      cap(time, y, { x: 200, width: 600, fontSize: 20, fill: RUST }),
      T(title, y + 34, { x: 150, width: 700, fontFamily: "DM Serif Display", fontSize: 50, lineHeight: 1.1, fill: BROWN }),
      T(desc, y + 94, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 29, fill: BROWN }),
    );
    if (i < items.length - 1) rows.push(rule(y + 130, 110));
  });
  const D0: [number, number] = [-20, 40];
  const D1: [number, number] = [500, 160];
  const D2: [number, number] = [1020, 40];
  const details = P(KRAFT, [
    ...base(15),
    place(plank(170, 190, 660, 110, 21, WOOD_DARK), 2),
    place(twine([260, 70], [258, 130], [250, 192], 6, 8), 2),
    place(twine([740, 70], [742, 130], [750, 192], 6, 8), 2),
    T("THE DAY", 206, { x: 180, width: 640, fontFamily: "DM Serif Display", fontSize: 76, letterSpacing: 10, lineHeight: 1.1, fill: CREAM, shadow: SIGN_SH }),
    place(stringLights(D0, D1, D2, 9, 9), 2),
    place(paper(120, 340, 760, 860, 25), 2),
    tape(150, 326, -8),
    tape(730, 326, 7),
    T("Emma & Jack  ·  October 16, 2027", 388, { x: 140, width: 720, fontFamily: "Sacramento", fontSize: 50, lineHeight: 1.1, fill: RUST }),
    rule(440, 240),
    ...rows,
    cap("Dress code", 1120, { x: 250, width: 500, fontSize: 16, letterSpacing: 9, fill: RUST }),
    T("Boots optional, bring a cardigan for the evening", 1148, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: BROWN }),
    ...bunch(90, 1460, 0.85, false, 31),
    ...bunch(910, 1460, 0.85, true, 37),
  ], "Schedule");

  /* --------------------------------- photo --------------------------------- */
  const photo = P(KRAFT, [
    ...base(35),
    place(stringLights([-20, 50], [500, 170], [1020, 50], 9, 12), 2),
    place(paper(150, 250, 700, 830, 41), 2),
    tape(186, 236, -8),
    tape(694, 236, 8),
    I({ x: 190, y: 290, width: 620, height: 560, mask: "rect", placeholderFill: "#e7d8b6", borderColor: "#fbf3e2", borderWidth: 0 }),
    T("Two hearts, one barn,", 878, { x: 170, width: 660, fontFamily: "Sacramento", fontSize: 60, lineHeight: 1.1, fill: RUST }),
    T("a lifetime of dancing in the kitchen", 944, { x: 170, width: 660, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: BROWN }),
    rule(1004, 200),
    cap("Emma & Jack", 1036, { x: 250, width: 500, fontSize: 22, letterSpacing: 10 }),
    ...bunch(110, 1450, 1.3, false, 47),
    ...bunch(890, 1450, 1.3, true, 53),
  ], "Message");

  return {
    slug: "rustic-kraft-barn",
    name: "Rustic Kraft Barn",
    tagline: "Rustic barn wedding invitation with kraft paper, string lights and wildflowers",
    description:
      "A rustic barn wedding invitation with kraft paper texture, jute twine, glowing string lights, a hanging wooden sign and hand-drawn wildflower bunches. Ideal for farm, orchard and country weddings.",
    categories: ["nature", "boho", "vintage"],
    keywords: ["rustic barn wedding invitation", "kraft paper wedding invite template", "string lights country wedding card", "wooden sign wildflower wedding invitation", "farm wedding invitation online", "twine and daisies rustic wedding invite"],
    palette: ["#c19768", "#6a4126", "#f8eed7", "#9a5b34", "#6f8f55"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
