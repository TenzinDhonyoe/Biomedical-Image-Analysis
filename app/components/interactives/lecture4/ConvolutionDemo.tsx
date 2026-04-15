'use client';

import { useState, useMemo, useCallback } from 'react';
import GridCanvas from '../shared/GridCanvas';
import KernelDisplay from '../shared/KernelDisplay';

const KERNELS: Record<string, { name: string; kernel: number[][] }> = {
  identity: { name: 'Identity', kernel: [[0, 0, 0], [0, 1, 0], [0, 0, 0]] },
  average: { name: 'Average 3x3', kernel: [[1/9, 1/9, 1/9], [1/9, 1/9, 1/9], [1/9, 1/9, 1/9]] },
  sharpen: { name: 'Sharpen', kernel: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]] },
  laplacian: { name: 'Laplacian', kernel: [[0, 1, 0], [1, -4, 1], [0, 1, 0]] },
  sobelX: { name: 'Sobel-X', kernel: [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]] },
  sobelY: { name: 'Sobel-Y', kernel: [[-1, -2, -1], [0, 0, 0], [1, 2, 1]] },
};

const DEFAULT_INPUT: number[][] = [
  [10, 10, 10, 10, 10, 10, 10, 10],
  [10, 10, 50, 50, 50, 50, 10, 10],
  [10, 50, 100, 100, 100, 50, 10, 10],
  [10, 50, 100, 200, 200, 100, 50, 10],
  [10, 50, 100, 200, 200, 100, 50, 10],
  [10, 50, 100, 100, 100, 50, 10, 10],
  [10, 10, 50, 50, 50, 50, 10, 10],
  [10, 10, 10, 10, 10, 10, 10, 10],
];

