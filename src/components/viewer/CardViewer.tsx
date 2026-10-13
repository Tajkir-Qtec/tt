"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Link2, PartyPopper, Share2, Check } from "lucide-react";
import { clsx } from "clsx";
import { Btn, Spinner } from "@/components/ui/kit";
import { applyGuestName, sanitizeGuestName } from "@/lib/design/layers";
import { renderPages } from "@/lib/render";
import { downloadCardPdf } from "@/lib/export";
import type { CardDesign, ViewMode } from "@/lib/design/types";
import type { EnvelopeColorId } from "@/lib/envelopes";
import { Envelope } from "./Envelope";
import { RsvpModal, loadSavedRsvp } from "./RsvpModal";
import { ReportModal } from "./ReportModal";

interface Props {
  design: CardDesign;
  viewMode: ViewMode;
  title: string;
  slug?: string;
  /** Guest name override (editor preview). Defaults to the ?to= link parameter. */
  guest?: string;
  /** Hide marketing footer / counters (editor preview). */
  embedded?: boolean;
  rsvpEnabled?: boolean;
  envelope?: { enabled: boolean; color: EnvelopeColorId };
  coupleNames?: string;
}

function usePageImages(design: CardDesign, guest: string) {
  const pages = useMemo(() => applyGuestName(design.pages, guest), [design.pages, guest]);
  const [images, setImages] = useState<string[] | null>(null);
  useEffect(() => {
    let alive = true;
    setImages(null);
    renderPages(pages, design.width, design.height, { pixelRatio: 1.5, quality: 0.9 })
      .then((r) => alive && setImages(r))
      .catch(() => alive && setImages([]));
    return () => {
      alive = false;
    };
  }, [pages, design.width, design.height]);
  return { pages, images };
}

/** Darkened tint from the cover, used as the page backdrop. */
function useBackdrop(src: string | undefined) {
  const [color, setColor] = useState<[number, number, number]>([40, 34, 30]);
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = c.height = 1;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      setColor([Math.round(r * 0.34), Math.round(g * 0.34), Math.round(b * 0.34)]);
    };
    img.src = src;
  }, [src]);
  return color;
}

export function CardViewer(props: Props) {
  const sp = useSearchParams();
  const guest = props.guest ?? sanitizeGuestName(sp.get("to"));
  return <Inner {...props} guest={guest} />;
}

