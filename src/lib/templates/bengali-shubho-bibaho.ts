import { archFrame, divider, ticketFrame } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { alponaBand, archRing, lotusBloom, rosetteLattice, rosetteSmall, shankha, topor } from "./bengali-shubho-bibaho.art";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const RED = "#a3141f";
const RED_D = "#6b0a14";
const IVORY = "#fbf2e0";
const CREAM = "#f4e6c8";
const GOLDC = "#e3bd6a";
const GOLD_D = "#a97a2a";
const INK = "#5a1a1f";

const shadow = { color: "#2b0206", blur: 10, offsetX: 0, offsetY: 3, opacity: 0.45 };
const petalFill = linear(90, [0, "#f7d3b8"], [0.5, "#fff3e6"], [1, "#f4c9ae"]);
const ivoryFill = linear(90, [0, "#f6e8c9"], [0.5, "#fdf6e6"], [1, "#f3e3c1"]);
const redBg = linear(90, [0, "#8a0f1b"], [0.5, "#a8161f"], [1, "#82101a"]);

function redGround(): ReturnType<typeof lock>[] {
  return [
    lock(O(rosetteLattice({ w: W, h: H, cell: 130, color: IVORY }), { x: 0, y: 0, width: W, opacity: 0.085 })),
    lock(S({ x: -200, y: 200, width: 1400, height: 1000, shape: "ellipse", fill: radial([0, "rgba(214,48,52,0.55)"], [0.7, "rgba(163,20,31,0.15)"], [1, "rgba(163,20,31,0)"]) })),
    lock(O(ticketFrame({ w: 928, h: 1328, r: 34, stroke: GOLDC, strokeWidth: 2.4, lines: 2, gap: 11 }), { x: 36, y: 36, width: 928 })),
    lock(O(alponaBand({ len: 840, color: IVORY, accent: GOLDC }), { x: 80, y: 66, width: 840 })),
    lock(O(alponaBand({ len: 840, color: IVORY, accent: GOLDC }), { x: 80, y: 1400 - 66 - 74, width: 840 })),
  ];
}

