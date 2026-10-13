"use client";
import { useMemo, useRef, useState } from "react";
import {
  AlignCenter,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  ArrowDownToLine,
  ArrowUpToLine,
  Copy,
  FlipHorizontal,
  FlipVertical,
  Italic,
  Lock,
  Trash2,
  Unlock,
  Upload,
} from "lucide-react";
import { useEditor } from "./store";
import { Btn, IconBtn, Label, NumberField, Range, Section, Segmented, Spinner, Toggle } from "@/components/ui/kit";
import { PaintPicker } from "./PaintPicker";
import { FontPicker } from "./FontPicker";
import { FONT_MAP, WEIGHT_LABELS, ensureFonts, nearestWeight } from "@/lib/design/fonts";
import { collectColors, mapLayerColors, normColor } from "@/lib/design/layers";
import { uploadImage } from "@/lib/client/api";
import type { ImageLayer, Layer, OrnamentLayer, ShapeLayer, TextLayer } from "@/lib/design/types";
import { GUEST_TOKEN } from "@/lib/design/types";

function useSelected(): Layer | null {
  const design = useEditor((s) => s.design);
  const pageId = useEditor((s) => s.activePageId);
  const id = useEditor((s) => s.selectedId);
  return useMemo(() => design?.pages.find((p) => p.id === pageId)?.layers.find((l) => l.id === id) ?? null, [design, pageId, id]);
}

/* ------------------------------ text ------------------------------ */

function TextProps({ layer }: { layer: TextLayer }) {
  const update = useEditor((s) => s.updateLayer);
  const set = (patch: Partial<TextLayer>, key?: string) => update(layer.id, patch as Partial<Layer>, key);
  const def = FONT_MAP.get(layer.fontFamily);
  const weights = def?.weights ?? [400, 700];

  const pickFont = async (family: string) => {
    const d = FONT_MAP.get(family);
    const weight = nearestWeight(family, layer.fontWeight);
    const italic = layer.italic && !!d?.italic;
    await ensureFonts([{ family, weight, italic }]);
    set({ fontFamily: family, fontWeight: weight, italic });
  };

  return (
    <>
      <Section title="Text">
        <textarea
          value={layer.text}
          onChange={(e) => set({ text: e.target.value }, `text:${layer.id}`)}
          rows={3}
          dir="auto"
          className="w-full resize-y rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
        />
        <button
          onClick={() => !layer.text.includes(GUEST_TOKEN) && set({ text: `${layer.text} ${GUEST_TOKEN}`.trim() })}
          className="mt-2 text-xs text-brand hover:underline"
        >
          + Insert guest name ({GUEST_TOKEN})
        </button>
      </Section>
      <Section title="Font">
        <FontPicker value={layer.fontFamily} onPick={pickFont} />
        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
          <select
            value={layer.fontWeight}
            onChange={async (e) => {
              const w = Number(e.target.value);
              await ensureFonts([{ family: layer.fontFamily, weight: w, italic: layer.italic }]);
              set({ fontWeight: w });
            }}
            className="h-9 rounded-lg border border-line bg-white px-2 text-sm outline-none focus:border-brand"
          >
            {weights.map((w) => (
              <option key={w} value={w}>
                {WEIGHT_LABELS[w] ?? w}
              </option>
            ))}
          </select>
          <IconBtn
            label="Italic"
            active={layer.italic}
            disabled={!def?.italic}
            className="border border-line"
            onClick={async () => {
              await ensureFonts([{ family: layer.fontFamily, weight: layer.fontWeight, italic: !layer.italic }]);
              set({ italic: !layer.italic });
            }}
          >
            <Italic className="size-4" />
          </IconBtn>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <Label>Size</Label>
            <NumberField value={layer.fontSize} min={6} max={600} onChange={(v) => set({ fontSize: v }, `fs:${layer.id}`)} />
          </div>
          <div>
            <Label>Case</Label>
            <Segmented
              value={layer.uppercase ? "up" : "as"}
              onChange={(v) => set({ uppercase: v === "up" })}
              options={[
                { value: "as", label: "Aa" },
                { value: "up", label: "AA" },
              ]}
            />
          </div>
        </div>
        <div className="mt-3">
          <Segmented
            value={layer.align}
            onChange={(v) => set({ align: v })}
            options={[
              { value: "left", label: <AlignLeft className="size-4" />, title: "Left" },
              { value: "center", label: <AlignCenter className="size-4" />, title: "Center" },
              { value: "right", label: <AlignRight className="size-4" />, title: "Right" },
              { value: "justify", label: <AlignJustify className="size-4" />, title: "Justify" },
            ]}
          />
        </div>
      </Section>
      <Section title="Color">
        <PaintPicker value={layer.fill} allowGradient onChange={(p) => p && set({ fill: p }, `fill:${layer.id}`)} />
      </Section>
      <Section title="Spacing">
        <div className="grid gap-3">
          <Range label="Letter spacing" min={-5} max={40} step={0.5} value={layer.letterSpacing} onChange={(v) => set({ letterSpacing: v }, `ls:${layer.id}`)} />
          <Range label="Line height" min={0.8} max={2.5} step={0.05} value={layer.lineHeight} onChange={(v) => set({ lineHeight: v }, `lh:${layer.id}`)} />
        </div>
      </Section>
      <Section title="Shadow">
        <Toggle
          label="Drop shadow"
          checked={!!layer.shadow}
          onChange={(on) => set({ shadow: on ? { color: "#000000", blur: 12, offsetX: 0, offsetY: 4, opacity: 0.35 } : undefined })}
        />
        {layer.shadow && (
          <div className="mt-2 grid gap-3">
            <Range label="Blur" min={0} max={60} value={layer.shadow.blur} onChange={(v) => set({ shadow: { ...layer.shadow!, blur: v } }, `sh:${layer.id}`)} />
            <Range label="Opacity" min={0} max={1} step={0.05} value={layer.shadow.opacity} onChange={(v) => set({ shadow: { ...layer.shadow!, opacity: v } }, `sho:${layer.id}`)} />
          </div>
        )}
      </Section>
    </>
  );
}

