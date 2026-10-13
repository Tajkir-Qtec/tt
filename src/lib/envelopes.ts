export type EnvelopeColorId = "ivory" | "blush" | "sage" | "navy" | "burgundy" | "emerald" | "charcoal" | "gold";

export interface EnvelopeStyle {
  label: string;
  body: string; // front pocket
  back: string; // inside back panel
  flap: string; // closed flap (outside)
  flapInner: string;
  liner: string; // inner lining pattern colour
  seal: string;
  sealText: string;
  text: string;
}

export const ENVELOPES: Record<EnvelopeColorId, EnvelopeStyle> = {
  ivory: { label: "Ivory", body: "#f4ecdc", back: "#e6d9bf", flap: "#efe4cc", flapInner: "#d9c9a6", liner: "#c9a45c", seal: "#9b2d4a", sealText: "#f8e7ea", text: "#5a4a35" },
  blush: { label: "Blush", body: "#f6dcdc", back: "#e8bcc0", flap: "#f1cfd1", flapInner: "#dba7ad", liner: "#c98089", seal: "#7a2e4d", sealText: "#fbe9ee", text: "#6b3a43" },
  sage: { label: "Sage", body: "#d9e2cf", back: "#b9c8a9", flap: "#cfdac3", flapInner: "#a7ba96", liner: "#7d9468", seal: "#3d5233", sealText: "#eef3e8", text: "#34452c" },
  navy: { label: "Navy", body: "#1e2a52", back: "#141d3d", flap: "#26346a", flapInner: "#0f1733", liner: "#d4af6a", seal: "#d4af6a", sealText: "#1a2142", text: "#e9d9ae" },
  burgundy: { label: "Burgundy", body: "#6f1d2e", back: "#4a1220", flap: "#7e2336", flapInner: "#3c0e19", liner: "#d4af6a", seal: "#d4af6a", sealText: "#4a1220", text: "#f2dfb4" },
  emerald: { label: "Emerald", body: "#0f4c3a", back: "#0a3528", flap: "#14604a", flapInner: "#082a20", liner: "#d4af6a", seal: "#d4af6a", sealText: "#0a3528", text: "#ecdcae" },
  charcoal: { label: "Charcoal", body: "#2b2b2f", back: "#1c1c1f", flap: "#34343a", flapInner: "#141416", liner: "#c9a45c", seal: "#c9a45c", sealText: "#1c1c1f", text: "#e8d9b0" },
  gold: { label: "Gold", body: "#d9bd7c", back: "#bf9f58", flap: "#e3c98f", flapInner: "#b08d45", liner: "#8a6a2f", seal: "#8b2f4f", sealText: "#fbeff3", text: "#5a4318" },
};

export const ENVELOPE_IDS = Object.keys(ENVELOPES) as EnvelopeColorId[];
