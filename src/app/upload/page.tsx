import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";
import UploadCard from "./UploadCard";

export const metadata: Metadata = {
  title: "Share Your Own Invitation Card Online — Scan, Crop & Send",
  description:
    "Already have a printed or designed invitation? Upload a photo or image, we straighten and crop it automatically, then you share it with every guest by personal link, with RSVP, a QR code and an optional envelope opening.",
  alternates: { canonical: "/upload" },
  keywords: ["upload wedding card image", "share invitation card online", "scan wedding card", "digital invitation from photo", "send invitation card whatsapp"],
};

export default function UploadPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">Share the card you already have</h1>
        <p className="mt-3 max-w-2xl text-lg text-ink/65">
          Upload a photo or image of your invitation. We find the card, straighten it and tidy the colours — then it becomes a shareable page with a personal link for every guest, replies and a QR code.
        </p>
        <UploadCard />
      </main>
      <SiteFooter />
    </>
  );
}
