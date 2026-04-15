'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { generateTestImage } from '../shared/imageUtils';
import { drawGrayscaleImage } from '../shared/useCanvas';
import SliderControl from '../shared/SliderControl';

const SIZE = 64;
const DISPLAY = 256;

// 1D Haar forward transform (in-place on even-length array)
function haarForward(data: Float64Array, n: number) {
  const temp = new Float64Array(n);
  const half = n >> 1;
  for (let i = 0; i < half; i++) {
    temp[i] = (data[2 * i] + data[2 * i + 1]) / 2; // average (LL)
    temp[half + i] = (data[2 * i] - data[2 * i + 1]) / 2; // detail (HH)
  }
  for (let i = 0; i < n; i++) data[i] = temp[i];
}

// 1D Haar inverse transform
function haarInverse(data: Float64Array, n: number) {
  const temp = new Float64Array(n);
  const half = n >> 1;
  for (let i = 0; i < half; i++) {
    temp[2 * i] = data[i] + data[half + i];
    temp[2 * i + 1] = data[i] - data[half + i];
  }
  for (let i = 0; i < n; i++) data[i] = temp[i];
}

// 2D Haar decomposition (one level)
function haar2dForward(img: Float64Array, w: number, h: number, level: number) {
  const data = new Float64Array(img);
  let curW = w, curH = h;
  for (let l = 0; l < level; l++) {
    // Transform rows
    const row = new Float64Array(curW);
    for (let y = 0; y < curH; y++) {
      for (let x = 0; x < curW; x++) row[x] = data[y * w + x];
      haarForward(row, curW);
      for (let x = 0; x < curW; x++) data[y * w + x] = row[x];
    }
    // Transform columns
    const col = new Float64Array(curH);
    for (let x = 0; x < curW; x++) {
      for (let y = 0; y < curH; y++) col[y] = data[y * w + x];
      haarForward(col, curH);
      for (let y = 0; y < curH; y++) data[y * w + x] = col[y];
    }
    curW >>= 1;
    curH >>= 1;
  }
  return data;
}

// 2D Haar inverse
function haar2dInverse(coeffs: Float64Array, w: number, h: number, level: number) {
  const data = new Float64Array(coeffs);
  let curW = w >> level, curH = h >> level;
  for (let l = 0; l < level; l++) {
    curW <<= 1;
    curH <<= 1;
    // Inverse columns
    const col = new Float64Array(curH);
    for (let x = 0; x < curW; x++) {
      for (let y = 0; y < curH; y++) col[y] = data[y * w + x];
      haarInverse(col, curH);
      for (let y = 0; y < curH; y++) data[y * w + x] = col[y];
    }
    // Inverse rows
    const row = new Float64Array(curW);
    for (let y = 0; y < curH; y++) {
      for (let x = 0; x < curW; x++) row[x] = data[y * w + x];
      haarInverse(row, curW);
      for (let x = 0; x < curW; x++) data[y * w + x] = row[x];
    }
  }
  return data;
}

type SubbandMask = { ll: boolean; lh: boolean; hl: boolean; hh: boolean };

