import { getTemplates } from "@/lib/templates";

export const CATEGORY_INFO: Record<string, { label: string; h1: string; intro: string; keywords: string[] }> = {
  floral: {
    label: "Floral",
    h1: "Floral Wedding Invitation Templates",
    intro: "Romantic peonies, olive branches and botanical frames — soft, elegant wedding invitations you can edit and share in minutes.",
    keywords: ["floral wedding invitation", "botanical wedding card", "peony invitation template"],
  },
  minimal: {
    label: "Minimal",
    h1: "Minimalist Wedding Invitation Templates",
    intro: "Clean lines, generous white space and refined typography for couples who love understated elegance.",
    keywords: ["minimalist wedding invitation", "simple wedding card", "modern minimal invitation"],
  },
  modern: {
    label: "Modern",
    h1: "Modern Wedding Invitation Templates",
    intro: "Fresh, contemporary layouts with bold type and on-trend color — designed to look great on a phone screen.",
    keywords: ["modern wedding invitation", "contemporary e-invite", "digital wedding card"],
  },
  luxury: {
    label: "Luxury",
    h1: "Luxury Wedding Invitation Templates",
    intro: "Gold foil, deep jewel tones and Art Deco detail for a grand, black-tie celebration.",
    keywords: ["luxury wedding invitation", "gold foil wedding card", "art deco invitation"],
  },
  islamic: {
    label: "Nikah & Islamic",
    h1: "Nikah & Islamic Wedding Invitation Templates",
    intro: "Emerald and gold nikah and walima invitations with geometric patterns, crescent motifs and Arabic or Urdu calligraphy fonts.",
    keywords: ["nikah invitation card", "islamic wedding invitation", "walima card template", "muslim wedding card"],
  },
  indian: {
    label: "Indian & South Asian",
    h1: "Indian Wedding Invitation Templates (Shaadi Cards)",
    intro: "Rich maroon and gold shaadi cards with mandala and paisley detail, with Hindi, Bangla, Punjabi and Tamil fonts built in.",
    keywords: ["indian wedding invitation", "shaadi card template", "hindu wedding card", "south asian wedding invitation"],
  },
  boho: {
    label: "Boho",
    h1: "Boho Wedding Invitation Templates",
    intro: "Sun-warmed terracotta, arches and rainbows for relaxed, free-spirited weddings.",
    keywords: ["boho wedding invitation", "terracotta wedding card", "rustic invitation template"],
  },
  vintage: {
    label: "Vintage",
    h1: "Vintage Wedding Invitation Templates",
    intro: "Antique parchment, ornate borders and old-world flourishes with a timeless, romantic feel.",
    keywords: ["vintage wedding invitation", "victorian wedding card", "antique invitation template"],
  },
  classic: {
    label: "Classic",
    h1: "Classic Wedding Invitation Templates",
    intro: "Timeless layouts, laurel wreaths and traditional serif lettering — always in good taste.",
    keywords: ["classic wedding invitation", "traditional wedding card", "formal invitation template"],
  },
  celestial: {
    label: "Celestial",
    h1: "Celestial Wedding Invitation Templates",
    intro: "Starry skies, silver constellations and crescent moons for a dreamy evening celebration.",
    keywords: ["celestial wedding invitation", "starry night invitation", "moon wedding card"],
  },
  geometric: {
    label: "Geometric",
    h1: "Geometric Wedding Invitation Templates",
    intro: "Fine linework, hexagons and metallic accents for sleek, contemporary invitations.",
    keywords: ["geometric wedding invitation", "rose gold wedding card", "modern geometric invitation"],
  },
  dark: {
    label: "Dark & Moody",
    h1: "Dark & Moody Wedding Invitation Templates",
    intro: "Deep backgrounds with glowing metallic type — dramatic invitations for evening weddings.",
    keywords: ["dark wedding invitation", "black and gold invitation", "navy wedding card"],
  },
  nature: {
    label: "Nature & Garden",
    h1: "Garden & Nature Wedding Invitation Templates",
    intro: "Lavender fields, palms and wildflowers for outdoor, garden and countryside weddings.",
    keywords: ["garden wedding invitation", "nature wedding card", "outdoor wedding invitation template"],
  },
  beach: {
    label: "Beach & Destination",
    h1: "Beach & Destination Wedding Invitation Templates",
    intro: "Sea-glass blues, tropical leaves and sunny palettes for beach and destination weddings.",
    keywords: ["beach wedding invitation", "destination wedding card", "tropical wedding invitation template"],
  },
  seasonal: {
    label: "Seasonal",
    h1: "Seasonal Wedding Invitation Templates",
    intro: "Autumn rust, winter frost and spring blossom invitations that match your wedding season.",
    keywords: ["autumn wedding invitation", "winter wedding invitation", "spring wedding card"],
  },
  cultural: {
    label: "Cultural",
    h1: "Cultural Wedding Invitation Templates",
    intro: "Invitations rooted in tradition — Bengali, Arab, Persian, Japanese and more.",
    keywords: ["cultural wedding invitation", "traditional wedding card", "ethnic wedding invitation template"],
  },
};

export function allCategories(): { slug: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const t of getTemplates()) for (const c of t.categories) counts.set(c, (counts.get(c) ?? 0) + 1);
  return [...counts.entries()].map(([slug, count]) => ({ slug, count })).sort((a, b) => b.count - a.count);
}

export function categoryLabel(slug: string) {
  return CATEGORY_INFO[slug]?.label ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}
