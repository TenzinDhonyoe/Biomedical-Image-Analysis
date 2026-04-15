'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { generateTestImage, histogram } from '../shared/imageUtils';
import { drawGrayscaleImage } from '../shared/useCanvas';

const SIZE = 64;
const DISPLAY = 140;

export default function ThresholdingDemo() {
  const [thresh, setThresh] = useState(128);
  const [imageType, setImageType] = useState<'cameraman' | 'circle' | 'gradient'>('cameraman');
  const [showOtsu, setShowOtsu] = useState(false);

  const origRef = useRef<HTMLCanvasElement>(null);
  const binRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const img = useMemo(() => generateTestImage(SIZE, SIZE, imageType), [imageType]);
  const hist = useMemo(() => histogram(img), [img]);
  const totalPixels = SIZE * SIZE;

  // Otsu computation
  const { otsuThresh, varianceCurve } = useMemo(() => {
    const curve: number[] = [];
    let bestT = 0, bestVar = 0;

    for (let t = 0; t < 256; t++) {
      let w0 = 0, w1 = 0, sum0 = 0, sum1 = 0;
      for (let i = 0; i <= t; i++) { w0 += hist[i]; sum0 += i * hist[i]; }
      for (let i = t + 1; i < 256; i++) { w1 += hist[i]; sum1 += i * hist[i]; }
      if (w0 === 0 || w1 === 0) { curve.push(0); continue; }
      const mu0 = sum0 / w0, mu1 = sum1 / w1;
      const varB = (w0 / totalPixels) * (w1 / totalPixels) * (mu0 - mu1) ** 2;
      curve.push(varB);
      if (varB > bestVar) { bestVar = varB; bestT = t; }
    }
    return { otsuThresh: bestT, varianceCurve: curve };
  }, [hist, totalPixels]);

  const setupCanvas = useCallback((canvas: HTMLCanvasElement) => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = DISPLAY * dpr;
    canvas.height = DISPLAY * dpr;
    canvas.style.width = `${DISPLAY}px`;
    canvas.style.height = `${DISPLAY}px`;
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }, []);

  // Draw original + binary
  useEffect(() => {
    const ctxO = setupCanvas(origRef.current!);
    drawGrayscaleImage(ctxO, img, SIZE, SIZE, 0, 0, DISPLAY, DISPLAY);
  }, [img, setupCanvas]);

  useEffect(() => {
    const binary = new Uint8Array(img.length);
    const t = showOtsu ? otsuThresh : thresh;
    for (let i = 0; i < img.length; i++) binary[i] = img[i] > t ? 255 : 0;
    const ctxB = setupCanvas(binRef.current!);
    drawGrayscaleImage(ctxB, binary, SIZE, SIZE, 0, 0, DISPLAY, DISPLAY);
  }, [img, thresh, showOtsu, otsuThresh, setupCanvas]);

  // Animate to Otsu
  useEffect(() => {
    if (showOtsu) {
      const start = thresh;
      const end = otsuThresh;
      const steps = 20;
      let step = 0;
      const id = setInterval(() => {
        step++;
        const t = Math.round(start + (end - start) * (step / steps));
        setThresh(t);
        if (step >= steps) clearInterval(id);
      }, 30);
      return () => clearInterval(id);
    }
  }, [showOtsu]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentT = showOtsu ? otsuThresh : thresh;

  // Histogram SVG dimensions
  const histW = 300, histH = 100;
  const maxHist = Math.max(...hist);

  // Variance curve SVG
  const varW = 300, varH = 60;
  const maxVar = Math.max(...varianceCurve);

  const handleHistDrag = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const t = Math.max(0, Math.min(255, Math.round((x / rect.width) * 255)));
    setThresh(t);
    setShowOtsu(false);
  }, []);

  return (
    <div>
      <div className="text-[13px] font-semibold text-[var(--text)] mb-3">
        Interactive Thresholding + Otsu's Method
      </div>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <select
          value={imageType}
          onChange={(e) => { setImageType(e.target.value as typeof imageType); setShowOtsu(false); }}
          className="text-[12px] px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] cursor-pointer"
        >
          <option value="cameraman">Scene</option>
          <option value="circle">Circle</option>
          <option value="gradient">Gradient</option>
        </select>
        <button
          onClick={() => setShowOtsu(true)}
          className={`text-[12px] px-3 py-1.5 rounded border cursor-pointer transition-colors ${
            showOtsu
              ? 'bg-[var(--green)] border-[var(--green)] text-white'
              : 'border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white'
          }`}
        >
          Compute Otsu's Threshold
        </button>
        <span className="text-[12px] font-mono text-[var(--text-2)]">T = {currentT}</span>
      </div>

      <div className="flex flex-wrap gap-4 items-start">
        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">Original</div>
          <canvas ref={origRef} className="rounded border border-[var(--border-light)]" style={{ imageRendering: 'pixelated' }} />
        </div>
        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">Binary (T={currentT})</div>
          <canvas ref={binRef} className="rounded border border-[var(--border-light)]" style={{ imageRendering: 'pixelated' }} />
        </div>
      </div>

      {/* Histogram with draggable threshold */}
      <div className="mt-4">
        <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">
          Histogram (drag to set threshold)
        </div>
        <svg
          ref={svgRef}
          width={histW}
          height={histH}
          className="block rounded border border-[var(--border-light)] bg-[var(--bg)] cursor-crosshair max-w-full"
          onMouseDown={(e) => { dragging.current = true; handleHistDrag(e); }}
          onMouseMove={(e) => { if (dragging.current) handleHistDrag(e); }}
          onMouseUp={() => { dragging.current = false; }}
          onMouseLeave={() => { dragging.current = false; }}
        >
          {hist.map((v, i) => {
            const barH = maxHist > 0 ? (v / maxHist) * (histH - 4) : 0;
            const x = (i / 255) * histW;
            const barW = Math.max(1, histW / 256);
            return (
              <rect
                key={i}
                x={x}
                y={histH - barH - 2}
                width={barW}
                height={barH}
                fill={i <= currentT ? 'var(--text-3)' : 'var(--accent)'}
                opacity={0.6}
              />
            );
          })}
          {/* Threshold line */}
          <line
            x1={(currentT / 255) * histW}
            y1={0}
            x2={(currentT / 255) * histW}
            y2={histH}
            stroke="var(--red)"
            strokeWidth={2}
          />
        </svg>
      </div>

      {/* Between-class variance */}
      <div className="mt-3">
        <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">
          Between-class Variance (Otsu)
        </div>
        <svg width={varW} height={varH} className="block rounded border border-[var(--border-light)] bg-[var(--bg)] max-w-full">
          {varianceCurve.length > 0 && (
            <path
              d={varianceCurve.map((v, i) => {
                const x = (i / 255) * varW;
                const y = varH - (maxVar > 0 ? (v / maxVar) * (varH - 4) : 0) - 2;
                return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
              }).join(' ')}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={1.5}
            />
          )}
          {/* Peak marker */}
          <circle
            cx={(otsuThresh / 255) * varW}
            cy={varH - (maxVar > 0 ? (varianceCurve[otsuThresh] / maxVar) * (varH - 4) : 0) - 2}
            r={4}
            fill="var(--green)"
            stroke="var(--bg)"
            strokeWidth={1}
          />
          {/* Current threshold line */}
          <line
            x1={(currentT / 255) * varW}
            y1={0}
            x2={(currentT / 255) * varW}
            y2={varH}
            stroke="var(--red)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        </svg>
      </div>

      <div className="mt-2 text-[11px] text-[var(--text-3)] italic">
        Otsu's method finds the threshold that maximizes between-class variance. The green dot marks the optimal threshold.
        Drag on the histogram to manually set any threshold value.
      </div>
    </div>
  );
}
