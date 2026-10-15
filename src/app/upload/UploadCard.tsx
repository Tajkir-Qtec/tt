"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { ImagePlus, Plus, RotateCcw, RotateCw, ScanLine, Sparkles, Trash2, Wand2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Btn, Spinner } from "@/components/ui/kit";
import { api, uploadImage } from "@/lib/client/api";
import { makeImage, makePage } from "@/lib/design/layers";
import { canvasToFile, detectQuad, insetQuad, toCanvas, warpQuad, type Enhance, type Pt, type Quad } from "@/lib/scan";

interface Item {
  id: string;
  /** upright source (rotation already applied) */
  src: HTMLCanvasElement;
  url: string;
  quad: Quad;
  enhance: Enhance;
  found: boolean;
}

const MAX_PAGES = 6;
const ENHANCE: { id: Enhance; label: string }[] = [
  { id: "original", label: "Original" },
  { id: "vivid", label: "Vivid" },
  { id: "document", label: "Clean paper" },
];

let counter = 0;

async function loadFile(file: File): Promise<HTMLCanvasElement> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error("Please choose a JPG, PNG or WebP image.");
  if (file.size > 25 * 1024 * 1024) throw new Error("That image is too large (25 MB max).");
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  return toCanvas(bmp, 2600);
}

