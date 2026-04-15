'use client';

interface GridCanvasProps {
  data: number[][];
  editable?: boolean;
  onCellClick?: (row: number, col: number) => void;
  maxVal?: number;
  minVal?: number;
  highlightCells?: [number, number][];
  highlightColor?: string;
  cellSize?: number;
  showValues?: boolean;
  binaryMode?: boolean;
  colorMap?: 'gray' | 'green-red';
}

export default function GridCanvas({
  data,
  editable = false,
  onCellClick,
  maxVal = 255,
  minVal = 0,
  highlightCells = [],
  highlightColor = 'var(--accent)',
  cellSize = 32,
  showValues = true,
  binaryMode = false,
  colorMap = 'gray',
}: GridCanvasProps) {
  const rows = data.length;
  const cols = data[0]?.length || 0;

  const highlightSet = new Set(highlightCells.map(([r, c]) => `${r}-${c}`));

  function getCellColor(val: number): string {
    if (binaryMode) {
      return val > 0 ? 'var(--text)' : 'var(--bg)';
    }
    if (colorMap === 'green-red') {
      if (val > 0) return '#22c55e';
      if (val < 0) return '#ef4444';
      return 'var(--surface)';
    }
    const range = maxVal - minVal || 1;
    const norm = Math.max(0, Math.min(1, (val - minVal) / range));
    const g = Math.round(norm * 255);
    return `rgb(${g}, ${g}, ${g})`;
  }

  function getTextColor(val: number): string {
    if (binaryMode) return val > 0 ? 'var(--bg)' : 'var(--text)';
    if (colorMap === 'green-red') return 'white';
    const range = maxVal - minVal || 1;
    const norm = (val - minVal) / range;
    return norm > 0.5 ? '#111' : '#eee';
  }

  return (
    <div
      className="inline-grid gap-px bg-[var(--border)] rounded overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
      }}
    >
      {data.map((row, ry) =>
        row.map((val, rx) => {
          const isHighlighted = highlightSet.has(`${ry}-${rx}`);
          return (
            <div
              key={`${ry}-${rx}`}
              onClick={() => {
                if (editable && onCellClick) onCellClick(ry, rx);
              }}
              className={`flex items-center justify-center transition-colors ${
                editable ? 'cursor-pointer hover:opacity-80' : ''
              }`}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: getCellColor(val),
                color: getTextColor(val),
                fontSize: cellSize < 24 ? 8 : 11,
                fontFamily: 'monospace',
                fontWeight: isHighlighted ? 700 : 400,
                outline: isHighlighted ? `2px solid ${highlightColor}` : 'none',
                outlineOffset: '-2px',
                zIndex: isHighlighted ? 1 : 0,
              }}
            >
              {showValues && (cellSize >= 20 ? val : '')}
            </div>
          );
        })
      )}
    </div>
  );
}
