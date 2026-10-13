"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Copy, Lock, Minus, Pencil, Plus, Trash2, Unlock } from "lucide-react";
import type Konva from "konva";
import { PageStage } from "@/components/canvas/PageStage";
import { IconBtn } from "@/components/ui/kit";
import { useEditor } from "./store";
import type { Layer, TextLayer } from "@/lib/design/types";

export function CanvasArea({ bottomInset = 0 }: { bottomInset?: number }) {
  const design = useEditor((s) => s.design)!;
  const pageId = useEditor((s) => s.activePageId);
  const selectedId = useEditor((s) => s.selectedId);
  const select = useEditor((s) => s.select);
  const updateLayer = useEditor((s) => s.updateLayer);
  const removeLayer = useEditor((s) => s.removeLayer);
  const duplicateLayer = useEditor((s) => s.duplicateLayer);
  const page = design.pages.find((p) => p.id === pageId) ?? design.pages[0];
  const selected = page.layers.find((l) => l.id === selectedId) ?? null;

  const wrap = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [box, setBox] = useState({ w: 600, h: 700 });
  const [zoom, setZoom] = useState(1);
  const [editing, setEditing] = useState<string | null>(null);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBox({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setBox({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const pad = box.w < 640 ? 20 : 48;
  const fit = Math.max(0.1, Math.min((box.w - pad * 2) / design.width, (box.h - pad * 2 - bottomInset) / design.height));
  const scale = fit * zoom;

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable]")) return;
      const st = useEditor.getState();
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        e.shiftKey ? st.redo() : st.undo();
      } else if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        st.redo();
      } else if (st.selectedId) {
        const id = st.selectedId;
        const layer = st.design?.pages.find((p) => p.id === st.activePageId)?.layers.find((l) => l.id === id);
        if (!layer) return;
        if (e.key === "Delete" || e.key === "Backspace") {
          e.preventDefault();
          st.removeLayer(id);
        } else if (mod && e.key.toLowerCase() === "d") {
          e.preventDefault();
          st.duplicateLayer(id);
        } else if (e.key === "Escape") {
          st.select(null);
        } else if (e.key.startsWith("Arrow") && !layer.locked) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 1;
          const patch: Partial<Layer> = {};
          if (e.key === "ArrowLeft") patch.x = layer.x - step;
          if (e.key === "ArrowRight") patch.x = layer.x + step;
          if (e.key === "ArrowUp") patch.y = layer.y - step;
          if (e.key === "ArrowDown") patch.y = layer.y + step;
          st.updateLayer(id, patch, `nudge:${id}`);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onChange = useCallback((id: string, patch: Partial<Layer>) => updateLayer(id, patch, `drag:${id}:${Date.now()}`), [updateLayer]);

  const editingLayer = editing ? (page.layers.find((l) => l.id === editing) as TextLayer | undefined) : undefined;
  useEffect(() => {
    if (editing && !editingLayer) setEditing(null);
  }, [editing, editingLayer]);

  const startEdit = (id: string) => {
    const l = page.layers.find((x) => x.id === id);
    if (l?.type === "text" && !l.locked) {
      select(id);
      setEditing(id);
    }
  };

  const fillCss = (l: TextLayer) => (typeof l.fill === "string" ? l.fill : (l.fill.stops[Math.floor(l.fill.stops.length / 2)]?.[1] ?? "#000"));

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-[#e9e5de]">
      <div ref={wrap} className="canvas-scroll min-h-0 flex-1 overflow-auto" style={{ paddingBottom: bottomInset }}>
        <div
          className="relative mx-auto my-auto"
          style={{
            width: design.width * scale,
            height: design.height * scale,
            margin: `${pad}px auto`,
            boxShadow: "0 10px 40px rgba(40,30,20,.22), 0 2px 6px rgba(40,30,20,.12)",
          }}
        >
          <PageStage
            ref={stageRef}
            width={design.width}
            height={design.height}
            page={page}
            scale={scale}
            interactive
            selectedId={editing ? null : selectedId}
            onSelect={select}
            onChange={onChange}
            onEditText={startEdit}
            guestSample="Guest Name"
            showHints
          />
          {editingLayer && (
            <TextEditor
              key={editingLayer.id}
              layer={editingLayer}
              scale={scale}
              color={fillCss(editingLayer)}
              stageRef={stageRef}
              onDone={(text) => {
                if (text !== editingLayer.text) updateLayer(editingLayer.id, { text } as Partial<Layer>, `text:${editingLayer.id}`);
                setEditing(null);
              }}
            />
          )}
        </div>
      </div>

      {selected && !editing && (
        <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center px-3">
          <div className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-line bg-white/95 px-1.5 py-1 shadow-lg backdrop-blur">
            {selected.type === "text" && (
              <button
                onClick={() => startEdit(selected.id)}
                className="flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-brand hover:bg-brand/10"
              >
                <Pencil className="size-3.5" /> Edit text
              </button>
            )}
            <IconBtn label="Duplicate" className="size-8" onClick={() => duplicateLayer(selected.id)}>
              <Copy className="size-4" />
            </IconBtn>
            <IconBtn label={selected.locked ? "Unlock" : "Lock"} className="size-8" onClick={() => updateLayer(selected.id, { locked: !selected.locked })}>
              {selected.locked ? <Lock className="size-4 text-brand" /> : <Unlock className="size-4" />}
            </IconBtn>
            <IconBtn label="Delete" className="size-8" onClick={() => removeLayer(selected.id)}>
              <Trash2 className="size-4" />
            </IconBtn>
          </div>
        </div>
      )}

      <div className="absolute bottom-3 right-3 z-20 hidden items-center gap-0.5 rounded-full border border-line bg-white/95 px-1 py-1 shadow-md backdrop-blur lg:flex" style={{ marginBottom: bottomInset }}>
        <IconBtn label="Zoom out" className="size-8" onClick={() => setZoom((z) => Math.max(0.3, Math.round((z - 0.1) * 10) / 10))}>
          <Minus className="size-4" />
        </IconBtn>
        <button onClick={() => setZoom(1)} className="w-12 text-center text-xs tabular-nums text-ink/70 hover:text-ink" title="Fit to screen">
          {Math.round(scale * 100)}%
        </button>
        <IconBtn label="Zoom in" className="size-8" onClick={() => setZoom((z) => Math.min(3, Math.round((z + 0.1) * 10) / 10))}>
          <Plus className="size-4" />
        </IconBtn>
      </div>
    </div>
  );
}

/** Textarea laid exactly over the canvas text while it's being edited. */
function TextEditor({
  layer,
  scale,
  color,
  stageRef,
  onDone,
}: {
  layer: TextLayer;
  scale: number;
  color: string;
  stageRef: React.RefObject<Konva.Stage | null>;
  onDone: (text: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(layer.text);
  const done = useRef(false);

  useLayoutEffect(() => {
    const node = stageRef.current?.findOne<Konva.Node>("#" + layer.id);
    node?.visible(false);
    node?.getLayer()?.batchDraw();
    const ta = ref.current;
    if (ta) {
      ta.focus();
      ta.setSelectionRange(ta.value.length, ta.value.length);
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
    return () => {
      node?.visible(true);
      node?.getLayer()?.batchDraw();
    };
  }, [layer.id, stageRef]);

  const finish = (v: string) => {
    if (done.current) return;
    done.current = true;
    onDone(v);
  };

  return (
    <textarea
      ref={ref}
      value={value}
      dir="auto"
      onChange={(e) => {
        setValue(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
      }}
      onBlur={() => finish(value)}
      onKeyDown={(e) => {
        if (e.key === "Escape") finish(layer.text);
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) finish(value);
      }}
      spellCheck={false}
      style={{
        position: "absolute",
        left: layer.x * scale,
        top: layer.y * scale,
        width: layer.width * scale,
        transform: `rotate(${layer.rotation}deg)`,
        transformOrigin: "0 0",
        font: "inherit",
        fontFamily: `"${layer.fontFamily}"`,
        fontSize: layer.fontSize * scale,
        fontWeight: layer.fontWeight,
        fontStyle: layer.italic ? "italic" : "normal",
        lineHeight: layer.lineHeight,
        letterSpacing: layer.letterSpacing * scale,
        textAlign: layer.align === "justify" ? "justify" : layer.align,
        textTransform: layer.uppercase ? "uppercase" : "none",
        color,
        background: "transparent",
        border: "none",
        outline: "1.5px dashed #6c5ce7",
        outlineOffset: 2,
        resize: "none",
        overflow: "hidden",
        padding: 0,
        margin: 0,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        zIndex: 30,
        caretColor: "#6c5ce7",
        opacity: layer.opacity,
      }}
    />
  );
}
