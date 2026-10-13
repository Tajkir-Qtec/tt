"use client";
import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { clsx } from "clsx";
import { Btn, Modal, Spinner } from "@/components/ui/kit";

interface Saved {
  name: string;
  attending: boolean;
  maybe?: boolean;
}

export function loadSavedRsvp(slug: string): Saved | null {
  try {
    const raw = localStorage.getItem(`rsvp:${slug}`);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

/** Simple, optional reply: coming (name, phone, how many) or can't make it (name). */
export function RsvpModal({
  open,
  onClose,
  slug,
  defaultName,
  preview,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  slug: string;
  defaultName: string;
  preview?: boolean;
  onSaved: (s: Saved) => void;
}) {
  const [choice, setChoice] = useState<"yes" | "maybe" | "no" | null>(null);
  const attending = choice === null ? null : choice === "yes";
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(1);
  const [website, setWebsite] = useState(""); // honeypot
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<Saved | null>(null);

  const field = "h-12 w-full rounded-xl border border-line bg-white px-4 text-[16px] outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10";

  const submit = async () => {
    setError("");
    if (attending === null) return setError("Please choose one of the options above.");
    if (!name.trim()) return setError("Please enter your name.");
    if (attending && phone.replace(/\D/g, "").length < 6) return setError("Please add a phone number.");
    if (preview) return setError("This is only a preview — replies are switched off here.");
    setBusy(true);
    try {
      const res = await fetch(`/api/public/${slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attending, maybe: choice === "maybe", name: name.trim(), phone: attending ? phone : phone || "", guests: attending ? guests : 1, from: defaultName, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      const saved = { name: name.trim(), attending, maybe: choice === "maybe" };
      try {
        localStorage.setItem(`rsvp:${slug}`, JSON.stringify(saved));
      } catch {}
      onSaved(saved);
      setDone(saved);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={done ? undefined : "Will you join us?"}>
      {done ? (
        <div className="py-6 text-center">
          <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-green-100 text-green-700">
            <Check className="size-7" />
          </span>
          <h2 className="font-display text-3xl font-semibold">Thank you, {done.name.split(" ")[0]}!</h2>
          <p className="mt-2 text-ink/65">{done.attending ? "We can’t wait to celebrate with you." : done.maybe ? "No problem — you can change your reply any time." : "We’ll miss you — thank you for letting us know."}</p>
          <div className="mt-6 flex justify-center gap-2">
            <Btn onClick={() => setDone(null)}>Change my reply</Btn>
            <Btn variant="primary" onClick={onClose}>
              Close
            </Btn>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          <p className="-mt-2 text-sm text-ink/60">Totally optional — just a quick way to let the family know.</p>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["yes", "I’ll be there", "🎉"],
                ["maybe", "Not sure yet", "🤔"],
                ["no", "Can’t make it", "💌"],
              ] as const
            ).map(([v, label, emoji]) => (
              <button
                key={label}
                onClick={() => setChoice(v)}
                className={clsx(
                  "flex flex-col items-center gap-1 rounded-2xl border-2 px-3 py-4 text-[15px] font-medium transition",
                  choice === v ? "border-brand bg-brand/5 text-brand" : "border-line bg-white text-ink/75 hover:border-ink/30",
                )}
              >
                <span className="text-2xl">{emoji}</span>
                {label}
              </button>
            ))}
          </div>

          {attending !== null && (
            <>
              <input className={field} placeholder="Your name" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              {attending && (
                <>
                  <input
                    className={field}
                    type="tel"
                    inputMode="tel"
                    placeholder="Phone number"
                    value={phone}
                    maxLength={24}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                  />
                  <div className="flex items-center justify-between rounded-xl border border-line bg-white px-4 py-2.5">
                    <div>
                      <div className="text-[15px] font-medium">How many people?</div>
                      <div className="text-xs text-ink/50">Including you</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button aria-label="Fewer" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="flex size-10 items-center justify-center rounded-full border border-line hover:bg-paper-2">
                        <Minus className="size-4" />
                      </button>
                      <span className="w-6 text-center text-xl font-semibold tabular-nums">{guests}</span>
                      <button aria-label="More" onClick={() => setGuests((g) => Math.min(20, g + 1))} className="flex size-10 items-center justify-center rounded-full border border-line hover:bg-paper-2">
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
              {/* honeypot — hidden from people */}
              <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Btn variant="primary" size="lg" onClick={submit} disabled={busy}>
                {busy && <Spinner />} Send reply
              </Btn>
            </>
          )}
          {attending === null && error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      )}
    </Modal>
  );
}
