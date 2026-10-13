"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { Ellipse, Group, Path, Rect, Shape, Text } from "react-konva";
import type Konva from "konva";
import type { ImageLayer, Layer, OrnamentLayer, ShapeLayer, TextLayer } from "@/lib/design/types";
import { GUEST_TOKEN } from "@/lib/design/types";
import { konvaFontStyle } from "@/lib/design/fonts";
import { fillProps, strokeProps } from "./paint";
import { useImage } from "./useImage";

export interface NodeCtx {
  interactive: boolean;
  onSelect: (id: string) => void;
  onChange: (id: string, patch: Partial<Layer>) => void;
  onEditText?: (id: string) => void;
  guestSample: string | null;
  /** Draw the "add photo" hint in empty image frames. */
  showHints: boolean;
  onDragMove?: (e: Konva.KonvaEventObject<DragEvent>, layer: Layer) => void;
  onDragEnd?: (layer: Layer) => void;
}

const common = (l: Layer, ctx: NodeCtx) => {
  const editable = ctx.interactive && !l.locked;
  return {
    id: l.id,
    name: "layer",
    x: l.x,
    y: l.y,
    rotation: l.rotation,
    opacity: l.opacity,
    visible: !l.hidden,
    listening: editable,
    draggable: editable,
    onMouseDown: () => ctx.interactive && ctx.onSelect(l.id),
    onTouchStart: () => ctx.interactive && ctx.onSelect(l.id),
    onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => ctx.onDragMove?.(e, l),
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
      ctx.onChange(l.id, { x: e.target.x(), y: e.target.y() });
      ctx.onDragEnd?.(l);
    },
  };
};

/* --------------------------------- text --------------------------------- */

export function TextNode({ layer, ctx }: { layer: TextLayer; ctx: NodeCtx }) {
  const ref = useRef<Konva.Text>(null);
  const isGradient = typeof layer.fill === "object";
  const [h, setH] = useState(layer.fontSize * layer.lineHeight);
  useLayoutEffect(() => {
    if (isGradient && ref.current) {
      const nh = ref.current.height();
      if (Math.abs(nh - h) > 0.5) setH(nh);
    }
  });
  let text = layer.text;
  if (ctx.guestSample && text.includes(GUEST_TOKEN)) text = text.split(GUEST_TOKEN).join(ctx.guestSample);
  if (layer.uppercase) text = text.toUpperCase();
  const sh = layer.shadow;
  return (
    <Text
      ref={ref}
      {...common(layer, ctx)}
      text={text}
      width={layer.width}
      fontFamily={`"${layer.fontFamily}"`}
      fontSize={layer.fontSize}
      fontStyle={konvaFontStyle(layer.fontWeight, layer.italic)}
      align={layer.align}
      letterSpacing={layer.letterSpacing}
      lineHeight={layer.lineHeight}
      wrap="word"
      {...fillProps(layer.fill, layer.width, h)}
      {...(sh
        ? {
            shadowColor: sh.color,
            shadowBlur: sh.blur,
            shadowOffsetX: sh.offsetX,
            shadowOffsetY: sh.offsetY,
            shadowOpacity: sh.opacity,
          }
        : {})}
      onDblClick={() => ctx.interactive && !layer.locked && ctx.onEditText?.(layer.id)}
      onDblTap={() => ctx.interactive && !layer.locked && ctx.onEditText?.(layer.id)}
    />
  );
}

/* --------------------------------- shape -------------------------------- */

export function ShapeNode({ layer, ctx }: { layer: ShapeLayer; ctx: NodeCtx }) {
  const stroke = strokeProps(layer.stroke, layer.strokeWidth);
  const dash = layer.dash ? { dash: layer.dash } : {};
  if (layer.shape === "ellipse") {
    return (
      <Ellipse
        {...common(layer, ctx)}
        offsetX={-layer.width / 2}
        offsetY={-layer.height / 2}
        radiusX={layer.width / 2}
        radiusY={layer.height / 2}
        {...fillProps(layer.fill, layer.width, layer.height, "center")}
        {...stroke}
        {...dash}
      />
    );
  }
  return (
    <Rect
      {...common(layer, ctx)}
      width={layer.width}
      height={layer.height}
      cornerRadius={Math.min(layer.cornerRadius, Math.min(layer.width, layer.height) / 2)}
      {...fillProps(layer.fill, layer.width, layer.height)}
      {...stroke}
      {...dash}
    />
  );
}

