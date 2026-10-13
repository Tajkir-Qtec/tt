"use client";
import { create } from "zustand";
import type { CardDesign, CardMeta, Layer, Page, Paint, ViewMode } from "@/lib/design/types";

export type EnvelopeColor = "ivory" | "blush" | "sage" | "navy" | "burgundy" | "emerald" | "charcoal" | "gold";
export interface EnvelopeSettings {
  enabled: boolean;
  color: EnvelopeColor;
}
import { cloneLayer, makePage, replaceColor, uid } from "@/lib/design/layers";

export interface CardRecord {
  id: string;
  slug: string;
  title: string;
  design: CardDesign;
  viewMode: ViewMode;
  meta: CardMeta;
  rsvpEnabled: boolean;
  envelope: EnvelopeSettings;
  published: boolean;
  previewId: string | null;
  views: number;
}

const HISTORY_LIMIT = 100;

interface State {
  card: CardRecord | null;
  design: CardDesign | null;
  title: string;
  viewMode: ViewMode;
  meta: CardMeta;
  slug: string;
  rsvpEnabled: boolean;
  envelope: EnvelopeSettings;
  activePageId: string;
  selectedId: string | null;
  past: CardDesign[];
  future: CardDesign[];
  dirty: number; // increments on every change; the autosaver watches this
  lastKey: string | null;
  lastAt: number;

  load: (card: CardRecord) => void;
  select: (id: string | null) => void;
  setActivePage: (id: string) => void;
  setTitle: (t: string) => void;
  setViewMode: (m: ViewMode) => void;
  setMeta: (m: Partial<CardMeta>) => void;
  setSlug: (slug: string) => void;
  setRsvpEnabled: (v: boolean) => void;
  setEnvelope: (e: Partial<EnvelopeSettings>) => void;

  updateLayer: (id: string, patch: Partial<Layer>, coalesceKey?: string) => void;
  addLayer: (layer: Layer) => void;
  removeLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  moveLayer: (id: string, dir: "forward" | "backward" | "front" | "back") => void;
  reorderLayer: (id: string, toIndex: number) => void;

  setBackground: (bg: Paint, coalesceKey?: string) => void;
  setBgImage: (src: string | null) => void;
  recolor: (from: string, to: string, coalesceKey?: string) => void;

  addPage: () => void;
  duplicatePage: (id: string) => void;
  deletePage: (id: string) => void;
  movePage: (id: string, dir: -1 | 1) => void;
  renamePage: (id: string, name: string) => void;

  undo: () => void;
  redo: () => void;
}

