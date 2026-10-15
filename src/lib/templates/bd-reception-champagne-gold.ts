import { decoFrame, divider, sparkle } from "../design/ornaments";
import { GUEST_TOKEN } from "../design/types";
import { archSteps, bubbles, chandelier } from "./bd-events.art";
import { GOLD, H, I, linear, lock, O, P, radial, S, T, W, type TemplateDef } from "./kit";

const BLACK = "#0f0c0b";
const BLACK2 = "#1b1512";
const CHAMP = "#ead9b8";
const CHAMP_L = "#f6ecd8";
const BLUSH = "#f2d6cf";
const BLUSH_D = "#d9a99f";
const GOLDC = "#d9b86a";
const GOLD_D = "#9a7433";
const INK = "#2a1f1a";

const blackBg = linear(90, [0, "#1d1613"], [0.5, "#100c0a"], [1, "#1a1310"]);
const creamBg = linear(90, [0, "#f7e9d6"], [0.5, "#fbf2e8"], [1, "#f3dccf"]);
const shadow = { color: "#000000", blur: 12, offsetX: 0, offsetY: 4, opacity: 0.6 };

const lamp = (w: number, y: number) =>
  O(chandelier({ stroke: GOLDC, metal: GOLD, crystal: "rgba(246,236,216,0.55)", flame: "#ffe9a8", glow: "#ffd98a" }), { cx: W / 2, y, width: w });

function blackGround() {
  return [
    lock(S({ x: -250, y: -450, width: 1500, height: 1500, shape: "ellipse", fill: radial([0, "rgba(217,184,106,0.30)"], [0.55, "rgba(217,184,106,0.08)"], [1, "rgba(217,184,106,0)"]) })),
    lock(O(bubbles({ w: 1000, h: 1400, n: 90, color: CHAMP, seed: 5, max: 10 }), { x: 0, y: 0, width: 1000, opacity: 0.22 })),
    lock(O(decoFrame({ w: 928, h: 1328, cut: 38, stroke: GOLDC, strokeWidth: 2.6, lines: 2, gap: 10 }), { x: 36, y: 36, width: 928 })),
  ];
}

