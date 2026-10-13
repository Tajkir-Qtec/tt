/**
 * Font registry. Fonts load from Google Fonts on demand (only the families a
 * page actually uses), because canvas text needs the font to be loaded before
 * it is measured/drawn.
 */

export type FontCategory = "serif" | "script" | "sans" | "display" | "arabic" | "indic";

export interface FontDef {
  family: string;
  category: FontCategory;
  /** Weights that exist on Google Fonts for this family. */
  weights: number[];
  italic: boolean;
  /** Sample text for the picker when the font isn't Latin. */
  sample?: string;
}

const f = (
  family: string,
  category: FontCategory,
  weights: number[],
  italic = false,
  sample?: string,
): FontDef => ({ family, category, weights, italic, sample });

export const FONTS: FontDef[] = [
  // Serif
  f("Cormorant Garamond", "serif", [300, 400, 500, 600, 700], true),
  f("Playfair Display", "serif", [400, 500, 600, 700, 800], true),
  f("Cinzel", "serif", [400, 500, 600, 700]),
  f("Bodoni Moda", "serif", [400, 500, 600, 700], true),
  f("DM Serif Display", "serif", [400], true),
  f("Libre Baskerville", "serif", [400, 700], true),
  f("Lora", "serif", [400, 500, 600, 700], true),
  f("EB Garamond", "serif", [400, 500, 600, 700], true),
  f("Marcellus", "serif", [400]),
  f("Italiana", "serif", [400]),
  f("Old Standard TT", "serif", [400, 700], true),
  f("Fraunces", "serif", [300, 400, 500, 600, 700], true),
  f("Cormorant Infant", "serif", [300, 400, 500, 600, 700], true),
  // Script / handwriting
  f("Great Vibes", "script", [400]),
  f("Pinyon Script", "script", [400]),
  f("Allura", "script", [400]),
  f("Parisienne", "script", [400]),
  f("Alex Brush", "script", [400]),
  f("Italianno", "script", [400]),
  f("Tangerine", "script", [400, 700]),
  f("Sacramento", "script", [400]),
  f("Dancing Script", "script", [400, 500, 600, 700]),
  f("Mrs Saint Delafield", "script", [400]),
  f("Monsieur La Doulaise", "script", [400]),
  f("Herr Von Muellerhoff", "script", [400]),
  f("Petit Formal Script", "script", [400]),
  f("Satisfy", "script", [400]),
  // Sans
  f("Montserrat", "sans", [300, 400, 500, 600, 700], true),
  f("Jost", "sans", [300, 400, 500, 600, 700], true),
  f("Josefin Sans", "sans", [300, 400, 600, 700], true),
  f("Poppins", "sans", [300, 400, 500, 600, 700], true),
  f("DM Sans", "sans", [300, 400, 500, 700], true),
  f("Raleway", "sans", [300, 400, 500, 600, 700], true),
  f("Lato", "sans", [300, 400, 700], true),
  f("Tenor Sans", "sans", [400]),
  f("Questrial", "sans", [400]),
  f("Outfit", "sans", [300, 400, 500, 600, 700]),
  f("Manrope", "sans", [300, 400, 500, 600, 700]),
  // Display
  f("Cinzel Decorative", "display", [400, 700, 900]),
  f("Bebas Neue", "display", [400]),
  f("Syncopate", "display", [400, 700]),
  f("Abril Fatface", "display", [400]),
  f("Yeseva One", "display", [400]),
  f("Limelight", "display", [400]),
  f("Gloock", "display", [400]),
  // Arabic / Urdu
  f("Amiri", "arabic", [400, 700], true, "بسم الله الرحمن الرحيم"),
  f("Aref Ruqaa", "arabic", [400, 700], false, "بسم الله الرحمن الرحيم"),
  f("Reem Kufi", "arabic", [400, 500, 600, 700], false, "بسم الله الرحمن الرحيم"),
  f("Noto Naskh Arabic", "arabic", [400, 500, 600, 700], false, "بسم الله الرحمن الرحيم"),
  f("Scheherazade New", "arabic", [400, 500, 600, 700], false, "بسم الله الرحمن الرحيم"),
  f("Noto Nastaliq Urdu", "arabic", [400, 500, 600, 700], false, "دعوتِ ولیمہ"),
  f("Lateef", "arabic", [400, 500, 600, 700], false, "دعوتِ ولیمہ"),
  // Indic
  f("Tiro Devanagari Hindi", "indic", [400], true, "शुभ विवाह"),
  f("Hind", "indic", [300, 400, 500, 600, 700], false, "शुभ विवाह"),
  f("Yatra One", "indic", [400], false, "शुभ विवाह"),
  f("Tiro Bangla", "indic", [400], true, "শুভ বিবাহ"),
  f("Hind Siliguri", "indic", [300, 400, 500, 600, 700], false, "শুভ বিবাহ"),
  f("Tiro Gurmukhi", "indic", [400], true, "ਸ਼ੁਭ ਵਿਆਹ"),
  f("Tiro Tamil", "indic", [400], true, "திருமண அழைப்பிதழ்"),
];