export const useEditor = create<State>((set, get) => {
  /** Apply a design change and record history (coalescing rapid edits with the same key). */
  const commit = (next: CardDesign, key?: string) => {
    const s = get();
    if (!s.design) return;
    const now = Date.now();
    const coalesce = key && key === s.lastKey && now - s.lastAt < 900;
    set({
      design: next,
      past: coalesce ? s.past : [...s.past.slice(-(HISTORY_LIMIT - 1)), s.design],
      future: [],
      dirty: s.dirty + 1,
      lastKey: key ?? null,
      lastAt: now,
    });
  };

  const mapPage = (pageId: string, fn: (p: Page) => Page, key?: string) => {
    const d = get().design;
    if (!d) return;
    commit({ ...d, pages: d.pages.map((p) => (p.id === pageId ? fn(p) : p)) }, key);
  };

  return {
    card: null,
    design: null,
    title: "",
    viewMode: "flip",
    meta: { coupleNames: "", eventDate: "", venue: "", city: "", description: "" },
    slug: "",
    rsvpEnabled: true,
    envelope: { enabled: true, color: "ivory" },
    activePageId: "",
    selectedId: null,
    past: [],
    future: [],
    dirty: 0,
    lastKey: null,
    lastAt: 0,

    load: (card) =>
      set({
        card,
        design: card.design,
        title: card.title,
        viewMode: card.viewMode,
        meta: card.meta,
        slug: card.slug,
        rsvpEnabled: card.rsvpEnabled ?? true,
        envelope: card.envelope ?? { enabled: true, color: "ivory" },
        activePageId: card.design.pages[0]?.id ?? "",
        selectedId: null,
        past: [],
        future: [],
        dirty: 0,
        lastKey: null,
      }),

    select: (id) => set({ selectedId: id }),
    setActivePage: (id) => set({ activePageId: id, selectedId: null }),
    setTitle: (title) => set((s) => ({ title, dirty: s.dirty + 1 })),
    setViewMode: (viewMode) => set((s) => ({ viewMode, dirty: s.dirty + 1 })),
    setMeta: (m) => set((s) => ({ meta: { ...s.meta, ...m }, dirty: s.dirty + 1 })),
    setSlug: (slug) => set({ slug }),
    setRsvpEnabled: (rsvpEnabled) => set((s) => ({ rsvpEnabled, dirty: s.dirty + 1 })),
    setEnvelope: (e) => set((s) => ({ envelope: { ...s.envelope, ...e }, dirty: s.dirty + 1 })),

    updateLayer: (id, patch, key) => {
      const { activePageId } = get();
      mapPage(
        activePageId,
        (p) => ({ ...p, layers: p.layers.map((l) => (l.id === id ? ({ ...l, ...patch } as Layer) : l)) }),
        key ?? (Object.keys(patch).length === 1 ? `u:${id}:${Object.keys(patch)[0]}` : undefined),
      );
    },

    addLayer: (layer) => {
      const { activePageId } = get();
      mapPage(activePageId, (p) => ({ ...p, layers: [...p.layers, layer] }));
      set({ selectedId: layer.id });
    },

    removeLayer: (id) => {
      const { activePageId } = get();
      mapPage(activePageId, (p) => ({ ...p, layers: p.layers.filter((l) => l.id !== id) }));
      set((s) => ({ selectedId: s.selectedId === id ? null : s.selectedId }));
    },

    duplicateLayer: (id) => {
      const { activePageId, design } = get();
      const page = design?.pages.find((p) => p.id === activePageId);
      const src = page?.layers.find((l) => l.id === id);
      if (!src) return;
      const copy = { ...cloneLayer(src), x: src.x + 30, y: src.y + 30, locked: false };
      mapPage(activePageId, (p) => ({ ...p, layers: [...p.layers, copy] }));
      set({ selectedId: copy.id });
    },

    moveLayer: (id, dir) => {
      const { activePageId } = get();
      mapPage(activePageId, (p) => {
        const i = p.layers.findIndex((l) => l.id === id);
        if (i < 0) return p;
        const layers = [...p.layers];
        const [l] = layers.splice(i, 1);
        const to = dir === "front" ? layers.length : dir === "back" ? 0 : dir === "forward" ? Math.min(layers.length, i + 1) : Math.max(0, i - 1);
        layers.splice(to, 0, l);
        return { ...p, layers };
      });
    },

    reorderLayer: (id, toIndex) => {
      const { activePageId } = get();
      mapPage(activePageId, (p) => {
        const i = p.layers.findIndex((l) => l.id === id);
        if (i < 0) return p;
        const layers = [...p.layers];
        const [l] = layers.splice(i, 1);
        layers.splice(Math.max(0, Math.min(layers.length, toIndex)), 0, l);
        return { ...p, layers };
      });
    },

    setBackground: (background, key) => {
      const { activePageId } = get();
      mapPage(activePageId, (p) => ({ ...p, background }), key ?? "bg");
    },

    setBgImage: (src) => {
      const { activePageId } = get();
      mapPage(activePageId, (p) => ({ ...p, bgImage: src }));
    },

    recolor: (from, to, key) => {
      const d = get().design;
      if (!d) return;
      commit({ ...d, pages: replaceColor(d.pages, from, to) }, key ?? `recolor:${from}`);
    },

    addPage: () => {
      const d = get().design;
      if (!d || d.pages.length >= 12) return;
      const active = d.pages.find((p) => p.id === get().activePageId) ?? d.pages[0];
      const page = makePage({ background: active.background, name: `Page ${d.pages.length + 1}` });
      commit({ ...d, pages: [...d.pages, page] });
      set({ activePageId: page.id, selectedId: null });
    },

    duplicatePage: (id) => {
      const d = get().design;
      if (!d || d.pages.length >= 12) return;
      const i = d.pages.findIndex((p) => p.id === id);
      if (i < 0) return;
      const src = d.pages[i];
      const copy: Page = { ...structuredClone(src), id: uid(), name: `${src.name ?? "Page"} copy`, layers: src.layers.map((l) => cloneLayer(l)) };
      const pages = [...d.pages];
      pages.splice(i + 1, 0, copy);
      commit({ ...d, pages });
      set({ activePageId: copy.id, selectedId: null });
    },

    deletePage: (id) => {
      const d = get().design;
      if (!d || d.pages.length <= 1) return;
      const pages = d.pages.filter((p) => p.id !== id);
      commit({ ...d, pages });
      if (get().activePageId === id) set({ activePageId: pages[0].id, selectedId: null });
    },

    movePage: (id, dir) => {
      const d = get().design;
      if (!d) return;
      const i = d.pages.findIndex((p) => p.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= d.pages.length) return;
      const pages = [...d.pages];
      [pages[i], pages[j]] = [pages[j], pages[i]];
      commit({ ...d, pages });
    },

    renamePage: (id, name) => mapPage(id, (p) => ({ ...p, name }), `rename:${id}`),

    undo: () => {
      const s = get();
      if (!s.past.length || !s.design) return;
      const prev = s.past[s.past.length - 1];
      const stillActive = prev.pages.some((p) => p.id === s.activePageId);
      set({
        design: prev,
        past: s.past.slice(0, -1),
        future: [s.design, ...s.future].slice(0, HISTORY_LIMIT),
        dirty: s.dirty + 1,
        lastKey: null,
        activePageId: stillActive ? s.activePageId : prev.pages[0].id,
        selectedId: null,
      });
    },

    redo: () => {
      const s = get();
      if (!s.future.length || !s.design) return;
      const next = s.future[0];
      const stillActive = next.pages.some((p) => p.id === s.activePageId);
      set({
        design: next,
        past: [...s.past, s.design],
        future: s.future.slice(1),
        dirty: s.dirty + 1,
        lastKey: null,
        activePageId: stillActive ? s.activePageId : next.pages[0].id,
        selectedId: null,
      });
    },
  };
});
