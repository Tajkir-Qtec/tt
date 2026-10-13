"use client";
import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
};

export function Btn({ variant = "secondary", size = "md", className, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition active:scale-[.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        size === "sm" && "h-8 px-3 text-[13px]",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-12 px-6 text-base",
        variant === "primary" && "bg-brand text-white shadow-sm hover:bg-brand-dark",
        variant === "gold" && "bg-gold text-white shadow-sm hover:brightness-95",
        variant === "secondary" && "border border-line bg-white text-ink hover:bg-paper-2",
        variant === "ghost" && "text-ink/80 hover:bg-ink/5",
        variant === "danger" && "border border-red-200 bg-white text-red-600 hover:bg-red-50",
        className,
      )}
    />
  );
}

export function IconBtn({
  active,
  className,
  label,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean; label: string }) {
  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      className={clsx(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-ink/75 transition hover:bg-ink/5 disabled:pointer-events-none disabled:opacity-35",
        active && "bg-brand/10 text-brand",
        className,
      )}
    />
  );
}

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink/50", className)}>{children}</div>;
}

export function Section({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={clsx("border-b border-line px-4 py-4", className)}>
      {title && <Label>{title}</Label>}
      {children}
    </div>
  );
}

export function NumberField({
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  className?: string;
}) {
  const [text, setText] = useState(String(Math.round(value * 100) / 100));
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setText(String(Math.round(value * 100) / 100));
  }, [value, focused]);
  return (
    <div className={clsx("relative", className)}>
      <input
        type="number"
        inputMode="decimal"
        value={text}
        min={min}
        max={max}
        step={step}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          setText(e.target.value);
          const n = parseFloat(e.target.value);
          if (Number.isFinite(n)) onChange(Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n)));
        }}
        className="h-9 w-full rounded-lg border border-line bg-white px-2.5 text-sm tabular-nums outline-none focus:border-brand"
      />
      {suffix && <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-xs text-ink/40">{suffix}</span>}
    </div>
  );
}

export function Range({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  display,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
  display?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between text-xs text-ink/70">
        <span>{label}</span>
        <span className="tabular-nums text-ink/50">{display ?? Math.round(value * 100) / 100}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="range w-full"
      />
    </label>
  );
}

export function Segmented<T extends string | number>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode; title?: string }[];
  className?: string;
}) {
  return (
    <div className={clsx("flex rounded-lg border border-line bg-paper-2 p-0.5", className)}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          title={o.title}
          onClick={() => onChange(o.value)}
          className={clsx(
            "flex h-8 flex-1 items-center justify-center rounded-md px-2 text-[13px] transition",
            o.value === value ? "bg-white font-medium text-ink shadow-sm" : "text-ink/60 hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between py-1 text-sm text-ink/80"
    >
      <span>{label}</span>
      <span className={clsx("relative h-5 w-9 rounded-full transition", checked ? "bg-brand" : "bg-ink/20")}>
        <span className={clsx("absolute top-0.5 size-4 rounded-full bg-white shadow transition-all", checked ? "left-[18px]" : "left-0.5")} />
      </span>
    </button>
  );
}

/** Closes when clicking outside. */
export function useOutside<T extends HTMLElement>(onOutside: () => void, active: boolean) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!active) return;
    const h = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener("pointerdown", h);
    return () => document.removeEventListener("pointerdown", h);
  }, [active, onOutside]);
  return ref;
}

export function Spinner({ className }: { className?: string }) {
  return <span className={clsx("inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent", className)} />;
}

export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone, message]);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[100] flex justify-center px-4 lg:bottom-6">
      <div className="pointer-events-auto rounded-full bg-ink px-5 py-2.5 text-sm text-white shadow-lg">{message}</div>
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onPointerDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onPointerDown={(e) => e.stopPropagation()}
        className={clsx(
          "max-h-[92svh] w-full overflow-y-auto rounded-t-3xl bg-paper p-5 shadow-2xl sm:rounded-3xl sm:p-7",
          wide ? "sm:max-w-2xl" : "sm:max-w-lg",
        )}
      >
        {title && (
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold">{title}</h2>
            <button onClick={onClose} aria-label="Close" className="-mr-1 rounded-full p-1.5 text-ink/50 hover:bg-ink/5">
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