function Inner({ design, viewMode, title, slug, guest, embedded, rsvpEnabled = true, envelope, coupleNames = "" }: Props & { guest: string }) {
  const { pages, images } = usePageImages(design, guest);
  const [r, g, b] = useBackdrop(images?.[0]);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState("");
  const envEnabled = !!envelope?.enabled;
  const [opened, setOpened] = useState(!envEnabled);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [saved, setSaved] = useState<{ name: string; attending: boolean } | null>(null);
  useEffect(() => {
    if (slug) setSaved(loadSavedRsvp(slug));
    if (envEnabled && window.matchMedia("(prefers-reduced-motion: reduce)").matches) setOpened(true);
  }, [slug, envEnabled]);
  const bg = `radial-gradient(120% 90% at 50% 20%, rgb(${r + 22},${g + 20},${b + 18}), rgb(${r},${g},${b}))`;

  useEffect(() => {
    if (embedded || !slug) return;
    try {
      if (sessionStorage.getItem(`viewed:${slug}`)) return;
      sessionStorage.setItem(`viewed:${slug}`, "1");
    } catch {}
    fetch(`/api/public/${slug}/view`, { method: "POST" }).catch(() => {});
  }, [slug, embedded]);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(url);
      setToast("Link copied");
      setTimeout(() => setToast(""), 1800);
    } catch {}
  };

  const download = async () => {
    setDownloading(true);
    try {
      await downloadCardPdf(design, pages, guest ? `${title} - ${guest}` : title);
    } finally {
      setDownloading(false);
    }
  };

  const count = viewMode === "single" ? 1 : pages.length;

  return (
    <div
      className={clsx("relative flex min-h-svh flex-col items-center", embedded && "min-h-full")}
      style={{ background: bg }}
    >
      <div className="flex w-full max-w-3xl flex-1 flex-col items-center px-4 pb-6 pt-6 sm:pt-10">
        {!images ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-white/70">
            <Spinner className="size-6" />
            <span className="text-sm">Opening your invitation…</span>
          </div>
        ) : viewMode === "scroll" ? (
          <ScrollMode images={images} design={design} title={title} />
        ) : viewMode === "flip" && images.length > 1 ? (
          <FlipMode images={images} design={design} title={title} />
        ) : (
          <SingleMode image={images[0]} design={design} title={title} />
        )}
      </div>

      {images && (
        <div className="sticky bottom-0 z-10 flex w-full justify-center px-3 pb-3 pt-2">
          <div className="flex items-center gap-1.5 rounded-full bg-black/55 p-1.5 text-white shadow-xl backdrop-blur-md">
            {rsvpEnabled && (slug || embedded) && (
              <Btn size="sm" variant="ghost" className="!text-white hover:!bg-white/15" onClick={() => setRsvpOpen(true)}>
                {saved ? <Check className="size-4" /> : <PartyPopper className="size-4" />} {saved ? (saved.attending ? "You’re coming" : "Replied") : "Will you join us?"}
              </Btn>
            )}
            <Btn size="sm" variant="ghost" className="!text-white hover:!bg-white/15" onClick={download} disabled={downloading}>
              {downloading ? <Spinner /> : <Download className="size-4" />} Download PDF
            </Btn>
            <Btn size="sm" variant="ghost" className="!text-white hover:!bg-white/15" onClick={share}>
              {typeof navigator !== "undefined" && "share" in navigator ? <Share2 className="size-4" /> : <Link2 className="size-4" />} Share
            </Btn>
          </div>
        </div>
      )}

      {!embedded && (
        <footer className="w-full px-4 pb-8 pt-2 text-center text-xs text-white/55">
          Made with{" "}
          <Link href="/" className="font-medium text-white/80 underline-offset-2 hover:underline">
            Marriage Cards
          </Link>{" "}
          · <Link href="/templates" className="underline-offset-2 hover:underline">Create your own invitation — free</Link>
          {slug && (
            <>
              {" "}
              ·{" "}
              <button onClick={() => setReportOpen(true)} className="underline-offset-2 hover:underline">
                Report
              </button>
            </>
          )}
        </footer>
      )}
      {images && envEnabled && !opened && envelope && (
        <Envelope color={envelope.color} cover={images[0]} toName={guest} fallbackName={coupleNames} backdrop={bg} onOpened={() => setOpened(true)} />
      )}
      {(slug || embedded) && (
        <RsvpModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} slug={slug ?? ""} defaultName={guest} preview={embedded} onSaved={setSaved} />
      )}
      {slug && <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} slug={slug} />}
      {toast && <div className="fixed bottom-20 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm text-ink shadow-lg">{toast}</div>}
      <span className="sr-only" aria-live="polite">{count > 1 ? `${count} pages` : ""}</span>
    </div>
  );
}

/* --------------------------------- modes --------------------------------- */

function frameSize(design: CardDesign, maxVh = 76) {
  const r = design.width / design.height;
  return { width: `min(92vw, 640px, calc(${maxVh}svh * ${r}))`, aspectRatio: `${design.width} / ${design.height}` } as const;
}

function SingleMode({ image, design, title }: { image: string; design: CardDesign; title: string }) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={frameSize(design)}
        className="overflow-hidden rounded-[3px] shadow-[0_30px_80px_rgba(0,0,0,.5)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={`${title} — wedding invitation`} className="size-full select-none" draggable={false} />
      </motion.div>
    </div>
  );
}