export default function WaveletDecomposition() {
  const [imageType, setImageType] = useState<'cameraman' | 'checkerboard' | 'circle'>('cameraman');
  const [level, setLevel] = useState(2);
  const [mask, setMask] = useState<SubbandMask>({ ll: true, lh: true, hl: true, hh: true });

  const decompRef = useRef<HTMLCanvasElement>(null);
  const reconRef = useRef<HTMLCanvasElement>(null);

  const setupCanvas = useCallback((canvas: HTMLCanvasElement, size: number) => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }, []);

  useEffect(() => {
    const img = generateTestImage(SIZE, SIZE, imageType);
    const imgF = new Float64Array(img);

    // Decompose
    const coeffs = haar2dForward(imgF, SIZE, SIZE, level);

    // Draw decomposition (normalize for display)
    const display = new Float64Array(coeffs.length);
    // Normalize each subband separately for visibility
    let minV = Infinity, maxV = -Infinity;
    for (let i = 0; i < coeffs.length; i++) {
      if (coeffs[i] < minV) minV = coeffs[i];
      if (coeffs[i] > maxV) maxV = coeffs[i];
    }
    const range = maxV - minV || 1;
    for (let i = 0; i < coeffs.length; i++) {
      display[i] = ((coeffs[i] - minV) / range) * 255;
    }

    const ctxD = setupCanvas(decompRef.current!, DISPLAY);
    drawGrayscaleImage(ctxD, display, SIZE, SIZE, 0, 0, DISPLAY, DISPLAY);

    // Draw subband borders on decomposition
    ctxD.strokeStyle = 'var(--accent)';
    ctxD.lineWidth = 1;
    const scale = DISPLAY / SIZE;
    let s = SIZE;
    for (let l = 0; l < level; l++) {
      const half = s / 2;
      // Horizontal line
      ctxD.beginPath();
      ctxD.moveTo(0, half * scale);
      ctxD.lineTo(s * scale, half * scale);
      ctxD.stroke();
      // Vertical line
      ctxD.beginPath();
      ctxD.moveTo(half * scale, 0);
      ctxD.lineTo(half * scale, s * scale);
      ctxD.stroke();
      s = half;
    }

    // Draw labels
    ctxD.fillStyle = 'var(--accent)';
    ctxD.font = '10px monospace';
    const labelS = SIZE >> level;
    ctxD.fillText('LL', 2 * scale, (labelS - 2) * scale);
    for (let l = 0; l < level; l++) {
      const bS = SIZE >> (l + 1);
      ctxD.fillText('HL', (bS + 2) * scale, (bS - 2) * scale);
      ctxD.fillText('LH', 2 * scale, (bS * 2 - 2) * scale);
      ctxD.fillText('HH', (bS + 2) * scale, (bS * 2 - 2) * scale);
    }

    // Reconstruction with masked subbands
    const masked = new Float64Array(coeffs);
    // Zero out subbands based on mask at ALL levels
    for (let l = 0; l < level; l++) {
      const bS = SIZE >> (l + 1);
      for (let y = 0; y < bS; y++) {
        for (let x = 0; x < bS; x++) {
          if (!mask.ll && l === level - 1) masked[y * SIZE + x] = 0; // LL only at deepest level
          if (!mask.hl) masked[y * SIZE + (x + bS)] = 0;
          if (!mask.lh) masked[(y + bS) * SIZE + x] = 0;
          if (!mask.hh) masked[(y + bS) * SIZE + (x + bS)] = 0;
        }
      }
    }

    const recon = haar2dInverse(masked, SIZE, SIZE, level);
    // Normalize reconstruction
    let rMin = Infinity, rMax = -Infinity;
    for (let i = 0; i < recon.length; i++) {
      if (recon[i] < rMin) rMin = recon[i];
      if (recon[i] > rMax) rMax = recon[i];
    }
    const rRange = rMax - rMin || 1;
    const reconDisplay = new Float64Array(recon.length);
    for (let i = 0; i < recon.length; i++) reconDisplay[i] = ((recon[i] - rMin) / rRange) * 255;

    const ctxR = setupCanvas(reconRef.current!, DISPLAY);
    drawGrayscaleImage(ctxR, reconDisplay, SIZE, SIZE, 0, 0, DISPLAY, DISPLAY);
  }, [imageType, level, mask, setupCanvas]);

  return (
    <div>
      <div className="text-[13px] font-semibold text-[var(--text)] mb-3">
        Haar Wavelet Decomposition
      </div>

      <div className="flex flex-wrap gap-3 mb-3 items-center">
        <select
          value={imageType}
          onChange={(e) => setImageType(e.target.value as typeof imageType)}
          className="text-[12px] px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] cursor-pointer"
        >
          <option value="cameraman">Scene</option>
          <option value="checkerboard">Checkerboard</option>
          <option value="circle">Circle</option>
        </select>
        <div className="max-w-[180px]">
          <SliderControl label="Level" min={1} max={3} step={1} value={level} onChange={(v) => setLevel(Math.round(v))} displayValue={level.toString()} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(['ll', 'lh', 'hl', 'hh'] as const).map(band => (
          <label key={band} className="flex items-center gap-1.5 text-[12px] text-[var(--text-2)] cursor-pointer">
            <input
              type="checkbox"
              checked={mask[band]}
              onChange={(e) => setMask(prev => ({ ...prev, [band]: e.target.checked }))}
              className="accent-[var(--accent)]"
            />
            {band.toUpperCase()}
            <span className="text-[10px] text-[var(--text-3)]">
              ({band === 'll' ? 'approx' : band === 'lh' ? 'horiz detail' : band === 'hl' ? 'vert detail' : 'diag detail'})
            </span>
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">Decomposition (Level {level})</div>
          <canvas ref={decompRef} className="rounded border border-[var(--border-light)]" style={{ imageRendering: 'pixelated' }} />
        </div>
        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">Reconstruction</div>
          <canvas ref={reconRef} className="rounded border border-[var(--border-light)]" style={{ imageRendering: 'pixelated' }} />
        </div>
      </div>

      <div className="mt-3 text-[11px] text-[var(--text-3)] italic">
        {!mask.ll && 'Without LL (approximation): only edges/details remain. This is the high-frequency content.'}
        {mask.ll && !mask.lh && !mask.hl && !mask.hh && 'LL only: blurry approximation without details. Each level halves the resolution.'}
        {mask.ll && mask.lh && mask.hl && mask.hh && 'All subbands: perfect reconstruction. Uncheck subbands to see their contribution.'}
      </div>
    </div>
  );
}
