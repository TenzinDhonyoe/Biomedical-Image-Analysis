'use client';

import { useState } from 'react';
import type { FlashCard as FlashCardType } from '../courseData';

export default function FlashCard({
  card,
  index,
  total,
}: {
  card: FlashCardType;
  index: number;
  total: number;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`cursor-pointer perspective-1000 h-52 ${flipped ? 'flashcard-flipped' : ''}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="flashcard-inner relative w-full h-full">
        {/* Front */}
        <div className="flashcard-front absolute inset-0 rounded border border-[#e5e7eb] bg-white p-5 flex flex-col justify-between">
          <div>
            <p className="text-[11px] text-[#9ca3af] font-mono mb-2">
              Click to reveal answer
            </p>
            <p className="text-sm text-[#111827] leading-relaxed">
              {card.question}
            </p>
          </div>
          <p className="text-[10px] text-[#d1d5db] text-right font-mono">Q</p>
        </div>
        {/* Back */}
        <div className="flashcard-back absolute inset-0 rounded border border-[#d1fae5] bg-[#f0fdf4] p-5 flex flex-col justify-between overflow-y-auto">
          <div>
            <p className="text-[11px] text-[#16a34a] font-mono mb-2">
              Answer
            </p>
            <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-line">
              {card.answer}
            </p>
          </div>
          <p className="text-[10px] text-[#bbf7d0] text-right font-mono">A</p>
        </div>
      </div>
    </div>
  );
}
