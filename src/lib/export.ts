"use client";
import { renderPage, renderPages } from "@/lib/render";
import type { CardDesign, Page } from "@/lib/design/types";

/** 1000 design px = 5 inches, so a portrait card prints as a 5×7. */
const PT_PER_PX = 0.36;

export async function downloadCardPdf(design: CardDesign, pages: Page[], filename: string) {
  const { jsPDF } = await import("jspdf");
  const images = await renderPages(pages, design.width, design.height, { pixelRatio: 2, mimeType: "image/jpeg", quality: 0.92 });
  const w = design.width * PT_PER_PX;
  const h = design.height * PT_PER_PX;
  const pdf = new jsPDF({ unit: "pt", format: [w, h], orientation: w > h ? "landscape" : "portrait", compress: true });
  images.forEach((img, i) => {
    if (i > 0) pdf.addPage([w, h], w > h ? "landscape" : "portrait");
    pdf.addImage(img, "JPEG", 0, 0, w, h);
  });
  pdf.save(`${filename.replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-") || "invitation"}.pdf`);
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

/** A 1200×630 link-preview JPEG: the cover centred on a tint taken from its own colours. */
export async function makeLinkPreview(design: CardDesign, cover: Page): Promise<Blob> {
  const ph = 560;
  const ratio = ph / design.height;
  const url = await renderPage(cover, design.width, design.height, { pixelRatio: ratio, mimeType: "image/jpeg", quality: 0.9 });
  const img = await loadImg(url);
  const c = document.createElement("canvas");
  c.width = 1200;
  c.height = 630;
  const ctx = c.getContext("2d")!;
  // average colour of the card as the backdrop
  const px = document.createElement("canvas");
  px.width = px.height = 1;
  px.getContext("2d")!.drawImage(img, 0, 0, 1, 1);
  const [r, g, b] = px.getContext("2d")!.getImageData(0, 0, 1, 1).data;
  ctx.fillStyle = `rgb(${Math.round(r * 0.8)},${Math.round(g * 0.8)},${Math.round(b * 0.8)})`;
  ctx.fillRect(0, 0, 1200, 630);
  ctx.shadowColor = "rgba(0,0,0,.35)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;
  const dw = img.width * (ph / img.height);
  ctx.drawImage(img, (1200 - dw) / 2, (630 - ph) / 2, dw, ph);
  return new Promise((res, rej) => c.toBlob((bl) => (bl ? res(bl) : rej(new Error("preview failed"))), "image/jpeg", 0.85));
}
