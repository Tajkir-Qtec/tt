"use client";
import { useState } from "react";
import { Btn, Modal, Spinner } from "@/components/ui/kit";

const REASONS: [string, string][] = [
  ["offensive", "Offensive or hateful"],
  ["spam", "Spam or scam"],
  ["private-info", "Shares private information"],
  ["impersonation", "Pretends to be someone else"],
  ["other", "Something else"],
];

export function ReportModal({ open, onClose, slug }: { open: boolean; onClose: () => void; slug: string }) {
  const [reason, setReason] = useState("offensive");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  return (
    <Modal open={open} onClose={onClose} title="Report this card">
      {done ? (
        <div className="py-4 text-center">
          <p className="text-ink/70">Thank you. Our team will take a look.</p>
          <Btn className="mt-5" variant="primary" onClick={onClose}>
            Close
          </Btn>
        </div>
      ) : (
        <div className="grid gap-3">
          {REASONS.map(([id, label]) => (
            <label key={id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-[15px] has-[:checked]:border-brand has-[:checked]:bg-brand/5">
              <input type="radio" name="reason" checked={reason === id} onChange={() => setReason(id)} className="accent-[var(--brand)]" /> {label}
            </label>
          ))}
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Anything else we should know? (optional)"
            maxLength={500}
            rows={3}
            className="rounded-xl border border-line bg-white px-4 py-3 text-[15px] outline-none focus:border-brand"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Btn
            variant="primary"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                const res = await fetch(`/api/public/${slug}/report`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason, details }) });
                if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Could not send report");
                setDone(true);
              } catch (e) {
                setError(e instanceof Error ? e.message : "Could not send report");
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy && <Spinner />} Send report
          </Btn>
        </div>
      )}
    </Modal>
  );
}
