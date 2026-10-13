"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile,
} from "firebase/auth";
import { devBypass, firebaseConfigured, getFirebaseAuth } from "@/lib/client/firebase";

export interface AppUser {
  uid: string;
  email: string | null;
  name: string | null;
  photo: string | null;
}

interface AuthCtx {
  user: AppUser | null;
  loading: boolean;
  configured: boolean;
  devBypass: boolean;
  signInGoogle: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInDemo: () => void;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const Ctx = createContext<AuthCtx | null>(null);
const DEMO_KEY = "mc-demo-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      try {
        if (devBypass && localStorage.getItem(DEMO_KEY)) {
          setUser({ uid: "demo", email: "demo@example.com", name: "Demo User", photo: null });
        }
      } catch {}
      setLoading(false);
      return;
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u ? { uid: u.uid, email: u.email, name: u.displayName, photo: u.photoURL } : null);
      setLoading(false);
    });
  }, []);

  const need = () => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Sign-in isn't configured yet. Add your Firebase keys to .env.local.");
    return auth;
  };

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      loading,
      configured: firebaseConfigured,
      devBypass,
      signInGoogle: async () => {
        await signInWithPopup(need(), new GoogleAuthProvider());
      },
      signInEmail: async (email, password) => {
        await signInWithEmailAndPassword(need(), email, password);
      },
      signUpEmail: async (name, email, password) => {
        const cred = await createUserWithEmailAndPassword(need(), email, password);
        if (name) await updateProfile(cred.user, { displayName: name });
        setUser({ uid: cred.user.uid, email: cred.user.email, name: name || null, photo: null });
      },
      resetPassword: async (email) => {
        await sendPasswordResetEmail(need(), email);
      },
      signInDemo: () => {
        try {
          localStorage.setItem(DEMO_KEY, "1");
        } catch {}
        setUser({ uid: "demo", email: "demo@example.com", name: "Demo User", photo: null });
      },
      signOut: async () => {
        const auth = getFirebaseAuth();
        if (auth) await fbSignOut(auth);
        try {
          localStorage.removeItem(DEMO_KEY);
        } catch {}
        setUser(null);
      },
      getToken: async () => {
        const auth = getFirebaseAuth();
        return auth?.currentUser ? auth.currentUser.getIdToken() : null;
      },
    }),
    [user, loading],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside <AuthProvider>");
  return v;
}

/** Redirects to /login when signed out. Returns the user once known. */
export function useRequireAuth() {
  const auth = useAuth();
  const go = useCallback(() => {
    if (typeof window !== "undefined") {
      const next = window.location.pathname + window.location.search;
      window.location.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }, []);
  useEffect(() => {
    if (!auth.loading && !auth.user) go();
  }, [auth.loading, auth.user, go]);
  return auth;
}
