"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/site/SiteChrome";
import { useAuth } from "@/components/auth/AuthProvider";
import { Btn, Spinner } from "@/components/ui/kit";

function friendly(e: unknown): string {
  const code = (e as { code?: string })?.code ?? "";
  const map: Record<string, string> = {
    "auth/invalid-credential": "That email or password isn’t right.",
    "auth/wrong-password": "That email or password isn’t right.",
    "auth/user-not-found": "No account found with that email.",
    "auth/email-already-in-use": "An account with this email already exists — try signing in.",
    "auth/weak-password": "Please choose a password of at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/popup-closed-by-user": "",
    "auth/cancelled-popup-request": "",
    "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  };
  if (code in map) return map[code];
  return e instanceof Error ? e.message : "Something went wrong. Please try again.";
}

export default function LoginForm() {
  const auth = useAuth();
  const router = useRouter();
  const sp = useSearchParams();
  const raw = sp.get("next") ?? "/dashboard";
  const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";
  const [mode, setMode] = useState<"in" | "up" | "reset">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (!auth.loading && auth.user) router.replace(next);
  }, [auth.loading, auth.user, next, router]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError("");
    setInfo("");
    try {
      await fn();
    } catch (e) {
      setError(friendly(e));
    } finally {
      setBusy(false);
    }
  };

  const field = "h-12 w-full rounded-xl border border-line bg-white px-4 text-[15px] outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10";

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            {mode === "in" ? "Welcome back" : mode === "up" ? "Create your account" : "Reset password"}
          </h1>
          <p className="mt-2 text-ink/60">
            {mode === "reset" ? "We’ll email you a link to choose a new password." : "Sign in to design, save and share your invitations."}
          </p>

          {mode !== "reset" && auth.configured && (
            <>
              <Btn className="mt-7 h-12 w-full" disabled={busy} onClick={() => run(() => auth.signInGoogle())}>
                <svg viewBox="0 0 48 48" className="size-5" aria-hidden>
                  <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.300 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.300-.1-2.600-.4-3.900z" />
                  <path fill="#FF3D00" d="M6.300 14.700l6.600 4.800C14.700 15.100 19 12 24 12c3.100 0 5.800 1.200 8 3l5.700-5.700C34 6.100 29.300 4 24 4 16.300 4 9.700 8.300 6.300 14.700z" />
                  <path fill="#4CAF50" d="M24 44c5.200 0 9.900-2 13.400-5.200l-6.200-5.200C29.200 35 26.700 36 24 36c-5.200 0-9.600-3.300-11.300-7.900l-6.500 5C9.500 39.600 16.200 44 24 44z" />
                  <path fill="#1976D2" d="M43.600 20.100H42V20H24v8h11.300c-.8 2.200-2.200 4.100-4.100 5.600l6.200 5.200C37 39.200 44 34 44 24c0-1.300-.1-2.600-.4-3.900z" />
                </svg>
                Continue with Google
              </Btn>
              <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-ink/35">
                <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
              </div>
            </>
          )}

          {auth.configured ? (
            <form
              className="mt-1 grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                run(async () => {
                  if (mode === "in") await auth.signInEmail(email, password);
                  else if (mode === "up") await auth.signUpEmail(name.trim(), email, password);
                  else {
                    await auth.resetPassword(email);
                    setInfo("Check your inbox for a reset link.");
                  }
                });
              }}
            >
              {mode === "up" && <input className={field} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />}
              <input className={field} type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              {mode !== "reset" && (
                <input
                  className={field}
                  type="password"
                  required
                  minLength={6}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "in" ? "current-password" : "new-password"}
                />
              )}
              {error && <p className="text-sm text-red-600">{error}</p>}
              {info && <p className="text-sm text-green-700">{info}</p>}
              <Btn variant="primary" size="lg" className="mt-1 w-full" disabled={busy} type="submit">
                {busy && <Spinner />} {mode === "in" ? "Sign in" : mode === "up" ? "Create account" : "Send reset link"}
              </Btn>
            </form>
          ) : (
            <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
              <b>Sign-in isn’t set up yet.</b> Add your Firebase keys to <code>.env.local</code> (see <code>.env.example</code>) and restart.
              {auth.devBypass && (
                <Btn variant="primary" className="mt-3 w-full" onClick={() => auth.signInDemo()}>
                  Continue as demo user (dev only)
                </Btn>
              )}
            </div>
          )}

          {auth.configured && (
            <div className="mt-6 flex flex-wrap justify-between gap-2 text-sm text-ink/60">
              {mode === "in" ? (
                <>
                  <button className="hover:text-brand" onClick={() => (setMode("up"), setError(""))}>
                    New here? Create an account
                  </button>
                  <button className="hover:text-brand" onClick={() => (setMode("reset"), setError(""))}>
                    Forgot password?
                  </button>
                </>
              ) : (
                <button className="hover:text-brand" onClick={() => (setMode("in"), setError(""), setInfo(""))}>
                  ← Back to sign in
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="relative hidden bg-[radial-gradient(80%_60%_at_30%_20%,#f3dfe3,transparent),linear-gradient(160deg,#efe3c9,#e8c9cf)] lg:block">
        <div className="absolute inset-0 flex items-center justify-center p-16">
          <div className="max-w-md text-center">
            <p className="font-display text-5xl font-semibold italic leading-tight text-ink/80">“The most beautiful way to say <span className="text-brand">you’re invited</span>.”</p>
            <p className="mt-6 text-sm uppercase tracking-[0.3em] text-ink/45">Marriage Cards</p>
          </div>
        </div>
      </div>
    </div>
  );
}
