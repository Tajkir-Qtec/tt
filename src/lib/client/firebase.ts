import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId);
export const devBypass = process.env.NEXT_PUBLIC_AUTH_DEV_BYPASS === "1" && process.env.NODE_ENV !== "production";

let app: FirebaseApp | null = null;

export function getFirebaseAuth(): Auth | null {
  if (!firebaseConfigured) return null;
  app ??= getApps().length ? getApp() : initializeApp(config);
  return getAuth(app);
}