export default function ConvolutionDemo() {
  const [kernelKey, setKernelKey] = useState('average');
  const [stepPos, setStepPos] = useState(-1); // -1 = not stepping

  const kernel = KERNELS[kernelKey].kernel;
  const kSize = kernel.length;
  const kHalf = Math.floor(kSize / 2);
  const gridSize = DEFAULT_INPUT.length;

  // Valid convolution positions (excluding border)
  const validPositions = useMemo(() => {
    const pos: [number, number][] = [];
    for (let y = kHalf; y < gridSize - kHalf; y++)
      for (let x = kHalf; x < gridSize - kHalf; x++)
        pos.push([y, x]);
    return pos;
  }, [kHalf, gridSize]);

  // Full convolution result
  const output = useMemo(() => {
    const out = Array.from({ length: gridSize }, () => new Array(gridSize).fill(NaN));
    for (let y = kHalf; y < gridSize - kHalf; y++) {
      for (let x = kHalf; x < gridSize - kHalf; x++) {
        let sum = 0;
        for (let ky = 0; ky < kSize; ky++)
          for (let kx = 0; kx < kSize; kx++)
            sum += DEFAULT_INPUT[y + ky - kHalf][x + kx - kHalf] * kernel[ky][kx];
        out[y][x] = Math.round(sum);
      }
    }
    return out;
  }, [kernel, kHalf, kSize, gridSize]);

  // Current step computation
  const currentStep = useMemo(() => {
    if (stepPos < 0 || stepPos >= validPositions.length) return null;
    const [cy, cx] = validPositions[stepPos];
    const windowCells: [number, number][] = [];
    const products: number[] = [];
    for (let ky = 0; ky < kSize; ky++) {
      for (let kx = 0; kx < kSize; kx++) {
        const iy = cy + ky - kHalf;
        const ix = cx + kx - kHalf;
        windowCells.push([iy, ix]);
        products.push(DEFAULT_INPUT[iy][ix] * kernel[ky][kx]);
      }
    }
    const sum = products.reduce((a, b) => a + b, 0);
    return { cy, cx, windowCells, products, sum: Math.round(sum) };
  }, [stepPos, validPositions, kernel, kHalf, kSize]);

  // Partial output (only filled up to current step)
  const partialOutput = useMemo(() => {
    if (stepPos < 0) return output; // show full
    const out = Array.from({ length: gridSize }, () => new Array(gridSize).fill(NaN));
    for (let i = 0; i <= stepPos && i < validPositions.length; i++) {
      const [y, x] = validPositions[i];
      out[y][x] = output[y][x];
    }
    return out;
  }, [stepPos, validPositions, output, gridSize]);

  const handleStep = useCallback(() => {
    setStepPos(prev => {
      if (prev >= validPositions.length - 1) return prev;
      return prev + 1;
    });
  }, [validPositions.length]);

  const isRunMode = stepPos < 0;

  // For display, replace NaN with empty
  const displayOutput = partialOutput.map(row =>
    row.map(v => (isNaN(v) ? 0 : Math.max(0, Math.min(255, v))))
  );

  return (
    <div>
      <div className="text-[13px] font-semibold text-[var(--text)] mb-3">
        2D Convolution: Step-by-Step
      </div>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <select
          value={kernelKey}
          onChange={(e) => { setKernelKey(e.target.value); setStepPos(-1); }}
          className="text-[12px] px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] cursor-pointer"
        >
          {Object.entries(KERNELS).map(([k, v]) => (
            <option key={k} value={k}>{v.name}</option>
          ))}
        </select>

        <button
          onClick={() => setStepPos(0)}
          className={`text-[12px] px-3 py-1.5 rounded border cursor-pointer transition-colors ${
            !isRunMode
              ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
              : 'border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white'
          }`}
        >
          Step Mode
        </button>
        <button
          onClick={() => setStepPos(-1)}
          className={`text-[12px] px-3 py-1.5 rounded border cursor-pointer transition-colors ${
            isRunMode
              ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
              : 'border-[var(--border)] text-[var(--text-2)] hover:border-[var(--accent)]'
          }`}
        >
          Full Result
        </button>
      </div>

      <div className="flex flex-wrap gap-6 items-start">
        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">Input Image</div>
          <GridCanvas
            data={DEFAULT_INPUT}
            maxVal={200}
            minVal={10}
            cellSize={36}
            highlightCells={currentStep?.windowCells || []}
            highlightColor="var(--accent)"
          />
        </div>

        <div>
          <KernelDisplay kernel={kernel} label="Kernel" />
          {currentStep && (
            <div className="mt-3 text-[11px] text-[var(--text-2)] font-mono max-w-[200px]">
              <div className="mb-1 font-semibold text-[var(--accent)]">
                Position ({currentStep.cy}, {currentStep.cx})
              </div>
              <div>Sum = {currentStep.sum}</div>
              <div className="text-[var(--text-3)] mt-1">
                Step {stepPos + 1}/{validPositions.length}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">Output</div>
          <GridCanvas
            data={displayOutput}
            maxVal={200}
            minVal={0}
            cellSize={36}
            highlightCells={currentStep ? [[currentStep.cy, currentStep.cx]] : []}
            highlightColor="var(--green)"
          />
        </div>
      </div>

      {!isRunMode && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleStep}
            disabled={stepPos >= validPositions.length - 1}
            className="text-[12px] px-3 py-1.5 rounded border border-[var(--accent)] text-[var(--accent)] cursor-pointer disabled:opacity-30 disabled:cursor-default hover:bg-[var(--accent)] hover:text-white transition-colors"
          >
            Next Position &rarr;
          </button>
          <button
            onClick={() => setStepPos(-1)}
            className="text-[12px] px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-3)] cursor-pointer hover:border-[var(--text-3)] transition-colors"
          >
            Show Full Result
          </button>
        </div>
      )}

      <div className="mt-2 text-[11px] text-[var(--text-3)] italic">
        Watch the kernel slide across the image. At each position, element-wise multiply and sum gives the output pixel.
      </div>
    </div>
  );
}
