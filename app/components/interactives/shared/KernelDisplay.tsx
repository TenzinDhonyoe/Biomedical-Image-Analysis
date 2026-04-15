'use client';

interface KernelDisplayProps {
  kernel: number[][];
  label?: string;
}

export default function KernelDisplay({ kernel, label }: KernelDisplayProps) {
  const kh = kernel.length;
  const kw = kernel[0].length;
  const center = [Math.floor(kh / 2), Math.floor(kw / 2)];

  return (
    <div className="inline-block">
      {label && (
        <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">
          {label}
        </div>
      )}
      <div
        className="inline-grid gap-px bg-[var(--border)]"
        style={{ gridTemplateColumns: `repeat(${kw}, 1fr)` }}
      >
        {kernel.map((row, ry) =>
          row.map((val, rx) => (
            <div
              key={`${ry}-${rx}`}
              className={`w-8 h-8 flex items-center justify-center text-[10px] font-mono ${
                ry === center[0] && rx === center[1]
                  ? 'bg-[var(--accent)] text-white font-bold'
                  : 'bg-[var(--surface)] text-[var(--text-2)]'
              }`}
            >
              {Number.isInteger(val) ? val : val.toFixed(2)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
