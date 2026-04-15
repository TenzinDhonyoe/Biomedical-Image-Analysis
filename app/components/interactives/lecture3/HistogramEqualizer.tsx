'use client';

import { useState, useMemo, useCallback } from 'react';
import GridCanvas from '../shared/GridCanvas';

const DEFAULT_GRID: number[][] = [
  [3, 5, 5, 4],
  [3, 4, 5, 7],
  [6, 5, 5, 4],
  [0, 7, 6, 2],
];
const L = 8; // 8 gray levels (0-7)
const N = 16; // 4x4 = 16 pixels total

type Step = 'input' | 'histogram' | 'cdf' | 'mapping' | 'result';
const STEPS: Step[] = ['input', 'histogram', 'cdf', 'mapping', 'result'];
const STEP_LABELS: Record<Step, string> = {
  input: '1. Input Image',
  histogram: '2. Compute Histogram',
  cdf: '3. Compute CDF',
  mapping: '4. Apply Mapping s_k = round((L-1)*CDF)',
  result: '5. Equalized Result',
};

export default function HistogramEqualizer() {
  const [grid, setGrid] = useState(DEFAULT_GRID);
  const [stepIdx, setStepIdx] = useState(0);
  const step = STEPS[stepIdx];

  const toggleCell = useCallback((r: number, c: number) => {
    setGrid(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = (next[r][c] + 1) % L;
      return next;
    });
    setStepIdx(0); // reset when editing
  }, []);

  // Compute histogram equalization
  const { hist, cdf, mapping, equalizedGrid, equalizedHist } = useMemo(() => {
    const flat = grid.flat();
    // Histogram
    const h = new Array(L).fill(0);
    for (const v of flat) h[v]++;
    // CDF
    const c = new Array(L).fill(0);
    c[0] = h[0];
    for (let i = 1; i < L; i++) c[i] = c[i - 1] + h[i];
    // Mapping: s_k = round((L-1) * CDF(k))
    const m = new Array(L).fill(0);
    for (let k = 0; k < L; k++) m[k] = Math.round((L - 1) * (c[k] / N));
    // Apply
    const eq = grid.map(row => row.map(v => m[v]));
    // Equalized histogram
    const eh = new Array(L).fill(0);
    for (const row of eq) for (const v of row) eh[v]++;

    return { hist: h, cdf: c, mapping: m, equalizedGrid: eq, equalizedHist: eh };
  }, [grid]);

  const BarChart = ({ data, maxH, highlight, label }: { data: number[]; maxH: number; highlight?: number; label: string }) => {
    const barW = 28;
    const chartW = L * barW + (L - 1) * 4;
    const chartH = 80;
    return (
      <div>
        <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">{label}</div>
        <svg width={chartW} height={chartH + 20} className="block">
          {data.map((v, i) => {
            const barH = maxH > 0 ? (v / maxH) * chartH : 0;
            const x = i * (barW + 4);
            const isHL = highlight !== undefined && i === highlight;
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={chartH - barH}
                  width={barW}
                  height={barH}
                  fill={isHL ? 'var(--accent)' : 'var(--text-3)'}
                  opacity={isHL ? 1 : 0.5}
                  rx={2}
                />
                <text
                  x={x + barW / 2}
                  y={chartH - barH - 3}
                  textAnchor="middle"
                  fill="var(--text-2)"
                  fontSize={9}
                  fontFamily="monospace"
                >
                  {v}
                </text>
                <text
                  x={x + barW / 2}
                  y={chartH + 14}
                  textAnchor="middle"
                  fill="var(--text-3)"
                  fontSize={9}
                  fontFamily="monospace"
                >
                  {i}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const maxHist = Math.max(...hist, ...equalizedHist);

  return (
    <div>
      <div className="text-[13px] font-semibold text-[var(--text)] mb-3">
        Histogram Equalization: Step-by-Step
      </div>

      {/* Step navigation */}
      <div className="flex flex-wrap gap-2 mb-4">
        {STEPS.map((s, i) => (
          <button
            key={s}
            onClick={() => setStepIdx(i)}
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
            {step === 'result' ? 'Original' : 'Input (click to edit)'}
          </div>
          <GridCanvas
            data={grid}
            editable={step === 'input'}
            onCellClick={toggleCell}
            maxVal={L - 1}
            minVal={0}
            cellSize={40}
          />
        </div>

        {/* Histogram */}
        {stepIdx >= 1 && (
          <BarChart data={hist} maxH={maxHist} label="Histogram h(r_k)" />
        )}

        {/* CDF Table */}
        {stepIdx >= 2 && (
          <div>
            <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">CDF Table</div>
            <table className="text-[11px] font-mono border-collapse">
              <thead>
                <tr>
                  <th className="px-2 py-1 border border-[var(--border)] bg-[var(--bg)] text-[var(--text-3)]">r_k</th>
                  <th className="px-2 py-1 border border-[var(--border)] bg-[var(--bg)] text-[var(--text-3)]">h(r_k)</th>
                  <th className="px-2 py-1 border border-[var(--border)] bg-[var(--bg)] text-[var(--text-3)]">CDF</th>
                  {stepIdx >= 3 && (
                    <th className="px-2 py-1 border border-[var(--border)] bg-[var(--bg)] text-[var(--text-3)]">s_k</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: L }, (_, k) => (
                  <tr key={k}>
                    <td className="px-2 py-1 border border-[var(--border)] text-[var(--text-2)]">{k}</td>
                    <td className="px-2 py-1 border border-[var(--border)] text-[var(--text-2)]">{hist[k]}</td>
                    <td className="px-2 py-1 border border-[var(--border)] text-[var(--text-2)]">
                      {cdf[k]}/{N} = {(cdf[k] / N).toFixed(3)}
                    </td>
                    {stepIdx >= 3 && (
                      <td className="px-2 py-1 border border-[var(--border)] font-bold text-[var(--accent)]">
                        {mapping[k]}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {stepIdx >= 3 && (
              <div className="text-[10px] text-[var(--text-3)] mt-1 italic">
                s_k = round({L - 1} &times; CDF(r_k))
              </div>
            )}
          </div>
        )}

        {/* Result */}
        {stepIdx >= 4 && (
          <>
            <div>
              <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">Equalized</div>
              <GridCanvas
                data={equalizedGrid}
                maxVal={L - 1}
                minVal={0}
                cellSize={40}
              />
            </div>
            <BarChart data={equalizedHist} maxH={maxHist} label="Equalized Histogram" />
          </>
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
          onClick={() => { setGrid(DEFAULT_GRID); setStepIdx(0); }}
          className="text-[12px] px-3 py-1.5 rounded border border-[var(--border)] text-[var(--text-3)] cursor-pointer hover:border-[var(--text-3)] transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="mt-2 text-[11px] text-[var(--text-3)] italic">
        This mirrors the exam format: compute histogram, CDF, then apply s_k = round((L-1) &times; CDF(r_k)) to each pixel.
      </div>
    </div>
  );
}