export default function bdReceptionChampagneGold(): TemplateDef {
  const label = (text: string, y: number, o = {}) =>
    T(text, y, { x: 150, width: 700, fontFamily: "Jost", fontSize: 16, fill: GOLDC, letterSpacing: 9, uppercase: true, fontWeight: 400, ...o });

  // ---------------- cover ----------------
  const cover = P(
    blackBg,
    [
      ...blackGround(),
      lock(O(archSteps({ w: 760, h: 1130, stroke: GOLDC, n: 4, gap: 11, sw: 2.4 }), { x: 120, y: 160, width: 760, opacity: 0.8 })),
      lock(S({ x: 120, y: 1288, width: 760, height: 2, fill: GOLDC, opacity: 0.8 })),
      lamp(460, 40),
      T(GUEST_TOKEN, 372, { x: 200, width: 600, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 500, fontSize: 32, fill: CHAMP }),
      label("Together with their families", 422, { fill: CHAMP, letterSpacing: 8, fontSize: 15 }),
      T("Reception", 438, { x: 120, width: 760, fontFamily: "Great Vibes", fontSize: 140, fill: GOLD, lineHeight: 1.3, shadow }),
      T("বউভাত ও রিসেপশন", 626, { x: 150, width: 700, fontFamily: "Tiro Bangla", fontSize: 50, fill: BLUSH, lineHeight: 1.3 }),
      O(divider({ style: "diamond", w: 380, color: GOLDC }), { cx: W / 2, y: 718, width: 380 }),
      T("NADIA", 758, { x: 150, width: 700, fontFamily: "Cinzel", fontWeight: 500, fontSize: 62, fill: CHAMP_L, letterSpacing: 14 }),
      T("&", 830, { x: 150, width: 700, fontFamily: "Great Vibes", fontSize: 60, fill: GOLD }),
      T("ARIF", 892, { x: 150, width: 700, fontFamily: "Cinzel", fontWeight: 500, fontSize: 62, fill: CHAMP_L, letterSpacing: 14 }),
      T("নাদিয়া  ও  আরিফ", 984, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 34, fill: BLUSH, lineHeight: 1.3 }),
      O(divider({ style: "stars", w: 300, color: GOLDC }), { cx: W / 2, y: 1056, width: 300 }),
      T("শনিবার, ১৮ ডিসেম্বর ২০২৭  ·  সন্ধ্যা ৭টা", 1096, { x: 150, width: 700, fontFamily: "Hind Siliguri", fontSize: 27, fontWeight: 500, fill: CHAMP_L }),
      T("Saturday, 18 December 2027  ·  Seven in the evening", 1142, { x: 150, width: 700, fontFamily: "Cormorant Garamond", italic: true, fontSize: 27, fill: CHAMP }),
      T("Grand Aurum Ballroom, Gulshan Avenue, Dhaka", 1186, { x: 150, width: 700, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 25, fill: GOLDC, letterSpacing: 1 }),
      label("Black tie", 1250, { fill: GOLDC, fontSize: 14, letterSpacing: 10 }),
    ],
    "Cover",
  );

  // ---------------- details ----------------
  const items: { time: string; en: string; bn: string }[] = [
    { time: "7:00 PM", en: "Welcome & champagne", bn: "আগমন ও স্বাগত পানীয়" },
    { time: "7:45 PM", en: "Entrance of the couple", bn: "বর-কনের আগমন" },
    { time: "8:30 PM", en: "Dinner is served", bn: "নৈশভোজ" },
    { time: "9:45 PM", en: "Cake & toast", bn: "কেক কাটা ও শুভেচ্ছা" },
    { time: "10:30 PM", en: "Music & dancing", bn: "গান ও নাচ" },
  ];
  const tl: ReturnType<typeof T>[] = [];
  const nodes: ReturnType<typeof O>[] = [];
  items.forEach((it, i) => {
    const y = 466 + i * 122;
    tl.push(T(it.time, y + 6, { x: 90, width: 370, align: "right", fontFamily: "Cinzel", fontWeight: 500, fontSize: 34, fill: GOLD_D, letterSpacing: 2 }));
    tl.push(T(it.en, y - 2, { x: 540, width: 390, align: "left", fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 33, fill: INK }));
    tl.push(T(it.bn, y + 40, { x: 540, width: 390, align: "left", fontFamily: "Hind Siliguri", fontSize: 22, fill: "#6b4a3c" }));
    nodes.push(O(sparkle({ color: GOLD_D, size: 40 }), { cx: W / 2, y: y + 10, width: 26 }));
  });
  const details = P(
    creamBg,
    [
      lock(O(bubbles({ w: 1000, h: 1400, n: 60, color: BLUSH_D, seed: 9, max: 9 }), { x: 0, y: 0, width: 1000, opacity: 0.22 })),
      lock(O(decoFrame({ w: 928, h: 1328, cut: 38, stroke: GOLDC, strokeWidth: 2.6, lines: 2, gap: 10 }), { x: 36, y: 36, width: 928 })),
      lamp(240, 44),
      T("Order of the Evening", 214, { x: 120, width: 760, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 56, fill: INK, letterSpacing: 2 }),
      T("সন্ধ্যার সূচি", 292, { x: 150, width: 700, fontFamily: "Tiro Bangla", fontSize: 44, fill: "#a86a5c", lineHeight: 1.3 }),
      O(divider({ style: "diamond", w: 360, color: GOLD_D }), { cx: W / 2, y: 372, width: 360 }),
      lock(S({ x: 499, y: 476, width: 2, height: 488, fill: GOLD })),
      ...nodes,
      ...tl,
      lock(S({ x: 150, y: 1090, width: 700, height: 180, fill: "rgba(255,255,255,0.45)", stroke: GOLDC, strokeWidth: 1.6, cornerRadius: 2 })),
      label("The venue", 1112, { fill: GOLD_D, fontSize: 14 }),
      T("Grand Aurum Ballroom", 1142, { x: 160, width: 680, fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 40, fill: INK }),
      T("গ্র্যান্ড অরাম বলরুম, গুলশান অ্যাভিনিউ, ঢাকা", 1198, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 22, fill: "#6b4a3c" }),
      T("Dress code: black tie  ·  পোশাক: ব্ল্যাক টাই", 1234, { x: 160, width: 680, fontFamily: "Cormorant Garamond", italic: true, fontSize: 24, fill: GOLD_D }),
    ],
    "Schedule",
  );

  // ---------------- photo ----------------
  const photo = P(
    blackBg,
    [
      ...blackGround(),
      lock(O(archSteps({ w: 600, h: 760, stroke: GOLDC, n: 5, gap: 12, sw: 2.4 }), { cx: W / 2, y: 130, width: 600 })),
      lock(S({ x: 200, y: 888, width: 600, height: 2, fill: GOLDC, opacity: 0.8 })),
      I({ x: 260, y: 196, width: 480, height: 690, mask: "arch", placeholderFill: "#2a211c", borderColor: GOLDC, borderWidth: 3 }),
      O(sparkle({ color: GOLDC, size: 60 }), { cx: 140, y: 330, width: 44 }),
      O(sparkle({ color: GOLDC, size: 60 }), { cx: 860, y: 430, width: 34 }),
      O(sparkle({ color: BLUSH, size: 60 }), { cx: 160, y: 640, width: 28 }),
      O(sparkle({ color: BLUSH, size: 60 }), { cx: 850, y: 700, width: 44 }),
      T("Thank you for", 940, { x: 120, width: 760, fontFamily: "Cormorant Garamond", italic: true, fontSize: 36, fill: CHAMP }),
      T("celebrating with us", 984, { x: 120, width: 760, fontFamily: "Great Vibes", fontSize: 82, fill: GOLD, lineHeight: 1.3, shadow }),
      T("আপনাদের উপস্থিতি ও দোয়া আমাদের আনন্দ পূর্ণ করবে", 1100, { x: 140, width: 720, fontFamily: "Hind Siliguri", fontSize: 25, fill: BLUSH, lineHeight: 1.6 }),
      O(divider({ style: "diamond", w: 320, color: GOLDC }), { cx: W / 2, y: 1180, width: 320 }),
      T("NADIA  &  ARIF", 1230, { x: 200, width: 600, fontFamily: "Cinzel", fontWeight: 500, fontSize: 28, fill: GOLD, letterSpacing: 8 }),
    ],
    "Photo",
  );

  return {
    slug: "bd-reception-champagne-gold",
    name: "Reception Champagne Gold",
    tagline: "Black-tie boubhat and wedding reception card with a gold chandelier",
    description:
      "A glamorous black-tie wedding reception invitation in champagne, blush and gold foil with a crystal chandelier and deco arches. English and Bangla wording for the boubhat or reception dinner of a Bangladeshi wedding.",
    categories: ["bengali", "ceremony", "luxury", "modern", "dark"],
    keywords: [
      "bangladeshi wedding reception invitation card",
      "বউভাত রিসেপশন কার্ড",
      "black tie reception invitation with gold chandelier",
      "champagne and blush gold foil reception invite",
      "boubhat card english and bangla",
    ],
    palette: [BLACK, BLACK2, CHAMP, BLUSH, GOLDC],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
