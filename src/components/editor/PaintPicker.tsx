"use client";
import { useCallback, useMemo, useState } from "react";
import { clsx } from "clsx";
import { Check } from "lucide-react";
import type { Paint } from "@/lib/design/types";
import { collectColors, isGradient } from "@/lib/design/layers";
import { GOLD, ROSE_GOLD, SILVER, linear } from "@/lib/templates/kit";
import { useEditor } from "./store";
import { useOutside } from "@/components/ui/kit";

const SWATCHES = [
  "#ffffff", "#f8f3e9", "#efe6d5", "#e3d2b5", "#1c1917", "#3a3733", "#6b6a5a", "#a8a29e",
  "#b08d57", "#d4af6a", "#8a6a2f", "#c97b84", "#e8b4bc", "#f3d7d9", "#8c2f4b", "#6b1f2a",
  "#35452f", "#6f8a6a", "#a9b89a", "#0f4c3a", "#1d3b66", "#7b9ab8", "#c9d8e6", "#0e1530",
  "#c5603b", "#e08a4a", "#e9c46a", "#5b3a29", "#6a4c93", "#c7b7e6", "#2a9d8f", "#264653",
];

const GRADIENTS: { name: string; paint: Paint }[] = [
  { name: "Gold foil", paint: GOLD },
  { name: "Rose gold", paint: ROSE_GOLD },
  { name: "Silver", paint: SILVER },
  { name: "Champagne", paint: linear(100, [0, "#f7e7c1"], [0.5, "#d9b97a"], [1, "#f3dfb0"]) },
  { name: "Blush", paint: linear(90, [0, "#fbe9e7"], [1, "#f1c6cc"]) },
  { name: "Sunset", paint: linear(90, [0, "#ffd9b8"], [0.5, "#f4a0a0"], [1, "#9b7fd1"]) },
  { name: "Midnight", paint: linear(90, [0, "#0e1530"], [1, "#2a2f6b"]) },
  { name: "Emerald", paint: linear(90, [0, "#0b3d2e"], [1, "#136a4f"]) },
  { name: "Ivory", paint: linear(90, [0, "#fbf7ef"], [1, "#eee3cd"]) },
];

export function paintCss(p: Paint | null | undefined): string {
  if (!p) return "transparent";
  if (typeof p === "string") return p;
  const stops = p.stops.map(([o, c]) => `${c} ${Math.round(o * 100)}%`).join(", ");
  return p.kind === "radial" ? `radial-gradient(circle, ${stops})` : `linear-gradient(${p.angle + 90}deg, ${stops})`;
}

export function Swatch({ paint, size = 28, className }: { paint: Paint | null | undefined; size?: number; className?: string }) {
  return (
    <span
      className={clsx("inline-block shrink-0 rounded-full border border-black/15", className)}
      style={{
        width: size,
        height: size,
        background: paint
          ? paintCss(paint)
          : "repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 50% / 10px 10px",
      }}
    />
  );
}

export function PaintPicker({
  value,
  onChange,
  allowGradient = false,
  allowNone = false,
  label,
}: {
  value: Paint | null;
  onChange: (p: Paint | null) => void;
  allowGradient?: boolean;
  allowNone?: boolean;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useOutside<HTMLDivElement>(close, open);
  const design = useEditor((s) => s.design);
  const docColors = useMemo(() => (design ? collectColors(design.pages).filter((c) => /^#|^rgb/.test(c)).slice(0, 14) : []), [design]);
  const solid = typeof value === "string" ? value : null;
  const [hex, setHex] = useState(solid ?? "#000000");

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-full items-center gap-2.5 rounded-lg border border-line bg-white px-2.5 text-left text-sm hover:border-ink/30"
      >
        <Swatch paint={value} size={22} />
        <span className="flex-1 truncate text-ink/70">{label ?? (value == null ? "None" : isGradient(value) ? "Gradient" : value)}</span>
      </button>
      {open && (
        <div className="absolute left-0 top-11 z-50 w-[272px] rounded-xl border border-line bg-white p-3 shadow-xl">
          {docColors.length > 0 && (
            <>
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink/50">In this card</div>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {docColors.map((c) => (
                  <button key={c} onClick={() => onChange(c)} aria-label={c}>
                    <Swatch paint={c} size={26} className={clsx(solid?.toLowerCase() === c && "ring-2 ring-brand ring-offset-1")} />
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink/50">Colors</div>
          <div className="mb-3 grid grid-cols-8 gap-1.5">
            {SWATCHES.map((c) => (
              <button key={c} onClick={() => onChange(c)} aria-label={c} className="relative">
                <Swatch paint={c} size={26} />
                {solid?.toLowerCase() === c && (
                  <Check className="absolute inset-0 m-auto size-3.5 text-white mix-blend-difference" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={/^#[0-9a-f]{6}$/i.test(solid ?? "") ? solid! : "#000000"}
              onChange={(e) => {
                setHex(e.target.value);
                onChange(e.target.value);
              }}
              className="h-9 w-12 cursor-pointer rounded-md border border-line bg-white p-0.5"
              aria-label="Custom color"
            />
            <input
              value={hex}
              onChange={(e) => {
                setHex(e.target.value);
                if (/^#[0-9a-f]{6}$/i.test(e.target.value)) onChange(e.target.value);
              }}
              maxLength={7}
              className="h-9 min-w-0 flex-1 rounded-lg border border-line px-2.5 font-mono text-sm uppercase outline-none focus:border-brand"
              aria-label="Hex color"
            />
          </div>
          {allowGradient && (
            <>
              <div className="mb-1.5 mt-3 text-[11px] font-semibold uppercase tracking-wider text-ink/50">Gradients & foils</div>
              <div className="grid grid-cols-3 gap-1.5">
                {GRADIENTS.map((g) => (
                  <button
                    key={g.name}
                    onClick={() => onChange(g.paint)}
                    className="h-9 rounded-lg border border-black/10 text-[10px] font-medium text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,.5)]"
                    style={{ background: paintCss(g.paint) }}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </>
          )}
          {allowNone && (
            <button onClick={() => onChange(null)} className="mt-3 w-full rounded-lg border border-line py-1.5 text-sm text-ink/70 hover:bg-paper-2">
              No fill
            </button>
          )}
        </div>
      )}
    </div>
  );
}