export const FONT_MAP = new Map(FONTS.map((x) => [x.family, x]));

export const CATEGORY_LABELS: Record<FontCategory, string> = {
  serif: "Serif",
  script: "Script",
  sans: "Sans",
  display: "Display",
  arabic: "Arabic / Urdu",
  indic: "Hindi / Bangla / more",
};

export const WEIGHT_LABELS: Record<number, string> = {
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "Semibold",
  700: "Bold",
  800: "Extra bold",
  900: "Black",
};

/** Closest weight available for a font. */
export function nearestWeight(family: string, weight: number): number {
  const def = FONT_MAP.get(family);
  if (!def) return weight;
  return def.weights.reduce((a, b) => (Math.abs(b - weight) < Math.abs(a - weight) ? b : a));
}

export function googleFontsHref(families: string[]): string {
  const parts = families.map((family) => {
    const def = FONT_MAP.get(family);
    const name = encodeURIComponent(family).replace(/%20/g, "+");
    if (!def) return `family=${name}`;
    const w = def.weights;
    if (def.italic) {
      const combos = [...w.map((x) => `0,${x}`), ...w.map((x) => `1,${x}`)];
      return `family=${name}:ital,wght@${combos.join(";")}`;
    }
    return `family=${name}:wght@${w.join(";")}`;
  });
  return `https://fonts.googleapis.com/css2?${parts.join("&")}&display=swap`;
}

const sheets = new Map<string, Promise<void>>();
const inflight = new Map<string, Promise<void>>();

function loadSheet(family: string): Promise<void> {
  let p = sheets.get(family);
  if (!p) {
    p = new Promise<void>((resolve) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = googleFontsHref([family]);
      link.onload = () => resolve();
      link.onerror = () => resolve();
      document.head.appendChild(link);
    });
    sheets.set(family, p);
  }
  return p;
}

/** Loads fonts and resolves once the browser can draw them on canvas. */
export function ensureFonts(
  specs: { family: string; weight?: number; italic?: boolean }[],
): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  const loads = specs.map((s) => {
    const key = `${s.italic ? "italic " : ""}${s.weight ?? 400} ${s.family}`;
    let p = inflight.get(key);
    if (!p) {
      const sample = FONT_MAP.get(s.family)?.sample ?? "Aa";
      p = loadSheet(s.family)
        .then(() => document.fonts.load(`${s.italic ? "italic " : ""}${s.weight ?? 400} 32px "${s.family}"`, sample))
        .then(() => undefined)
        .catch(() => undefined);
      inflight.set(key, p);
    }
    return p;
  });
  const timeout = new Promise<void>((r) => setTimeout(r, 8000));
  return Promise.race([Promise.all(loads).then(() => undefined), timeout]);
}

export function konvaFontStyle(weight: number, italic: boolean): string {
  return `${italic ? "italic " : ""}${weight}`;
}
