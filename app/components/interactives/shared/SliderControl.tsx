'use client';

interface SliderControlProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  displayValue?: string;
}

export default function SliderControl({
  label,
  min,
  max,
  step,
  value,
  onChange,
  displayValue,
}: SliderControlProps) {
  return (
    <label className="flex items-center gap-2 text-[12px] text-[var(--text-2)]">
      <span className="font-medium whitespace-nowrap min-w-[60px]">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-1.5 accent-[var(--accent)] cursor-pointer"
      />
      <span className="font-mono text-[11px] min-w-[40px] text-right text-[var(--text-3)]">
        {displayValue ?? value.toFixed(step < 1 ? 2 : 0)}
      </span>
    </label>
  );
}
