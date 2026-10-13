"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import { ChevronDown, Search } from "lucide-react";
import { CATEGORY_LABELS, FONTS, type FontCategory } from "@/lib/design/fonts";
import { useOutside } from "@/components/ui/kit";

const previewLoaded = new Set<string>();

/** Loads just enough of a font (its own name) to render the picker row in that face. */
function loadPreview(family: string, sample?: string) {
  if (previewLoaded.has(family)) return;
  previewLoaded.add(family);
  const text = encodeURIComponent(sample ?? family);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}&text=${text}&display=swap`;
  document.head.appendChild(link);
}

export function FontPicker({ value, onPick }: { value: string; onPick: (family: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const close = useCallback(() => setOpen(false), []);
  const ref = useOutside<HTMLDivElement>(close, open);

  const groups = useMemo(() => {
    const term = q.trim().toLowerCase();
    const out: { cat: FontCategory; fonts: typeof FONTS }[] = [];
    for (const cat of Object.keys(CATEGORY_LABELS) as FontCategory[]) {
      const fonts = FONTS.filter((f) => f.category === cat && f.family.toLowerCase().includes(term));
      if (fonts.length) out.push({ cat, fonts });
    }
    return out;
  }, [q]);

  useEffect(() => {
    if (!open) return;
    FONTS.forEach((f) => loadPreview(f.family, f.sample ?? undefined));
  }, [open]);
  useEffect(() => {
    loadPreview(value);
  }, [value]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-line bg-white px-3 text-left hover:border-ink/30"
      >
        <span className="truncate text-[15px]" style={{ fontFamily: `"${value}"` }}>
          {value}
        </span>
        <ChevronDown className="size-4 shrink-0 text-ink/40" />
      </button>
      {open && (
        <div className="absolute left-0 top-11 z-50 w-[290px] overflow-hidden rounded-xl border border-line bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-line px-3">
            <Search className="size-4 text-ink/40" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search fonts"
              className="h-10 flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <div className="max-h-[340px] overflow-y-auto p-1.5">
            {groups.map((g) => (
              <div key={g.cat}>
                <div className="px-2 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink/45">{CATEGORY_LABELS[g.cat]}</div>
                {g.fonts.map((f) => (
                  <button
                    key={f.family}
                    onClick={() => {
                      onPick(f.family);
                      setOpen(false);
                    }}
                    className={clsx(
                      "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[18px] leading-tight hover:bg-paper-2",
                      f.family === value && "bg-brand/10",
                    )}
                    style={{ fontFamily: `"${f.family}"` }}
                  >
                    <span className="truncate">{f.sample ?? f.family}</span>
                    {f.sample && <span className="ml-2 shrink-0 font-sans text-[11px] text-ink/40">{f.family}</span>}
                  </button>
                ))}
              </div>
            ))}
            {groups.length === 0 && <div className="p-4 text-center text-sm text-ink/50">No fonts match “{q}”.</div>}
          </div>
        </div>
      )}
    </div>
  );
}
