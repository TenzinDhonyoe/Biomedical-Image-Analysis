'use client';

import { useRef, useCallback, useEffect } from 'react';

/**
 * Hook for canvas setup with DPR scaling and dark mode reactivity.
 * Returns a ref to attach to <canvas> and a draw() function.
 */
export function useCanvas(width: number, height: number) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawFnRef = useRef<((ctx: CanvasRenderingContext2D) => void) | null>(null);

  const draw = useCallback((fn: (ctx: CanvasRenderingContext2D) => void) => {
    drawFnRef.current = fn;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    fn(ctx);
  }, [width, height]);

  // Redraw on dark mode toggle
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (drawFnRef.current) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawFnRef.current(ctx);
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return { canvasRef, draw };
}

/** Read a CSS custom property value from :root */
export function getCSSVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Draw a grayscale image array onto a canvas context */
export function drawGrayscaleImage(
  ctx: CanvasRenderingContext2D,
  data: number[] | Uint8Array | Float64Array,
  w: number,
  h: number,
  dx = 0,
  dy = 0,
  displayW?: number,
  displayH?: number
) {
  const imgData = ctx.createImageData(w, h);
  for (let i = 0; i < w * h; i++) {
    const v = Math.max(0, Math.min(255, Math.round(data[i])));
    imgData.data[i * 4] = v;
    imgData.data[i * 4 + 1] = v;
    imgData.data[i * 4 + 2] = v;
    imgData.data[i * 4 + 3] = 255;
  }
  if (displayW && displayH && (displayW !== w || displayH !== h)) {
    const offscreen = new OffscreenCanvas(w, h);
    const offCtx = offscreen.getContext('2d')!;
    offCtx.putImageData(imgData, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(offscreen, dx, dy, displayW, displayH);
  } else {
    ctx.putImageData(imgData, dx, dy);
  }
}
