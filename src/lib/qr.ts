import QRCode from "qrcode";
import { Path, assemble, type OrnamentData } from "@/lib/design/path";

/** A QR code as crisp, recolourable vector art (a white tile plus the dark modules). */
export function qrOrnament(text: string, opts: { color?: string; background?: string | null; quiet?: number } = {}): OrnamentData {
  const color = opts.color ?? "#1c1917";
  const quiet = opts.quiet ?? 2;
  const qr = QRCode.create(text, { errorCorrectionLevel: "M" });
  const n = qr.modules.size;
  const total = n + quiet * 2;
  const dark = new Path();
  for (let y = 0; y < n; y++) {
    let x = 0;
    while (x < n) {
      if (!qr.modules.get(y, x)) {
        x++;
        continue;
      }
      let len = 1;
      while (x + len < n && qr.modules.get(y, x + len)) len++;
      const px = x + quiet;
      const py = y + quiet;
      dark.M(px, py).L(px + len, py).L(px + len, py + 1).L(px, py + 1).Z();
      x += len;
    }
  }
  const specs = [];
  if (opts.background !== null) {
    const bg = new Path().M(0, 0).L(total, 0).L(total, total).L(0, total).Z();
    specs.push({ path: bg, fill: opts.background ?? "#ffffff" });
  }
  specs.push({ path: dark, fill: color });
  return assemble(specs, 0, { w: total, h: total });
}

export function qrPngDataUrl(text: string, size = 720): Promise<string> {
  return QRCode.toDataURL(text, { errorCorrectionLevel: "M", margin: 2, width: size, color: { dark: "#1c1917", light: "#ffffff" } });
}
