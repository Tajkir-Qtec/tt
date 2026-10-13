"use client";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Layer as KLayer, Line, Rect, Stage, Transformer } from "react-konva";
import type Konva from "konva";
import type { Layer, OrnamentLayer, Page, TextLayer } from "@/lib/design/types";
import { LayerNode, type NodeCtx } from "./nodes";
import { fillProps } from "./paint";
import { useImage } from "./useImage";

export interface PageStageProps {
  width: number;
  height: number;
  page: Page;
  /** Display scale (stage px per design px). Use 1 for offscreen rendering. */
  scale: number;
  interactive?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onChange?: (id: string, patch: Partial<Layer>) => void;
  onEditText?: (id: string) => void;
  guestSample?: string | null;
  showHints?: boolean;
}

type Guide = { orientation: "v" | "h"; pos: number };

export const PageStage = forwardRef<Konva.Stage, PageStageProps>(function PageStage(
  { width, height, page, scale, interactive = false, selectedId = null, onSelect, onChange, onEditText, guestSample = null, showHints = false },
  fwd,
) {
  const stageRef = useRef<Konva.Stage>(null);
  const contentRef = useRef<Konva.Layer>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const layersRef = useRef(page.layers);
  layersRef.current = page.layers;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [guides, setGuides] = useState<Guide[]>([]);
  const bgImg = useImage(page.bgImage);

  useImperativeHandle(fwd, () => stageRef.current as Konva.Stage);

  // Attach the transformer to the selected node.
  useEffect(() => {
    const tr = trRef.current;
    const stage = stageRef.current;
    if (!tr || !stage) return;
    const node = selectedId && interactive ? stage.findOne<Konva.Node>("#" + selectedId) : null;
    const layer = page.layers.find((l) => l.id === selectedId);
    tr.nodes(node && layer && !layer.locked && !layer.hidden ? [node] : []);
    tr.getLayer()?.batchDraw();
  }, [selectedId, interactive, page.layers]);

  // Convert transformer scaling into real width/height/fontSize values.
  useEffect(() => {
    const tr = trRef.current;
    if (!tr) return;
    const handler = () => {
      for (const node of tr.nodes()) {
        const layer = layersRef.current.find((l) => l.id === node.id());
        if (!layer) continue;
        const sx = Math.abs(node.scaleX());
        const sy = Math.abs(node.scaleY());
        const common = { x: node.x(), y: node.y(), rotation: node.rotation() };
        let patch: Partial<Layer>;
        if (layer.type === "text") {
          const t = layer as TextLayer;
          const uniform = Math.abs(sx - sy) < 0.002 && Math.abs(sx - 1) > 0.002;
          patch = {
            ...common,
            width: Math.max(40, t.width * sx),
            ...(uniform ? { fontSize: Math.max(6, Math.round(t.fontSize * sx * 10) / 10), letterSpacing: t.letterSpacing * sx } : {}),
          };
        } else if (layer.type === "ornament") {
          const o = layer as OrnamentLayer;
          patch = { ...common, width: Math.max(8, o.vbW * sx), height: Math.max(8, o.vbH * sy) };
        } else {
          patch = { ...common, width: Math.max(8, layer.width * sx), height: Math.max(8, layer.height * sy) };
        }
        node.scaleX(1);
        node.scaleY(1);
        onChangeRef.current?.(layer.id, patch);
      }
    };
    tr.on("transformend", handler);
    return () => {
      tr.off("transformend", handler);
    };
  }, []);

  const W = width;
  const H = height;
  const snap = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>, layer: Layer) => {
      const node = e.target;
      const content = contentRef.current;
      if (!content) return;
      const tol = 7 / scale;
      const r = node.getClientRect({ relativeTo: content });
      const xs = [0, W / 2, W, 60, W - 60];
      const ys = [0, H / 2, H, 60, H - 60];
      for (const l of layersRef.current) {
        if (l.id === layer.id || l.hidden) continue;
        const n = stageRef.current?.findOne<Konva.Node>("#" + l.id);
        if (!n) continue;
        const b = n.getClientRect({ relativeTo: content });
        xs.push(b.x, b.x + b.width / 2, b.x + b.width);
        ys.push(b.y, b.y + b.height / 2, b.y + b.height);
      }
      let dx = 0;
      let dy = 0;
      let gx: number | null = null;
      let gy: number | null = null;
      let bestX = tol;
      let bestY = tol;
      for (const edge of [r.x, r.x + r.width / 2, r.x + r.width]) {
        for (const t of xs) {
          const d = t - edge;
          if (Math.abs(d) < bestX) {
            bestX = Math.abs(d);
            dx = d;
            gx = t;
          }
        }
      }
      for (const edge of [r.y, r.y + r.height / 2, r.y + r.height]) {
        for (const t of ys) {
          const d = t - edge;
          if (Math.abs(d) < bestY) {
            bestY = Math.abs(d);
            dy = d;
            gy = t;
          }
        }
      }
      if (dx) node.x(node.x() + dx);
      if (dy) node.y(node.y() + dy);
      const g: Guide[] = [];
      if (gx != null) g.push({ orientation: "v", pos: gx });
      if (gy != null) g.push({ orientation: "h", pos: gy });
      setGuides(g);
    },
    [scale, W, H],
  );

  const ctx: NodeCtx = {
    interactive,
    onSelect: (id) => onSelect?.(id),
    onChange: (id, patch) => onChange?.(id, patch),
    onEditText,
    guestSample,
    showHints,
    onDragMove: interactive ? snap : undefined,
    onDragEnd: () => setGuides([]),
  };

  return (
    <Stage
      ref={stageRef}
      width={W * scale}
      height={H * scale}
      scaleX={scale}
      scaleY={scale}
      listening={interactive}
      onMouseDown={(e) => {
        if (interactive && (e.target === e.target.getStage() || e.target.name() === "page-bg")) onSelect?.(null);
      }}
      onTouchStart={(e) => {
        if (interactive && (e.target === e.target.getStage() || e.target.name() === "page-bg")) onSelect?.(null);
      }}
    >
      <KLayer ref={contentRef}>
        <Rect name="page-bg" x={0} y={0} width={W} height={H} {...fillProps(page.background, W, H)} />
        {bgImg && (
          <Rect
            name="page-bg"
            x={0}
            y={0}
            width={W}
            height={H}
            fillPatternImage={bgImg}
            fillPatternScale={{ x: Math.max(W / bgImg.width, H / bgImg.height), y: Math.max(W / bgImg.width, H / bgImg.height) }}
            fillPatternRepeat="no-repeat"
          />
        )}
        {page.layers.map((l) => (
          <LayerNode key={l.id} layer={l} ctx={ctx} />
        ))}
      </KLayer>
      {interactive && (
        <KLayer>
          {guides.map((g, i) =>
            g.orientation === "v" ? (
              <Line key={i} points={[g.pos, 0, g.pos, H]} stroke="#ff2d87" strokeWidth={1 / scale} dash={[6 / scale, 4 / scale]} listening={false} />
            ) : (
              <Line key={i} points={[0, g.pos, W, g.pos]} stroke="#ff2d87" strokeWidth={1 / scale} dash={[6 / scale, 4 / scale]} listening={false} />
            ),
          )}
          <Transformer
            ref={trRef}
            rotateEnabled
            flipEnabled={false}
            rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
            rotationSnapTolerance={4}
            anchorSize={14}
            anchorCornerRadius={7}
            anchorStroke="#7c5cff"
            anchorFill="#ffffff"
            borderStroke="#7c5cff"
            borderStrokeWidth={1.5}
            padding={2}
            ignoreStroke
            enabledAnchors={
              layersRef.current.find((l) => l.id === selectedId)?.type === "text"
                ? ["top-left", "top-right", "bottom-left", "bottom-right", "middle-left", "middle-right"]
                : undefined
            }
            boundBoxFunc={(oldBox, newBox) => (newBox.width < 10 || newBox.height < 10 ? oldBox : newBox)}
          />
        </KLayer>
      )}
    </Stage>
  );
});
