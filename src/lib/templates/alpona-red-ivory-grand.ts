import { divider } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { alponaMedallion, cornerAlpona, loopBand } from "./alpona-red-ivory-grand.art";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const RED = "#9b1b2c";
const RED_D = "#6f0f1d";
const RED_PAGE = "#7f1223";
const IVORY = "#fbf4e4";
const GOLDC = "#c9a24d";
const GOLD_D = "#8f6a22";
const INK = "#5b1420";
const shadow = { color: "#2b0206", blur: 8, offsetX: 0, offsetY: 3, opacity: 0.5 };

/** Gold foil double frame built from stacked gradient rects over a flat page colour. */
function foilFrame(bg: string, inset = 40) {
  const r = (i: number, fill: string | typeof GOLD) => lock(S({ x: i, y: i, width: W - i * 2, height: H - i * 2, shape: "rect", fill }));
  return [r(inset, GOLD), r(inset + 5, bg), r(inset + 14, GOLD), r(inset + 16.5, bg)];
}

function corners(ink: string, accent: string, size = 150, off = 62) {
  const c = cornerAlpona({ size, ink, accent });
  return [
    lock(O(c, { x: off, y: off, width: size })),
    lock(O(c, { x: W - off - size, y: off, width: size, flipX: true })),
    lock(O(c, { x: off, y: H - off - size, width: size, flipY: true })),
    lock(O(c, { x: W - off - size, y: H - off - size, width: size, flipX: true, flipY: true })),
  ];
}

