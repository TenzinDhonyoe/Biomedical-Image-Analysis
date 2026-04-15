'use client';

import { useState, useCallback, useMemo } from 'react';
import GridCanvas from '../shared/GridCanvas';
import KernelDisplay from '../shared/KernelDisplay';
import { dilate, erode } from '../shared/imageUtils';

const GRID_SIZE = 16;

const STRUCTURING_ELEMENTS: Record<string, { name: string; se: boolean[][] }> = {
  cross3: {
    name: '3x3 Cross',
    se: [
      [false, true, false],
      [true, true, true],
      [false, true, false],
    ],
  },
  square3: {
    name: '3x3 Square',
    se: [
      [true, true, true],
      [true, true, true],
      [true, true, true],
    ],
  },
  hline: {
    name: '1x3 Horizontal',
    se: [[true, true, true]],
  },
  vline: {
    name: '3x1 Vertical',
    se: [[true], [true], [true]],
  },
};

// Preset shapes
function makePreset(type: 'blob' | 'bridge' | 'hole'): Uint8Array {
  const g = new Uint8Array(GRID_SIZE * GRID_SIZE);
  const S = GRID_SIZE;
  switch (type) {
    case 'blob':
      // Circle with thin protrusions
      for (let y = 0; y < S; y++)
        for (let x = 0; x < S; x++) {
          const dx = x - S / 2 + 0.5, dy = y - S / 2 + 0.5;
          if (dx * dx + dy * dy < 20) g[y * S + x] = 255;
        }
      // Thin protrusion right
      for (let x = 10; x < 15; x++) g[8 * S + x] = 255;
      // Thin protrusion down
      for (let y = 10; y < 14; y++) g[y * S + 8] = 255;
      break;
    case 'bridge':
      // Two blobs connected by thin bridge
      for (let y = 3; y < 7; y++)
        for (let x = 2; x < 6; x++) g[y * S + x] = 255;
      for (let y = 3; y < 7; y++)
        for (let x = 10; x < 14; x++) g[y * S + x] = 255;
      g[5 * S + 6] = 255;
      g[5 * S + 7] = 255;
      g[5 * S + 8] = 255;
      g[5 * S + 9] = 255;
      break;
    case 'hole':
      // Filled rectangle with small holes
      for (let y = 2; y < 14; y++)
        for (let x = 2; x < 14; x++) g[y * S + x] = 255;
      // Holes
      g[5 * S + 5] = 0;
      g[5 * S + 6] = 0;
      g[6 * S + 5] = 0;
      g[6 * S + 6] = 0;
      g[9 * S + 10] = 0;
      break;
  }
  return g;
}

