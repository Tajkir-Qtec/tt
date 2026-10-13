"use client";
import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Download, ExternalLink, Mail, MessageCircle, QrCode, Share2, Users } from "lucide-react";
import { Btn, Label } from "@/components/ui/kit";
import { sanitizeGuestName } from "@/lib/design/layers";
import { qrPngDataUrl } from "@/lib/qr";

export function cardUrl(slug: string, guest?: string) {
  const base = `${window.location.origin}/c/${slug}`;
  const g = sanitizeGuestName(guest);
  return g ? `${base}?to=${encodeURIComponent(g)}` : base;
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

export function SharePanel({ slug, title, hasGuestSlot }: { slug: string; title: string; hasGuestSlot: boolean }) {
  const [guest, setGuest] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [bulk, setBulk] = useState("");
  const link = typeof window === "undefined" ? "" : cardUrl(slug, guest);
  const [qr, setQr] = useState("");
  useEffect(() => {
    if (!link) return;
    let alive = true;
    qrPngDataUrl(cardUrl(slug)).then((u) => alive && setQr(u));
    return () => {
      alive = false;
    };
  }, [slug, link]);
  const canNativeShare = typeof navigator !== "undefined" && "share" in navigator;

  const flash = (k: string) => {
    setCopied(k);
    setTimeout(() => setCopied((c) => (c === k ? null : c)), 1800);
  };

  const message = `${guest ? `Dear ${sanitizeGuestName(guest)}, you` : "You"} are warmly invited! Please open your invitation: ${link}`;

  const bulkRows = useMemo(
    () =>
      bulk
        .split("\n")
        .map((n) => sanitizeGuestName(n))
        .filter(Boolean)
        .slice(0, 500),
    [bulk],
  );

  return (
    <div className="grid gap-5">
      <div>
        <Label>Your public link</Label>
        <div className="flex gap-2">
          <input readOnly value={cardUrl(slug)} onFocus={(e) => e.target.select()} className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-paper-2 px-3 text-sm" />
          <Btn
            variant="primary"
            onClick={async () => {
              await copy(cardUrl(slug));
              flash("main");
            }}
          >
            {copied === "main" ? <Check className="size-4" /> : <Copy className="size-4" />} {copied === "main" ? "Copied" : "Copy"}
          </Btn>
        </div>
        <p className="mt-1.5 text-xs text-ink/50">Anyone with this link can view your card — no sign-in needed.</p>
      </div>

      <div className="rounded-2xl border border-line bg-white p-4">
        <Label>Personalise for a guest</Label>
        <input
          value={guest}
          onChange={(e) => setGuest(e.target.value)}
          placeholder="Guest or family name, e.g. Sarah Khan"
          maxLength={40}
          className="h-10 w-full rounded-lg border border-line px-3 text-sm outline-none focus:border-brand"
        />
        {!hasGuestSlot && (
          <p className="mt-2 rounded-lg bg-amber-50 p-2.5 text-xs leading-relaxed text-amber-800">
            Your card has no guest-name spot yet, so the name won’t appear. In the editor open <b>Text → Guest name</b> to add “Dear {"{to}"},” where you’d like it.
          </p>
        )}
        <div className="mt-3 break-all rounded-lg bg-paper-2 p-2.5 font-mono text-[11.5px] text-ink/70">{link}</div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Btn
            size="sm"
            onClick={async () => {
              await copy(link);
              flash("guest");
            }}
          >
            {copied === "guest" ? <Check className="size-4" /> : <Copy className="size-4" />} Copy
          </Btn>
          <a
            className="inline-flex h-8 items-center justify-center gap-2 rounded-full border border-line bg-white px-3 text-[13px] font-medium hover:bg-paper-2"
            href={`https://wa.me/?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="size-4 text-green-600" /> WhatsApp
          </a>
          <a
            className="inline-flex h-8 items-center justify-center gap-2 rounded-full border border-line bg-white px-3 text-[13px] font-medium hover:bg-paper-2"
            href={`mailto:?subject=${encodeURIComponent(`You're invited — ${title}`)}&body=${encodeURIComponent(message)}`}
          >
            <Mail className="size-4" /> Email
          </a>
          {canNativeShare ? (
            <Btn size="sm" onClick={() => navigator.share({ title, text: message, url: link }).catch(() => {})}>
              <Share2 className="size-4" /> More…
            </Btn>
          ) : (
            <a
              className="inline-flex h-8 items-center justify-center gap-2 rounded-full border border-line bg-white px-3 text-[13px] font-medium hover:bg-paper-2"
              href={link}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="size-4" /> Open
            </a>
          )}
        </div>
      </div>

      <details className="rounded-2xl border border-line bg-white p-4">
        <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium">
          <QrCode className="size-4 text-brand" /> QR code for printed cards &amp; posters
        </summary>
        <div className="mt-3 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {qr && <img src={qr} alt="QR code for your invitation link" className="size-36 rounded-lg border border-line" />}
          <div className="text-sm text-ink/60">
            <p>Scan to open your invitation. Put it on a printed card, a banner or a table sign.</p>
            {qr && (
              <a href={qr} download={`${slug}-qr.png`} className="mt-3 inline-flex h-8 items-center gap-2 rounded-full border border-line bg-white px-3 text-[13px] font-medium text-ink hover:bg-paper-2">
                <Download className="size-4" /> Download PNG
              </a>
            )}
            <p className="mt-2 text-xs text-ink/45">You can also add this code onto the card itself: Elements → QR code.</p>
          </div>
        </div>
      </details>

      <details className="rounded-2xl border border-line bg-white p-4">
        <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium">
          <Users className="size-4 text-brand" /> Many guests? Make a personal link for each
        </summary>
        <p className="mt-2 text-xs text-ink/55">Paste names, one per line. Copy the list into WhatsApp, a sheet, or an email merge.</p>
        <textarea
          value={bulk}
          onChange={(e) => setBulk(e.target.value)}
          rows={5}
          placeholder={"Sarah Khan\nThe Rahman Family\nUncle Tariq"}
          className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
        />
        {bulkRows.length > 0 && (
          <>
            <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-line text-xs">
              {bulkRows.map((n, i) => (
                <div key={i} className="flex items-center gap-2 border-b border-line px-2.5 py-1.5 last:border-0">
                  <span className="w-32 shrink-0 truncate font-medium">{n}</span>
                  <span className="min-w-0 flex-1 truncate text-ink/50">{cardUrl(slug, n)}</span>
                  <button
                    className="shrink-0 text-brand hover:underline"
                    onClick={async () => {
                      await copy(cardUrl(slug, n));
                      flash(`b${i}`);
                    }}
                  >
                    {copied === `b${i}` ? "Copied" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
            <Btn
              size="sm"
              className="mt-2"
              onClick={async () => {
                await copy(bulkRows.map((n) => `${n}\t${cardUrl(slug, n)}`).join("\n"));
                flash("all");
              }}
            >
              {copied === "all" ? <Check className="size-4" /> : <Copy className="size-4" />} Copy all {bulkRows.length} links
            </Btn>
          </>
        )}
      </details>
    </div>
  );
}