export default function build(): TemplateDef {
  const cover = P(
    IVORY,
    [
      ...foilFrame(IVORY),
      lock(S({ x: 120, y: 150, width: 760, height: 700, shape: "ellipse", fill: radial([0, "rgba(155,27,44,0.13)"], [1, "rgba(155,27,44,0)"]) })),
      ...corners(RED, GOLDC),
      T("শ্রীশ্রী প্রজাপতয়ে নমঃ", 92, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 28, fill: GOLD_D, letterSpacing: 2 }),
      T(GUEST_TOKEN, 136, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 34, fill: RED }),
      O(alponaMedallion({ size: 600, accent: GOLDC, ringFill: RED, ringInk: IVORY, paper: IVORY }), { cx: W / 2, y: 190, width: 600 }),
      T("শুভ বিবাহ", 386, { x: 300, width: 400, fontFamily: "Tiro Bangla", fontSize: 36, fill: GOLD_D }),
      T("বউভাত", 424, { x: 280, width: 440, fontFamily: "Tiro Bangla", fontSize: 104, fill: RED, lineHeight: 1.3 }),
      T("Reception", 558, { x: 300, width: 400, fontFamily: "Jost", fontWeight: 500, fontSize: 15, fill: GOLD_D, letterSpacing: 10, uppercase: true }),
      T("Tanmay", 824, { x: 100, width: 800, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 84, fill: RED, letterSpacing: 4 }),
      T("&", 902, { x: 100, width: 800, fontFamily: "Great Vibes", fontSize: 60, fill: GOLD_D }),
      T("Mithila", 944, { x: 100, width: 800, fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 84, fill: RED, letterSpacing: 4 }),
      T("তন্ময় ও মিথিলা", 1056, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 42, fill: GOLD_D }),
      O(divider({ style: "floral", w: 340, color: GOLDC }), { cx: W / 2, y: 1126, width: 340 }),
      T("রবিবার, ৭ই ফেব্রুয়ারি ২০২৭  ·  সন্ধ্যা ৭:৩০টা", 1182, { x: 120, width: 760, fontFamily: "Hind Siliguri", fontSize: 25, fill: INK }),
      T("Rajkuthi Banquet, EM Bypass, Kolkata", 1232, { x: 120, width: 760, fontFamily: "Jost", fontSize: 16, fill: GOLD_D, letterSpacing: 5, uppercase: true }),
    ],
    "Cover",
  );

  const card = (y: number, label: string, lines: ReturnType<typeof T>[]) => [
    lock(S({ x: 170, y, width: 660, height: 230, shape: "rect", fill: "#fffaf0", stroke: GOLDC, strokeWidth: 2.2, cornerRadius: 10 })),
    lock(S({ x: 180, y: y + 10, width: 640, height: 210, shape: "rect", fill: null, stroke: GOLDC, strokeWidth: 0.9, cornerRadius: 5 })),
    lock(S({ x: 360, y: y - 26, width: 280, height: 52, shape: "rect", fill: RED, stroke: GOLDC, strokeWidth: 2, cornerRadius: 26 })),
    T(label, y - 20, { x: 360, width: 280, fontFamily: "Tiro Bangla", fontSize: 34, fill: IVORY, lineHeight: 1.2 }),
    ...lines,
  ];

  const details = P(
    IVORY,
    [
      ...foilFrame(IVORY),
      ...corners(RED, GOLDC),
      O(alponaMedallion({ size: 260, accent: GOLDC, ringFill: RED, ringInk: IVORY, paper: IVORY }), { cx: W / 2, y: 100, width: 260 }),
      T("শুভ", 196, { x: 400, width: 200, fontFamily: "Tiro Bangla", fontSize: 54, fill: RED, lineHeight: 1.3 }),
      T("অনুষ্ঠানসূচি", 388, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 62, fill: RED, lineHeight: 1.3 }),
      T("Wedding & Reception", 478, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 32, fill: GOLD_D }),
      ...card(570, "শুভ বিবাহ", [
        T("Saturday, 6 February 2027", 624, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 40, fill: INK }),
        T("সন্ধ্যা ৭:০০টা", 692, { x: 200, width: 600, fontFamily: "Hind Siliguri", fontSize: 26, fill: INK }),
        T("7:00 PM", 740, { x: 200, width: 600, fontFamily: "Jost", fontSize: 16, fill: GOLD_D, letterSpacing: 8, uppercase: true }),
      ]),
      ...card(850, "বউভাত", [
        T("Sunday, 7 February 2027", 904, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 40, fill: INK }),
        T("সন্ধ্যা ৭:৩০টা", 972, { x: 200, width: 600, fontFamily: "Hind Siliguri", fontSize: 26, fill: INK }),
        T("7:30 PM", 1020, { x: 200, width: 600, fontFamily: "Jost", fontSize: 16, fill: GOLD_D, letterSpacing: 8, uppercase: true }),
      ]),
      T("রাজকুঠি ব্যাংকোয়েট, ই এম বাইপাস, কলকাতা", 1130, { x: 120, width: 760, fontFamily: "Hind Siliguri", fontSize: 25, fill: RED }),
      T("Rajkuthi Banquet, EM Bypass, Kolkata 700107", 1176, { x: 120, width: 760, fontFamily: "Jost", fontSize: 15, fill: GOLD_D, letterSpacing: 5, uppercase: true }),
      lock(O(loopBand({ w: 560, h: 44, ink: RED, accent: GOLDC }), { cx: W / 2, y: 1240, width: 560 })),
    ],
    "Details",
  );

  const photo = P(
    RED_PAGE,
    [
      ...foilFrame(RED_PAGE),
      lock(S({ x: 100, y: 200, width: 800, height: 800, shape: "ellipse", fill: radial([0, "rgba(220,70,80,0.45)"], [1, "rgba(220,70,80,0)"]) })),
      ...corners(IVORY, GOLDC),
      T("আশীর্বাদ", 96, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 58, fill: GOLD, lineHeight: 1.3, shadow }),
      O(alponaMedallion({ size: 740, accent: "#e0bd6a", ringFill: IVORY, ringInk: RED, paper: RED_PAGE }), { cx: W / 2, y: 232, width: 740 }),
      I({ x: 300, y: 402, width: 400, height: 400, mask: "ellipse", placeholderFill: "#a82234", borderColor: "#e0bd6a", borderWidth: 4 }),
      T("নতুন সংসারে সুখ, শান্তি ও", 1020, { x: 150, width: 700, fontFamily: "Tiro Bangla", fontSize: 42, fill: GOLD, lineHeight: 1.3, shadow }),
      T("ভালোবাসা বিরাজ করুক", 1078, { x: 150, width: 700, fontFamily: "Tiro Bangla", fontSize: 42, fill: GOLD, lineHeight: 1.3, shadow }),
      T("আপনাদের আশীর্বাদই আমাদের পাথেয়", 1160, { x: 150, width: 700, fontFamily: "Hind Siliguri", fontSize: 24, fill: IVORY }),
      T("Tanmay & Mithila", 1230, { x: 160, width: 680, fontFamily: "Cinzel", fontWeight: 500, fontSize: 28, fill: GOLD, letterSpacing: 8 }),
    ],
    "Blessing",
  );

  return {
    slug: "alpona-red-ivory-grand",
    name: "Alpona Red Ivory Grand",
    tagline: "Grand ivory and gold Bou Bhaat reception invitation with alpona medallion",
    description:
      "A grand Bengali Bou Bhaat reception invitation in ivory with gold foil frames, red accents and an elaborate round alpona medallion lettered with Bangla, plus bilingual Bangla and English details.",
    categories: ["bengali", "indian", "luxury", "cultural", "festive"],
    keywords: [
      "bou bhaat invitation card bengali",
      "bengali reception invitation ivory red gold",
      "alpona medallion wedding card",
      "shubho bibaho boubhat card design",
      "grand bengali wedding reception invitation",
    ],
    palette: [RED, RED_D, IVORY, GOLDC, GOLD_D],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