export default function MorphologyPlayground() {
  const [grid, setGrid] = useState<Uint8Array>(() => makePreset('blob'));
  const [seKey, setSeKey] = useState('cross3');
  const [lastOp, setLastOp] = useState<string | null>(null);
  const [prevGrid, setPrevGrid] = useState<Uint8Array | null>(null);

  const se = STRUCTURING_ELEMENTS[seKey].se;

  const toggleCell = useCallback((r: number, c: number) => {
    setGrid(prev => {
      const next = new Uint8Array(prev);
      next[r * GRID_SIZE + c] = next[r * GRID_SIZE + c] > 0 ? 0 : 255;
      return next;
    });
    setLastOp(null);
    setPrevGrid(null);
  }, []);

  const applyOp = useCallback((op: 'dilate' | 'erode' | 'open' | 'close') => {
    setPrevGrid(new Uint8Array(grid));
    let result: Uint8Array;
    switch (op) {
      case 'dilate':
        result = dilate(grid, GRID_SIZE, GRID_SIZE, se);
        break;
      case 'erode':
        result = erode(grid, GRID_SIZE, GRID_SIZE, se);
        break;
      case 'open':
        result = dilate(erode(grid, GRID_SIZE, GRID_SIZE, se), GRID_SIZE, GRID_SIZE, se);
        break;
      case 'close':
        result = erode(dilate(grid, GRID_SIZE, GRID_SIZE, se), GRID_SIZE, GRID_SIZE, se);
        break;
    }
    setGrid(result);
    setLastOp(op);
  }, [grid, se]);

  // Build display grid with diff coloring
  const displayData = useMemo(() => {
    const rows: number[][] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      const row: number[] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        row.push(grid[y * GRID_SIZE + x] > 0 ? 1 : 0);
      }
      rows.push(row);
    }
    return rows;
  }, [grid]);

  // Compute diff for color overlay
  const diffCells = useMemo(() => {
    if (!prevGrid || !lastOp) return { added: [] as [number, number][], removed: [] as [number, number][] };
    const added: [number, number][] = [];
    const removed: [number, number][] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const idx = y * GRID_SIZE + x;
        const was = prevGrid[idx] > 0;
        const now = grid[idx] > 0;
        if (!was && now) added.push([y, x]);
        if (was && !now) removed.push([y, x]);
      }
    }
    return { added, removed };
  }, [grid, prevGrid, lastOp]);

  // SE display as number kernel
  const seKernel = se.map(row => row.map(v => v ? 1 : 0));

  return (
    <div>
      <div className="text-[13px] font-semibold text-[var(--text)] mb-3">
        Morphological Operations Playground
      </div>

      <div className="flex flex-wrap gap-3 mb-3 items-center">
        <select
          value={seKey}
          onChange={(e) => { setSeKey(e.target.value); setLastOp(null); setPrevGrid(null); }}
          className="text-[12px] px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] cursor-pointer"
        >
          {Object.entries(STRUCTURING_ELEMENTS).map(([k, v]) => (
            <option key={k} value={k}>{v.name}</option>
          ))}
        </select>

        {(['dilate', 'erode', 'open', 'close'] as const).map(op => (
          <button
            key={op}
            onClick={() => applyOp(op)}
            className={`text-[12px] px-3 py-1.5 rounded border cursor-pointer transition-colors ${
              lastOp === op
                ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                : 'border-[var(--border)] text-[var(--text-2)] hover:border-[var(--accent)]'
            }`}
          >
            {op.charAt(0).toUpperCase() + op.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(['blob', 'bridge', 'hole'] as const).map(preset => (
          <button
            key={preset}
            onClick={() => { setGrid(makePreset(preset)); setLastOp(null); setPrevGrid(null); }}
            className="text-[11px] px-2 py-1 rounded border border-[var(--border)] text-[var(--text-3)] cursor-pointer hover:border-[var(--text-3)] transition-colors"
          >
            Preset: {preset}
          </button>
        ))}
        <button
          onClick={() => { setGrid(new Uint8Array(GRID_SIZE * GRID_SIZE)); setLastOp(null); setPrevGrid(null); }}
          className="text-[11px] px-2 py-1 rounded border border-[var(--border)] text-[var(--text-3)] cursor-pointer hover:border-[var(--text-3)] transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="flex flex-wrap gap-6 items-start">
        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">
            Grid (click to toggle)
          </div>
          {/* Custom grid rendering with diff colors */}
          <div
            className="inline-grid gap-px bg-[var(--border)] rounded overflow-hidden"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`,
            }}
          >
            {displayData.map((row, ry) =>
              row.map((val, rx) => {
                const isAdded = diffCells.added.some(([r, c]) => r === ry && c === rx);
                const isRemoved = diffCells.removed.some(([r, c]) => r === ry && c === rx);
                let bg = val > 0 ? 'var(--text)' : 'var(--bg)';
                if (isAdded) bg = '#22c55e';
                if (isRemoved) bg = '#ef4444';
                return (
                  <div
                    key={`${ry}-${rx}`}
                    onClick={() => toggleCell(ry, rx)}
                    className="cursor-pointer hover:opacity-80 transition-colors"
                    style={{ width: 20, height: 20, backgroundColor: bg }}
                  />
                );
              })
            )}
          </div>
        </div>

        <div>
          <KernelDisplay kernel={seKernel} label="Structuring Element" />
          {lastOp && (
            <div className="mt-3 text-[11px]">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="inline-block w-3 h-3 rounded bg-[#22c55e]" />
                <span className="text-[var(--text-2)]">Added ({diffCells.added.length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded bg-[#ef4444]" />
                <span className="text-[var(--text-2)]">Removed ({diffCells.removed.length})</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 text-[11px] text-[var(--text-3)] italic">
        {!lastOp && 'Click cells to draw, then apply operations. Green = added pixels, Red = removed pixels.'}
        {lastOp === 'dilate' && 'Dilation: Grows the foreground. If ANY SE pixel overlaps foreground, output is 1.'}
        {lastOp === 'erode' && 'Erosion: Shrinks the foreground. Output is 1 only if ALL SE pixels overlap foreground.'}
        {lastOp === 'open' && 'Opening = Erode then Dilate. Removes thin protrusions and small objects. Smooths contour from outside.'}
        {lastOp === 'close' && 'Closing = Dilate then Erode. Fills small holes and gaps. Smooths contour from inside.'}
      </div>
    </div>
  );
}
