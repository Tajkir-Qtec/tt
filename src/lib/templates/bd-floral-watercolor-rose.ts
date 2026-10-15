import { archFrame, divider } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { blossomRow, floralBand, roseSpray } from "./bd-floral-watercolor-rose.art";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const BLUSH = "#fdf1ea";
const ROSE = "#d27c8d";
const PEACH = "#f6c9b0";
const PLUM = "#5a2d3b";
const PLUM_S = "#8a5a66";
const GOLDL = "#b98a4e";
const SAGE = "#8da384";

const bg = linear(100, [0, "#fff6f0"], [0.5, "#fdeee6"], [1, "#fadfd6"]);

const wash = (x: number, y: number, w: number, h: number, c: string, a = 0.5) =>
  lock(S({ x, y, width: w, height: h, shape: "ellipse", fill: radial([0, c.replace("A", String(a))], [0.6, c.replace("A", String(a * 0.35))], [1, c.replace("A", "0")]) }));

export default function bdFloralWatercolorRose(): TemplateDef {
  const washes = (v: 0 | 1 | 2) => {
    const roseW = "rgba(238,150,160,A)";
    const peachW = "rgba(250,196,160,A)";
    const sageW = "rgba(160,190,150,A)";
    if (v === 0)
      return [wash(-260, -240, 900, 800, roseW, 0.5), wash(520, 800, 900, 800, peachW, 0.55), wash(500, -200, 600, 520, sageW, 0.25), wash(-200, 960, 640, 560, peachW, 0.3)];
    if (v === 1) return [wash(-240, -200, 760, 640, roseW, 0.4), wash(500, 1000, 800, 700, peachW, 0.5), wash(300, 560, 700, 600, "rgba(255,255,255,A)", 0.5)];
    return [wash(-240, -200, 800, 700, peachW, 0.5), wash(440, 900, 900, 800, roseW, 0.45), wash(560, 80, 560, 520, sageW, 0.22)];
  };
  const cap = (text: string, y: number, o = {}) =>
    T(text, y, { x: 200, width: 600, fontFamily: "Jost", fontSize: 15, letterSpacing: 8, fontWeight: 400, fill: PLUM_S, uppercase: true, ...o });

  // ---------- cover ----------
  const cover = P(
    bg,
    [
      ...washes(0),
      lock(O(archFrame({ w: 640, h: 810, stroke: GOLDL, strokeWidth: 1.6, fill: "rgba(255,252,248,0.72)", lines: 2, gap: 12 }), { x: 180, y: 290, width: 640 })),
      lock(O(roseSpray(0), { x: 0, y: 0, width: 590 })),
      lock(O(roseSpray(0), { x: 410, y: 810, width: 590, flipX: true, flipY: true })),
      lock(O(roseSpray(1), { x: 720, y: 0, width: 280, flipX: true })),
      lock(O(roseSpray(1), { x: 0, y: 1120, width: 280, flipY: true })),
      T("শুভ বিবাহ", 384, { x: 220, width: 560, fontFamily: "Tiro Bangla", fontSize: 88, fill: ROSE, lineHeight: 1.3 }),
      cap("together with their families", 506),
      T(GUEST_TOKEN, 546, { x: 240, width: 520, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 32, fill: GOLDL }),
      T("Anika", 590, { x: 220, width: 560, fontFamily: "Great Vibes", fontSize: 104, fill: PLUM, lineHeight: 1.2 }),
      T("&", 672, { x: 220, width: 560, fontFamily: "Cormorant Garamond", italic: true, fontSize: 46, fill: GOLDL }),
      T("Rafiq", 740, { x: 220, width: 560, fontFamily: "Great Vibes", fontSize: 104, fill: PLUM, lineHeight: 1.2 }),
      O(blossomRow(300), { cx: W / 2, y: 884, width: 300 }),
      T("আনিকা  ও  রফিক", 922, { x: 230, width: 540, fontFamily: "Tiro Bangla", fontSize: 38, fill: PLUM, lineHeight: 1.3 }),
      T("শুক্রবার, ১২ ফেব্রুয়ারি ২০২৭  ·  বিকেল ৫টা", 984, { x: 220, width: 560, fontFamily: "Hind Siliguri", fontSize: 23, fontWeight: 500, fill: PLUM }),
      T("শোনার তরী গার্ডেন রিসোর্ট, গাজীপুর", 1026, { x: 220, width: 560, fontFamily: "Hind Siliguri", fontSize: 21, fill: PLUM_S }),
    ],
    "Invitation",
  );

  // ---------- details ----------
  const events = [
    { bn: "মেহেদি সন্ধ্যা", en: "Mehendi Evening", d: "বুধবার, ১০ ফেব্রুয়ারি", t: "সন্ধ্যা ৬টা" },
    { bn: "গায়ে হলুদ", en: "Gaye Holud", d: "বৃহস্পতিবার, ১১ ফেব্রুয়ারি", t: "বিকেল ৪টা" },
    { bn: "বিবাহ অনুষ্ঠান", en: "The Wedding", d: "শুক্রবার, ১২ ফেব্রুয়ারি", t: "বিকেল ৫টা" },
    { bn: "বউভাত", en: "Reception", d: "শনিবার, ১৩ ফেব্রুয়ারি", t: "সন্ধ্যা ৭টা" },
  ];
  const evLayers: ReturnType<typeof T>[] = [];
  const evBoxes: ReturnType<typeof S>[] = [];
  events.forEach((e, i) => {
    const y = 380 + i * 168;
    evBoxes.push(lock(S({ x: 150, y, width: 700, height: 146, shape: "rect", cornerRadius: 28, fill: "rgba(255,252,248,0.78)", stroke: "#e3b9b0", strokeWidth: 1.2 })));
    evBoxes.push(lock(S({ x: 164, y: y + 14, width: 672, height: 118, shape: "rect", cornerRadius: 20, fill: null, stroke: GOLDL, strokeWidth: 0.7, opacity: 0.6 })));
    evLayers.push(T(e.bn, y + 26, { x: 190, width: 330, align: "left", fontFamily: "Tiro Bangla", fontSize: 42, fill: ROSE, lineHeight: 1.25 }));
    evLayers.push(T(e.en, y + 92, { x: 192, width: 330, align: "left", fontFamily: "Jost", fontSize: 14, letterSpacing: 6, uppercase: true, fill: PLUM_S }));
    evLayers.push(T(e.d, y + 34, { x: 480, width: 330, align: "right", fontFamily: "Hind Siliguri", fontSize: 24, fontWeight: 500, fill: PLUM }));
    evLayers.push(T(e.t, y + 78, { x: 480, width: 330, align: "right", fontFamily: "Hind Siliguri", fontSize: 24, fill: GOLDL }));
  });
  const details = P(
    bg,
    [
      ...washes(1),
      lock(O(roseSpray(1), { x: 0, y: 0, width: 360 })),
      lock(O(roseSpray(1), { x: 640, y: 1040, width: 360, flipX: true, flipY: true })),
      T("অনুষ্ঠানসূচি", 150, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 86, fill: ROSE, lineHeight: 1.3 }),
      cap("Celebration schedule", 270),
      O(blossomRow(300), { cx: W / 2, y: 308, width: 300 }),
      ...evBoxes,
      ...evLayers,
      T("স্থান", 1070, { x: 300, width: 400, fontFamily: "Hind Siliguri", fontSize: 22, fill: GOLDL }),
      T("শোনার তরী গার্ডেন রিসোর্ট", 1106, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 40, fill: PLUM, lineHeight: 1.3 }),
      T("কালিয়াকৈর, গাজীপুর  ·  Shonar Tori Garden Resort", 1166, { x: 150, width: 700, fontFamily: "Cormorant Garamond", fontSize: 24, fontWeight: 500, fill: PLUM_S }),
    ],
    "Schedule",
  );

  // ---------- photo ----------
  const photo = P(
    bg,
    [
      ...washes(2),
      lock(O(roseSpray(0), { x: 0, y: 0, width: 560 })),
      lock(O(roseSpray(1), { x: 580, y: 980, width: 420, flipX: true, flipY: true })),
      lock(S({ x: 262, y: 176, width: 476, height: 612, shape: "ellipse", fill: null, stroke: GOLDL, strokeWidth: 1.2 })),
      I({ x: 280, y: 194, width: 440, height: 576, mask: "ellipse", placeholderFill: "#f2cfc6", borderColor: "#fffaf5", borderWidth: 6 }),
      T("দুটি হৃদয়ের মিলন", 830, { x: 150, width: 700, fontFamily: "Tiro Bangla", fontSize: 62, fill: ROSE, lineHeight: 1.35 }),
      T("আপনাদের স্নেহ, দোয়া ও উপস্থিতিই আমাদের নতুন জীবনের সবচেয়ে সুন্দর উপহার।", 930, { x: 210, width: 580, fontFamily: "Hind Siliguri", fontSize: 24, fill: PLUM_S, lineHeight: 1.6 }),
      O(divider({ style: "floral", w: 320, color: GOLDL, strokeWidth: 1.4 }), { cx: W / 2, y: 1052, width: 320 }),
      T("Anika & Rafiq", 1106, { x: 200, width: 600, fontFamily: "Great Vibes", fontSize: 72, fill: PLUM }),
      cap("১২ · ০২ · ২০২৭", 1210, { fontFamily: "Hind Siliguri", fontSize: 18, letterSpacing: 6 }),
    ],
    "Message",
  );

  void GOLD;
  void SAGE;
  void PEACH;
  void H;
  return {
    slug: "bd-floral-watercolor-rose",
    name: "Watercolor Rose Bangla",
    tagline: "Soft rose and peach floral Bangladeshi wedding card with Bangla header",
    description:
      "A romantic Bangladeshi wedding invitation with hand-painted style rose and peach florals, blush watercolor washes, a gold arch and a Bangla Shubho Bibaho heading. Ideal for garden weddings and a soft, modern bride.",
    categories: ["bengali", "floral", "classic", "ceremony"],
    keywords: [
      "rose floral bangla wedding invitation",
      "watercolor flower biyer card bangladesh",
      "blush pink peach bengali wedding card",
      "bangla shubho bibaho floral invitation online",
      "garden wedding invitation dhaka",
    ],
    palette: [BLUSH, ROSE, PEACH, PLUM, SAGE],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
