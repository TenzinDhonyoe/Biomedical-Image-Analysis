'use client';

import { useState, useMemo, useCallback } from 'react';
import GridCanvas from '../shared/GridCanvas';

const GRID_ROWS = 4;
const GRID_COLS = 4;
const LEVELS = 4; // Gray levels 0-3

const DEFAULT_GRID: number[][] = [
  [0, 0, 1, 1],
  [0, 0, 1, 1],
  [0, 2, 2, 2],
  [2, 2, 3, 3],
];

type Direction = 'right' | 'down' | 'diag';
const DIRECTIONS: Record<Direction, { name: string; dx: number; dy: number }> = {
  right: { name: 'Horizontal (0, 1)', dx: 1, dy: 0 },
  down: { name: 'Vertical (1, 0)', dx: 0, dy: 1 },
  diag: { name: 'Diagonal (1, 1)', dx: 1, dy: 1 },
};

type Step = 'input' | 'pairs' | 'glcm' | 'normalized' | 'features';
const STEPS: Step[] = ['input', 'pairs', 'glcm', 'normalized', 'features'];
const STEP_LABELS: Record<Step, string> = {
  input: '1. Input Image',
  pairs: '2. Count Pairs',
  glcm: '3. Build GLCM',
  normalized: '4. Normalize',
  features: '5. Compute Features',
};