function ScrollMode({ images, design, title }: { images: string[]; design: CardDesign; title: string }) {
  return (
    <div className="flex w-full flex-col items-center gap-8 pb-10">
      {images.map((src, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "min(92vw, 600px)", aspectRatio: `${design.width} / ${design.height}` }}
          className="overflow-hidden rounded-[3px] shadow-[0_24px_70px_rgba(0,0,0,.45)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={`${title} — page ${i + 1}`} className="size-full select-none" draggable={false} loading={i === 0 ? "eager" : "lazy"} />
        </motion.div>
      ))}
    </div>
  );
}

function FlipMode({ images, design, title }: { images: string[]; design: CardDesign; title: string }) {
  const [index, setIndex] = useState(0);
  const [hint, setHint] = useState(true);
  const n = images.length;
  const dragged = useRef(false);
  const go = (d: number) => {
    setHint(false);
    setIndex((i) => Math.max(0, Math.min(n - 1, i + d)));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  // A deck of invitation cards: swipe the top card away to reveal the next one.
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 overflow-x-clip">
      <div className="relative" style={frameSize(design)}>
        <button
          aria-label="Previous page"
          onClick={() => go(-1)}
          disabled={index === 0}
          className="absolute -left-2 top-1/2 z-30 hidden size-11 -translate-x-full -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 disabled:opacity-0 md:flex"
        >
          <ChevronLeft />
        </button>
        <button
          aria-label="Next page"
          onClick={() => go(1)}
          disabled={index === n - 1}
          className="absolute -right-2 top-1/2 z-30 hidden size-11 -translate-y-1/2 translate-x-full items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 disabled:opacity-0 md:flex"
        >
          <ChevronRight />
        </button>

        {images.map((src, i) => {
          const d = i - index; // <0 already swiped away, 0 front, >0 waiting in the deck
          const side = i % 2 === 0 ? -1 : 1;
          const gone = d < 0;
          const depth = Math.min(Math.max(d, 0), 3);
          const front = d === 0;
          return (
            <motion.div
              key={i}
              className="absolute inset-0 touch-pan-y select-none overflow-hidden rounded-[4px] bg-white"
              style={{ zIndex: gone ? n + i : n - i, pointerEvents: front ? "auto" : "none", cursor: front ? "grab" : "default", boxShadow: "0 18px 50px rgba(0,0,0,.35), 0 2px 6px rgba(0,0,0,.2)" }}
              initial={false}
              animate={{
                x: gone ? side * 130 + "%" : 0,
                y: gone ? 30 : depth * 12,
                rotate: gone ? side * 16 : front ? 0 : (i % 2 ? 1 : -1) * depth * 1.6,
                scale: gone ? 0.96 : 1 - depth * 0.04,
                opacity: gone ? 0 : d > 3 ? 0 : 1,
              }}
              transition={{ type: "spring", stiffness: 140, damping: 20, mass: 0.9, opacity: { duration: 0.45, delay: gone ? 0.15 : 0 } }}
              drag={front ? "x" : false}
              dragSnapToOrigin
              dragElastic={0.7}
              whileDrag={{ rotate: 0, scale: 1.02 }}
              onDragStart={() => {
                dragged.current = true;
              }}
              onDragEnd={(_, info) => {
                setTimeout(() => (dragged.current = false), 80);
                if (info.offset.x < -70 || info.velocity.x < -450) go(1);
                else if (info.offset.x > 70 || info.velocity.x > 450) go(-1);
              }}
              onTap={(e, info) => {
                if (dragged.current) return;
                const rect = (e.currentTarget as HTMLElement | null)?.getBoundingClientRect?.();
                if (!rect) return go(1);
                go(info.point.x - rect.left > rect.width / 2 ? 1 : -1);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${title} — page ${i + 1}`} className="pointer-events-none size-full" draggable={false} />
            </motion.div>
          );
        })}
      </div>

      <div className="mt-2 flex items-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to page ${i + 1}`}
            onClick={() => (setHint(false), setIndex(i))}
            className={clsx("h-1.5 rounded-full transition-all", i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70")}
          />
        ))}
      </div>
      {hint && index === 0 && <p className="text-xs text-white/60">Swipe the card away, or tap to turn</p>}
    </div>
  );
}
