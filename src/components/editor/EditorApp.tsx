"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowLeft, Check, CloudOff, Download, Eye, Redo2, SlidersHorizontal, Undo2, X } from "lucide-react";
import { useRequireAuth } from "@/components/auth/AuthProvider";
import { Btn, IconBtn, Modal, Spinner, Toast } from "@/components/ui/kit";
import { SharePanel } from "@/components/share/SharePanel";
import { CardViewer } from "@/components/viewer/CardViewer";
import { api } from "@/lib/client/api";
import { downloadCardPdf, makeLinkPreview } from "@/lib/export";
import { ensureFonts } from "@/lib/design/fonts";
import { applyGuestName, collectFonts, hasGuestToken } from "@/lib/design/layers";
import { prepareAssets } from "@/lib/render";
import { CanvasArea } from "./CanvasArea";
import { PagesStrip } from "./PagesStrip";
import { PropsPanel } from "./PropsPanel";
import { TABS, ToolPanel, type ToolTab } from "./LeftPanel";
import { useEditor, type CardRecord } from "./store";

function useIsDesktop() {
  const [d, setD] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setD(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return d;
}

type SaveState = "saved" | "saving" | "dirty" | "error";

export default function EditorApp({ id }: { id: string }) {
  const auth = useRequireAuth();
  const [loadError, setLoadError] = useState("");
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<ToolTab | null>("text");
  const [sheet, setSheet] = useState<"tool" | "style" | null>(null);
  const [save, setSave] = useState<SaveState>("saved");
  const [shareOpen, setShareOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState("");
  const [pub, setPub] = useState<{ published: boolean; slug: string }>({ published: false, slug: "" });

  const design = useEditor((s) => s.design);
  const title = useEditor((s) => s.title);
  const slug = useEditor((s) => s.slug);
  const dirty = useEditor((s) => s.dirty);
  const selectedId = useEditor((s) => s.selectedId);
  const canUndo = useEditor((s) => s.past.length > 0);
  const canRedo = useEditor((s) => s.future.length > 0);
  const desktop = useIsDesktop();
  const savedAt = useRef(0);
  const inflight = useRef<Promise<void> | null>(null);

  /* ---------------------------- load ---------------------------- */
  useEffect(() => {
    if (!auth.user) return;
    let alive = true;
    api<{ card: CardRecord }>(`/api/cards/${id}`)
      .then(async ({ card }) => {
        await prepareAssets(card.design.pages);
        if (!alive) return;
        useEditor.getState().load(card);
        setPub({ published: card.published, slug: card.slug });
        setReady(true);
        // On phones start with the canvas, not an open panel.
        if (window.matchMedia("(max-width: 1023px)").matches) setTab(null);
      })
      .catch((e) => alive && setLoadError(e.message || "Could not open this card."));
    return () => {
      alive = false;
    };
  }, [auth.user, id]);

  /* --------------------------- save ----------------------------- */
  const saveNow = useCallback(async () => {
    const s = useEditor.getState();
    if (!s.design) return;
    const snapshot = s.dirty;
    setSave("saving");
    const p = api(`/api/cards/${id}`, {
      method: "PUT",
      json: { title: s.title || "Untitled card", design: s.design, viewMode: s.viewMode, meta: s.meta, rsvpEnabled: s.rsvpEnabled, envelope: s.envelope },
    })
      .then(() => {
        savedAt.current = snapshot;
        setSave(useEditor.getState().dirty === snapshot ? "saved" : "dirty");
      })
      .catch(() => setSave("error"));
    inflight.current = p;
    await p;
  }, [id]);

  useEffect(() => {
    if (!ready || dirty === savedAt.current) return;
    setSave((s) => (s === "saving" ? s : "dirty"));
    const t = setTimeout(saveNow, 1200);
    return () => clearTimeout(t);
  }, [dirty, ready, saveNow]);

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (useEditor.getState().dirty !== savedAt.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, []);

  /* ------------------ keep the link preview fresh --------------- */
  const syncPreview = useCallback(async () => {
    const s = useEditor.getState();
    if (!s.design) return;
    await prepareAssets(s.design.pages);
    const blob = await makeLinkPreview(s.design, s.design.pages[0]);
    await api(`/api/cards/${id}/preview`, { method: "PUT", body: blob, headers: { "Content-Type": "image/jpeg" } });
  }, [id]);

  useEffect(() => {
    if (!pub.published || save !== "saved") return;
    const t = setTimeout(() => syncPreview().catch(() => {}), 4000);
    return () => clearTimeout(t);
  }, [pub.published, save, dirty, syncPreview]);

  /* ---------------------------- publish ------------------------- */
  const publish = async () => {
    setPublishing(true);
    try {
      await saveNow();
      await syncPreview().catch(() => {});
      const res = await api<{ slug: string; published: boolean }>(`/api/cards/${id}/publish`, { method: "POST", json: { published: true } });
      setPub({ published: true, slug: res.slug });
      setShareOpen(true);
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Could not publish");
    } finally {
      setPublishing(false);
    }
  };

  const unpublish = async () => {
    await api(`/api/cards/${id}/publish`, { method: "POST", json: { published: false } });
    setPub((p) => ({ ...p, published: false }));
    setShareOpen(false);
    setToast("Card unpublished — the link no longer works");
  };

  const exportPdf = async () => {
    const s = useEditor.getState();
    if (!s.design) return;
    setToast("Preparing your PDF…");
    await downloadCardPdf(s.design, applyGuestName(s.design.pages, ""), s.title || "invitation");
    setToast("PDF downloaded");
  };

  /* --------------------------- render --------------------------- */
  if (loadError)
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-lg">{loadError}</p>
        <Link href="/dashboard" className="text-brand underline">
          Back to my cards
        </Link>
      </div>
    );
  if (!ready || !design)
    return (
      <div className="flex min-h-svh items-center justify-center gap-3 text-ink/60">
        <Spinner className="size-5" /> Opening editor…
      </div>
    );

  const hasSlot = hasGuestToken(design.pages);
  const sheetOpen = sheet !== null;

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-paper-2">
      {/* top bar */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line bg-white px-2 sm:px-4">
        <Link href="/dashboard" aria-label="Back to my cards" className="flex size-9 items-center justify-center rounded-lg text-ink/70 hover:bg-ink/5">
          <ArrowLeft className="size-5" />
        </Link>
        <input
          value={title}
          onChange={(e) => useEditor.getState().setTitle(e.target.value)}
          maxLength={120}
          aria-label="Card name"
          className="h-9 min-w-0 flex-1 rounded-lg bg-transparent px-2 text-[15px] font-medium outline-none hover:bg-ink/5 focus:bg-ink/5 sm:max-w-xs sm:flex-none"
        />
        <SaveBadge state={save} />
        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          <IconBtn label="Undo (Ctrl+Z)" disabled={!canUndo} onClick={() => useEditor.getState().undo()}>
            <Undo2 className="size-[18px]" />
          </IconBtn>
          <IconBtn label="Redo (Ctrl+Y)" disabled={!canRedo} onClick={() => useEditor.getState().redo()}>
            <Redo2 className="size-[18px]" />
          </IconBtn>
          <span className="hidden sm:block">
            <Btn variant="ghost" size="sm" onClick={() => setPreviewOpen(true)}>
              <Eye className="size-4" /> Preview
            </Btn>
          </span>
          <span className="sm:hidden">
            <IconBtn label="Preview" onClick={() => setPreviewOpen(true)}>
              <Eye className="size-[18px]" />
            </IconBtn>
          </span>
          <span className="hidden md:block">
            <Btn variant="secondary" size="sm" onClick={exportPdf}>
              <Download className="size-4" /> PDF
            </Btn>
          </span>
          {pub.published ? (
            <Btn variant="primary" size="sm" onClick={() => setShareOpen(true)}>
              Share
            </Btn>
          ) : (
            <Btn variant="primary" size="sm" onClick={publish} disabled={publishing}>
              {publishing && <Spinner />} Publish
            </Btn>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* desktop tool rail + panel */}
        {desktop && <nav className="hidden w-[76px] shrink-0 flex-col items-stretch gap-1 border-r border-line bg-white py-2 lg:flex">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(tab === t.id ? null : t.id)}
              className={clsx(
                "mx-1.5 flex flex-col items-center gap-1 rounded-xl py-2.5 text-[11px] transition",
                tab === t.id ? "bg-brand/10 font-medium text-brand" : "text-ink/60 hover:bg-ink/5",
              )}
            >
              <t.icon className="size-5" strokeWidth={1.7} />
              {t.label}
            </button>
          ))}
        </nav>}
        {desktop && tab && (
          <aside className="hidden w-[300px] shrink-0 border-r border-line bg-white lg:block">
            <ToolPanel tab={tab} />
          </aside>
        )}

        <main className="flex min-w-0 flex-1 flex-col">
          <CanvasArea bottomInset={sheetOpen && typeof window !== "undefined" && window.innerWidth < 1024 ? Math.max(0, Math.round(window.innerHeight * 0.46 - 100)) : 0} />
          <PagesStrip compact={false} />
        </main>

        {desktop && (
          <aside className="hidden w-[300px] shrink-0 border-l border-line bg-white lg:block">
            <PropsPanel />
          </aside>
        )}
      </div>

      {/* mobile bottom bar + sheets */}
      {desktop === false && <div className="lg:hidden">
        {sheet && (
          <div className="fixed inset-x-0 bottom-[60px] z-40 flex h-[46svh] flex-col rounded-t-3xl border-t border-line bg-white shadow-[0_-12px_40px_rgba(0,0,0,.18)]">
            <div className="flex items-center justify-between px-4 pt-3">
              <div className="mx-auto h-1 w-10 rounded-full bg-ink/15" />
              <button onClick={() => setSheet(null)} aria-label="Close panel" className="absolute right-3 top-2 rounded-full p-1.5 text-ink/50">
                <X className="size-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 pt-1">{sheet === "style" ? <PropsPanel /> : tab && <ToolPanel tab={tab} />}</div>
          </div>
        )}
        <nav className="fixed inset-x-0 bottom-0 z-50 flex h-[60px] items-stretch gap-0.5 overflow-x-auto border-t border-line bg-white px-1 pb-[env(safe-area-inset-bottom)]">
          {selectedId && (
            <button
              onClick={() => setSheet(sheet === "style" ? null : "style")}
              className={clsx("flex min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-lg text-[10.5px] font-semibold", sheet === "style" ? "text-brand" : "text-brand/80")}
            >
              <SlidersHorizontal className="size-5" /> Style
            </button>
          )}
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                if (sheet === "tool" && tab === t.id) setSheet(null);
                else {
                  setTab(t.id);
                  setSheet("tool");
                }
              }}
              className={clsx("flex min-w-[60px] flex-1 flex-col items-center justify-center gap-0.5 text-[10.5px]", sheet === "tool" && tab === t.id ? "text-brand" : "text-ink/60")}
            >
              <t.icon className="size-5" strokeWidth={1.7} /> {t.label}
            </button>
          ))}
        </nav>
        <div className="h-[60px]" />
      </div>}

      <Modal open={shareOpen} onClose={() => setShareOpen(false)} title="Your invitation is live 🎉" wide>
        {slug && <SharePanel slug={slug} title={title} hasGuestSlot={hasSlot} />}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <Btn size="sm" onClick={exportPdf}>
            <Download className="size-4" /> Download PDF
          </Btn>
          <a href={`/c/${slug}`} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center rounded-full border border-line bg-white px-3 text-[13px] font-medium hover:bg-paper-2">
            View as guest
          </a>
          <Btn size="sm" variant="danger" className="ml-auto" onClick={unpublish}>
            Unpublish
          </Btn>
        </div>
      </Modal>

      {previewOpen && (
        <div className="fixed inset-0 z-[95] overflow-y-auto bg-black">
          <button
            onClick={() => setPreviewOpen(false)}
            className="fixed right-3 top-3 z-[96] flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-lg"
          >
            <X className="size-4" /> Close preview
          </button>
          <div className="fixed left-3 top-3 z-[96] rounded-full bg-white/90 px-3 py-1.5 text-xs text-ink/70 shadow">Preview as “Sarah Khan”</div>
          <CardViewer
            design={design}
            viewMode={useEditor.getState().viewMode}
            title={title}
            guest="Sarah Khan"
            embedded
            rsvpEnabled={useEditor.getState().rsvpEnabled}
            envelope={useEditor.getState().envelope}
            coupleNames={useEditor.getState().meta.coupleNames}
          />
        </div>
      )}
      {toast && <Toast message={toast} onDone={() => setToast("")} />}
    </div>
  );
}

function SaveBadge({ state }: { state: SaveState }) {
  const map = {
    saved: { icon: <Check className="size-3.5" />, text: "Saved", cls: "text-ink/45" },
    saving: { icon: <Spinner className="size-3" />, text: "Saving…", cls: "text-ink/45" },
    dirty: { icon: <Spinner className="size-3" />, text: "Unsaved", cls: "text-amber-600" },
    error: { icon: <CloudOff className="size-3.5" />, text: "Not saved — retrying", cls: "text-red-600" },
  }[state];
  return (
    <span className={clsx("hidden items-center gap-1.5 text-xs sm:flex", map.cls)} aria-live="polite">
      {map.icon} {map.text}
    </span>
  );
}

void ensureFonts;
void collectFonts;