export default function GLCMCalculator() {
  const [grid, setGrid] = useState(DEFAULT_GRID);
  const [direction, setDirection] = useState<Direction>('right');
  const [stepIdx, setStepIdx] = useState(0);
  const [highlightPair, setHighlightPair] = useState(-1);
  const step = STEPS[stepIdx];

  const { dx, dy } = DIRECTIONS[direction];

  const toggleCell = useCallback((r: number, c: number) => {
    setGrid(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = (next[r][c] + 1) % LEVELS;
      return next;
    });
    setStepIdx(0);
  }, []);

  // Compute pairs and GLCM
  const { pairs, glcm, normalized, features } = useMemo(() => {
    const p: { r: number; c: number; val: number; nr: number; nc: number; nval: number }[] = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const nr = r + dy, nc = c + dx;
        if (nr >= 0 && nr < GRID_ROWS && nc >= 0 && nc < GRID_COLS) {
          p.push({ r, c, val: grid[r][c], nr, nc, nval: grid[nr][nc] });
        }
      }
    }

    // Build GLCM
    const g = Array.from({ length: LEVELS }, () => new Array(LEVELS).fill(0));
    for (const pair of p) {
      g[pair.val][pair.nval]++;
    }

    // Symmetric: also count reverse
    const gSym = g.map(row => [...row]);
    for (let i = 0; i < LEVELS; i++)
      for (let j = 0; j < LEVELS; j++)
        gSym[i][j] = g[i][j] + g[j][i];

    // Normalize
    let total = 0;
    for (let i = 0; i < LEVELS; i++)
      for (let j = 0; j < LEVELS; j++)
        total += gSym[i][j];

    const norm = gSym.map(row => row.map(v => total > 0 ? v / total : 0));

    // Features
    let contrast = 0, homogeneity = 0, energy = 0, entropy = 0;
    for (let i = 0; i < LEVELS; i++) {
      for (let j = 0; j < LEVELS; j++) {
        const p = norm[i][j];
        contrast += (i - j) ** 2 * p;
        homogeneity += p / (1 + Math.abs(i - j));
        energy += p ** 2;
        if (p > 0) entropy -= p * Math.log2(p);
      }
    }

    return {
      pairs: p,
      glcm: gSym,
      normalized: norm,
      features: { contrast, homogeneity, energy, entropy },
    };
  }, [grid, dx, dy]);

  // Highlight cells for current pair
  const pairHighlight: [number, number][] = highlightPair >= 0 && highlightPair < pairs.length
    ? [[pairs[highlightPair].r, pairs[highlightPair].c], [pairs[highlightPair].nr, pairs[highlightPair].nc]]
    : [];

  return (
    <div>
      <div className="text-[13px] font-semibold text-[var(--text)] mb-3">
        GLCM Construction: Step-by-Step
      </div>

      <div className="flex flex-wrap gap-3 mb-3 items-center">
        <select
          value={direction}
          onChange={(e) => { setDirection(e.target.value as Direction); setStepIdx(0); setHighlightPair(-1); }}
          className="text-[12px] px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] cursor-pointer"
        >
          {Object.entries(DIRECTIONS).map(([k, v]) => (
            <option key={k} value={k}>{v.name}</option>
          ))}
        </select>
      </div>

      {/* Step navigation */}
      <div className="flex flex-wrap gap-2 mb-4">
        {STEPS.map((s, i) => (
          <button
            key={s}
            onClick={() => { setStepIdx(i); setHighlightPair(-1); }}
            className={`text-[11px] px-2.5 py-1 rounded-full border cursor-pointer transition-colors ${
              i === stepIdx
                ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                : i < stepIdx
                ? 'border-[var(--green)] text-[var(--green)]'
                : 'border-[var(--border)] text-[var(--text-3)]'
            }`}
          >
            {STEP_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-6 items-start">
        {/* Input grid */}
        <div>
          <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">
            Image (click to edit, levels 0-{LEVELS - 1})
          </div>
          <GridCanvas
            data={grid}
            editable={step === 'input'}
            onCellClick={toggleCell}
            maxVal={LEVELS - 1}
            minVal={0}
            cellSize={44}
            highlightCells={pairHighlight}
          />
        </div>

        {/* Pair list */}
        {stepIdx >= 1 && (
          <div>
            <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">
              Pixel Pairs ({pairs.length} total)
            </div>
            <div className="max-h-[200px] overflow-y-auto text-[11px] font-mono">
              {pairs.map((p, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHighlightPair(i)}
                  onMouseLeave={() => setHighlightPair(-1)}
                  className={`px-2 py-0.5 cursor-pointer rounded transition-colors ${
                    highlightPair === i ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-2)] hover:bg-[var(--surface)]'
                  }`}
                >
                  ({p.r},{p.c})={p.val} &rarr; ({p.nr},{p.nc})={p.nval}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GLCM */}
        {stepIdx >= 2 && (
          <div>
            <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">
              {stepIdx >= 3 ? 'Normalized GLCM' : 'GLCM (symmetric)'}
            </div>
            <table className="text-[11px] font-mono border-collapse">
              <thead>
                <tr>
                  <th className="px-2 py-1 border border-[var(--border)] bg-[var(--bg)] text-[var(--text-3)]">i\j</th>
                  {Array.from({ length: LEVELS }, (_, j) => (
                    <th key={j} className="px-2 py-1 border border-[var(--border)] bg-[var(--bg)] text-[var(--text-3)]">{j}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: LEVELS }, (_, i) => (
                  <tr key={i}>
                    <td className="px-2 py-1 border border-[var(--border)] bg-[var(--bg)] text-[var(--text-3)] font-bold">{i}</td>
                    {Array.from({ length: LEVELS }, (_, j) => (
                      <td
                        key={j}
                        className={`px-2 py-1 border border-[var(--border)] text-center ${
                          (stepIdx >= 3 ? normalized[i][j] : glcm[i][j]) > 0
                            ? 'text-[var(--accent)] font-bold'
                            : 'text-[var(--text-3)]'
                        }`}
                      >
                        {stepIdx >= 3 ? normalized[i][j].toFixed(3) : glcm[i][j]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Features */}
        {stepIdx >= 4 && (
          <div>
            <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">Texture Features</div>
            <div className="space-y-2 text-[12px]">
              {[
                { name: 'Contrast', val: features.contrast, formula: 'Sum (i-j)^2 * P(i,j)', desc: 'High = large intensity differences' },
                { name: 'Homogeneity', val: features.homogeneity, formula: 'Sum P(i,j)/(1+|i-j|)', desc: 'High = similar neighbor values' },
                { name: 'Energy', val: features.energy, formula: 'Sum P(i,j)^2', desc: 'High = uniform texture (few dominant pairs)' },
                { name: 'Entropy', val: features.entropy, formula: '-Sum P*log2(P)', desc: 'High = complex/random texture' },
              ].map(f => (
                <div key={f.name} className="bg-[var(--bg)] rounded p-2 border border-[var(--border-light)]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--text)]">{f.name}:</span>
                    <span className="font-mono text-[var(--accent)]">{f.val.toFixed(4)}</span>
                  </div>
                  <div className="text-[10px] text-[var(--text-3)] mt-0.5">{f.formula} &mdash; {f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setStepIdx(Math.max(0, stepIdx - 1))}
          disabled={stepIdx === 0}
          className="text-[12px] px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-2)] cursor-pointer disabled:opacity-30 disabled:cursor-default hover:border-[var(--accent)] transition-colors"
        >
          &larr; Prev
        </button>
        <button
          onClick={() => setStepIdx(Math.min(STEPS.length - 1, stepIdx + 1))}
          disabled={stepIdx === STEPS.length - 1}
          className="text-[12px] px-3 py-1.5 rounded border border-[var(--accent)] text-[var(--accent)] cursor-pointer disabled:opacity-30 disabled:cursor-default hover:bg-[var(--accent)] hover:text-white transition-colors"
        >
          Next Step &rarr;
        </button>
        <button
          onClick={() => { setGrid(DEFAULT_GRID); setStepIdx(0); setHighlightPair(-1); }}
          className="text-[12px] px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-3)] cursor-pointer hover:border-[var(--text-3)] transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="mt-2 text-[11px] text-[var(--text-3)] italic">
        Hover over pixel pairs to highlight them on the image. The GLCM counts co-occurrences of gray-level pairs at the chosen offset.
      </div>
    </div>
  );
}
