'use client';

import { chapters } from '../courseData';
import { BlockMath } from './MathDisplay';

export default function FormulaSheet() {
  const chaptersWithFormulas = chapters
    .map((ch) => ({
      ...ch,
      allFormulas: ch.topics.flatMap((t) =>
        (t.formulas || []).map((f) => ({ formula: f, topicTitle: t.title }))
      ),
    }))
    .filter((ch) => ch.allFormulas.length > 0);

  if (chaptersWithFormulas.length === 0) {
    return (
      <p className="text-sm text-[var(--text-3)] py-8 text-center">
        No formulas found in course data.
      </p>
    );
  }

  return (
    <div>
      <p className="text-xs text-[var(--text-3)] mb-5">
        All formulas across {chaptersWithFormulas.length} lectures &middot; Quick reference for exam prep
      </p>

      {chaptersWithFormulas.map((ch) => (
        <div key={ch.id} className="mb-6">
          <h3 className="text-[13px] font-semibold text-[var(--text)] mb-2 flex items-baseline gap-2">
            <span className="text-[10px] text-[var(--text-3)] font-mono">L{ch.id}</span>
            {ch.title}
          </h3>

          <div className="space-y-2">
            {ch.allFormulas.map((item, i) => (
              <div
                key={i}
                className="formula-block flex items-start gap-3"
              >
                <span className="flex-shrink-0 text-[10px] text-[var(--text-3)] font-mono mt-2 w-24 truncate">
                  {item.topicTitle}
                </span>
                <div className="flex-1 min-w-0">
                  <BlockMath math={item.formula} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