/* ------------------------------- ornament ------------------------------- */

export function OrnamentNode({ layer, ctx }: { layer: OrnamentLayer; ctx: NodeCtx }) {
  const sx = layer.width / layer.vbW;
  const sy = layer.height / layer.vbH;
  return (
    <Group
      {...common(layer, ctx)}
      scaleX={layer.flipX ? -sx : sx}
      scaleY={layer.flipY ? -sy : sy}
      offsetX={layer.flipX ? layer.vbW : 0}
      offsetY={layer.flipY ? layer.vbH : 0}
    >
      {layer.parts.map((pt, i) => (
        <Path
          key={i}
          data={pt.d}
          opacity={pt.opacity ?? 1}
          lineCap={pt.lineCap ?? "round"}
          lineJoin={pt.lineJoin ?? "round"}
          hitStrokeWidth={Math.max(pt.strokeWidth, 14 / Math.max(0.05, Math.min(sx, sy)))}
          {...fillProps(pt.fill, layer.vbW, layer.vbH)}
          {...strokeProps(pt.stroke, pt.strokeWidth)}
          perfectDrawEnabled={false}
        />
      ))}
    </Group>
  );
}

/* --------------------------------- image -------------------------------- */

function maskPath(c: CanvasRenderingContext2D, l: ImageLayer, w: number, h: number) {
  c.beginPath();
  if (l.mask === "ellipse") {
    c.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
  } else if (l.mask === "arch") {
    const r = Math.min(w / 2, h);
    c.moveTo(0, h);
    c.lineTo(0, r);
    c.arc(w / 2, r, w / 2, Math.PI, 0);
    c.lineTo(w, h);
  } else if (l.mask === "rounded" && l.cornerRadius > 0) {
    const r = Math.min(l.cornerRadius, w / 2, h / 2);
    c.roundRect(0, 0, w, h, r);
  } else {
    c.rect(0, 0, w, h);
  }
  c.closePath();
}

export function ImageNode({ layer, ctx }: { layer: ImageLayer; ctx: NodeCtx }) {
  const img = useImage(layer.src);
  return (
    <Shape
      {...common(layer, ctx)}
      width={layer.width}
      height={layer.height}
      fill="#000"
      sceneFunc={(kctx, shape) => {
        const c = (kctx as unknown as { _context: CanvasRenderingContext2D })._context;
        const w = shape.width();
        const h = shape.height();
        c.save();
        maskPath(c, layer, w, h);
        c.clip();
        if (img) {
          const scale = Math.max(w / img.width, h / img.height) * Math.max(1, layer.zoom);
          const dw = img.width * scale;
          const dh = img.height * scale;
          c.drawImage(img, -(dw - w) * layer.focusX, -(dh - h) * layer.focusY, dw, dh);
        } else {
          c.fillStyle = layer.placeholderFill;
          c.fillRect(0, 0, w, h);
          if (ctx.showHints) {
            c.fillStyle = "rgba(0,0,0,0.35)";
            c.font = `500 ${Math.max(14, Math.min(w, h) * 0.07)}px sans-serif`;
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.fillText("+ Add photo", w / 2, h / 2);
          }
        }
        c.restore();
        if (layer.borderColor && layer.borderWidth > 0) {
          c.save();
          maskPath(c, layer, w, h);
          c.lineWidth = layer.borderWidth * 2;
          c.strokeStyle = layer.borderColor;
          c.clip();
          c.stroke();
          c.restore();
        }
      }}
      hitFunc={(kctx, shape) => {
        const c = (kctx as unknown as { _context: CanvasRenderingContext2D })._context;
        maskPath(c, layer, shape.width(), shape.height());
        kctx.fillShape(shape);
      }}
    />
  );
}

export function LayerNode({ layer, ctx }: { layer: Layer; ctx: NodeCtx }) {
  switch (layer.type) {
    case "text":
      return <TextNode layer={layer} ctx={ctx} />;
    case "shape":
      return <ShapeNode layer={layer} ctx={ctx} />;
    case "ornament":
      return <OrnamentNode layer={layer} ctx={ctx} />;
    case "image":
      return <ImageNode layer={layer} ctx={ctx} />;
  }
}
