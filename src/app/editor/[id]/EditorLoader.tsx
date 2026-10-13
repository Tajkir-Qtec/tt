"use client";
import dynamic from "next/dynamic";

// Konva needs the browser, so the editor is client-only.
const EditorApp = dynamic(() => import("@/components/editor/EditorApp"), {
  ssr: false,
  loading: () => <div className="flex min-h-svh items-center justify-center text-ink/50">Opening editor…</div>,
});

export default function EditorLoader({ id }: { id: string }) {
  return <EditorApp id={id} />;
}
