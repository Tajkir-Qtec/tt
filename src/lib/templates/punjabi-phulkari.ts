import type { OrnamentData } from "../design/path";
import { eventsLayers } from "./art-utils";
import { phulkariBand, phulkariDivider, phulkariMedallion } from "./punjabi-phulkari.art";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const IVORY = "#fbeed6";
const PINK = "#f06aa6";
const SAFF = "#f5a623";
const GREEN = "#7fd35a";
const GOLDLINE = "#e8c15a";
const SOFT = "#e6c9c0";

export default function build(): TemplateDef {
  const bg = linear(90, [0, "#3a0a18"], [0.5, "#561226"], [1, "#390a17"]);
  const aura = (cy: number, d: number) =>
    lock(
      S({
        shape: "ellipse",
        x: W / 2 - d / 2,
        y: cy - d / 2,
        width: d,
        height: d,
        fill: radial([0, "rgba(224,38,122,0.30)"], [0.55, "rgba(224,38,122,0.10)"], [1, "rgba(224,38,122,0)"]),
      }),
    );
  const band = phulkariBand();
  const bands = () => [
    lock(O(band, { x: 0, y: 14, width: 1000 })),
    lock(O(band, { x: 0, y: H - 14 - 136, width: 1000, flipY: true })),
    lock(S({ x: 0, y: 156, width: W, height: 2, fill: GOLDLINE, opacity: 0.8 })),
    lock(S({ x: 0, y: H - 158, width: W, height: 2, fill: GOLDLINE, opacity: 0.8 })),
  ];
  const at = (d: OrnamentData, cx: number, cy: number) => O(d, { x: cx - d.vbW / 2, y: cy - d.vbH / 2 });
  const foil = { color: "#000000", blur: 10, offsetX: 0, offsetY: 4, opacity: 0.4 };

  // ---------------- cover ----------------
  const cover = P(
    bg,
    [
      aura(520, 900),
      ...bands(),
      T("Dear {to},", 186, { x: 250, width: 500, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, fill: SOFT }),
      T("ਸ਼ੁਭ ਵਿਆਹ", 232, { x: 150, width: 700, fontFamily: "Tiro Gurmukhi", fontSize: 70, fill: SAFF, lineHeight: 1.1 }),
      lock(at(phulkariMedallion(138), W / 2, 505)),
      T("Simran", 706, { x: 120, width: 760, fontFamily: "Yeseva One", fontSize: 92, fill: GOLD, lineHeight: 1.1, shadow: foil }),
      T("&", 802, { x: 120, width: 760, fontFamily: "Playfair Display", italic: true, fontSize: 44, fill: PINK, lineHeight: 1 }),
      T("Arjun", 844, { x: 120, width: 760, fontFamily: "Yeseva One", fontSize: 92, fill: GOLD, lineHeight: 1.1, shadow: foil }),
      T("Friday  ·  12 March 2027", 978, { x: 120, width: 760, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 38, fill: IVORY }),
      T("at half past six in the evening", 1034, { x: 120, width: 760, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, fill: SOFT }),
      O(phulkariDivider(), { cx: W / 2, y: 1082, width: 360 }),
      T("Baisakhi Gardens  ·  Amritsar", 1140, { x: 120, width: 760, fontFamily: "Jost", fontWeight: 500, fontSize: 20, fill: GREEN, letterSpacing: 6, uppercase: true }),
    ],
    "Invitation",
  );

  // ---------------- details ----------------
  const details = P(
    bg,
    [
      aura(700, 1000),
      ...bands(),
      ...eventsLayers({
        eyebrow: "Join us for",
        heading: "The Celebration",
        headFont: "Yeseva One",
        headSize: 62,
        headFill: GOLD,
        labelFont: "Jost",
        labelFill: GREEN,
        labelSpacing: 6,
        strongFont: "Playfair Display",
        strongFill: IVORY,
        strongWeight: 400,
        bodyFont: "Cormorant Garamond",
        bodyFill: SOFT,
        bodyItalic: true,
        events: [
          { name: "Milni & Welcome", time: "10:00 AM", note: "Families meet with garlands and dhol" },
          { name: "Wedding Ceremony", time: "11:30 AM", note: "Anand Karaj" },
          { name: "Lunch & Celebration", time: "1:30 PM", note: "Bhangra, feasting and bolis" },
        ],
        venueName: "Baisakhi Gardens",
        address: "Mall Road, Near Ranjit Avenue\nAmritsar, Punjab 143001",
        extras: [["Dress Code", "Festive Punjabi attire — bring your brightest colours"]],
        divider: phulkariDivider(),
        dividerW: 340,
        dividerH: 45,
        y0: 205,
        x: 170,
        width: 660,
        eventGap: 126,
        timeSize: 42,
        strongSize: 38,
      }),
    ],
    "Details",
  );

  // ---------------- photo ----------------
  const rOut = 150;
  const rIn = 82;
  const haloW = Math.round((rOut * 1.26 + 28) * 2);
  const photoR = 157;
  const cyP = 600;
  const blessing = P(
    bg,
    [
      aura(cyP, 900),
      ...bands(),
      T("ਆਸ਼ੀਰਵਾਦ", 188, { x: 150, width: 700, fontFamily: "Tiro Gurmukhi", fontSize: 58, fill: SAFF }),
      lock(at(phulkariMedallion(270, 165), W / 2, cyP)),
      I({ x: W / 2 - photoR, y: cyP - photoR, width: photoR * 2, height: photoR * 2, mask: "ellipse", placeholderFill: "#8f2349", borderColor: GOLDLINE, borderWidth: 3 }),
      T("May your love bloom like a field\nof phulkari — bright, warm and lasting.", 1000, { x: 120, width: 760, fontFamily: "Cormorant Garamond", italic: true, fontSize: 36, fill: IVORY, lineHeight: 1.3 }),
      O(phulkariDivider(), { cx: W / 2, y: 1108, width: 320 }),
      T("Simran  &  Arjun", 1170, { x: 120, width: 760, fontFamily: "Jost", fontWeight: 500, fontSize: 20, fill: GOLD, letterSpacing: 8, uppercase: true }),
    ],
    "Blessing",
  );
  void haloW;

  return {
    slug: "punjabi-phulkari",
    name: "Punjabi Phulkari",
    tagline: "Phulkari-embroidery wedding invitation in magenta, saffron and gold",
    description:
      "A joyful Punjabi wedding invitation inspired by phulkari darning-stitch embroidery, with stitched diamond borders and a rosette medallion in magenta, saffron, parrot green and gold on deep maroon.",
    categories: ["indian", "cultural", "luxury"],
    keywords: ["punjabi wedding invitation", "phulkari wedding card", "sikh anand karaj invitation"],
    palette: ["#3a0a18", "#e0267a", "#f5a623", "#5fb83f", "#f1cd6c"],
    width: W,
    height: H,
    pages: [cover, details, blessing],
  };
}
