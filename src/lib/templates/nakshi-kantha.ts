import { GUEST_TOKEN } from "../design/types";
import { cloth, fish, kanthaFlower, kanthaFrame, nouka, padma, petalRing, riverLine, vine } from "./nakshi-kantha.art";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const INDIGO = "#22386e";
const MADDER = "#b0342c";
const TURMERIC = "#e3a519";
const COTTON = "#f5ecd8";
const COTTON_D = "#eadcbf";
const INK = "#2a2f4d";
const c = { indigo: INDIGO, madder: MADDER, turmeric: TURMERIC };

const bg = radial([0, "#fbf5e6"], [0.7, COTTON], [1, COTTON_D]);

function base(): ReturnType<typeof lock>[] {
  return [
    lock(O(cloth(W, H, "#b9a37a"), { x: 0, y: 0, width: W, opacity: 0.35 })),
    lock(O(kanthaFrame(c, 920, 1320), { x: 40, y: 40, width: 920 })),
  ];
}

export default function nakshiKantha(): TemplateDef {
  const caps = (text: string, y: number, o = {}) =>
    T(text, y, { x: 200, width: 600, fontFamily: "Jost", fontSize: 16, fill: MADDER, letterSpacing: 8, uppercase: true, fontWeight: 500, ...o });

  const cover = P(
    bg,
    [
      ...base(),
      O(padma(c), { cx: W / 2, y: 112, width: 300 }),
      T("বিয়ের নিমন্ত্রণ", 424, { x: 140, width: 720, fontFamily: "Tiro Bangla", fontSize: 88, fill: INDIGO, lineHeight: 1.3 }),
      caps("Wedding Invitation", 538),
      T(GUEST_TOKEN, 584, { x: 200, width: 600, fontFamily: "Fraunces", italic: true, fontWeight: 400, fontSize: 34, fill: MADDER }),
      T("Shapla", 636, { x: 120, width: 760, fontFamily: "Fraunces", fontWeight: 500, fontSize: 90, fill: INDIGO }),
      T("&", 744, { x: 120, width: 760, fontFamily: "Fraunces", italic: true, fontWeight: 300, fontSize: 56, fill: TURMERIC }),
      T("Arif", 784, { x: 120, width: 760, fontFamily: "Fraunces", fontWeight: 500, fontSize: 90, fill: INDIGO }),
      T("শাপলা  ও  আরিফ", 900, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 44, fill: MADDER, lineHeight: 1.4 }),
      O(riverLine(c, 360), { cx: W / 2, y: 972, width: 360 }),
      T("শনিবার, ১১ ডিসেম্বর ২০২৭  ·  সন্ধ্যা ৬টা ৩০", 1036, { x: 120, width: 760, fontFamily: "Hind Siliguri", fontWeight: 500, fontSize: 28, fill: INK }),
      T("Saturday, 11 December 2027", 1082, { x: 120, width: 760, fontFamily: "Fraunces", italic: true, fontSize: 24, fill: INK }),
      T("রাজশাহী ক্লাব মাঠ, সাহেব বাজার, রাজশাহী", 1130, { x: 120, width: 760, fontFamily: "Hind Siliguri", fontSize: 24, fill: INK }),
      O(fish({ body: INDIGO, accent: MADDER, fin: TURMERIC }), { cx: 230, y: 1196, width: 150 }),
      O(fish({ body: MADDER, accent: INDIGO, fin: TURMERIC }), { cx: 770, y: 1196, width: 150, flipX: true }),
      O(vine(c, 300), { cx: W / 2, y: 1190, width: 300 }),
    ],
    "Invitation",
  );

  // ---------- details ----------
  const ev = [
    { bn: "গায়ে হলুদ", en: "Gaye Holud", t: "শুক্রবার, ১০ ডিসেম্বর  ·  বিকেল ৪টা", te: "Friday, 10 December  ·  4:00 PM", col: TURMERIC },
    { bn: "বিয়ে", en: "The Wedding", t: "শনিবার, ১১ ডিসেম্বর  ·  সন্ধ্যা ৬টা ৩০", te: "Saturday, 11 December  ·  6:30 PM", col: MADDER },
    { bn: "বউভাত", en: "Reception", t: "রবিবার, ১২ ডিসেম্বর  ·  দুপুর ১টা", te: "Sunday, 12 December  ·  1:00 PM", col: INDIGO },
  ];
  const evLayers: ReturnType<typeof T>[] = [];
  const icons: ReturnType<typeof O>[] = [];
  ev.forEach((e, i) => {
    const y = 330 + i * 236;
    icons.push(O(kanthaFlower({ indigo: i === 1 ? INDIGO : e.col === MADDER ? MADDER : INDIGO, madder: e.col === INDIGO ? MADDER : e.col, turmeric: TURMERIC }, 120), { cx: 220, y: y + 26, width: 120 }));
    evLayers.push(T(e.bn, y, { x: 310, width: 560, align: "left", fontFamily: "Tiro Bangla", fontSize: 62, fill: INDIGO, lineHeight: 1.25 }));
    evLayers.push(T(e.en, y + 86, { x: 310, width: 560, align: "left", fontFamily: "Jost", fontSize: 16, letterSpacing: 7, uppercase: true, fill: MADDER, fontWeight: 500 }));
    evLayers.push(T(e.t, y + 120, { x: 310, width: 560, align: "left", fontFamily: "Hind Siliguri", fontSize: 26, fontWeight: 500, fill: INK }));
    evLayers.push(T(e.te, y + 162, { x: 310, width: 560, align: "left", fontFamily: "Fraunces", italic: true, fontSize: 24, fill: INK }));
  });
  const details = P(
    bg,
    [
      ...base(),
      T("অনুষ্ঠানসূচি", 120, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 76, fill: INDIGO, lineHeight: 1.3 }),
      caps("The Celebrations", 232),
      O(riverLine(c, 360), { cx: W / 2, y: 268, width: 360 }),
      ...icons,
      ...evLayers,
      O(vine(c, 640), { cx: W / 2, y: 1030, width: 640 }),
      T("স্থান: রাজশাহী ক্লাব মাঠ", 1120, { x: 120, width: 760, fontFamily: "Hind Siliguri", fontWeight: 500, fontSize: 32, fill: INDIGO }),
      T("Rajshahi Club Ground, Saheb Bazar, Rajshahi", 1170, { x: 120, width: 760, fontFamily: "Fraunces", italic: true, fontSize: 26, fill: INK }),
    ],
    "Schedule",
  );

  // ---------- blessing ----------
  const photo = P(
    bg,
    [
      ...base(),
      lock(O(petalRing(c, 190, 250), { cx: W / 2, y: 130, width: 520 })),
      I({ x: 310, y: 190, width: 380, height: 500, mask: "ellipse", placeholderFill: "#e6d3ae", borderColor: INDIGO, borderWidth: 4 }),
      T("ভালোবাসার সুতোয় গাঁথা নতুন জীবন", 780, { x: 100, width: 800, fontFamily: "Tiro Bangla", fontSize: 56, fill: INDIGO, lineHeight: 1.4 }),
      T("আপনাদের উপস্থিতি ও আশীর্বাদে আমাদের আনন্দ পূর্ণ হোক", 900, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 26, fill: INK, lineHeight: 1.6 }),
      O(nouka(c), { cx: W / 2, y: 1000, width: 300 }),
      T("Shapla & Arif", 1226, { x: 200, width: 600, fontFamily: "Fraunces", fontWeight: 500, fontSize: 32, letterSpacing: 3, fill: MADDER }),
    ],
    "Blessing",
  );
  void S;
  void linear;

  return {
    slug: "nakshi-kantha",
    name: "Nakshi Kantha",
    tagline: "Hand-stitched nakshi kantha style Bengali wedding invitation",
    description:
      "A handmade-feeling Bengali wedding invitation inspired by nakshi kantha embroidery: running-stitch lotus mandala, boat and river motifs in indigo, madder red and turmeric thread on warm cotton.",
    categories: ["bengali", "cultural", "vintage", "boho", "nature"],
    keywords: [
      "nakshi kantha wedding invitation",
      "bangla folk art wedding card",
      "handmade embroidery style bengali invitation",
      "bangladeshi biyer nimontron card kantha",
      "indigo and turmeric rustic wedding card",
    ],
    palette: [INDIGO, MADDER, TURMERIC, COTTON, COTTON_D],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
