import type { Metadata } from "next";
import EditorLoader from "./EditorLoader";

export const metadata: Metadata = { title: "Editor", robots: { index: false, follow: false } };

export default async function Page({ params }: PageProps<"/editor/[id]">) {
  const { id } = await params;
  return <EditorLoader id={id} />;
}
