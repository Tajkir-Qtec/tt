import { divider, flower, scallops, sparkle, ticketFrame } from "../design/ornaments";
import { centerRotate } from "../design/layers";
import { GUEST_TOKEN } from "../design/types";
import { botehBand, hand, mehndiMedallion, vineBand } from "./bd-events.art";
import { H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const GREEN_D = "#0f3320";
const GREEN = "#1d5a33";
const LEAF = "#4b9a5a";
const MUSTARD = "#e0a21b";
const MUST_L = "#f6d36b";
const CREAM = "#fbf1d6";
const HENNA = "#6a2a10";
const PINK = "#d63f7c";
const INK = "#173a24";

const mustardPaint = linear(100, [0, "#f8dc7c"], [0.45, "#e0a21b"], [0.75, "#f5cd5e"], [1, "#c98a10"]);
const greenBg = linear(90, [0, "#1d5a33"], [0.55, "#14442a"], [1, "#0d2f1b"]);
const shadow = { color: "#04180c", blur: 10, offsetX: 0, offsetY: 3, opacity: 0.5 };
const skin = linear(90, [0, "#f4cfae"], [1, "#e9b78f"]);
const bangle = linear(90, [0, "#f6d36b"], [0.5, "#c98a10"], [1, "#f6d36b"]);

const handArt = () => hand({ skin, henna: HENNA, bangle, bangleEdge: "#8a5a10", shade: "#b9714a" });

function greenGround(withFrame = true) {
  return [
    lock(O(mehndiMedallion({ size: 1160, color: MUST_L, accent: MUST_L, sw: 2 }), { x: -80, y: 120, width: 1160, opacity: 0.07 })),
    lock(S({ x: -150, y: 50, width: 1300, height: 1300, shape: "ellipse", fill: radial([0, "rgba(90,170,100,0.38)"], [0.7, "rgba(40,110,60,0.1)"], [1, "rgba(20,70,40,0)"]) })),
    ...(withFrame
      ? [lock(O(ticketFrame({ w: 928, h: 1328, r: 34, stroke: MUSTARD, strokeWidth: 2.4, lines: 2, gap: 11 }), { x: 36, y: 36, width: 928 }))]
      : []),
  ];
}

export default function bdMehendiNightGreen(): TemplateDef {
  const label = (text: string, y: number, o = {}) =>
    T(text, y, { x: 200, width: 600, fontFamily: "Jost", fontSize: 16, fill: MUSTARD, letterSpacing: 8, uppercase: true, fontWeight: 500, ...o });

  // ---------------- cover ----------------
  const cover = P(
    greenBg,
    [
      ...greenGround(),
      lock(O(botehBand({ len: 840, stroke: MUST_L, fill: "rgba(246,211,107,0.22)", accent: PINK, size: 58 }), { x: 80, y: 62, width: 840 })),
      O(sparkle({ color: MUST_L, size: 40 }), { cx: 150, y: 214, width: 34 }),
      O(sparkle({ color: MUST_L, size: 40 }), { cx: 850, y: 232, width: 26 }),
      T("মেহেদী সন্ধ্যা", 160, { x: 100, width: 800, fontFamily: "Tiro Bangla", fontSize: 120, fill: mustardPaint, lineHeight: 1.25, shadow }),
      label("Mehendi Night", 322, { letterSpacing: 12, fontSize: 18, fill: CREAM }),
      T(GUEST_TOKEN, 360, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 32, fill: MUST_L }),
      lock(O(mehndiMedallion({ size: 520, color: MUST_L, accent: PINK, fill: "rgba(10,50,28,0.55)", sw: 2.4 }), { cx: W / 2, y: 410, width: 520 })),
      lock(S({ x: 372, y: 522, width: 256, height: 256, shape: "ellipse", fill: CREAM, stroke: MUSTARD, strokeWidth: 4 })),
      lock(S({ x: 382, y: 532, width: 236, height: 236, shape: "ellipse", fill: null, stroke: HENNA, strokeWidth: 1.4, dash: [2, 6] })),
      T("Nusrat", 566, { x: 380, width: 240, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 56, fill: INK }),
      T("&", 636, { x: 380, width: 240, fontFamily: "Cormorant Garamond", italic: true, fontSize: 48, fill: PINK }),
      T("Tanvir", 676, { x: 380, width: 240, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 56, fill: INK }),
      O(divider({ style: "diamond", w: 380, color: MUSTARD }), { cx: W / 2, y: 952, width: 380 }),
      T("বৃহস্পতিবার", 990, { x: 290, width: 420, fontFamily: "Hind Siliguri", fontSize: 26, fontWeight: 500, fill: CREAM, letterSpacing: 2 }),
      T("৯ ডিসেম্বর ২০২৭", 1028, { x: 270, width: 460, fontFamily: "Tiro Bangla", fontSize: 50, fill: MUST_L, lineHeight: 1.3 }),
      T("সন্ধ্যা ৬টা থেকে", 1104, { x: 290, width: 420, fontFamily: "Hind Siliguri", fontSize: 26, fill: CREAM }),
      T("Thursday, 9 December 2027", 1150, { x: 290, width: 420, fontFamily: "Cormorant Garamond", italic: true, fontSize: 26, fill: CREAM }),
      T("লেকশোর গার্ডেন, গুলশান, ঢাকা", 1200, { x: 280, width: 440, fontFamily: "Hind Siliguri", fontSize: 22, fill: MUST_L }),
      centerRotate(O(handArt(), { x: 35, y: 1010, width: 250 }), 160, 1215, 9),
      centerRotate(O(handArt(), { x: 715, y: 1010, width: 250, flipX: true }), 840, 1215, -9),
    ],
    "Cover",
  );

  // ---------------- details ----------------
  const rows: { en: string; bn: string; sub: string; sub2?: string }[] = [
    { en: "Date & time", bn: "৯ ডিসেম্বর ২০২৭, বৃহস্পতিবার", sub: "সন্ধ্যা ৬টা থেকে রাত ১১টা", sub2: "Thursday, 9 December 2027  ·  6 PM onwards" },
    { en: "Venue", bn: "লেকশোর গার্ডেন", sub: "রোড ৪১, গুলশান-২, ঢাকা", sub2: "Lakeshore Garden, Gulshan-2, Dhaka" },
    { en: "The evening", bn: "মেহেদী, গান ও নাচ", sub: "হাতে হাতে মেহেদী, সঙ্গে নৈশভোজ", sub2: "Henna, music, dance and dinner" },
    { en: "Dress code", bn: "সবুজ ও হলুদের ছোঁয়া", sub: "রঙিন পোশাকে আসুন, আনন্দ ছড়িয়ে দিন", sub2: "Come in green & yellow, festive and bright" },
  ];
  const rowLayers: ReturnType<typeof T>[] = [];
  const seps: ReturnType<typeof O>[] = [];
  rows.forEach((r, i) => {
    const y = 296 + i * 240;
    rowLayers.push(label(r.en, y, { fill: "#a56f0a", fontSize: 15, letterSpacing: 7 }));
    rowLayers.push(T(r.bn, y + 34, { x: 100, width: 800, fontFamily: "Tiro Bangla", fontSize: 44, fill: GREEN, lineHeight: 1.3 }));
    rowLayers.push(T(r.sub, y + 100, { x: 100, width: 800, fontFamily: "Hind Siliguri", fontSize: 24, fill: INK }));
    if (r.sub2) rowLayers.push(T(r.sub2, y + 140, { x: 100, width: 800, fontFamily: "Cormorant Garamond", italic: true, fontSize: 25, fill: "#6b4a12" }));
    if (i < rows.length - 1) seps.push(O(vineBand({ len: 360, stroke: GREEN, leafFill: LEAF, accent: PINK, amp: 8, step: 60 }), { cx: W / 2, y: y + 184, width: 230 }));
  });

  const details = P(
    linear(90, [0, "#fcf4de"], [0.5, "#fff9e8"], [1, "#f8ecc8"]),
    [
      lock(O(mehndiMedallion({ size: 1000, color: MUSTARD, accent: MUSTARD, sw: 2 }), { x: 0, y: 330, width: 1000, opacity: 0.07 })),
      lock(S({ x: 0, y: 0, width: W, height: 250, fill: greenBg })),
      lock(O(mehndiMedallion({ size: 700, color: MUST_L, accent: MUST_L, sw: 2 }), { x: 150, y: -300, width: 700, opacity: 0.1 })),
      lock(O(scallops({ color: "#14442a", w: W, r: 25, fill: true }), { x: 0, y: 249, width: W })),
      lock(O(ticketFrame({ w: 928, h: 1328, r: 34, stroke: MUSTARD, strokeWidth: 2.2, lines: 2, gap: 11 }), { x: 36, y: 36, width: 928 })),
      T("অনুষ্ঠানের বিবরণ", 76, { x: 100, width: 800, fontFamily: "Tiro Bangla", fontSize: 76, fill: mustardPaint, lineHeight: 1.3, shadow }),
      label("Mehendi night details", 188, { fill: CREAM, letterSpacing: 9 }),
      ...rowLayers,
      ...seps,
      lock(O(botehBand({ len: 840, stroke: GREEN, fill: "rgba(224,162,27,0.45)", accent: PINK, size: 52 }), { x: 80, y: 1400 - 62 - 66, width: 840 })),
    ],
    "Details",
  );

  // ---------------- photo ----------------
  const bloom = (cx: number, y: number, w: number) =>
    O(flower({ color: "#f2a81c", ringColors: ["#e0861a", "#f2a81c", "#f6c94c", "#fbe08a"], stroke: "#a85f0a", strokeWidth: 1.2, radius: 120, rings: 4, petals: 12, center: "#b8480e" }), { cx, y, width: w });
  const photo = P(
    greenBg,
    [
      ...greenGround(),
      lock(O(mehndiMedallion({ size: 700, color: MUST_L, accent: PINK, fill: "rgba(10,50,28,0.35)", sw: 2.4 }), { cx: W / 2, y: 80, width: 700 })),
      I({ x: 260, y: 220, width: 480, height: 600, mask: "arch", placeholderFill: "#2f7a45", borderColor: MUST_L, borderWidth: 5 }),
      bloom(150, 100, 190),
      bloom(850, 100, 190),
      bloom(120, 760, 150),
      bloom(880, 760, 150),
      T("রঙে রঙে রাঙুক", 880, { x: 100, width: 800, fontFamily: "Tiro Bangla", fontSize: 76, fill: mustardPaint, lineHeight: 1.3, shadow }),
      T("আমাদের এই সন্ধ্যা", 968, { x: 100, width: 800, fontFamily: "Tiro Bangla", fontSize: 50, fill: CREAM, lineHeight: 1.3 }),
      O(vineBand({ len: 380, stroke: MUST_L, leafFill: LEAF, accent: PINK, amp: 8 }), { cx: W / 2, y: 1056, width: 380 }),
      T("Henna, music & laughter. Come celebrate with us.", 1130, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 30, fill: CREAM, lineHeight: 1.4 }),
      T("Nusrat & Tanvir", 1224, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 28, fill: MUST_L, letterSpacing: 6 }),
    ],
    "Photo",
  );

  return {
    slug: "bd-mehendi-night-green",
    name: "Mehendi Night Green",
    tagline: "Joyful Bangladeshi mehendi sondha card in henna green and mustard",
    description:
      "A festive Bangla mehendi sondha invitation in henna green and mustard yellow, with decorated mehndi hands, a paisley medallion and boteh borders. Bangla and English wording for the mehendi night of a Bangladeshi wedding.",
    categories: ["bengali", "ceremony", "cultural", "festive", "floral"],
    keywords: [
      "mehendi night invitation card bangladesh",
      "মেহেদী সন্ধ্যা আমন্ত্রণ কার্ড",
      "green and yellow mehndi invitation with henna hands",
      "bangla mehedi party card online",
      "paisley mehndi ceremony invite template",
    ],
    palette: [GREEN, GREEN_D, MUSTARD, CREAM, PINK],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