/* ----------------------------- shapes ----------------------------- */

function ShapeProps({ layer }: { layer: ShapeLayer }) {
  const update = useEditor((s) => s.updateLayer);
  const set = (patch: Partial<ShapeLayer>, key?: string) => update(layer.id, patch as Partial<Layer>, key);
  return (
    <>
      <Section title="Fill">
        <PaintPicker value={layer.fill} allowGradient allowNone onChange={(p) => set({ fill: p }, `fill:${layer.id}`)} />
      </Section>
      <Section title="Outline">
        <PaintPicker
          value={layer.stroke}
          allowNone
          onChange={(p) => set({ stroke: typeof p === "string" ? p : null, strokeWidth: typeof p === "string" && !layer.strokeWidth ? 3 : layer.strokeWidth }, `st:${layer.id}`)}
        />
        {layer.stroke && (
          <div className="mt-3">
            <Range label="Thickness" min={0.5} max={40} step={0.5} value={layer.strokeWidth} onChange={(v) => set({ strokeWidth: v }, `sw:${layer.id}`)} />
          </div>
        )}
      </Section>
      {layer.shape === "rect" && (
        <Section title="Corners">
          <Range label="Radius" min={0} max={Math.min(layer.width, layer.height) / 2} value={layer.cornerRadius} onChange={(v) => set({ cornerRadius: v }, `cr:${layer.id}`)} />
        </Section>
      )}
    </>
  );
}

/* ---------------------------- ornaments --------------------------- */

