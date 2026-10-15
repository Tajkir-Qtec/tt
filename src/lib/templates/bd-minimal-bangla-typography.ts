import { divider } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { cornerTick, hairSun, lineShapla } from "./bd-minimal-bangla-typography.art";
import { GOLD, H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";

const IVORY = "#f7f2e7";
const PAPER = "#efe7d6";
const INK = "#24252b";
const SOFT = "#6a6a70";
const GOLDL = "#b8923f";
const RED = "#9b2a2a";

const bg = linear(90, [0, "#f4eddc"], [0.5, "#f9f5ea"], [1, "#f1e9d6"]);

export default function bdMinimalBanglaTypography(): TemplateDef {
  const frame = () => [
    lock(S({ x: 44, y: 44, width: 912, height: 1312, shape: "rect", fill: null, stroke: GOLDL, strokeWidth: 1.4 })),
    lock(S({ x: 56, y: 56, width: 888, height: 1288, shape: "rect", fill: null, stroke: GOLDL, strokeWidth: 0.7, opacity: 0.7 })),
  ];
  const ticks = () => [
    lock(O(cornerTick({ color: GOLDL }), { x: 72, y: 72, width: 66 })),
    lock(O(cornerTick({ color: GOLDL }), { x: 862, y: 72, width: 66, flipX: true })),
    lock(O(cornerTick({ color: GOLDL }), { x: 72, y: 1262, width: 66, flipY: true })),
    lock(O(cornerTick({ color: GOLDL }), { x: 862, y: 1262, width: 66, flipX: true, flipY: true })),
  ];
  const cap = (text: string, y: number, o = {}) =>
    T(text, y, { x: 200, width: 600, fontFamily: "Jost", fontSize: 16, letterSpacing: 9, fontWeight: 400, fill: SOFT, uppercase: true, ...o });

  // ---------- cover ----------
  const cover = P(
    bg,
    [
      ...frame(),
      ...ticks(),
      lock(O(hairSun({ color: GOLDL, size: 680 }), { cx: W / 2, y: 206, width: 680, opacity: 0.55 })),
      cap("আমাদের", 150, { fontFamily: "Tiro Bangla", uppercase: false, fontSize: 30, letterSpacing: 0, fill: GOLDL }),
      O(lineShapla({ color: GOLDL }), { cx: W / 2, y: 196, width: 120 }),
      T("বিয়ে", 350, { x: 60, width: 880, fontFamily: "Tiro Bangla", fontSize: 380, fill: INK, lineHeight: 1.15 }),
      T("আপনাকে সাদর আমন্ত্রণ", 878, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 27, fontWeight: 400, fill: SOFT, letterSpacing: 0 }),
      lock(S({ x: 440, y: 940, width: 120, height: 1.6, fill: GOLD })),
      T(GUEST_TOKEN, 958, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 32, fill: GOLDL }),
      T("নুসরাত  ও  তানভীর", 1004, { x: 120, width: 760, fontFamily: "Tiro Bangla", fontSize: 58, fill: INK, lineHeight: 1.3 }),
      cap("Nusrat  &  Tanvir", 1082, { fontSize: 20, letterSpacing: 10, fill: INK, fontWeight: 500 }),
      T("শুক্রবার  ·  ১০ ডিসেম্বর ২০২৭  ·  সন্ধ্যা ৬টা", 1150, { x: 140, width: 720, fontFamily: "Hind Siliguri", fontSize: 24, fontWeight: 500, fill: INK }),
      T("লেকভিউ কনভেনশন হল, গুলশান-২, ঢাকা", 1192, { x: 140, width: 720, fontFamily: "Hind Siliguri", fontSize: 22, fill: SOFT }),
    ],
    "Invitation",
  );

  // ---------- details ----------
  const rows = [
    { n: "০১", bn: "গায়ে হলুদ", en: "Gaye Holud", d: "বৃহস্পতিবার, ৯ ডিসেম্বর", t: "বিকেল ৪টা" },
    { n: "০২", bn: "আকদ", en: "Akd", d: "শুক্রবার, ১০ ডিসেম্বর", t: "দুপুর ১২টা" },
    { n: "০৩", bn: "বিবাহ অনুষ্ঠান", en: "Wedding Ceremony", d: "শুক্রবার, ১০ ডিসেম্বর", t: "সন্ধ্যা ৬টা" },
    { n: "০৪", bn: "বউভাত", en: "Reception", d: "শনিবার, ১১ ডিসেম্বর", t: "সন্ধ্যা ৭টা" },
  ];
  const rowLayers: ReturnType<typeof T>[] = [];
  const rules: ReturnType<typeof S>[] = [];
  rows.forEach((r, i) => {
    const y = 420 + i * 150;
    rules.push(lock(S({ x: 120, y: y - 22, width: 760, height: 1, fill: GOLDL, opacity: 0.7 })));
    rowLayers.push(T(r.n, y + 8, { x: 120, width: 110, align: "left", fontFamily: "Tiro Bangla", fontSize: 38, fill: GOLDL }));
    rowLayers.push(T(r.bn, y, { x: 240, width: 330, align: "left", fontFamily: "Tiro Bangla", fontSize: 46, fill: INK, lineHeight: 1.25 }));
    rowLayers.push(T(r.en, y + 66, { x: 242, width: 330, align: "left", fontFamily: "Jost", fontSize: 14, letterSpacing: 6, uppercase: true, fill: SOFT }));
    rowLayers.push(T(r.d, y + 4, { x: 560, width: 320, align: "right", fontFamily: "Hind Siliguri", fontSize: 25, fontWeight: 500, fill: INK }));
    rowLayers.push(T(r.t, y + 46, { x: 560, width: 320, align: "right", fontFamily: "Hind Siliguri", fontSize: 24, fill: RED }));
  });
  rules.push(lock(S({ x: 120, y: 420 + 4 * 150 - 22, width: 760, height: 1, fill: GOLDL, opacity: 0.7 })));

  const details = P(
    bg,
    [
      ...frame(),
      ...ticks(),
      cap("Celebration schedule", 150),
      T("অনুষ্ঠানসূচি", 190, { x: 100, width: 800, fontFamily: "Tiro Bangla", fontSize: 150, fill: INK, lineHeight: 1.2 }),
      ...rules,
      ...rowLayers,
      O(lineShapla({ color: GOLDL }), { cx: W / 2, y: 1060, width: 90 }),
      cap("স্থান", 1128, { fontFamily: "Hind Siliguri", uppercase: false, fontSize: 22, letterSpacing: 0 }),
      T("লেকভিউ কনভেনশন হল", 1160, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 40, fill: INK, lineHeight: 1.3 }),
      T("প্লট ১২, রোড ৫৫, গুলশান-২, ঢাকা ১২১২", 1218, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 22, fill: SOFT }),
    ],
    "Schedule",
  );

  // ---------- photo ----------
  const photo = P(
    bg,
    [
      ...frame(),
      ...ticks(),
      lock(O(hairSun({ color: GOLDL, size: 640 }), { cx: W / 2, y: 150, width: 640, opacity: 0.4 })),
      I({ x: 300, y: 190, width: 400, height: 520, mask: "arch", placeholderFill: PAPER, borderColor: GOLDL, borderWidth: 2 }),
      T("ভালোবাসা", 760, { x: 80, width: 840, fontFamily: "Tiro Bangla", fontSize: 190, fill: INK, lineHeight: 1.2 }),
      T("আপনাদের উপস্থিতি ও দোয়া আমাদের নতুন জীবনের শ্রেষ্ঠ উপহার।", 995, { x: 170, width: 660, fontFamily: "Hind Siliguri", fontSize: 26, fill: SOFT, lineHeight: 1.6 }),
      O(divider({ style: "diamond", w: 300, color: GOLDL, strokeWidth: 1.4 }), { cx: W / 2, y: 1112, width: 300 }),
      T("Nusrat  &  Tanvir", 1170, { x: 200, width: 600, fontFamily: "Cormorant Garamond", fontSize: 38, fontWeight: 500, italic: true, fill: INK, letterSpacing: 2 }),
      cap("১০ · ১২ · ২০২৭", 1226, { fontFamily: "Hind Siliguri", fontSize: 18, letterSpacing: 8 }),
    ],
    "Message",
  );

  return {
    slug: "bd-minimal-bangla-typography",
    name: "Minimal Bangla Typography",
    tagline: "Modern minimalist Bangla wedding card with a giant বিয়ে headline",
    description:
      "A clean ivory and charcoal Bangladeshi wedding invitation with oversized Bangla typography, hairline gold frames and a fine-line shapla. Bilingual and made for modern Dhaka couples who love quiet elegance.",
    categories: ["bengali", "minimal", "modern", "classic"],
    keywords: [
      "minimal bangla biyer card",
      "modern bangladeshi wedding invitation",
      "bangla typography wedding card ivory",
      "simple bengali wedding invitation online",
      "বিয়ের কার্ড ডিজাইন মিনিমাল",
    ],
    palette: [IVORY, INK, GOLDL, SOFT, RED],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
