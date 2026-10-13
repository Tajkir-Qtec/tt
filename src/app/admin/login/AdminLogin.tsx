"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Btn, Spinner } from "@/components/ui/kit";
import { api } from "@/lib/client/api";

/** Separate sign-in for the administrator panel. Regular users sign in at /login. */
export default function AdminLogin() {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Once signed in, confirm this account is an administrator before entering.
  useEffect(() => {
    if (auth.loading || !auth.user) return;
    let alive = true;
    setBusy(true);
    api("/api/admin/me")
      .then(() => alive && router.replace("/admin"))
      .catch(async () => {
        if (!alive) return;
        await auth.signOut();
        setError("This account isn’t an administrator. Sign in with an admin account.");
        setBusy(false);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.loading, auth.user]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      const code = (e as { code?: string })?.code ?? "";
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") setError("");
      else if (code.startsWith("auth/")) setError("That email or password isn’t right.");
      else setError(e instanceof Error ? e.message : "Something went wrong.");
      setBusy(false);
    }
  };

  const field = "h-12 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-[15px] text-white outline-none placeholder:text-white/35 focus:border-white/40";

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#15131a] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center text-white">
          <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-white/10">
            <ShieldCheck className="size-6" />
          </span>
          <h1 className="font-display text-4xl font-semibold">Admin sign in</h1>
          <p className="mt-2 text-sm text-white/55">Marriage Cards administration</p>
        </div>

        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            run(() => auth.signInEmail(email.trim(), password));
          }}
        >
          <input className={field} type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
          <input className={field} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Btn variant="primary" size="lg" type="submit" disabled={busy}>
            {busy && <Spinner />} Sign in
          </Btn>
          <div className="my-1 flex items-center gap-3 text-xs text-white/35">
            <span className="h-px flex-1 bg-white/15" /> or <span className="h-px flex-1 bg-white/15" />
          </div>
          <button
            type="button"
            disabled={busy || !auth.configured}
            onClick={() => run(() => auth.signInGoogle())}
            className="h-12 rounded-xl border border-white/20 text-[15px] text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            Continue with Google
          </button>
        </form>
        {!auth.configured && <p className="mt-4 text-center text-xs text-white/40">Firebase isn’t configured yet.</p>}
      </div>
    </div>
  );
}
