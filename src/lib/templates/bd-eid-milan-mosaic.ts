import { divider, islamicStar, sparkle } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { glowBlob, hangingCrescent, lanternCenter, lanternScene, sparkleField } from "./eid-iftar-lanterns.art";
import { goldRule, mihrab, mosaicStrip } from "./bd-eid-milan-mosaic.art";
import { GOLD, H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";

const DEEP = "#052a2c";
const TEAL = "#0f6b6a";
const GOLDC = "#e2bd62";
const GOLD_L = "#f6e2a6";
const CREAM = "#f6ecd2";
const MIST = "#9fcfc6";

const bg = linear(90, [0, "#04282a"], [0.5, "#0a4547"], [1, "#04282a"]);

export default function bdEidMilanMosaic(): TemplateDef {
  const frieze = (top: number, h: number, seed: number, atTop: boolean) => [
    lock(O(mosaicStrip(W, h, 100, seed), { x: 0, y: top, width: W })),
    lock(O(goldRule(W), { x: 0, y: atTop ? top + h : top - 14, width: W })),
  ];
  const lamps = [
    { cx: 112, len: 80, s: 0.9 },
    { cx: 258, len: 14, s: 0.72, tint: "teal" as const },
    { cx: 742, len: 14, s: 0.72, tint: "teal" as const },
    { cx: 888, len: 80, s: 0.9 },
  ];
  const lampGlow = (items: { cx: number; len: number; s: number }[]) =>
    items.map((h) => {
      const [cx, cy] = lanternCenter(h);
      return glowBlob(cx, cy, 150 * h.s, "255,190,90", 0.35);
    });

  const cover = P(
    bg,
    [
      glowBlob(500, 700, 520, "30,170,160", 0.22),
      ...frieze(0, 270, 11, true),
      ...frieze(1190, 210, 23, false),
      ...sparkleField(41, 26, [[0, 0, 1000, 330], [100, 330, 900, 1180], [0, 1160, 1000, 1400]], ["#f6e2a6", "#9fe0d0"]),
      lock(S({ x: 410, y: 70, width: 180, height: 180, shape: "ellipse", fill: { kind: "radial", stops: [[0, "rgba(4,40,42,0.92)"], [0.7, "rgba(4,40,42,0.7)"], [1, "rgba(4,40,42,0)"]] } })),
      ...lampGlow(lamps),
      lock(O(lanternScene(lamps), { x: 0, y: 0, width: W })),
      lock(O(hangingCrescent(500, 0, 120, 78), { x: 0, y: 0, width: W })),
      lock(O(mihrab(780, 830, GOLDC, linear(90, [0, "#0a3b3d"], [1, "#062f31"]), 3), { x: 110, y: 318, width: 780 })),
      O(sparkle({ color: GOLD_L, size: 40 }), { cx: 190, y: 480, width: 22, opacity: 0.8 }),
      O(sparkle({ color: GOLD_L, size: 40 }), { cx: 812, y: 560, width: 16, opacity: 0.8 }),
      T("ঈদ মোবারক", 408, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 50, fill: CREAM, lineHeight: 1.3 }),
      T("ঈদ মিলন", 468, { x: 150, width: 700, fontFamily: "Tiro Bangla", fontSize: 158, fill: GOLD, lineHeight: 1.25, shadow: { color: "#f4c85a", blur: 26, offsetX: 0, offsetY: 0, opacity: 0.35 } }),
      T("EID MILAN  ·  REUNION GATHERING", 676, { x: 180, width: 640, fontFamily: "Jost", fontWeight: 500, fontSize: 17, fill: GOLDC, letterSpacing: 8 }),
      O(divider({ style: "diamond", w: 360, color: GOLDC }), { cx: W / 2, y: 722, width: 360 }),
      T(GUEST_TOKEN, 770, { x: 220, width: 560, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 32, fill: GOLD_L }),
      T("আসুন, ঈদের আনন্দ ভাগ করে নিই", 818, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 28, fill: CREAM }),
      T("শনিবার, ২০ মার্চ ২০২৭", 906, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 50, fill: GOLD, lineHeight: 1.3 }),
      T("বিকাল ৪টা থেকে রাত ৯টা", 974, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontWeight: 500, fontSize: 28, fill: CREAM }),
      T("Saturday, 20 March 2027  ·  4 PM to 9 PM", 1020, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 26, fill: MIST }),
      T("রহমান ভিলা, বনানী, ঢাকা", 1074, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 34, fill: GOLD_L, lineHeight: 1.3 }),
    ],
    "Invitation",
  );

  // ---------- details ----------
  const items = [
    { l: "তারিখ", m: "২০ মার্চ ২০২৭", s: "শনিবার" },
    { l: "সময়", m: "বিকাল ৪টা", s: "রাত ৯টা পর্যন্ত" },
    { l: "স্থান", m: "রহমান ভিলা", s: "বনানী, ঢাকা" },
    { l: "পোশাক", m: "উৎসবের রঙ", s: "নতুন পোশাকে সবাই আসুন" },
  ];
  const cards = items.flatMap((it, i) => {
    const x = 90 + (i % 2) * 430;
    const y = 400 + Math.floor(i / 2) * 270;
    return [
      lock(S({ x, y, width: 390, height: 230, shape: "rect", cornerRadius: 22, fill: "rgba(15,107,106,0.28)", stroke: GOLDC, strokeWidth: 1.8 })),
      lock(S({ x: x + 10, y: y + 10, width: 370, height: 210, shape: "rect", cornerRadius: 15, fill: null, stroke: "rgba(226,189,98,0.4)", strokeWidth: 1 })),
      T(it.l, y + 30, { x: x + 20, width: 350, fontFamily: "Hind Siliguri", fontWeight: 500, fontSize: 22, fill: GOLDC, letterSpacing: 2 }),
      T(it.m, y + 82, { x: x + 20, width: 350, fontFamily: "Tiro Bangla", fontSize: 44, fill: GOLD, lineHeight: 1.3 }),
      T(it.s, y + 156, { x: x + 20, width: 350, fontFamily: "Hind Siliguri", fontSize: 24, fill: CREAM }),
    ];
  });
  const sideLamps = [
    { cx: 56, len: 40, s: 0.62 },
    { cx: 944, len: 40, s: 0.62, tint: "teal" as const },
  ];
  const details = P(
    bg,
    [
      glowBlob(500, 600, 520, "30,170,160", 0.2),
      ...frieze(0, 210, 31, true),
      ...frieze(1200, 200, 47, false),
      ...lampGlow(sideLamps),
      lock(O(lanternScene(sideLamps), { x: 0, y: 0, width: W })),
      T("আয়োজন", 240, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 92, fill: GOLD, lineHeight: 1.3 }),
      T("THE GATHERING", 346, { x: 200, width: 600, fontFamily: "Jost", fontWeight: 500, fontSize: 17, fill: GOLDC, letterSpacing: 10 }),
      ...cards,
      O(divider({ style: "stars", w: 280, color: GOLDC, strokeWidth: 1.6 }), { cx: W / 2, y: 954, width: 280 }),
      T("সেমাই  ·  পোলাও  ·  কাবাব  ·  ফিরনি", 1004, { x: 100, width: 800, fontFamily: "Tiro Bangla", fontSize: 40, fill: GOLD_L, lineHeight: 1.3 }),
      T("ছোটদের জন্য ঈদ সালামি ও আনন্দের আসর", 1074, { x: 120, width: 760, fontFamily: "Hind Siliguri", fontSize: 26, fill: CREAM }),
      T("A festive spread, a children's corner and Eid cheer for the whole family", 1128, { x: 140, width: 720, fontFamily: "Cormorant Garamond", italic: true, fontSize: 25, fill: MIST }),
    ],
    "Gathering",
  );

  // ---------- greeting ----------
  const tall = [
    { cx: 70, len: 260, s: 0.7 },
    { cx: 930, len: 260, s: 0.7, tint: "teal" as const },
    { cx: 70, len: 20, s: 0.6, tint: "teal" as const },
    { cx: 930, len: 20, s: 0.6 },
  ];
  const photo = P(
    bg,
    [
      glowBlob(500, 560, 560, "30,170,160", 0.25),
      ...frieze(0, 170, 59, true),
      ...frieze(1220, 180, 71, false),
      ...lampGlow(tall),
      lock(O(lanternScene(tall), { x: 0, y: 0, width: W })),
      lock(O(islamicStar({ color: GOLDC, size: 600, strokeWidth: 2.4, echo: false, fill: "rgba(15,107,106,0.35)" }), { cx: W / 2, y: 240, width: 600 })),
      I({ x: 290, y: 330, width: 420, height: 420, mask: "ellipse", placeholderFill: "#0f6b6a", borderColor: GOLDC, borderWidth: 5 }),
      T("تقبل الله منا ومنكم", 852, { x: 150, width: 700, fontFamily: "Amiri", fontSize: 54, fill: GOLD, lineHeight: 1.3 }),
      T("ঈদ মোবারক", 938, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 84, fill: CREAM, lineHeight: 1.3 }),
      T("ঈদের খুশি ছড়িয়ে পড়ুক সবার ঘরে ঘরে।", 1046, { x: 140, width: 720, fontFamily: "Hind Siliguri", fontSize: 28, fill: GOLD_L }),
      T("May this Eid bring peace, joy and togetherness to every home.", 1092, { x: 180, width: 640, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, fill: MIST, lineHeight: 1.35 }),
      T("রহমান ও হোসেন পরিবার", 1142, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 32, fill: GOLDC, lineHeight: 1.3 }),
    ],
    "Greeting",
  );

  return {
    slug: "bd-eid-milan-mosaic",
    name: "Eid Milan Teal Mosaic",
    tagline: "Teal and gold mosaic Eid reunion card with lanterns and a Bangla Eid Milan heading",
    description:
      "A festive Eid Milan (Eid reunion) invitation in teal and gold, with star-and-cross mosaic friezes, glowing lanterns, a hanging crescent and a mihrab arch panel, written in Bangla with Arabic and English greetings.",
    categories: ["bengali", "ceremony", "islamic", "festive", "geometric", "luxury"],
    keywords: [
      "eid milan invitation card bangla",
      "eid punormiloni invitation design",
      "teal and gold eid reunion invitation",
      "eid mubarak party card with lanterns",
      "online eid milan card maker bangladesh",
    ],
    palette: [DEEP, TEAL, GOLDC, CREAM, MIST],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
