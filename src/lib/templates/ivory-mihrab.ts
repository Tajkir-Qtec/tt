import { archFrame, divider } from "../design/ornaments";
import { baseSprigs, finialLayers, lanternLayers, mihrabFrame, mihrabGlow, mihrabGround } from "./ivory-mihrab.art";
import { H, I, linear, lock, O, P, T, W, type TemplateDef } from "./kit";
import { sections } from "./premium-details";

const DEEP = "#33452f";
const SAGE = "#7d9070";
const INK = "#5e6552";
const CHAMP = "#b8934f";
const IVORY = "#faf6ec";

const FOIL = linear(100, [0, "#8c6a2b"], [0.3, "#c9a24f"], [0.55, "#9c7632"], [0.8, "#cfab5a"], [1, "#a07a35"]);

export default function build(): TemplateDef {
  const bg = linear(90, [0, "#dfe5cf"], [0.5, "#e8ead6"], [1, "#e2e4cc"]);
  const frame = () => [...mihrabGround(), ...mihrabFrame(), mihrabGlow(), ...baseSprigs()];
  const x = 200;
  const w = 600;
  const sm = (text: string, y: number, o = {}) =>
    T(text, y, { x, width: w, fontFamily: "Jost", fontSize: 17, fill: SAGE, letterSpacing: 8, uppercase: true, fontWeight: 500, ...o });

  const cover = P(
    bg,
    [
      ...frame(),
      ...lanternLayers(),
      T("بسم الله الرحمن الرحيم", 372, { x: 160, width: 680, fontFamily: "Amiri", fontSize: 54, fill: FOIL, lineHeight: 1.4 }),
      T("Dear {to},", 462, { x, width: w, fontFamily: "Cormorant Garamond", italic: true, fontSize: 34, fill: INK }),
      sm("Together with their families", 530),
      T("request the pleasure of your company at the Walima of", 566, { x: 180, width: 640, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, fill: INK }),
      T("Maryam", 622, { x: 160, width: 680, fontFamily: "Cinzel", fontWeight: 500, fontSize: 90, fill: DEEP, letterSpacing: 6 }),
      T("&", 722, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 58, fill: FOIL }),
      T("Idris", 770, { x: 160, width: 680, fontFamily: "Cinzel", fontWeight: 500, fontSize: 90, fill: DEEP, letterSpacing: 6 }),
      O(divider({ style: "diamond", w: 360, color: CHAMP }), { cx: W / 2, y: 910, width: 360 }),
      sm("Saturday", 974, { fill: CHAMP, letterSpacing: 10 }),
      T("18 · 09 · 2027", 1008, { x, width: w, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 72, fill: DEEP }),
      T("Reception from seven o'clock in the evening", 1100, { x, width: w, fontFamily: "Cormorant Garamond", italic: true, fontSize: 26, fill: INK }),
      T("The Orchard Pavilion", 1154, { x, width: w, fontFamily: "Cinzel", fontWeight: 600, fontSize: 26, fill: DEEP, letterSpacing: 5 }),
      T("27 Jasmine Court, Kensington, London", 1200, { x, width: w, fontFamily: "Jost", fontSize: 18, fill: INK, letterSpacing: 2 }),
    ],
    "Invitation",
  );

  const sec = sections(
    [
      { label: "Nikah Ceremony", strong: "4:00 PM", after: 56 },
      { label: "Walima Reception", strong: "7:00 PM", after: 56 },
      { label: "Dinner Served", strong: "8:30 PM", after: 58 },
      { label: "Venue", strong: "The Orchard Pavilion", body: ["27 Jasmine Court, Kensington", "London W8 5QP, United Kingdom"], after: 46 },
      { label: "Dress Code", body: ["Modest formal  ·  soft pastels welcome"] },
    ],
    {
      x,
      width: w,
      y0: 455,
      label: { font: "Jost", size: 16, fill: CHAMP, spacing: 8, weight: 500 },
      strong: { font: "Cormorant Garamond", size: 40, fill: DEEP, weight: 500 },
      body: { font: "Jost", size: 20, fill: INK, weight: 400, lineHeight: 1.55 },
      sep: (y) => O(divider({ style: "diamond", w: 200, color: CHAMP, strokeWidth: 1.6 }), { cx: W / 2, y, width: 200, opacity: 0.85 }),
    },
  );

  const details = P(
    bg,
    [
      ...frame(),
      ...finialLayers(),
      T("The Celebration", 336, { x: 160, width: 680, fontFamily: "Cinzel", fontWeight: 500, fontSize: 38, fill: DEEP, letterSpacing: 5 }),
      ...sec.layers,
    ],
    "Details",
  );

  const photo = P(
    bg,
    [
      ...frame(),
      ...finialLayers(),
      lock(O(archFrame({ w: 450, h: 560, stroke: "#c2a468", strokeWidth: 1.6, lines: 2, gap: 9, }), { x: 275, y: 320, width: 450 })),
      I({ x: 300, y: 330, width: 400, height: 520, mask: "arch", placeholderFill: "#dde4cb", borderColor: "#c2a468", borderWidth: 3 }),
      T("And among His signs is that He created for you mates from among yourselves, that you may find tranquillity in them, and He placed between you love and mercy.", 925, {
        x: 200,
        width: 600,
        fontFamily: "Cormorant Garamond",
        italic: true,
        fontSize: 29,
        lineHeight: 1.4,
        fill: DEEP,
      }),
      sm("Surah Ar-Rum  ·  30:21", 1070, { fill: CHAMP, fontSize: 16 }),
      O(divider({ style: "stars", w: 300, color: CHAMP }), { cx: W / 2, y: 1118, width: 300 }),
      T("Maryam & Idris", 1175, { x, width: w, fontFamily: "Cinzel", fontWeight: 500, fontSize: 34, fill: FOIL, letterSpacing: 6 }),
    ],
    "Blessing",
  );

  return {
    slug: "ivory-mihrab",
    name: "Ivory Mihrab",
    tagline: "Light ivory and sage mihrab arch walima & nikah invitation",
    description:
      "A calm, luminous Islamic wedding invitation: layered mihrab arches with slim columns, a hanging lantern and champagne gold lines on ivory and soft sage, finished with an Arabic Bismillah.",
    categories: ["islamic", "luxury", "classic", "geometric"],
    keywords: ["light islamic wedding invitation", "walima invitation card ivory", "mihrab arch nikah invitation", "sage green muslim wedding card"],
    palette: ["#faf6ec", "#dfe5cf", SAGE, DEEP, "#c2a468"],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
void lock;
void IVORY;
