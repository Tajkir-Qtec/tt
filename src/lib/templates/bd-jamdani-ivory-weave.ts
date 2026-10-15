import { GUEST_TOKEN } from "../design/types";
import { bootiSolo, chamferPanel, diamondChain, JD, jamdaniField, kalkaPair, paar, weave } from "./bd-jamdani-ivory-weave.art";
import { H, I, linear, lock, O, P, S, T, W, type TemplateDef } from "./kit";

const { ivory: IVORY, ivoryD: IVORY_D, indigo: INDIGO, red: RED, gold: GOLDT, ink: INK } = JD;
const SOFT = "#6b5a52";

const bg = linear(100, [0, "#f1e6cb"], [0.5, "#f6eedb"], [1, "#eee2c4"]);

export default function bdJamdaniIvoryWeave(): TemplateDef {
  const cap = (text: string, y: number, o = {}) =>
    T(text, y, { x: 200, width: 600, fontFamily: "Jost", fontSize: 15, letterSpacing: 8, fontWeight: 500, fill: SOFT, uppercase: true, ...o });
  const field = (op = 1) => lock(O(jamdaniField({ w: W, h: H, cell: 112 }), { x: 0, y: 0, width: W, opacity: op }));
  const panel = () => [
    lock(O(chamferPanel({ w: 720, h: 1060, cut: 64 }), { x: 140, y: 170, width: 720 })),
    lock(O(weave({ w: 660, h: 1000, color: INDIGO }), { x: 170, y: 200, width: 660, opacity: 0.07 })),
  ];

  // ---------- cover ----------
  const cover = P(
    bg,
    [
      field(),
      ...panel(),
      lock(O(kalkaPair({ size: 150 }), { cx: W / 2, y: 240, width: 360 })),
      T("শুভ বিবাহ", 396, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 98, fill: RED, lineHeight: 1.3 }),
      T("সবান্ধবে আপনার উপস্থিতি কাম্য", 516, { x: 200, width: 600, fontFamily: "Hind Siliguri", fontSize: 23, fill: SOFT }),
      T(GUEST_TOKEN, 566, { x: 240, width: 520, fontFamily: "Cormorant Garamond", italic: true, fontWeight: 600, fontSize: 32, fill: GOLDT }),
      T("সাদিয়া", 606, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 92, fill: INDIGO, lineHeight: 1.3 }),
      T("ও", 724, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 46, fill: RED, lineHeight: 1.3 }),
      T("তাহমিদ", 764, { x: 200, width: 600, fontFamily: "Tiro Bangla", fontSize: 92, fill: INDIGO, lineHeight: 1.3 }),
      cap("Sadia  &  Tahmid", 894, { fontSize: 18, fill: INK }),
      O(diamondChain({ w: 340 }), { cx: W / 2, y: 940, width: 340 }),
      T("শনিবার, ১৮ ডিসেম্বর ২০২৭  ·  সন্ধ্যা ৭টা", 986, { x: 180, width: 640, fontFamily: "Hind Siliguri", fontSize: 26, fontWeight: 500, fill: INK }),
      T("মেঘনা বাড়ি কনভেনশন হল, উত্তরা, ঢাকা", 1034, { x: 180, width: 640, fontFamily: "Hind Siliguri", fontSize: 22, fill: SOFT }),
      lock(O(paar({ w: 520, h: 84 }), { cx: W / 2, y: 1096, width: 520 })),
    ],
    "Invitation",
  );

  // ---------- details ----------
  const events = [
    { bn: "গায়ে হলুদ", en: "Gaye Holud", d: "শুক্রবার, ১৭ ডিসেম্বর", t: "বিকেল ৪টা" },
    { bn: "আকদ", en: "Akd", d: "শনিবার, ১৮ ডিসেম্বর", t: "সকাল ১১টা" },
    { bn: "বিবাহ ভোজ", en: "Wedding Banquet", d: "শনিবার, ১৮ ডিসেম্বর", t: "সন্ধ্যা ৭টা" },
    { bn: "বউভাত", en: "Reception", d: "রবিবার, ১৯ ডিসেম্বর", t: "সন্ধ্যা ৭টা" },
  ];
  const evLayers: ReturnType<typeof T>[] = [];
  const evDeco: (ReturnType<typeof O> | ReturnType<typeof S>)[] = [];
  events.forEach((e, i) => {
    const y = 420 + i * 164;
    evDeco.push(O(bootiSolo({ size: 96, tone: i % 2 ? "indigo" : "red" }), { x: 120, y: y - 2, width: 96 }));
    evLayers.push(T(e.bn, y, { x: 244, width: 330, align: "left", fontFamily: "Tiro Bangla", fontSize: 46, fill: INDIGO, lineHeight: 1.25 }));
    evLayers.push(T(e.en, y + 68, { x: 246, width: 330, align: "left", fontFamily: "Jost", fontSize: 14, letterSpacing: 6, uppercase: true, fill: SOFT }));
    evLayers.push(T(e.d, y + 6, { x: 520, width: 350, align: "right", fontFamily: "Hind Siliguri", fontSize: 25, fontWeight: 500, fill: INK }));
    evLayers.push(T(e.t, y + 48, { x: 520, width: 350, align: "right", fontFamily: "Hind Siliguri", fontSize: 25, fill: RED }));
    if (i < events.length - 1) evDeco.push(lock(S({ x: 130, y: y + 118, width: 740, height: 1.2, fill: GOLDT, opacity: 0.75 })));
  });
  const details = P(
    bg,
    [
      lock(O(weave({ w: W, h: H, color: INDIGO }), { x: 0, y: 0, width: W, opacity: 0.05 })),
      lock(O(paar({ w: W, h: 104 }), { x: 0, y: 0, width: W })),
      lock(O(paar({ w: W, h: 104, tone: "indigo" }), { x: 0, y: 1296, width: W })),
      T("অনুষ্ঠানসূচি", 160, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 90, fill: RED, lineHeight: 1.3 }),
      cap("Celebration schedule", 280),
      O(diamondChain({ w: 380 }), { cx: W / 2, y: 330, width: 380 }),
      ...evDeco,
      ...evLayers,
      O(diamondChain({ w: 380 }), { cx: W / 2, y: 1082, width: 380 }),
      T("মেঘনা বাড়ি কনভেনশন হল", 1126, { x: 160, width: 680, fontFamily: "Tiro Bangla", fontSize: 40, fill: INDIGO, lineHeight: 1.3 }),
      T("প্লট ৭, সেক্টর ১১, উত্তরা, ঢাকা ১২৩০", 1186, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 22, fill: SOFT }),
      T("পোশাক  ·  Dress code: Traditional", 1228, { x: 160, width: 680, fontFamily: "Hind Siliguri", fontSize: 20, fill: RED }),
    ],
    "Schedule",
  );

  // ---------- photo ----------
  const photo = P(
    bg,
    [
      field(),
      ...panel(),
      lock(S({ x: 262, y: 240, width: 476, height: 576, shape: "rect", fill: null, stroke: GOLDT, strokeWidth: 1.6 })),
      lock(S({ x: 254, y: 232, width: 492, height: 592, shape: "rect", fill: null, stroke: RED, strokeWidth: 3 })),
      I({ x: 272, y: 250, width: 456, height: 556, mask: "rect", placeholderFill: "#d9c9a2", borderColor: null, borderWidth: 0 }),
      T("ভালোবাসার সুতোয় বোনা", 858, { x: 180, width: 640, fontFamily: "Tiro Bangla", fontSize: 54, fill: RED, lineHeight: 1.35 }),
      T("আপনাদের দোয়া ও উপস্থিতিতে আমাদের নতুন জীবনের পথচলা হোক আরও সুন্দর।", 940, { x: 210, width: 580, fontFamily: "Hind Siliguri", fontSize: 23, fill: SOFT, lineHeight: 1.6 }),
      O(diamondChain({ w: 340 }), { cx: W / 2, y: 1030, width: 340 }),
      T("Sadia & Tahmid", 1070, { x: 200, width: 600, fontFamily: "Playfair Display", fontSize: 40, fontWeight: 500, fill: INDIGO }),
      cap("১৮ · ১২ · ২০২৭", 1140, { fontFamily: "Hind Siliguri", fontSize: 18, letterSpacing: 6, fill: RED }),
    ],
    "Blessing",
  );

  void IVORY;
  void IVORY_D;
  return {
    slug: "bd-jamdani-ivory-weave",
    name: "Jamdani Ivory Weave",
    tagline: "Jamdani saree inspired Bangladeshi wedding card with woven booti and lattice borders",
    description:
      "An ivory Bangladeshi wedding invitation inspired by the Dhakai Jamdani saree, with woven diamond booti flowers, diagonal jaal lattice and paisley motifs in red, indigo and gold thread. A heritage-rich choice for a traditional Bangla biye.",
    categories: ["bengali", "cultural", "classic", "ceremony", "geometric"],
    keywords: [
      "jamdani wedding invitation card bangladesh",
      "dhakai jamdani inspired biyer card",
      "traditional bangla wedding card red indigo",
      "woven motif bengali wedding invitation",
      "ivory bangladeshi wedding card online",
    ],
    palette: [IVORY, RED, INDIGO, GOLDT, INK],
    width: W,
    height: H,
    pages: [cover, details, photo],
  };
}
