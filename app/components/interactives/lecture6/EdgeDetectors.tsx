'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import SliderControl from '../shared/SliderControl';
import KernelDisplay from '../shared/KernelDisplay';
import { generateTestImage, convolve2d, gaussianKernel } from '../shared/imageUtils';
import { drawGrayscaleImage } from '../shared/useCanvas';

const SIZE = 64;
const DISPLAY = 140;

const OPERATORS: Record<string, { name: string; kernels: number[][][] }> = {
  roberts: {
    name: 'Roberts',
    kernels: [
      [[1, 0], [0, -1]],
      [[0, 1], [-1, 0]],
    ],
  },
  prewitt: {
    name: 'Prewitt',
    kernels: [
      [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]],
      [[-1, -1, -1], [0, 0, 0], [1, 1, 1]],
    ],
  },
  sobel: {
    name: 'Sobel',
    kernels: [
      [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]],
      [[-1, -2, -1], [0, 0, 0], [1, 2, 1]],
    ],
  },
  laplacian: {
    name: 'Laplacian',
    kernels: [
      [[0, 1, 0], [1, -4, 1], [0, 1, 0]],
    ],
  },
  log: {
    name: 'LoG (Laplacian of Gaussian)',
    kernels: [], // computed dynamically
  },
};

export default function EdgeDetectors() {
  const [opKey, setOpKey] = useState('sobel');
  const [imageType, setImageType] = useState<'cameraman' | 'circle' | 'checkerboard'>('cameraman');
  const [threshold, setThreshold] = useState(50);
  const [sigma, setSigma] = useState(1.0);

  const origRef = useRef<HTMLCanvasElement>(null);
  const gradRef = useRef<HTMLCanvasElement>(null);
  const edgeRef = useRef<HTMLCanvasElement>(null);

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

  useEffect(() => {
    const img = generateTestImage(SIZE, SIZE, imageType);
    const ctxO = setupCanvas(origRef.current!);
    drawGrayscaleImage(ctxO, img, SIZE, SIZE, 0, 0, DISPLAY, DISPLAY);

    let gradient: Float64Array;

    if (opKey === 'log') {
      // LoG: Gaussian blur then Laplacian
      const kSize = Math.max(3, Math.round(sigma * 6) | 1);
      const gk = gaussianKernel(kSize, sigma);
      const blurred = convolve2d(img, gk, SIZE, SIZE);
      const blurredU8 = new Uint8Array(blurred.length);
      for (let i = 0; i < blurred.length; i++) blurredU8[i] = Math.max(0, Math.min(255, Math.round(blurred[i])));
      const lap = convolve2d(blurredU8, [[0, 1, 0], [1, -4, 1], [0, 1, 0]], SIZE, SIZE);
      gradient = new Float64Array(lap.length);
      for (let i = 0; i < lap.length; i++) gradient[i] = Math.abs(lap[i]);
    } else if (opKey === 'laplacian') {
      const lap = convolve2d(img, OPERATORS.laplacian.kernels[0], SIZE, SIZE);
      gradient = new Float64Array(lap.length);
      for (let i = 0; i < lap.length; i++) gradient[i] = Math.abs(lap[i]);
    } else {
      const op = OPERATORS[opKey];
      const gx = convolve2d(img, op.kernels[0], SIZE, SIZE);
      const gy = convolve2d(img, op.kernels[1], SIZE, SIZE);
      gradient = new Float64Array(gx.length);
      for (let i = 0; i < gx.length; i++) gradient[i] = Math.sqrt(gx[i] ** 2 + gy[i] ** 2);
    }

    // Normalize gradient for display
    let maxG = 0;
    for (let i = 0; i < gradient.length; i++) if (gradient[i] > maxG) maxG = gradient[i];
    const normGrad = new Float64Array(gradient.length);
    if (maxG > 0) for (let i = 0; i < gradient.length; i++) normGrad[i] = (gradient[i] / maxG) * 255;

    const ctxG = setupCanvas(gradRef.current!);
    drawGrayscaleImage(ctxG, normGrad, SIZE, SIZE, 0, 0, DISPLAY, DISPLAY);

    // Thresholded edges
    const edges = new Float64Array(gradient.length);
    const threshVal = (threshold / 100) * maxG;
    for (let i = 0; i < gradient.length; i++) edges[i] = gradient[i] > threshVal ? 255 : 0;

    const ctxE = setupCanvas(edgeRef.current!);
    drawGrayscaleImage(ctxE, edges, SIZE, SIZE, 0, 0, DISPLAY, DISPLAY);
  }, [opKey, imageType, threshold, sigma, setupCanvas]);

  const displayKernel = opKey === 'log' ? null : OPERATORS[opKey]?.kernels[0];

  return (
    <div>
      <div className="text-[13px] font-semibold text-[var(--text)] mb-3">
        Edge Detection Operators
      </div>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <select
          value={opKey}
          onChange={(e) => setOpKey(e.target.value)}
          className="text-[12px] px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] cursor-pointer"
        >
          {Object.entries(OPERATORS).map(([k, v]) => (
            <option key={k} value={k}>{v.name}</option>
          ))}
        </select>
        <select
          value={imageType}
          onChange={(e) => setImageType(e.target.value as typeof imageType)}
          className="text-[12px] px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] cursor-pointer"
        >
          <option value="cameraman">Scene</option>
          <option value="circle">Circle</option>
          <option value="checkerboard">Checkerboard</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="max-w-[200px] flex-1 min-w-[150px]">
          <SliderControl label="Threshold" min={1} max={100} step={1} value={threshold} onChange={setThreshold} displayValue={`${threshold}%`} />
        </div>
        {opKey === 'log' && (
          <div className="max-w-[200px] flex-1 min-w-[150px]">
            <SliderControl label="Sigma" min={0.3} max={3.0} step={0.1} value={sigma} onChange={setSigma} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 items-start">
        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">Original</div>
          <canvas ref={origRef} className="rounded border border-[var(--border-light)]" style={{ imageRendering: 'pixelated' }} />
        </div>
        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">Gradient Magnitude</div>
          <canvas ref={gradRef} className="rounded border border-[var(--border-light)]" style={{ imageRendering: 'pixelated' }} />
        </div>
        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">Thresholded Edges</div>
          <canvas ref={edgeRef} className="rounded border border-[var(--border-light)]" style={{ imageRendering: 'pixelated' }} />
        </div>
        {displayKernel && (
          <KernelDisplay kernel={displayKernel} label={`${OPERATORS[opKey].name} Kernel (Gx)`} />
        )}
      </div>

      <div className="mt-3 text-[11px] text-[var(--text-3)] italic">
        {opKey === 'roberts' && 'Roberts: 2x2 cross-difference. Simplest, but very noise-sensitive.'}
        {opKey === 'prewitt' && 'Prewitt: 3x3 with equal weights. Better noise handling than Roberts.'}
        {opKey === 'sobel' && 'Sobel: 3x3 with center weight 2. Most commonly used first-derivative operator. Better smoothing than Prewitt.'}
        {opKey === 'laplacian' && 'Laplacian: Second derivative (isotropic). Detects edges in all directions but double-edges at boundaries.'}
        {opKey === 'log' && 'LoG: Gaussian smoothing then Laplacian. Sigma controls scale of edges detected. Zero-crossings define edges.'}
      </div>
    </div>
  );
}