function OrnamentProps({ layer }: { layer: OrnamentLayer }) {
  const update = useEditor((s) => s.updateLayer);
  const colors = useMemo(() => {
    const out: string[] = [];
    mapLayerColors(layer, (c) => {
      if (/^#|^rgb/.test(c) && !out.some((x) => normColor(x) === normColor(c))) out.push(c);
      return c;
    });
    return out;
  }, [layer]);
  return (
    <>
      <Section title="Colors">
        <div className="grid gap-2">
          {colors.map((c, i) => (
            <PaintPicker
              key={i}
              value={c}
              onChange={(p) => {
                if (typeof p !== "string") return;
                update(layer.id, mapLayerColors(layer, (x) => (normColor(x) === normColor(c) ? p : x)) as Partial<Layer>, `oc:${layer.id}:${i}`);
              }}
            />
          ))}
          {colors.length === 0 && <p className="text-sm text-ink/50">This decoration uses a gradient.</p>}
        </div>
      </Section>
      <Section title="Flip">
        <div className="flex gap-2">
          <Btn size="sm" className="flex-1" onClick={() => update(layer.id, { flipX: !layer.flipX } as Partial<Layer>)}>
            <FlipHorizontal className="size-4" /> Horizontal
          </Btn>
          <Btn size="sm" className="flex-1" onClick={() => update(layer.id, { flipY: !layer.flipY } as Partial<Layer>)}>
            <FlipVertical className="size-4" /> Vertical
          </Btn>
        </div>
      </Section>
    </>
  );
}

/* ------------------------------ image ----------------------------- */

function ImageProps({ layer }: { layer: ImageLayer }) {
  const update = useEditor((s) => s.updateLayer);
  const set = (patch: Partial<ImageLayer>, key?: string) => update(layer.id, patch as Partial<Layer>, key);
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <>
      <Section title="Photo">
        <input
          ref={input}
          type="file"
          hidden
          accept="image/jpeg,image/png,image/webp"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setBusy(true);
            setError("");
            try {
              set({ src: await uploadImage(f) });
            } catch (err) {
              setError(err instanceof Error ? err.message : "Upload failed");
            } finally {
              setBusy(false);
              e.target.value = "";
            }
          }}
        />
        <div className="flex gap-2">
          <Btn variant="primary" className="flex-1" onClick={() => input.current?.click()} disabled={busy}>
            {busy ? <Spinner /> : <Upload className="size-4" />} {layer.src ? "Replace photo" : "Add photo"}
          </Btn>
          {layer.src && (
            <Btn variant="danger" onClick={() => set({ src: "" })}>
              Clear
            </Btn>
          )}
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </Section>
      <Section title="Shape">
        <Segmented
          value={layer.mask}
          onChange={(v) => set({ mask: v })}
          options={[
            { value: "rect", label: "Square" },
            { value: "rounded", label: "Round" },
            { value: "ellipse", label: "Oval" },
            { value: "arch", label: "Arch" },
          ]}
        />
        {layer.mask === "rounded" && (
          <div className="mt-3">
            <Range label="Corner radius" min={0} max={Math.min(layer.width, layer.height) / 2} value={layer.cornerRadius} onChange={(v) => set({ cornerRadius: v }, `cr:${layer.id}`)} />
          </div>
        )}
      </Section>
      {layer.src && (
        <Section title="Crop">
          <div className="grid gap-3">
            <Range label="Zoom" min={1} max={4} step={0.05} value={layer.zoom} onChange={(v) => set({ zoom: v }, `z:${layer.id}`)} />
            <Range label="Move left / right" min={0} max={1} step={0.01} value={layer.focusX} display="" onChange={(v) => set({ focusX: v }, `fx:${layer.id}`)} />
            <Range label="Move up / down" min={0} max={1} step={0.01} value={layer.focusY} display="" onChange={(v) => set({ focusY: v }, `fy:${layer.id}`)} />
          </div>
        </Section>
      )}
      <Section title="Border">
        <PaintPicker
          value={layer.borderColor}
          allowNone
          onChange={(p) => set({ borderColor: typeof p === "string" ? p : null, borderWidth: typeof p === "string" && !layer.borderWidth ? 6 : layer.borderWidth }, `bc:${layer.id}`)}
        />
        {layer.borderColor && (
          <div className="mt-3">
            <Range label="Thickness" min={1} max={40} value={layer.borderWidth} onChange={(v) => set({ borderWidth: v }, `bw:${layer.id}`)} />
          </div>
        )}
      </Section>
      {!layer.src && (
        <Section title="Empty frame color">
          <PaintPicker value={layer.placeholderFill} onChange={(p) => typeof p === "string" && set({ placeholderFill: p }, `pf:${layer.id}`)} />
        </Section>
      )}
    </>
  );
}

/* ------------------------- common: arrange ------------------------ */

