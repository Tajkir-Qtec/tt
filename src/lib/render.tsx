"use client";
import { createRef } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import type Konva from "konva";
import { PageStage } from "@/components/canvas/PageStage";
import { loadImage } from "@/components/canvas/useImage";
import { ensureFonts } from "@/lib/design/fonts";
import { collectFonts, collectImages } from "@/lib/design/layers";
import type { Page } from "@/lib/design/types";

/** Load every font and image the pages need so a synchronous render is complete. */
export async function prepareAssets(pages: Page[]) {
  await Promise.all([ensureFonts(collectFonts(pages)), ...collectImages(pages).map(loadImage)]);
}

export interface RenderOptions {
  pixelRatio?: number;
  mimeType?: "image/jpeg" | "image/png";
  quality?: number;
}

/** Render one page to a data URL using the same Konva tree as the editor. */
export async function renderPage(
  page: Page,
  width: number,
  height: number,
  { pixelRatio = 1, mimeType = "image/jpeg", quality = 0.92 }: RenderOptions = {},
): Promise<string> {
  await prepareAssets([page]);
  const host = document.createElement("div");
  host.style.cssText = "position:fixed;left:-100000px;top:0;pointer-events:none;";
  document.body.appendChild(host);
  const root = createRoot(host);
  const ref = createRef<Konva.Stage>();
  try {
    flushSync(() => root.render(<PageStage ref={ref} width={width} height={height} page={page} scale={1} />));
    const stage = ref.current;
    if (!stage) throw new Error("Stage did not mount");
    stage.draw();
    return stage.toDataURL({ pixelRatio, mimeType, quality });
  } finally {
    root.unmount();
    host.remove();
  }
}

export async function renderPages(pages: Page[], width: number, height: number, opts?: RenderOptions): Promise<string[]> {
  await prepareAssets(pages);
  const out: string[] = [];
  for (const p of pages) out.push(await renderPage(p, width, height, opts));
  return out;
}
