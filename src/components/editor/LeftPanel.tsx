"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Image as ImageIcon,
  ImagePlus,
  Layers as LayersIcon,
  Lock,
  Palette,
  PaintBucket,
  Settings2,
  Shapes,
  Trash2,
  Type,
  Unlock,
  Upload,
} from "lucide-react";
import { useEditor } from "./store";
import { Btn, IconBtn, Label, Section, Segmented, Spinner, Toggle } from "@/components/ui/kit";
import { PaintPicker } from "./PaintPicker";
import { LIBRARY, LIB_GROUPS, TEXT_PRESETS, buildLibLayer, type LibCtx, type LibItem } from "./library";
import { collectColors, makeImage } from "@/lib/design/layers";
import { ensureFonts } from "@/lib/design/fonts";
import { api, uploadImage } from "@/lib/client/api";
import { ENVELOPES, ENVELOPE_IDS } from "@/lib/envelopes";
import { qrOrnament } from "@/lib/qr";
import { makeOrnament } from "@/lib/design/layers";
import type { Layer, ViewMode } from "@/lib/design/types";

export type ToolTab = "text" | "elements" | "photos" | "background" | "colors" | "layers" | "settings";

export const TABS: { id: ToolTab; label: string; icon: typeof Type }[] = [
  { id: "text", label: "Text", icon: Type },
  { id: "elements", label: "Elements", icon: Shapes },
  { id: "photos", label: "Photos", icon: ImageIcon },
  { id: "background", label: "Background", icon: PaintBucket },
  { id: "colors", label: "Colors", icon: Palette },
  { id: "layers", label: "Layers", icon: LayersIcon },
  { id: "settings", label: "Details", icon: Settings2 },
];

function luminance(hex: string) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return 0.5;
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** A colour from the current design suitable for new decorative elements. */
function useLibCtx(): LibCtx | null {
  const design = useEditor((s) => s.design);
  const pageId = useEditor((s) => s.activePageId);
  return useMemo(() => {
    if (!design) return null;
    const hexes = collectColors(design.pages).filter((c) => /^#[0-9a-f]{6}$/i.test(c));
    const mid = hexes.filter((c) => luminance(c) > 0.08 && luminance(c) < 0.85);
    return { color: mid[0] ?? "#b08d57", accent: mid[1] ?? "#8a6a2f", W: design.width, H: design.height };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [design?.width, design?.height, pageId]);
}

export function OrnamentThumb({ item, ctx }: { item: LibItem; ctx: LibCtx }) {
  if (item.shape) {
    return (
      <svg viewBox="0 0 100 100" className="size-full">
        {item.shape === "line" ? (
          <rect x="8" y="48" width="84" height="4" fill={ctx.color} />
        ) : item.shape === "circle" ? (
          <circle cx="50" cy="50" r="30" fill={ctx.color} />
        ) : (
          <rect x="20" y="20" width="60" height="60" rx={item.shape === "rounded" ? 12 : 0} fill={ctx.color} />
        )}
      </svg>
    );
  }
  const data = item.data!({ ...ctx, W: 1000, H: 1400 });
  return (
    <svg viewBox={`0 0 ${data.vbW} ${data.vbH}`} className="size-full" preserveAspectRatio="xMidYMid meet">
      {data.parts.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill={typeof p.fill === "string" ? p.fill : p.fill ? "#c9a45c" : "none"}
          stroke={p.stroke ?? "none"}
          strokeWidth={p.strokeWidth}
          opacity={p.opacity}
          strokeLinecap={p.lineCap}
          strokeLinejoin={p.lineJoin}
        />
      ))}
    </svg>
  );
}

/* --------------------------------- tabs --------------------------------- */

