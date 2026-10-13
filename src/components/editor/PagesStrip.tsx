"use client";
import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { ChevronLeft, ChevronRight, Copy, Plus, Trash2 } from "lucide-react";
import { renderPage } from "@/lib/render";
import { IconBtn } from "@/components/ui/kit";
import { useEditor } from "./store";
import type { Page } from "@/lib/design/types";

/** Small cached thumbnails, re-rendered shortly after a page changes. */
function usePageThumbs() {
  const design = useEditor((s) => s.design)!;
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const cache = useRef(new Map<string, { page: Page; busy: boolean }>());
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const live = new Set(design.pages.map((p) => p.id));
    for (const p of design.pages) {
      const entry = cache.current.get(p.id);
      if (entry?.page === p) continue;
      cache.current.set(p.id, { page: p, busy: false });
      clearTimeout(timers.current.get(p.id));
      timers.current.set(
        p.id,
        setTimeout(
          async () => {
            try {
              const url = await renderPage(p, design.width, design.height, { pixelRatio: 160 / design.width, quality: 0.7 });
              if (cache.current.get(p.id)?.page === p) setThumbs((t) => ({ ...t, [p.id]: url }));
            } catch {}
          },
          entry ? 700 : 60,
        ),
      );
    }
    for (const id of [...cache.current.keys()]) if (!live.has(id)) cache.current.delete(id);
  }, [design]);

  return thumbs;
}

export function PagesStrip({ compact = false }: { compact?: boolean }) {
  const design = useEditor((s) => s.design)!;
  const active = useEditor((s) => s.activePageId);
  const setActive = useEditor((s) => s.setActivePage);
  const addPage = useEditor((s) => s.addPage);
  const duplicatePage = useEditor((s) => s.duplicatePage);
  const deletePage = useEditor((s) => s.deletePage);
  const movePage = useEditor((s) => s.movePage);
  const thumbs = usePageThumbs();
  const ratio = design.height / design.width;
  const w = compact ? 44 : 62;

  return (
    <div className="flex items-center gap-3 overflow-x-auto border-t border-line bg-white px-3 py-2">
      {design.pages.map((p, i) => (
        <div key={p.id} className="group relative shrink-0">
          <button
            onClick={() => setActive(p.id)}
            className={clsx(
              "block overflow-hidden rounded-md bg-paper-2 shadow-sm ring-2 transition",
              p.id === active ? "ring-brand" : "ring-transparent hover:ring-ink/20",
            )}
            style={{ width: w, height: w * ratio }}
            aria-label={`Page ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {thumbs[p.id] && <img src={thumbs[p.id]} alt="" className="size-full object-cover" draggable={false} />}
          </button>
          <span className="mt-0.5 block text-center text-[10px] text-ink/50">{i + 1}</span>
          {p.id === active && !compact && (
            <div className="absolute -top-2 left-1/2 flex -translate-x-1/2 items-center rounded-full border border-line bg-white shadow">
              <IconBtn label="Move left" className="size-6" disabled={i === 0} onClick={() => movePage(p.id, -1)}>
                <ChevronLeft className="size-3.5" />
              </IconBtn>
              <IconBtn label="Duplicate page" className="size-6" onClick={() => duplicatePage(p.id)}>
                <Copy className="size-3" />
              </IconBtn>
              <IconBtn label="Delete page" className="size-6" disabled={design.pages.length <= 1} onClick={() => deletePage(p.id)}>
                <Trash2 className="size-3" />
              </IconBtn>
              <IconBtn label="Move right" className="size-6" disabled={i === design.pages.length - 1} onClick={() => movePage(p.id, 1)}>
                <ChevronRight className="size-3.5" />
              </IconBtn>
            </div>
          )}
        </div>
      ))}
      <button
        onClick={addPage}
        disabled={design.pages.length >= 12}
        className="flex shrink-0 items-center justify-center rounded-md border-2 border-dashed border-line text-ink/40 transition hover:border-brand/50 hover:text-brand disabled:opacity-40"
        style={{ width: w, height: w * ratio }}
        aria-label="Add page"
        title="Add page"
      >
        <Plus className="size-5" />
      </button>
      {compact && active && design.pages.length > 1 && (
        <div className="ml-auto flex shrink-0">
          <IconBtn label="Duplicate page" onClick={() => duplicatePage(active)}>
            <Copy className="size-4" />
          </IconBtn>
          <IconBtn label="Delete page" onClick={() => deletePage(active)}>
            <Trash2 className="size-4" />
          </IconBtn>
        </div>
      )}
    </div>
  );
}
