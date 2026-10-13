"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageStage } from "@/components/canvas/PageStage";
import { prepareAssets } from "@/lib/render";
import type { TemplateDef } from "@/lib/templates/kit";
import { applyGuestName } from "@/lib/design/layers";

/** Dev-only: renders one template page at an exact scale (used for visual checks & thumbnails). */
export default function PreviewClient() {
  const sp = useSearchParams();
  const slug = sp.get("t") ?? "";
  const pageIdx = Number(sp.get("p") ?? 0);
  const scale = Number(sp.get("s") ?? 1);
  const guest = sp.get("to") ?? "";
  const [tpl, setTpl] = useState<TemplateDef | null>(null);
  const [err, setErr] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    import(`@/lib/templates/${slug}`)
      .then((m) => {
        const t: TemplateDef = m.default();
        return prepareAssets(t.pages).then(() => {
          setTpl(t);
          setReady(true);
        });
      })
      .catch((e) => setErr(String(e)));
  }, [slug]);
  if (err) return <pre id="err">{err}</pre>;
  if (!tpl) return <p>Loading…</p>;
  if (!tpl.pages[pageIdx]) return <pre id="err">no such page</pre>;
  const page = applyGuestName([tpl.pages[pageIdx]], guest)[0];
  return (
    <div style={{ background: "#222", display: "inline-block" }}>
      {ready && (
        <div id="stage-host" data-ready="1" style={{ width: tpl.width * scale, height: tpl.height * scale }}>
          <PageStage width={tpl.width} height={tpl.height} page={page} scale={scale} />
        </div>
      )}
    </div>
  );
}