function TextTab() {
  const design = useEditor((s) => s.design)!;
  const addLayer = useEditor((s) => s.addLayer);
  const lib = useLibCtx();
  return (
    <div className="p-4">
      <Label>Click to add</Label>
      <div className="grid gap-2">
        {TEXT_PRESETS.map((p) => {
          const layer = p.make({ W: design.width, H: design.height, color: "#1c1917" });
          return (
            <button
              key={p.id}
              onClick={async () => {
                const l = p.make({ W: design.width, H: design.height, color: lib && luminance(lib.color) < 0.3 ? lib.color : "#2b2622" });
                await ensureFonts([{ family: l.fontFamily, weight: l.fontWeight, italic: l.italic }]);
                addLayer(l);
              }}
              className="group rounded-xl border border-line bg-white px-4 py-3 text-left transition hover:border-brand/50 hover:shadow-sm"
            >
              <div className="text-[11px] font-medium uppercase tracking-wider text-ink/40">{p.label}</div>
              <div
                className="mt-0.5 truncate text-ink"
                style={{
                  fontFamily: `"${layer.fontFamily}"`,
                  fontStyle: layer.italic ? "italic" : "normal",
                  fontWeight: layer.fontWeight,
                  fontSize: Math.min(34, Math.max(18, layer.fontSize * 0.34)),
                  letterSpacing: layer.letterSpacing * 0.3,
                  textTransform: layer.uppercase ? "uppercase" : undefined,
                }}
              >
                {p.sample}
              </div>
            </button>
          );
        })}
      </div>
      <p className="mt-4 rounded-xl bg-paper-2 p-3 text-xs leading-relaxed text-ink/60">
        <b>Guest name:</b> a text containing <code className="rounded bg-white px-1">{"{to}"}</code> shows each guest’s name when you share a link with their name. Without a
        name in the link it stays hidden.
      </p>
    </div>
  );
}

function QrBlock() {
  const addLayer = useEditor((s) => s.addLayer);
  const slug = useEditor((s) => s.slug);
  const design = useEditor((s) => s.design)!;
  const url = typeof window === "undefined" ? "" : `${window.location.origin}/c/${slug}`;
  return (
    <div className="mb-5 rounded-xl border border-line bg-white p-3">
      <Label>QR code</Label>
      <p className="mb-2 text-xs leading-relaxed text-ink/55">Adds a scannable code for your card link (great for printed cards). If you change the link name later, add it again.</p>
      <Btn
        size="sm"
        className="w-full"
        onClick={() => {
          const data = qrOrnament(url, { color: "#1c1917" });
          const w = design.width * 0.22;
          const l = makeOrnament(data, { width: w, name: "QR code" });
          l.x = (design.width - w) / 2;
          l.y = design.height - w - design.width * 0.08;
          addLayer(l);
        }}
      >
        Add QR code to this page
      </Btn>
    </div>
  );
}

