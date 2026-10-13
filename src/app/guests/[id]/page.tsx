import type { Metadata } from "next";
import GuestList from "./GuestList";

export const metadata: Metadata = { title: "Guest list", robots: { index: false, follow: false } };

export default async function Page({ params }: PageProps<"/guests/[id]">) {
  const { id } = await params;
  return <GuestList id={id} />;
}
