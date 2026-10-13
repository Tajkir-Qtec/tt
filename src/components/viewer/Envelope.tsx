"use client";
import { useEffect, useState } from "react";
import { ENVELOPES, type EnvelopeColorId } from "@/lib/envelopes";
import { ensureFonts } from "@/lib/design/fonts";

/**
 * Full-screen envelope intro. Tap → the flap opens, the card slides out, then the
 * overlay fades away revealing the real card underneath.
 */
export function Envelope({
  color,
  cover,
  toName,
  fallbackName,
  backdrop,
  onOpened,
}: {
  color: EnvelopeColorId;
  cover: string;
  toName: string;
  fallbackName: string;
  backdrop: string;
  onOpened: () => void;
}) {
  const st = ENVELOPES[color] ?? ENVELOPES.ivory;
  const [phase, setPhase] = useState<"closed" | "open" | "fade">("closed");
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    ensureFonts([{ family: "Great Vibes" }]).then(() => setFontReady(true));
  }, []);

  const open = () => {
    if (phase !== "closed") return;
    setPhase("open");
    setTimeout(() => setPhase("fade"), 1500);
    setTimeout(onOpened, 2200);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => (e.key === "Enter" || e.key === " ") && open();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const isOpen = phase !== "closed";
  const W = "min(86vw, 440px)";
  const addressee = toName || fallbackName;

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center"
      style={{ background: backdrop, opacity: phase === "fade" ? 0 : 1, transition: "opacity 700ms ease", pointerEvents: phase === "fade" ? "none" : "auto" }}
    >
      <button
        onClick={open}
        aria-label="Open your invitation"
        className="relative cursor-pointer outline-none"
        style={{ width: W, aspectRatio: "10 / 6.8", perspective: 1400, transform: isOpen ? "translateY(40px)" : "translateY(0)", transition: "transform 900ms ease 700ms" }}
      >
        <div className="absolute inset-0 animate-[float_4s_ease-in-out_infinite] drop-shadow-[0_30px_50px_rgba(0,0,0,.45)]" style={{ animationPlayState: isOpen ? "paused" : "running" }}>
          {/* back panel */}
          <div className="absolute inset-0 rounded-[6px]" style={{ background: st.back }} />

          {/* the card: tucked inside the pocket, then slides up and grows */}
          <div
            className="absolute inset-x-0 flex justify-center"
            style={{
              bottom: "7%",
              height: "84%",
              transformOrigin: "50% 100%",
              transform: isOpen ? "translateY(-58%) scale(1.28)" : "translateY(0) scale(1)",
              transition: "transform 1100ms cubic-bezier(.22,1,.36,1) 550ms",
              zIndex: 2,
            }}
          >
            <div className="h-full overflow-hidden rounded-[3px] shadow-[0_4px_20px_rgba(0,0,0,.3)]" style={{ aspectRatio: "5 / 7" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt="" className="size-full object-cover" draggable={false} />
            </div>
          </div>

          {/* front pocket */}
          <div
            className="absolute inset-0 rounded-[6px]"
            style={{ zIndex: 3, background: st.body, clipPath: "polygon(0 0, 50% 58%, 100% 0, 100% 100%, 0 100%)", boxShadow: "inset 0 -30px 60px rgba(0,0,0,.08)" }}
          />
          {/* pocket fold lines */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              zIndex: 3,
              background: `linear-gradient(to top right, transparent calc(50% - 0.5px), ${st.liner}55 50%, transparent calc(50% + 0.5px)) left/50% 100% no-repeat, linear-gradient(to top left, transparent calc(50% - 0.5px), ${st.liner}55 50%, transparent calc(50% + 0.5px)) right/50% 100% no-repeat`,
              clipPath: "polygon(0 0, 50% 58%, 100% 0, 100% 100%, 0 100%)",
              opacity: 0.6,
            }}
          />

          {/* addressee */}
          {addressee && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-[10%] z-[4] px-6 text-center"
              style={{ color: st.text, opacity: isOpen ? 0 : 1, transition: "opacity 400ms" }}
            >
              <div className="text-[10px] uppercase tracking-[0.35em] opacity-70">{toName ? "For" : "The wedding of"}</div>
              <div className="mt-1 truncate text-[34px] leading-tight" style={{ fontFamily: fontReady ? '"Great Vibes", cursive' : "serif" }}>
                {addressee}
              </div>
            </div>
          )}

          {/* flap */}
          <div
            className="absolute inset-x-0 top-0"
            style={{
              height: "62%",
              transformOrigin: "50% 0",
              transformStyle: "preserve-3d",
              transform: isOpen ? "rotateX(180deg)" : "rotateX(0deg)",
              transition: "transform 800ms cubic-bezier(.5,0,.2,1) 150ms",
              zIndex: phase === "closed" ? 5 : 1,
              transitionProperty: "transform",
            }}
          >
            <div
              className="absolute inset-0"
              style={{ background: st.flap, clipPath: "polygon(0 0, 100% 0, 50% 93.5%)", backfaceVisibility: "hidden", filter: "drop-shadow(0 6px 6px rgba(0,0,0,.18))" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(160deg, ${st.flapInner}, ${st.back})`,
                clipPath: "polygon(0 0, 100% 0, 50% 93.5%)",
                transform: "rotateX(180deg)",
                backfaceVisibility: "hidden",
              }}
            />
          </div>

          {/* wax seal */}
          <div
            className="absolute left-1/2 z-[6] flex size-[58px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
            style={{
              top: "58%",
              background: `radial-gradient(circle at 35% 30%, ${st.seal}, ${st.seal}cc 60%, ${st.seal}99)`,
              boxShadow: "0 4px 10px rgba(0,0,0,.4), inset 0 2px 3px rgba(255,255,255,.35), inset 0 -3px 5px rgba(0,0,0,.3)",
              opacity: isOpen ? 0 : 1,
              transform: `translate(-50%, -50%) scale(${isOpen ? 0.6 : 1})`,
              transition: "opacity 250ms, transform 250ms",
              color: st.sealText,
            }}
          >
            <svg viewBox="0 0 64 64" className="size-6" aria-hidden>
              <path d="M32 49C14 36 15 22 24 18c4-1.6 7 .5 8 4 1-3.5 4-5.6 8-4 9 4 10 18-8 31z" fill="currentColor" />
            </svg>
          </div>
        </div>
      </button>

      <p
        className="mt-14 animate-pulse text-sm tracking-[0.25em] text-white/75 uppercase"
        style={{ opacity: isOpen ? 0 : 1, transition: "opacity 300ms" }}
      >
        Tap to open
      </p>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}@media (prefers-reduced-motion: reduce){.animate-\\[float_4s_ease-in-out_infinite\\]{animation:none}}`}</style>
    </div>
  );
}
