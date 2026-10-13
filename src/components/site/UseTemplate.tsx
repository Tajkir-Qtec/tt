"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Btn, Spinner } from "@/components/ui/kit";
import { api } from "@/lib/client/api";

/** Creates a card from a template (or a blank canvas) and opens it in the editor. */
export function UseTemplateButton({
  templateSlug,
  blank,
  label = "Use this template",
  size = "lg",
  variant = "primary",
  className,
}: {
  templateSlug?: string;
  blank?: { width: number; height: number };
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "gold";
  className?: string;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const go = async () => {
    setError("");
    if (!user) {
      const next = window.location.pathname + window.location.search;
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    setBusy(true);
    try {
      const { card } = await api<{ card: { id: string } }>("/api/cards", { method: "POST", json: { templateSlug, blank } });
      router.push(`/editor/${card.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setBusy(false);
    }
  };

  return (
    <div className={className}>
      <Btn variant={variant} size={size} onClick={go} disabled={busy || loading}>
        {busy ? <Spinner /> : null} {label} {!busy && <ArrowRight className="size-4" />}
      </Btn>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
