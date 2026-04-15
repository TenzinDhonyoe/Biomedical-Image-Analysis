'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import SliderControl from '../shared/SliderControl';
import { generateTestImage } from '../shared/imageUtils';
import { drawGrayscaleImage } from '../shared/useCanvas';

type OpType = 'negative' | 'log' | 'power-law' | 'contrast-stretch';

const SIZE = 128;

export default function GammaTransform() {
  const [op, setOp] = useState<OpType>('power-law');
  const [gamma, setGamma] = useState(1.0);
  const [c, setC] = useState(1.0);
  const [imageType, setImageType] = useState<'gradient' | 'cameraman' | 'circle'>('gradient');

  const inputRef = useRef<HTMLCanvasElement>(null);
  const outputRef = useRef<HTMLCanvasElement>(null);
  const curveRef = useRef<SVGSVGElement>(null);

  const sourceImg = useRef<Uint8Array>(new Uint8Array(0));

  const setupCanvas = useCallback((canvas: HTMLCanvasElement) => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width = `${SIZE}px`;
    canvas.style.height = `${SIZE}px`;
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }, []);

  // Generate source image
  useEffect(() => {
    sourceImg.current = generateTestImage(SIZE, SIZE, imageType);
    const ctx = setupCanvas(inputRef.current!);
    drawGrayscaleImage(ctx, sourceImg.current, SIZE, SIZE);
  }, [imageType, setupCanvas]);

  // Apply transform and draw output + curve
  useEffect(() => {
    if (sourceImg.current.length === 0) return;
    const ctx = setupCanvas(outputRef.current!);
    const src = sourceImg.current;
    const out = new Uint8Array(src.length);

    // Build LUT
    const lut = new Uint8Array(256);
    for (let r = 0; r < 256; r++) {
      const rn = r / 255;
      let s: number;
      switch (op) {
        case 'negative':
          s = 255 - r;
          break;
        case 'log':
          s = c * Math.log(1 + r) * (255 / Math.log(256));
          break;
        case 'power-law':
          s = c * Math.pow(rn, gamma) * 255;
          break;
        case 'contrast-stretch': {
          // Piecewise linear stretch around midpoint
          const m = 128, e = gamma * 10;
          s = 255 / (1 + Math.pow(m / (r + 0.5), e));
          break;
        }
      }
      lut[r] = Math.max(0, Math.min(255, Math.round(s!)));
    }

    for (let i = 0; i < src.length; i++) out[i] = lut[src[i]];
    drawGrayscaleImage(ctx, out, SIZE, SIZE);

    // Draw transfer curve
    const svg = curveRef.current;
    if (!svg) return;
    const path = svg.querySelector('path.curve')!;
    const cw = 200, ch = 140;
    let d = `M 0 ${ch}`;
    for (let r = 0; r < 256; r++) {
      const x = (r / 255) * cw;
      const y = ch - (lut[r] / 255) * ch;
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    path.setAttribute('d', d);
  }, [op, gamma, c, imageType, setupCanvas]);

  return (
    <div>
      <div className="text-[13px] font-semibold text-[var(--text)] mb-3">
        Point Operations: Transform Visualizer
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={op}
          onChange={(e) => setOp(e.target.value as OpType)}
          className="text-[12px] px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] cursor-pointer"
        >
          <option value="negative">Negative (s = 255 - r)</option>
          <option value="log">Log Transform (s = c*log(1+r))</option>
          <option value="power-law">Power-Law / Gamma (s = c*r^gamma)</option>
          <option value="contrast-stretch">Contrast Stretching</option>
        </select>
        <select
          value={imageType}
          onChange={(e) => setImageType(e.target.value as typeof imageType)}
          className="text-[12px] px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] cursor-pointer"
        >
          <option value="gradient">Gradient</option>
          <option value="cameraman">Scene</option>
          <option value="circle">Circle</option>
        </select>
      </div>

      {(op === 'power-law' || op === 'contrast-stretch') && (
        <div className="max-w-xs mb-4">
          <SliderControl
            label={op === 'power-law' ? 'Gamma' : 'Steepness'}
            min={0.04}
            max={5.0}
            step={0.02}
            value={gamma}
            onChange={setGamma}
            displayValue={gamma.toFixed(2)}
          />
        </div>
      )}

      {(op === 'log' || op === 'power-law') && (
        <div className="max-w-xs mb-4">
          <SliderControl
            label="c"
            min={0.1}
            max={3.0}
            step={0.05}
            value={c}
            onChange={setC}
            displayValue={c.toFixed(2)}
          />
        </div>
      )}

      {/* Images + Curve */}
      <div className="flex flex-wrap items-start gap-4">
        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">Input</div>
          <canvas ref={inputRef} className="rounded border border-[var(--border-light)] max-w-full" />
        </div>

        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">T(r) Curve</div>
          <svg
            ref={curveRef}
            width={200}
            height={140}
            className="rounded border border-[var(--border-light)] bg-[var(--bg)]"
          >
            {/* Grid lines */}
            <line x1={0} y1={0} x2={0} y2={140} stroke="var(--border-light)" strokeWidth={0.5} />
            <line x1={0} y1={140} x2={200} y2={140} stroke="var(--border-light)" strokeWidth={0.5} />
            {/* Identity line */}
            <line x1={0} y1={140} x2={200} y2={0} stroke="var(--border)" strokeWidth={1} strokeDasharray="4 4" />
            {/* Transform curve */}
            <path className="curve" d="M 0 140" fill="none" stroke="var(--accent)" strokeWidth={2} />
            {/* Labels */}
            <text x={95} y={135} fill="var(--text-3)" fontSize={9} textAnchor="middle">r</text>
            <text x={8} y={10} fill="var(--text-3)" fontSize={9}>s</text>
          </svg>
        </div>

        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">Output</div>
          <canvas ref={outputRef} className="rounded border border-[var(--border-light)] max-w-full" />
        </div>
      </div>

      <div className="mt-3 text-[11px] text-[var(--text-3)] italic">
        {op === 'power-law' && 'Gamma < 1 brightens dark regions. Gamma > 1 darkens them. The dashed line is the identity transform.'}
        {op === 'log' && 'Log transform expands low intensity values and compresses high ones. Used to display Fourier spectra.'}
        {op === 'negative' && 'Image negative: s = L-1-r. Reverses intensity values. Useful for enhancing white details in dark images.'}
        {op === 'contrast-stretch' && 'Piecewise intensity stretching. Higher steepness approaches binary thresholding.'}
      </div>
    </div>
  );
}
