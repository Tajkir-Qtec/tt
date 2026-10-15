"use client";
import { useEffect, useRef, useState } from "react";

export interface Point {
  label: string;
  value: number;
}

const nice = (max: number) => {
  if (max <= 4) return 4;
  const p = Math.pow(10, Math.floor(Math.log10(max)));
  const n = max / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
};

/** Thin single-series area chart with a hover crosshair and tooltip. Colour comes from `currentColor`. */
export function AreaChart({ data, height = 230, noun = "" }: { data: Point[]; height?: number; noun?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(640);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(Math.max(280, el.clientWidth)));
    ro.observe(el);
    setW(Math.max(280, el.clientWidth));
    return () => ro.disconnect();
  }, []);

  const padL = 34;
  const padR = 8;
  const padT = 10;
  const padB = 24;
  const iw = w - padL - padR;
  const ih = height - padT - padB;
  const max = nice(Math.max(1, ...data.map((d) => d.value)));
  const x = (i: number) => padL + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw);
  const y = (v: number) => padT + ih - (v / max) * ih;
  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(d.value).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1).toFixed(1)} ${padT + ih} L${x(0).toFixed(1)} ${padT + ih} Z`;
  const ticks = [0, 0.5, 1].map((t) => Math.round(max * t));
  const every = Math.max(1, Math.ceil(data.length / Math.floor(iw / 70)));

  const onMove = (e: React.PointerEvent) => {
    const r = (e.currentTarget as SVGElement).getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left - padL) / iw) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  };
  const h = hover !== null ? data[hover] : null;

  return (
    <div ref={box} className="relative text-brand" style={{ height }}>
      <svg width={w} height={height} className="touch-none overflow-visible" onPointerMove={onMove} onPointerLeave={() => setHover(null)} role="img" aria-label={`${noun} over time`}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity=".22" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={w - padR} y1={y(t)} y2={y(t)} className="stroke-ink/10" strokeDasharray={t ? "3 4" : undefined} />
            <text x={padL - 8} y={y(t) + 4} textAnchor="end" className="fill-ink/45 text-[10px]">
              {t >= 1000 ? `${t / 1000}k` : t}
            </text>
          </g>
        ))}
        {data.map((d, i) =>
          i % every === 0 || i === data.length - 1 ? (
            <text key={d.label} x={x(i)} y={height - 6} textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"} className="fill-ink/45 text-[10px]">
              {d.label}
            </text>
          ) : null,
        )}
        <path d={area} fill="url(#areaFill)" />
        <path d={line} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {h && hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={padT} y2={padT + ih} className="stroke-ink/25" />
            <circle cx={x(hover)} cy={y(h.value)} r="4.5" fill="currentColor" className="stroke-white" strokeWidth="2" />
          </g>
        )}
        <rect x={padL} y={padT} width={iw} height={ih} fill="transparent" />
      </svg>
      {h && hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-xs text-white shadow-lg"
          style={{ left: Math.min(w - 60, Math.max(60, x(hover))), top: Math.max(0, y(h.value) - 46) }}
        >
          <div className="text-white/60">{h.label}</div>
          <div className="font-medium tabular-nums">
            {h.value.toLocaleString()} {noun}
          </div>
        </div>
      )}
    </div>
  );
}

/** Tiny trend line for KPI tiles. */
export function Spark({ values, className = "text-brand" }: { values: number[]; className?: string }) {
  const w = 96;
  const h = 28;
  const max = Math.max(1, ...values);
  const pts = values.map((v, i) => `${i ? "L" : "M"}${((i / Math.max(1, values.length - 1)) * w).toFixed(1)} ${(h - 3 - (v / max) * (h - 6)).toFixed(1)}`).join(" ");
  return (
    <svg width={w} height={h} className={className} aria-hidden>
      <path d={pts} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Horizontal ranked bars. */
export function BarList({ rows, format = (n: number) => n.toLocaleString() }: { rows: { label: string; value: number; sub?: string }[]; format?: (n: number) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="grid gap-3">
      {rows.map((r) => (
        <li key={r.label} title={`${r.label}: ${format(r.value)}`}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate">{r.label}</span>
            <span className="shrink-0 tabular-nums text-ink/60">
              {format(r.value)}
              {r.sub && <span className="ml-1.5 text-xs text-ink/40">{r.sub}</span>}
            </span>
          </div>
          <div className="h-2 rounded-full bg-ink/6">
            <div className="h-2 rounded-r-full rounded-l-full bg-brand" style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