export default function UploadCard() {
  const auth = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  useEffect(() => {
    if (!auth.loading && !auth.user) window.location.replace(`/login?next=${encodeURIComponent("/upload")}`);
  }, [auth.loading, auth.user]);

  const addFiles = useCallback(
    async (files: FileList | File[] | null) => {
      if (!files?.length) return;
      setError("");
      setBusy("Looking for your card…");
      try {
        const next: Item[] = [];
        for (const f of Array.from(files).slice(0, MAX_PAGES - items.length)) {
          const c = await loadFile(f);
          await new Promise((r) => setTimeout(r, 0));
          const { quad, confident } = detectQuad(c);
          next.push({ id: `i${++counter}`, src: c, url: c.toDataURL("image/jpeg", 0.8), quad, enhance: "original", found: confident });
        }
        setItems((p) => [...p, ...next]);
        setActive(items.length);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not read that image.");
      } finally {
        setBusy("");
      }
    },
    [items.length],
  );

  const item = items[active];
  const patch = (p: Partial<Item>) => setItems((all) => all.map((it, i) => (i === active ? { ...it, ...p } : it)));

  const rotate = (dir: 1 | -1) => {
    if (!item) return;
    const c = toCanvas(item.src, 2600, dir === 1 ? 90 : 270);
    const { quad, confident } = detectQuad(c);
    patch({ src: c, url: c.toDataURL("image/jpeg", 0.8), quad, found: confident });
  };

  const create = async () => {
    if (!items.length) return;
    setError("");
    try {
      const urls: string[] = [];
      const dims: { w: number; h: number }[] = [];
      for (let i = 0; i < items.length; i++) {
        setBusy(`Preparing page ${i + 1} of ${items.length}…`);
        await new Promise((r) => setTimeout(r, 0));
        const out = warpQuad(items[i].src, items[i].quad, 1800, items[i].enhance);
        dims.push({ w: out.width, h: out.height });
        urls.push(await uploadImage(await canvasToFile(out)));
      }
      // the first page sets the card's shape; the rest are fitted inside it
      const k = 1400 / Math.max(dims[0].w, dims[0].h);
      const W = Math.max(300, Math.round(dims[0].w * k));
      const H = Math.max(300, Math.round(dims[0].h * k));
      setBusy("Creating your card…");
      const label = title.trim() || "My invitation";
      const { card } = await api<{ card: { id: string } }>("/api/cards", { method: "POST", json: { title: label, blank: { width: W, height: H } } });
      const pages = urls.map((src, i) => {
        const fit = Math.min(W / dims[i].w, H / dims[i].h);
        const w = Math.round(dims[i].w * fit);
        const h = Math.round(dims[i].h * fit);
        return makePage({
          background: "#ffffff",
          name: `Page ${i + 1}`,
          layers: [makeImage({ src, x: Math.round((W - w) / 2), y: Math.round((H - h) / 2), width: w, height: h, name: "Your card" })],
        });
      });
      await api(`/api/cards/${card.id}`, {
        method: "PUT",
        json: { design: { version: 1, width: W, height: H, pages }, viewMode: pages.length > 1 ? "flip" : "single", envelope: { enabled: true, color: "ivory" } },
      });
      router.push(`/editor/${card.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setBusy("");
    }
  };

  if (auth.loading || !auth.user) return <div className="mt-16 flex justify-center"><Spinner className="size-6 text-ink/40" /></div>;

  return (
    <div className="mt-10">
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => (addFiles(e.target.files), (e.target.value = ""))} />

      {!items.length ? (
        <div
          onDragOver={(e) => (e.preventDefault(), setDrag(true))}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => (e.preventDefault(), setDrag(false), addFiles(e.dataTransfer.files))}
          className={clsx("flex flex-col items-center rounded-3xl border-2 border-dashed bg-white px-6 py-16 text-center transition", drag ? "border-brand bg-brand/5" : "border-line")}
        >
          <span className="flex size-16 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            {busy ? <Spinner className="size-6" /> : <ImagePlus className="size-7" />}
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold">{busy || "Drop your invitation here"}</h2>
          <p className="mt-2 max-w-md text-ink/60">A photo from your camera or a saved image — front and back pages work too (up to {MAX_PAGES}).</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Btn variant="primary" size="lg" onClick={() => input.current?.click()} disabled={!!busy}>
              Choose image
            </Btn>
          </div>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <ul className="mt-10 grid max-w-2xl gap-4 text-left text-sm text-ink/65 sm:grid-cols-3">
            {[
              ["Finds the card", "Detects the edges of the card on the table or wall."],
              ["Straightens it", "Fixes the angle so it looks like a flat scan."],
              ["Ready to share", "Personal links, replies, QR code and envelope."],
            ].map(([a, b]) => (
              <li key={a} className="rounded-2xl bg-paper-2 p-4">
                <div className="font-medium text-ink">{a}</div>
                {b}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            {item && <CropStage key={item.id} item={item} onQuad={(quad) => patch({ quad })} />}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Btn size="sm" onClick={() => rotate(-1)}>
                <RotateCcw className="size-4" /> Rotate
              </Btn>
              <Btn size="sm" onClick={() => rotate(1)}>
                <RotateCw className="size-4" /> Rotate
              </Btn>
              <Btn size="sm" onClick={() => {
                  const r = detectQuad(item.src);
                  patch({ quad: r.quad, found: r.confident });
                }}>
                <ScanLine className="size-4" /> Auto-detect
              </Btn>
              <Btn size="sm" onClick={() => patch({ quad: insetQuad(0) })}>
                Use whole image
              </Btn>
            </div>
            <p className="mt-3 text-sm text-ink/55">{item?.found ? "We found your card. Drag the corners if the edges are off." : "Drag the four corners to the corners of your card."}</p>
          </div>

          <aside className="grid content-start gap-6">
            {item && <Preview item={item} />}
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Wand2 className="size-4 text-brand" /> Colours
              </div>
              <div className="flex gap-2">
                {ENHANCE.map((e) => (
                  <button key={e.id} onClick={() => patch({ enhance: e.id })} className={clsx("flex-1 rounded-xl border px-3 py-2 text-sm transition", item?.enhance === e.id ? "border-brand bg-brand/5 text-brand" : "border-line bg-white hover:border-ink/30")}>
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium">Pages ({items.length}/{MAX_PAGES})</div>
              <div className="flex flex-wrap gap-2">
                {items.map((it, i) => (
                  <div key={it.id} className="group relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.url} alt={`Page ${i + 1}`} onClick={() => setActive(i)} className={clsx("h-20 w-16 cursor-pointer rounded-lg border-2 object-cover", i === active ? "border-brand" : "border-line")} />
                    <button
                      aria-label="Remove page"
                      onClick={() => (setItems((p) => p.filter((_, j) => j !== i)), setActive(0))}
                      className="absolute -right-1.5 -top-1.5 hidden size-6 items-center justify-center rounded-full bg-ink text-white group-hover:flex"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                ))}
                {items.length < MAX_PAGES && (
                  <button onClick={() => input.current?.click()} className="flex h-20 w-16 items-center justify-center rounded-lg border-2 border-dashed border-line text-ink/45 hover:border-brand hover:text-brand">
                    <Plus className="size-5" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="ttl">
                Card name
              </label>
              <input id="ttl" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Amelia & James" maxLength={80} className="h-12 w-full rounded-xl border border-line bg-white px-4 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10" />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            <Btn variant="primary" size="lg" onClick={create} disabled={!!busy}>
              {busy ? <Spinner /> : <Sparkles className="size-5" />} {busy || "Continue to share"}
            </Btn>
            <p className="-mt-3 text-xs text-ink/50">Next you can add a guest-name line, QR code and envelope, then publish.</p>
          </aside>
        </div>
      )}
    </div>
  );
}

/** The photo with four draggable corner handles. */
function CropStage({ item, onQuad }: { item: Item; onQuad: (q: Quad) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const ratio = item.src.width / item.src.height;

  const move = (e: React.PointerEvent) => {
    if (dragIdx === null || !box.current) return;
    const r = box.current.getBoundingClientRect();
    const p: Pt = { x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)) };
    const q = item.quad.map((c, i) => (i === dragIdx ? p : c)) as Quad;
    onQuad(q);
  };

  const pts = item.quad.map((p) => `${p.x * 100},${p.y * 100}`).join(" ");
  return (
    <div className="flex justify-center rounded-3xl bg-ink/5 p-3 sm:p-5">
      <div
        ref={box}
        className="relative touch-none select-none overflow-hidden rounded-lg shadow-lg"
        style={{ width: `min(100%, calc(68svh * ${ratio}))`, aspectRatio: `${item.src.width} / ${item.src.height}` }}
        onPointerMove={move}
        onPointerUp={() => setDragIdx(null)}
        onPointerCancel={() => setDragIdx(null)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.url} alt="Your photo" className="size-full" draggable={false} />
        <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d={`M0 0H100V100H0Z M${item.quad.map((p) => `${p.x * 100} ${p.y * 100}`).join(" L")}Z`} fill="rgba(20,16,24,.5)" fillRule="evenodd" />
          <polygon points={pts} fill="none" stroke="#fff" strokeWidth="0.5" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 2 }} />
        </svg>
        {item.quad.map((p, i) => (
          <button
            key={i}
            aria-label={`Corner ${i + 1}`}
            onPointerDown={(e) => {
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              setDragIdx(i);
            }}
            className="absolute flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center"
            style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
          >
            <span className="size-5 rounded-full border-[3px] border-white bg-brand shadow-md" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Preview({ item }: { item: Item }) {
  const [url, setUrl] = useState("");
  const key = useMemo(() => JSON.stringify([item.quad, item.enhance, item.id, item.src.width]), [item]);
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        setUrl(warpQuad(item.src, item.quad, 700, item.enhance).toDataURL("image/jpeg", 0.8));
      } catch {}
    }, 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return (
    <div>
      <div className="mb-2 text-sm font-medium">Result</div>
      <div className="flex min-h-48 items-center justify-center rounded-2xl bg-ink/5 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {url ? <img src={url} alt="Straightened card" className="max-h-80 rounded shadow-md" /> : <Spinner className="size-5 text-ink/40" />}
      </div>
    </div>
  );
}
