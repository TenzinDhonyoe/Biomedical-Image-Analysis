'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import SliderControl from '../shared/SliderControl';
import { generateTestImage, addGaussianNoise, convolve2d, fft2d, gaussianKernel } from '../shared/imageUtils';
import { drawGrayscaleImage } from '../shared/useCanvas';

const SIZE = 64;
const DISPLAY = 140;

type RestoreMethod = 'none' | 'inverse' | 'wiener';

export default function NoiseAndRestoration() {
  const [noiseVar, setNoiseVar] = useState(200);
  const [blurSize, setBlurSize] = useState(3);
  const [method, setMethod] = useState<RestoreMethod>('none');
  const [wienerK, setWienerK] = useState(0.01);

  const cleanRef = useRef<HTMLCanvasElement>(null);
  const degradedRef = useRef<HTMLCanvasElement>(null);
  const restoredRef = useRef<HTMLCanvasElement>(null);

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
    const clean = generateTestImage(SIZE, SIZE, 'cameraman');
    const ctxC = setupCanvas(cleanRef.current!);
    drawGrayscaleImage(ctxC, clean, SIZE, SIZE, 0, 0, DISPLAY, DISPLAY);

    // Blur
    const blurKernel = gaussianKernel(blurSize, blurSize / 3);
    const blurred = convolve2d(clean, blurKernel, SIZE, SIZE);

    // Add noise
    const blurredU8 = new Uint8Array(blurred.length);
    for (let i = 0; i < blurred.length; i++) blurredU8[i] = Math.max(0, Math.min(255, Math.round(blurred[i])));
    const degraded = addGaussianNoise(blurredU8, noiseVar);
    const ctxD = setupCanvas(degradedRef.current!);
    drawGrayscaleImage(ctxD, degraded, SIZE, SIZE, 0, 0, DISPLAY, DISPLAY);

    // Restoration
    const ctxR = setupCanvas(restoredRef.current!);
    if (method === 'none') {
      drawGrayscaleImage(ctxR, degraded, SIZE, SIZE, 0, 0, DISPLAY, DISPLAY);
    } else {
      // FFT of degraded
      const gReal = new Float64Array(SIZE * SIZE);
      const gImag = new Float64Array(SIZE * SIZE);
      for (let i = 0; i < degraded.length; i++) gReal[i] = degraded[i];
      fft2d(gReal, gImag, SIZE, SIZE);

      // FFT of blur kernel (pad to image size)
      const hReal = new Float64Array(SIZE * SIZE);
      const hImag = new Float64Array(SIZE * SIZE);
      const kHalf = Math.floor(blurSize / 2);
      for (let ky = 0; ky < blurSize; ky++) {
        for (let kx = 0; kx < blurSize; kx++) {
          const y = (ky - kHalf + SIZE) % SIZE;
          const x = (kx - kHalf + SIZE) % SIZE;
          hReal[y * SIZE + x] = blurKernel[ky][kx];
        }
      }
      fft2d(hReal, hImag, SIZE, SIZE);

      const fReal = new Float64Array(SIZE * SIZE);
      const fImag = new Float64Array(SIZE * SIZE);

      for (let i = 0; i < SIZE * SIZE; i++) {
        const hMag2 = hReal[i] ** 2 + hImag[i] ** 2;
        // H conjugate
        const hConR = hReal[i];
        const hConI = -hImag[i];

        if (method === 'inverse') {
          // F = G / H
          if (hMag2 < 1e-10) {
            fReal[i] = 0;
            fImag[i] = 0;
          } else {
            fReal[i] = (gReal[i] * hConR - gImag[i] * hConI) / hMag2;
            fImag[i] = (gImag[i] * hConR + gReal[i] * hConI) / hMag2;
          }
        } else {
          // Wiener: F = (H* / (|H|^2 + K)) * G
          const denom = hMag2 + wienerK;
          const wR = hConR / denom;
          const wI = hConI / denom;
          fReal[i] = gReal[i] * wR - gImag[i] * wI;
          fImag[i] = gImag[i] * wR + gReal[i] * wI;
        }
      }

      fft2d(fReal, fImag, SIZE, SIZE, true);

      // Normalize and display
      const restored = new Float64Array(SIZE * SIZE);
      let minV = Infinity, maxV = -Infinity;
      for (let i = 0; i < fReal.length; i++) {
        if (fReal[i] < minV) minV = fReal[i];
        if (fReal[i] > maxV) maxV = fReal[i];
      }
      const range = maxV - minV || 1;
      for (let i = 0; i < fReal.length; i++) {
        restored[i] = ((fReal[i] - minV) / range) * 255;
      }
      drawGrayscaleImage(ctxR, restored, SIZE, SIZE, 0, 0, DISPLAY, DISPLAY);
    }
  }, [noiseVar, blurSize, method, wienerK, setupCanvas]);

  // MSE computation
  const mseLabel = method === 'none' ? 'No restoration' :
    method === 'inverse' ? 'Inverse filter (N/H blow-up)' : 'Wiener filter';

  return (
    <div>
      <div className="text-[13px] font-semibold text-[var(--text)] mb-3">
        Image Degradation & Restoration
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="max-w-[200px] flex-1 min-w-[150px]">
          <SliderControl label="Noise" min={0} max={2000} step={50} value={noiseVar} onChange={setNoiseVar} displayValue={noiseVar.toString()} />
        </div>
        <div className="max-w-[200px] flex-1 min-w-[150px]">
          <SliderControl label="Blur" min={1} max={11} step={2} value={blurSize} onChange={(v) => setBlurSize(Math.round(v) | 1)} displayValue={`${blurSize}x${blurSize}`} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(['none', 'inverse', 'wiener'] as RestoreMethod[]).map(m => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`text-[12px] px-3 py-1.5 rounded border cursor-pointer transition-colors ${
              method === m
                ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                : 'border-[var(--border)] text-[var(--text-2)] hover:border-[var(--accent)]'
            }`}
          >
            {m === 'none' ? 'No Restoration' : m === 'inverse' ? 'Inverse Filter' : 'Wiener Filter'}
          </button>
        ))}
      </div>

      {method === 'wiener' && (
        <div className="max-w-xs mb-4">
          <SliderControl label="K (SNR)" min={0.0001} max={0.1} step={0.0005} value={wienerK} onChange={setWienerK} displayValue={wienerK.toFixed(4)} />
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">Clean</div>
          <canvas ref={cleanRef} className="rounded border border-[var(--border-light)]" style={{ imageRendering: 'pixelated' }} />
        </div>
        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">Degraded (blur + noise)</div>
          <canvas ref={degradedRef} className="rounded border border-[var(--border-light)]" style={{ imageRendering: 'pixelated' }} />
        </div>
        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">Restored ({mseLabel})</div>
          <canvas ref={restoredRef} className="rounded border border-[var(--border-light)]" style={{ imageRendering: 'pixelated' }} />
        </div>
      </div>

      <div className="mt-3 text-[11px] text-[var(--text-3)] italic">
        {method === 'inverse' && 'Inverse filtering divides by H(u,v). Where H is small (zeros), noise N/H blows up. This is why inverse filtering fails with noise.'}
        {method === 'wiener' && 'Wiener filter adds K to the denominator: H*/(|H|^2 + K). K prevents division by small values. Increase K to suppress noise (at cost of sharpness).'}
        {method === 'none' && 'Increase noise and blur, then try Inverse vs Wiener filter to see why Wiener works better.'}
      </div>
    </div>
  );
}
