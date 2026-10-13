"use client";
import { useEffect, useState } from "react";

const cache = new Map<string, HTMLImageElement>();
const pending = new Map<string, Promise<HTMLImageElement | null>>();

export function loadImage(src: string): Promise<HTMLImageElement | null> {
  if (!src) return Promise.resolve(null);
  const hit = cache.get(src);
  if (hit) return Promise.resolve(hit);
  let p = pending.get(src);
  if (!p) {
    p = new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        cache.set(src, img);
        resolve(img);
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
    pending.set(src, p);
  }
  return p;
}

export function getCachedImage(src: string | null | undefined) {
  return src ? cache.get(src) ?? null : null;
}

/** Returns the loaded image (synchronously when already cached). */
export function useImage(src: string | null | undefined): HTMLImageElement | null {
  const [, setTick] = useState(0);
  const cached = getCachedImage(src);
  useEffect(() => {
    if (!src || cache.has(src)) return;
    let alive = true;
    loadImage(src).then(() => alive && setTick((t) => t + 1));
    return () => {
      alive = false;
    };
  }, [src]);
  return cached;
}
