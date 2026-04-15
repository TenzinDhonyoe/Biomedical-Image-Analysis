'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { generateTestImage, fft2d, fftShift, logMagnitude } from '../shared/imageUtils';
import { drawGrayscaleImage } from '../shared/useCanvas';

const SIZE = 64;

type ViewMode = 'all' | 'mag-only' | 'phase-only';

export default function FourierSpectrum() {
  const [imageType, setImageType] = useState<'checkerboard' | 'circle' | 'lines' | 'cameraman'>('checkerboard');
  const [shifted, setShifted] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [cutoff, setCutoff] = useState(SIZE / 2); // radius for frequency filter

  const origRef = useRef<HTMLCanvasElement>(null);
  const magRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<HTMLCanvasElement>(null);
  const reconRef = useRef<HTMLCanvasElement>(null);

  const DISPLAY = 128;

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

    // Draw original
    const ctxO = setupCanvas(origRef.current!);
    drawGrayscaleImage(ctxO, img, SIZE, SIZE, 0, 0, DISPLAY, DISPLAY);

    // Forward FFT
    const real = new Float64Array(SIZE * SIZE);
    const imag = new Float64Array(SIZE * SIZE);
    for (let i = 0; i < img.length; i++) real[i] = img[i];
    fft2d(real, imag, SIZE, SIZE);

    // Magnitude spectrum
    const magR = shifted ? fftShift(real, SIZE, SIZE) : new Float64Array(real);
    const magI = shifted ? fftShift(imag, SIZE, SIZE) : new Float64Array(imag);
    const mag = logMagnitude(magR, magI);
    const ctxM = setupCanvas(magRef.current!);
    drawGrayscaleImage(ctxM, mag, SIZE, SIZE, 0, 0, DISPLAY, DISPLAY);

    // Phase spectrum
    const phase = new Float64Array(SIZE * SIZE);
    const phaseDisplay = shifted ? fftShift(real, SIZE, SIZE) : new Float64Array(real);
    const phaseImag = shifted ? fftShift(imag, SIZE, SIZE) : new Float64Array(imag);
    for (let i = 0; i < phase.length; i++) {
      phase[i] = ((Math.atan2(phaseImag[i], phaseDisplay[i]) / Math.PI + 1) / 2) * 255;
    }
    const ctxP = setupCanvas(phaseRef.current!);
    drawGrayscaleImage(ctxP, phase, SIZE, SIZE, 0, 0, DISPLAY, DISPLAY);

    // Reconstruction based on view mode + cutoff filter
    const reconReal = new Float64Array(SIZE * SIZE);
    const reconImag = new Float64Array(SIZE * SIZE);
    const hw = SIZE / 2, hh = SIZE / 2;

    for (let i = 0; i < real.length; i++) {
      const y = Math.floor(i / SIZE);
      const x = i % SIZE;
      // Distance from DC (shifted center)
      const dy = ((y + hh) % SIZE) - hh;
      const dx = ((x + hw) % SIZE) - hw;
      const dist = Math.sqrt(dy * dy + dx * dx);

      // Apply frequency cutoff
      if (dist > cutoff) {
        reconReal[i] = 0;
        reconImag[i] = 0;
        continue;
      }

      const magnitude = Math.sqrt(real[i] ** 2 + imag[i] ** 2);
      const ph = Math.atan2(imag[i], real[i]);

      switch (viewMode) {
        case 'mag-only':
          reconReal[i] = magnitude;
          reconImag[i] = 0;
          break;
        case 'phase-only':
          reconReal[i] = Math.cos(ph);
          reconImag[i] = Math.sin(ph);
          break;
        default:
          reconReal[i] = real[i];
          reconImag[i] = imag[i];
      }
    }

    fft2d(reconReal, reconImag, SIZE, SIZE, true);

    // Normalize reconstruction
    let minV = Infinity, maxV = -Infinity;
    for (let i = 0; i < reconReal.length; i++) {
      if (reconReal[i] < minV) minV = reconReal[i];
      if (reconReal[i] > maxV) maxV = reconReal[i];
    }
    const range = maxV - minV || 1;
    const reconDisplay = new Float64Array(reconReal.length);
    for (let i = 0; i < reconReal.length; i++) {
      reconDisplay[i] = ((reconReal[i] - minV) / range) * 255;
    }

    const ctxR = setupCanvas(reconRef.current!);
    drawGrayscaleImage(ctxR, reconDisplay, SIZE, SIZE, 0, 0, DISPLAY, DISPLAY);
  }, [imageType, shifted, viewMode, cutoff, setupCanvas]);

  return (
    <div>
      <div className="text-[13px] font-semibold text-[var(--text)] mb-3">
        2D Fourier Transform Visualizer
      </div>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <select
          value={imageType}
          onChange={(e) => setImageType(e.target.value as typeof imageType)}
          className="text-[12px] px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] cursor-pointer"
        >
          <option value="checkerboard">Checkerboard</option>
          <option value="circle">Circle</option>
          <option value="lines">Horizontal Lines</option>
          <option value="cameraman">Scene</option>
        </select>

        <label className="flex items-center gap-1.5 text-[12px] text-[var(--text-2)] cursor-pointer">
          <input
            type="checkbox"
            checked={shifted}
            onChange={(e) => setShifted(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          FFT Shift
        </label>

        <select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as ViewMode)}
          className="text-[12px] px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] cursor-pointer"
        >
          <option value="all">Full Reconstruction</option>
          <option value="mag-only">Magnitude Only</option>
          <option value="phase-only">Phase Only</option>
        </select>

        <label className="flex items-center gap-1.5 text-[12px] text-[var(--text-2)]">
          <span className="whitespace-nowrap">Freq Cutoff</span>
          <input
            type="range"
            min={1}
            max={SIZE / 2}
            value={cutoff}
            onChange={(e) => setCutoff(parseInt(e.target.value))}
            className="w-20 h-1.5 accent-[var(--accent)] cursor-pointer"
          />
          <span className="font-mono text-[11px] text-[var(--text-3)]">{cutoff}</span>
        </label>
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">Original</div>
          <canvas ref={origRef} className="rounded border border-[var(--border-light)]" style={{ imageRendering: 'pixelated' }} />
        </div>
        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">Log |F(u,v)|</div>
          <canvas ref={magRef} className="rounded border border-[var(--border-light)]" style={{ imageRendering: 'pixelated' }} />
        </div>
        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">Phase</div>
          <canvas ref={phaseRef} className="rounded border border-[var(--border-light)]" style={{ imageRendering: 'pixelated' }} />
        </div>
        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">
            {viewMode === 'all' ? 'Reconstruction' : viewMode === 'mag-only' ? 'Mag-Only Recon' : 'Phase-Only Recon'}
          </div>
          <canvas ref={reconRef} className="rounded border border-[var(--border-light)]" style={{ imageRendering: 'pixelated' }} />
        </div>
      </div>

      <div className="mt-3 text-[11px] text-[var(--text-3)] italic">
        {viewMode === 'phase-only' && 'Phase carries structural information. Notice the reconstruction preserves edges and shapes even without magnitude.'}
        {viewMode === 'mag-only' && 'Magnitude alone loses spatial structure. The reconstruction shows no recognizable features.'}
        {viewMode === 'all' && cutoff < SIZE / 2 && 'Lowering the frequency cutoff removes high frequencies, blurring the image (lowpass filter).'}
        {viewMode === 'all' && cutoff >= SIZE / 2 && 'Try switching to Phase-Only or Magnitude-Only to see which carries more structural information.'}
      </div>
    </div>
  );
}
