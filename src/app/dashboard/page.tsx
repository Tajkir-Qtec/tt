import type { Metadata } from "next";
import Dashboard from "./Dashboard";

export const metadata: Metadata = { title: "My cards", robots: { index: false, follow: false } };

export default function Page() {
  return <Dashboard />;
}