export default function bengaliShubhoBibaho(): TemplateDef {

  const label = (text: string, y: number, o = {}) =>
    T(text, y, { x: 200, width: 600, fontFamily: "Jost", fontSize: 16, fill: GOLD_D, letterSpacing: 8, uppercase: true, fontWeight: 500, ...o });

  const cover = P(
    redBg,
    [
      ...redGround(),
      lock(O(archRing({ w: 700, h: 1010, color: IVORY, accent: GOLDC }), { x: 110, y: 138, width: 780 })),
      lock(O(archFrame({ w: 700, h: 1010, stroke: GOLD_D, strokeWidth: 3.5, fill: ivoryFill, lines: 2, gap: 14 }), { x: 150, y: 178, width: 700 })),
      O(topor({ stroke: GOLD_D, fill: ivoryFill, accent: GOLDC }), { cx: W / 2, y: 214, width: 250 }),
      T("শুভ বিবাহ", 398, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 94, fill: RED, lineHeight: 1.3 }),
      label("The wedding of", 526),
      T(GUEST_TOKEN, 566, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 34, fill: GOLD_D }),
      T("Arpita", 612, { x: 160, width: 680, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 92, fill: INK }),
      T("&", 722, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 56, fill: GOLD_D }),
      T("Soumyadeep", 756, { x: 160, width: 680, fontFamily: "Playfair Display", fontWeight: 500, fontSize: 86, fill: INK }),
      T("অর্পিতা  ও  সৌম্যদীপ", 864, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 36, fill: RED, lineHeight: 1.4 }),
      O(shankha({ stroke: "#8a5a1a", fill: "#fffaf0", accent: "#c43a3a", sw: 3 }), { cx: W / 2 - 165, y: 940, width: 84 }),
      O(shankha({ stroke: "#8a5a1a", fill: "#fffaf0", accent: "#c43a3a", sw: 3 }), { cx: W / 2 + 165, y: 940, width: 84, flipX: true }),
      O(lotusBloom({ stroke: "#8a5a1a", fill: petalFill, accent: RED, sw: 2.8 }), { cx: W / 2, y: 924, width: 200 }),
      T("রবিবার, ১৯ ডিসেম্বর ২০২৭  ·  সন্ধ্যা ৬টা ৩০", 1090, { x: 180, width: 640, fontFamily: "Hind Siliguri", fontWeight: 500, fontSize: 27, fill: RED_D, lineHeight: 1.4 }),
      T("Basanta Vihar, Lake Gardens, Kolkata", 1134, { x: 180, width: 640, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 28, fill: INK, letterSpacing: 1 }),
    ],
    "Invitation",
  );

  // ---------- details ----------
  const events: { bn: string; en: string; whenBn: string; whenEn: string }[] = [
    { bn: "আইবুড়ো ভাত", en: "Aiburo Bhaat", whenBn: "শুক্রবার, ১৭ ডিসেম্বর  ·  দুপুর ১টা", whenEn: "Friday, 17 December  ·  1:00 PM" },
    { bn: "গায়ে হলুদ", en: "Gaye Holud", whenBn: "শনিবার, ১৮ ডিসেম্বর  ·  সকাল ১০টা", whenEn: "Saturday, 18 December  ·  10:00 AM" },
    { bn: "শুভ বিবাহ", en: "The Wedding", whenBn: "রবিবার, ১৯ ডিসেম্বর  ·  সন্ধ্যা ৬টা ৩০", whenEn: "Sunday, 19 December  ·  6:30 PM" },
    { bn: "বৌভাত", en: "Reception", whenBn: "সোমবার, ২০ ডিসেম্বর  ·  সন্ধ্যা ৭টা", whenEn: "Monday, 20 December  ·  7:00 PM" },
  ];
  const ev: ReturnType<typeof T>[] = [];
  const sepLayers: ReturnType<typeof O>[] = [];
  events.forEach((e, i) => {
    const y = 316 + i * 178;
    ev.push(T(e.bn, y, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 44, fill: RED, lineHeight: 1.3 }));
    ev.push(label(e.en, y + 62, { fontSize: 14, letterSpacing: 7 }));
    ev.push(T(e.whenBn, y + 86, { x: 150, width: 700, fontFamily: "Hind Siliguri", fontSize: 24, fontWeight: 500, fill: INK }));
    ev.push(T(e.whenEn, y + 122, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 26, fill: INK }));
    if (i < events.length - 1) sepLayers.push(O(rosetteSmall(RED, GOLD_D, 24), { cx: W / 2, y: y + 152, width: 20 }));
  });

  const details = P(
    linear(90, [0, "#f3e4c4"], [0.5, "#fbf3e2"], [1, "#f0dfbc"]),
    [
      lock(S({ x: 0, y: 0, width: W, height: 262, fill: redBg })),
      lock(O(rosetteLattice({ w: W, h: 262, cell: 110, color: IVORY }), { x: 0, y: 0, width: W, opacity: 0.09 })),
      lock(S({ x: 0, y: 262, width: W, height: 4, fill: GOLD })),
      lock(O(ticketFrame({ w: 928, h: 1328, r: 34, stroke: GOLD_D, strokeWidth: 2.2, lines: 2, gap: 11 }), { x: 36, y: 36, width: 928 })),
      lock(O(alponaBand({ len: 840, color: IVORY, accent: GOLDC }), { x: 80, y: 62, width: 840 })),
      T("অনুষ্ঠানসূচি", 128, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 78, fill: GOLD, lineHeight: 1.3, shadow }),
      T("CELEBRATION SCHEDULE", 214, { x: 200, width: 600, fontFamily: "Jost", fontSize: 17, letterSpacing: 9, fontWeight: 500, fill: IVORY }),
      lock(O(alponaBand({ len: 860, color: RED, accent: GOLD_D, step: 110 }), { x: 70, y: 1400 - 66 - 74, width: 860, opacity: 0.9 })),
      ...ev,
      ...sepLayers,
      O(divider({ style: "diamond", w: 420, color: GOLD_D }), { cx: W / 2, y: 1022, width: 420 }),
      label("স্থান  ·  Venue", 1070, { fontFamily: "Hind Siliguri", fontSize: 20, letterSpacing: 4, uppercase: false }),
      T("বসন্ত বিহার", 1108, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 40, fill: RED, lineHeight: 1.3 }),
      T("Basanta Vihar  ·  14 Lake Gardens Road, Kolkata 700045", 1166, { x: 140, width: 720, fontFamily: "Cormorant Garamond", fontSize: 26, fontWeight: 500, fill: INK }),
    ],
    "Schedule",
  );
  // ---------- blessing ----------
  const photo = P(
    redBg,
    [
      ...redGround(),
      lock(O(archRing({ w: 420, h: 560, color: IVORY, accent: GOLDC, pad: 40 }), { x: 250, y: 150, width: 500 })),
      I({ x: 290, y: 190, width: 420, height: 560, mask: "arch", placeholderFill: "#c0303a", borderColor: GOLDC, borderWidth: 4 }),
      O(shankha({ stroke: "#8a5a1a", fill: "#fffaf0", accent: "#c43a3a", sw: 3 }), { cx: 150, y: 330, width: 100 }),
      O(shankha({ stroke: "#8a5a1a", fill: "#fffaf0", accent: "#c43a3a", sw: 3 }), { cx: 850, y: 330, width: 100, flipX: true }),
      T("দুটি মন, একটি জীবন", 800, { x: 140, width: 720, fontFamily: "Tiro Bangla", fontSize: 58, fill: GOLD, lineHeight: 1.35, shadow }),
      T("আপনাদের আশীর্বাদই আমাদের নতুন পথচলার পাথেয়", 900, { x: 150, width: 700, fontFamily: "Hind Siliguri", fontSize: 28, fontWeight: 400, fill: "#f2dfc6", lineHeight: 1.55 }),
      T("Your blessings and presence will make our joy complete.", 990, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontSize: 28, lineHeight: 1.4, fill: IVORY }),
      O(lotusBloom({ stroke: "#8a5a1a", fill: petalFill, accent: GOLDC }), { cx: W / 2, y: 1062, width: 130 }),
      T("Arpita & Soumyadeep", 1192, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 28, fill: GOLD, letterSpacing: 6 }),
    ],
    "Blessing",
  );

  return {
    slug: "bengali-shubho-bibaho",
    name: "Bengali Shubho Bibaho",
    tagline: "Traditional Bengali Hindu wedding card with alpona, shankha and topor",
    description:
      "A traditional Bengali wedding invitation in sindoor red, ivory and gold, with white alpona rice-paste motifs, a conch shell, lotus and sola-shola topor crest above a Bangla Shubho Bibaho heading.",
    categories: ["bengali", "indian", "cultural", "floral", "classic"],
    keywords: [
      "shubho bibaho invitation card bengali",
      "bengali hindu wedding card with alpona",
      "red and gold bangla biyer card",
      "topor shankha wedding invitation",
      "online bengali wedding invitation maker",
    ],
    palette: [RED, RED_D, IVORY, GOLDC, CREAM],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