function ElementsTab() {
  const addLayer = useEditor((s) => s.addLayer);
  const ctx = useLibCtx();
  const [group, setGroup] = useState<LibItem["group"] | "All">("All");
  if (!ctx) return null;
  const groups = group === "All" ? LIB_GROUPS : [group];
  return (
    <div className="p-4">
      <div className="-mx-1 mb-3 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {(["All", ...LIB_GROUPS] as const).map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={clsx(
              "shrink-0 rounded-full border px-3 py-1 text-[13px]",
              g === group ? "border-brand bg-brand text-white" : "border-line bg-white text-ink/70 hover:bg-paper-2",
            )}
          >
            {g}
          </button>
        ))}
      </div>
      <QrBlock />
      {groups.map((g) => (
        <div key={g} className="mb-5">
          <Label>{g}</Label>
          <div className="grid grid-cols-3 gap-2">
            {LIBRARY.filter((i) => i.group === g).map((item) => (
              <button
                key={item.id}
                onClick={() => addLayer(buildLibLayer(item, ctx))}
                className="group flex aspect-square flex-col items-center justify-center rounded-xl border border-line bg-white p-2 transition hover:border-brand/50 hover:shadow-sm"
                title={item.label}
              >
                <div className="size-full min-h-0 flex-1 p-1">
                  <OrnamentThumb item={item} ctx={ctx} />
                </div>
                <span className="mt-1 w-full truncate text-center text-[10.5px] text-ink/55">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PhotosTab() {
  const design = useEditor((s) => s.design)!;
  const selectedId = useEditor((s) => s.selectedId);
  const pageId = useEditor((s) => s.activePageId);
  const addLayer = useEditor((s) => s.addLayer);
  const updateLayer = useEditor((s) => s.updateLayer);
  const [items, setItems] = useState<{ id: string; url: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const selected = design.pages.find((p) => p.id === pageId)?.layers.find((l) => l.id === selectedId);

  useEffect(() => {
    api<{ items: { id: string; url: string }[] }>("/api/media")
      .then((r) => setItems(r.items))
      .catch(() => {});
  }, []);

  const place = async (url: string) => {
    if (selected?.type === "image") {
      updateLayer(selected.id, { src: url } as Partial<Layer>);
      return;
    }
    const img = new window.Image();
    await new Promise<void>((res) => {
      img.onload = () => res();
      img.onerror = () => res();
      img.src = url;
    });
    const w = design.width * 0.6;
    const ratio = img.naturalWidth ? img.naturalHeight / img.naturalWidth : 1;
    const h = Math.min(design.height * 0.6, w * ratio);
    addLayer(makeImage({ src: url, x: (design.width - w) / 2, y: (design.height - h) / 2, width: w, height: h, name: "Photo" }));
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const url = await uploadImage(file);
      setItems((p) => [{ id: url, url }, ...p]);
      await place(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  const frame = (mask: "arch" | "ellipse" | "rounded" | "rect") => {
    const w = design.width * 0.5;
    const h = mask === "arch" ? w * 1.4 : mask === "ellipse" ? w : w * 1.15;
    addLayer(
      makeImage({
        mask,
        cornerRadius: mask === "rounded" ? 40 : 0,
        x: (design.width - w) / 2,
        y: (design.height - h) / 2,
        width: w,
        height: h,
        name: "Photo frame",
      }),
    );
  };

  return (
    <div className="p-4">
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => onFile(e.target.files?.[0])} />
      <Btn variant="primary" className="w-full" onClick={() => input.current?.click()} disabled={busy}>
        {busy ? <Spinner /> : <Upload className="size-4" />} Upload a photo
      </Btn>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-ink/50">
        {selected?.type === "image" ? "Pick a photo below to put it in the selected frame." : "Photos you upload are added to your card."}
      </p>

      <Label className="mt-5">Photo frames</Label>
      <div className="grid grid-cols-4 gap-2">
        {(
          [
            ["arch", "Arch", "rounded-t-full rounded-b-sm"],
            ["ellipse", "Circle", "rounded-full"],
            ["rounded", "Rounded", "rounded-xl"],
            ["rect", "Square", "rounded-none"],
          ] as const
        ).map(([m, label, cls]) => (
          <button key={m} onClick={() => frame(m)} className="flex flex-col items-center gap-1.5 rounded-xl border border-line bg-white p-2 hover:border-brand/50">
            <span className={clsx("h-10 w-8 bg-paper-3", cls)} />
            <span className="text-[11px] text-ink/60">{label}</span>
          </button>
        ))}
      </div>

      <Label className="mt-5">Your uploads</Label>
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-ink/45">
          <ImagePlus className="mx-auto mb-2 size-6" />
          Nothing yet
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {items.map((it) => (
            // eslint-disable-next-line @next/next/no-img-element
            <button key={it.id} onClick={() => place(it.url)} className="aspect-square overflow-hidden rounded-lg border border-line bg-paper-2 hover:ring-2 hover:ring-brand/50">
              <img src={it.url} alt="" className="size-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BackgroundTab() {
  const design = useEditor((s) => s.design)!;
  const pageId = useEditor((s) => s.activePageId);
  const page = design.pages.find((p) => p.id === pageId)!;
  const setBackground = useEditor((s) => s.setBackground);
  const setBgImage = useEditor((s) => s.setBgImage);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="p-4">
      <Label>Page color</Label>
      <PaintPicker value={page.background} onChange={(p) => p && setBackground(p)} allowGradient />
      <Label className="mt-5">Background image</Label>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setBusy(true);
          setError("");
          try {
            setBgImage(await uploadImage(file));
          } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
          } finally {
            setBusy(false);
            e.target.value = "";
          }
        }}
      />
      <div className="flex gap-2">
        <Btn className="flex-1" onClick={() => input.current?.click()} disabled={busy}>
          {busy ? <Spinner /> : <Upload className="size-4" />} {page.bgImage ? "Replace" : "Upload"}
        </Btn>
        {page.bgImage && (
          <Btn variant="danger" onClick={() => setBgImage(null)}>
            Remove
          </Btn>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-3 text-xs text-ink/50">A background image covers the whole page, on top of the page color.</p>
    </div>
  );
}

function ColorsTab() {
  const design = useEditor((s) => s.design)!;
  const recolor = useEditor((s) => s.recolor);
  const colors = useMemo(() => collectColors(design.pages).filter((c) => /^#[0-9a-f]{6}$/i.test(c)), [design.pages]);
  return (
    <div className="p-4">
      <Label>Colors in this card</Label>
      <p className="mb-3 text-xs leading-relaxed text-ink/55">
        Change a color here to update it everywhere it’s used — the quickest way to re-theme a template.
      </p>
      <div className="grid gap-2">
        {colors.map((c, i) => (
          <label key={i} className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-white p-2 pr-3 hover:border-brand/50">
            <span className="relative size-9 overflow-hidden rounded-lg border border-black/15" style={{ background: c }}>
              <input
                type="color"
                value={c}
                onChange={(e) => recolor(c, e.target.value)}
                className="absolute inset-0 size-full cursor-pointer opacity-0"
                aria-label={`Change ${c}`}
              />
            </span>
            <span className="font-mono text-sm uppercase text-ink/70">{c}</span>
            <span className="ml-auto text-xs text-ink/40">Edit</span>
          </label>
        ))}
        {colors.length === 0 && <p className="text-sm text-ink/50">No solid colors yet.</p>}
      </div>
    </div>
  );
}

function layerLabel(l: Layer) {
  if (l.name) return l.name;
  if (l.type === "text") return l.text.replace(/\s+/g, " ").slice(0, 28) || "Text";
  if (l.type === "image") return "Photo";
  if (l.type === "ornament") return "Decoration";
  return l.shape === "ellipse" ? "Circle" : "Shape";
}

function LayersTab() {
  const design = useEditor((s) => s.design)!;
  const pageId = useEditor((s) => s.activePageId);
  const selectedId = useEditor((s) => s.selectedId);
  const select = useEditor((s) => s.select);
  const updateLayer = useEditor((s) => s.updateLayer);
  const moveLayer = useEditor((s) => s.moveLayer);
  const removeLayer = useEditor((s) => s.removeLayer);
  const page = design.pages.find((p) => p.id === pageId)!;
  const layers = [...page.layers].reverse();
  return (
    <div className="p-3">
      <Label className="px-1">Top to bottom</Label>
      <div className="flex flex-col gap-1">
        {layers.map((l) => (
          <div
            key={l.id}
            onClick={() => select(l.id)}
            className={clsx(
              "flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1.5 text-sm",
              l.id === selectedId ? "border-brand bg-brand/5" : "border-transparent hover:bg-ink/5",
            )}
          >
            <span className={clsx("min-w-0 flex-1 truncate", l.hidden && "text-ink/35 line-through")}>{layerLabel(l)}</span>
            <IconBtn label="Move up" className="size-7" onClick={(e) => (e.stopPropagation(), moveLayer(l.id, "forward"))}>
              <ArrowUp className="size-3.5" />
            </IconBtn>
            <IconBtn label="Move down" className="size-7" onClick={(e) => (e.stopPropagation(), moveLayer(l.id, "backward"))}>
              <ArrowDown className="size-3.5" />
            </IconBtn>
            <IconBtn label={l.hidden ? "Show" : "Hide"} className="size-7" onClick={(e) => (e.stopPropagation(), updateLayer(l.id, { hidden: !l.hidden }))}>
              {l.hidden ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            </IconBtn>
            <IconBtn label={l.locked ? "Unlock" : "Lock"} className="size-7" onClick={(e) => (e.stopPropagation(), updateLayer(l.id, { locked: !l.locked }))}>
              {l.locked ? <Lock className="size-3.5 text-brand" /> : <Unlock className="size-3.5" />}
            </IconBtn>
            <IconBtn label="Delete" className="size-7" onClick={(e) => (e.stopPropagation(), removeLayer(l.id))}>
              <Trash2 className="size-3.5" />
            </IconBtn>
          </div>
        ))}
        {layers.length === 0 && <p className="p-3 text-sm text-ink/50">This page is empty. Add text or elements.</p>}
      </div>
    </div>
  );
}

const VIEW_MODES: { id: ViewMode; title: string; desc: string }[] = [
  { id: "flip", title: "Card stack", desc: "Guests swipe through the cards like a deck." },
  { id: "scroll", title: "Scroll", desc: "All pages in one smooth, scrolling story." },
  { id: "single", title: "Single image", desc: "Just the first page, like a photo card." },
];

function LinkName() {
  const slug = useEditor((s) => s.slug);
  const setSlug = useEditor((s) => s.setSlug);
  const cardId = useEditor((s) => s.card?.id);
  const [value, setValue] = useState(slug);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  useEffect(() => setValue(slug), [slug]);
  const origin = typeof window === "undefined" ? "" : window.location.host;
  return (
    <div>
      <div className="flex items-center overflow-hidden rounded-lg border border-line bg-white focus-within:border-brand">
        <span className="shrink-0 bg-paper-2 px-2.5 py-2.5 text-xs text-ink/50">{origin}/c/</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
          maxLength={60}
          className="h-10 min-w-0 flex-1 px-2 text-sm outline-none"
          aria-label="Link name"
        />
      </div>
      {value !== slug && (
        <div className="mt-2 flex items-center gap-2">
          <Btn
            size="sm"
            variant="primary"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setMsg(null);
              try {
                const r = await api<{ slug: string }>(`/api/cards/${cardId}/slug`, { method: "PUT", json: { slug: value } });
                setSlug(r.slug);
                setMsg({ ok: true, text: "Link updated. Links you already sent with the old name will stop working." });
              } catch (e) {
                setMsg({ ok: false, text: e instanceof Error ? e.message : "Could not change link" });
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy && <Spinner />} Save link name
          </Btn>
          <button className="text-xs text-ink/50 hover:underline" onClick={() => setValue(slug)}>
            Cancel
          </button>
        </div>
      )}
      {msg && <p className={`mt-2 text-xs ${msg.ok ? "text-green-700" : "text-red-600"}`}>{msg.text}</p>}
    </div>
  );
}

function SettingsTab() {
  const rsvpEnabled = useEditor((s) => s.rsvpEnabled);
  const setRsvpEnabled = useEditor((s) => s.setRsvpEnabled);
  const envelope = useEditor((s) => s.envelope);
  const setEnvelope = useEditor((s) => s.setEnvelope);
  const title = useEditor((s) => s.title);
  const setTitle = useEditor((s) => s.setTitle);
  const viewMode = useEditor((s) => s.viewMode);
  const setViewMode = useEditor((s) => s.setViewMode);
  const meta = useEditor((s) => s.meta);
  const setMeta = useEditor((s) => s.setMeta);
  const pages = useEditor((s) => s.design?.pages.length ?? 1);
  const field = "h-10 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-brand";
  return (
    <div className="p-4">
      <Label>Card name (only you see this)</Label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} className={field} />

      <Label className="mt-5">How guests see your card</Label>
      <div className="grid gap-2">
        {VIEW_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setViewMode(m.id)}
            className={clsx(
              "rounded-xl border p-3 text-left transition",
              viewMode === m.id ? "border-brand bg-brand/5" : "border-line bg-white hover:border-ink/30",
            )}
          >
            <div className="text-sm font-medium">{m.title}</div>
            <div className="text-xs text-ink/55">{m.desc}</div>
          </button>
        ))}
      </div>
      {viewMode === "single" && pages > 1 && (
        <p className="mt-2 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800">
          “Single image” shows only page 1 online. The downloaded PDF still includes all {pages} pages.
        </p>
      )}

      <Label className="mt-5">Opening animation</Label>
      <div className="rounded-xl border border-line bg-white p-3">
        <Toggle label="Animated envelope" checked={envelope.enabled} onChange={(v) => setEnvelope({ enabled: v })} />
        {envelope.enabled && (
          <div className="mt-2 flex flex-wrap gap-2">
            {ENVELOPE_IDS.map((id) => (
              <button
                key={id}
                title={ENVELOPES[id].label}
                aria-label={ENVELOPES[id].label}
                onClick={() => setEnvelope({ color: id })}
                className={clsx("size-8 rounded-full border-2 shadow-sm", envelope.color === id ? "border-brand ring-2 ring-brand/30" : "border-white")}
                style={{ background: `linear-gradient(135deg, ${ENVELOPES[id].flap} 50%, ${ENVELOPES[id].body} 50%)` }}
              />
            ))}
          </div>
        )}
      </div>

      <Label className="mt-5">Guest replies</Label>
      <div className="rounded-xl border border-line bg-white p-3">
        <Toggle label="Let guests say if they’re coming" checked={rsvpEnabled} onChange={setRsvpEnabled} />
        <p className="mt-1 text-xs text-ink/50">Adds an optional “Will you join us?” button. Guests give a name, phone and how many people — you see the list in My cards.</p>
      </div>

      <Label className="mt-5">Link name</Label>
      <LinkName />

      <Label className="mt-5">Event details</Label>
      <p className="mb-2 text-xs text-ink/50">Used for the link preview when you share (WhatsApp, Facebook, iMessage…).</p>
      <div className="grid gap-2">
        <input placeholder="Couple names — e.g. Amelia & James" value={meta.coupleNames} maxLength={160} onChange={(e) => setMeta({ coupleNames: e.target.value })} className={field} />
        <input type="date" value={meta.eventDate} onChange={(e) => setMeta({ eventDate: e.target.value })} className={field} />
        <input placeholder="Venue" value={meta.venue} maxLength={200} onChange={(e) => setMeta({ venue: e.target.value })} className={field} />
        <input placeholder="City" value={meta.city} maxLength={120} onChange={(e) => setMeta({ city: e.target.value })} className={field} />
        <textarea
          placeholder="Short message shown in link previews (optional)"
          value={meta.description}
          maxLength={400}
          rows={3}
          onChange={(e) => setMeta({ description: e.target.value })}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
    </div>
  );
}

export function ToolPanel({ tab }: { tab: ToolTab }) {
  const design = useEditor((s) => s.design);
  if (!design) return null;
  return (
    <div className="h-full overflow-y-auto overscroll-contain">
      {tab === "text" && <TextTab />}
      {tab === "elements" && <ElementsTab />}
      {tab === "photos" && <PhotosTab />}
      {tab === "background" && <BackgroundTab />}
      {tab === "colors" && <ColorsTab />}
      {tab === "layers" && <LayersTab />}
      {tab === "settings" && <SettingsTab />}
    </div>
  );
}

void Section;
void Segmented;