function ArrangeProps({ layer }: { layer: Layer }) {
  const design = useEditor((s) => s.design)!;
  const update = useEditor((s) => s.updateLayer);
  const move = useEditor((s) => s.moveLayer);
  const set = (patch: Partial<Layer>, key?: string) => update(layer.id, patch, key);
  const W = design.width;
  const H = design.height;
  // Text height is automatic, so align using an estimate from the canvas when needed.
  const h = layer.type === "text" ? layer.fontSize * layer.lineHeight * Math.max(1, layer.text.split("\n").length) : layer.height;
  return (
    <>
      <Section title="Align to page">
        <div className="grid grid-cols-6 gap-1">
          <IconBtn label="Left" onClick={() => set({ x: 0 })}>
            <AlignHorizontalJustifyStart className="size-4" />
          </IconBtn>
          <IconBtn label="Center horizontally" onClick={() => set({ x: (W - layer.width) / 2 })}>
            <AlignHorizontalJustifyCenter className="size-4" />
          </IconBtn>
          <IconBtn label="Right" onClick={() => set({ x: W - layer.width })}>
            <AlignHorizontalJustifyEnd className="size-4" />
          </IconBtn>
          <IconBtn label="Top" onClick={() => set({ y: 0 })}>
            <AlignVerticalJustifyStart className="size-4" />
          </IconBtn>
          <IconBtn label="Center vertically" onClick={() => set({ y: (H - h) / 2 })}>
            <AlignVerticalJustifyCenter className="size-4" />
          </IconBtn>
          <IconBtn label="Bottom" onClick={() => set({ y: H - h })}>
            <AlignVerticalJustifyEnd className="size-4" />
          </IconBtn>
        </div>
      </Section>
      <Section title="Transform">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>X</Label>
            <NumberField value={layer.x} onChange={(v) => set({ x: v }, `x:${layer.id}`)} />
          </div>
          <div>
            <Label>Y</Label>
            <NumberField value={layer.y} onChange={(v) => set({ y: v }, `y:${layer.id}`)} />
          </div>
          <div>
            <Label>Width</Label>
            <NumberField value={layer.width} min={4} onChange={(v) => set({ width: v }, `w:${layer.id}`)} />
          </div>
          {layer.type !== "text" && (
            <div>
              <Label>Height</Label>
              <NumberField value={layer.height} min={4} onChange={(v) => set({ height: v }, `h:${layer.id}`)} />
            </div>
          )}
          <div>
            <Label>Rotate</Label>
            <NumberField value={Math.round(layer.rotation * 10) / 10} suffix="°" onChange={(v) => set({ rotation: v }, `r:${layer.id}`)} />
          </div>
        </div>
        <div className="mt-3">
          <Range label="Opacity" min={0} max={1} step={0.01} value={layer.opacity} display={`${Math.round(layer.opacity * 100)}%`} onChange={(v) => set({ opacity: v }, `o:${layer.id}`)} />
        </div>
      </Section>
      <Section title="Order">
        <div className="flex gap-2">
          <Btn size="sm" className="flex-1" onClick={() => move(layer.id, "front")}>
            <ArrowUpToLine className="size-4" /> Front
          </Btn>
          <Btn size="sm" className="flex-1" onClick={() => move(layer.id, "back")}>
            <ArrowDownToLine className="size-4" /> Back
          </Btn>
        </div>
      </Section>
    </>
  );
}

/* ------------------------------ page ------------------------------ */

function PageProps() {
  const design = useEditor((s) => s.design)!;
  const pageId = useEditor((s) => s.activePageId);
  const page = design.pages.find((p) => p.id === pageId)!;
  const setBackground = useEditor((s) => s.setBackground);
  const colors = collectColors(design.pages).length;
  return (
    <>
      <Section title="Page background">
        <PaintPicker value={page.background} allowGradient onChange={(p) => p && setBackground(p)} />
      </Section>
      <div className="p-4 text-sm leading-relaxed text-ink/55">
        <p className="mb-2 font-medium text-ink/70">Tip</p>
        <p>Tap any text or decoration on the card to edit it. Double-tap text to type directly on the card.</p>
        {colors > 0 && <p className="mt-2">Use the <b>Colors</b> tab to re-theme the whole card in one go.</p>}
      </div>
    </>
  );
}

/* ----------------------------- exports ---------------------------- */

export function PropsPanel() {
  const layer = useSelected();
  const remove = useEditor((s) => s.removeLayer);
  const duplicate = useEditor((s) => s.duplicateLayer);
  const update = useEditor((s) => s.updateLayer);
  if (!layer) return <div className="h-full overflow-y-auto"><PageProps /></div>;
  return (
    <div className="h-full overflow-y-auto overscroll-contain">
      <div className="flex items-center gap-1 border-b border-line px-3 py-2">
        <span className="flex-1 pl-1 text-sm font-medium capitalize">{layer.type === "ornament" ? "Decoration" : layer.type === "shape" ? "Shape" : layer.type}</span>
        <IconBtn label="Duplicate" onClick={() => duplicate(layer.id)}>
          <Copy className="size-4" />
        </IconBtn>
        <IconBtn label={layer.locked ? "Unlock" : "Lock"} active={layer.locked} onClick={() => update(layer.id, { locked: !layer.locked })}>
          {layer.locked ? <Lock className="size-4" /> : <Unlock className="size-4" />}
        </IconBtn>
        <IconBtn label="Delete" onClick={() => remove(layer.id)}>
          <Trash2 className="size-4" />
        </IconBtn>
      </div>
      {layer.locked && (
        <div className="m-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">This element is locked. Unlock it to move or resize it.</div>
      )}
      {layer.type === "text" && <TextProps layer={layer} />}
      {layer.type === "shape" && <ShapeProps layer={layer} />}
      {layer.type === "ornament" && <OrnamentProps layer={layer} />}
      {layer.type === "image" && <ImageProps layer={layer} />}
      <ArrangeProps layer={layer} />
    </div>
  );
}
