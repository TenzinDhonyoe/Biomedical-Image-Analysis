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
      className={`cursor-pointer perspective-1000 h-64 ${flipped ? 'flashcard-flipped' : ''}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="flashcard-inner relative w-full h-full">
        <div className="flashcard-front absolute inset-0 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#1e293b] border border-[#334155] p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs text-[#38bdf8] mb-2 font-mono">
              Card {index + 1}/{total} -- Click to flip
            </div>
            <p className="text-[#e2e8f0] text-base leading-relaxed">
              {card.question}
            </p>
          </div>
          <div className="text-xs text-[#64748b] text-right">Q</div>
        </div>
        <div className="flashcard-back absolute inset-0 rounded-xl bg-gradient-to-br from-[#1a3a2a] to-[#1e293b] border border-[#22c55e]/30 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="text-xs text-[#22c55e] mb-2 font-mono">
              Answer
            </div>
            <p className="text-[#e2e8f0] text-sm leading-relaxed whitespace-pre-line">
              {card.answer}
            </p>
          </div>
          <div className="text-xs text-[#64748b] text-right">A</div>
        </div>
      </div>
    </div>
  );
}
