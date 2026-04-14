'use client';

import { useState } from 'react';
import type { Chapter } from '../courseData';
import { BlockMath } from './MathDisplay';
import FlashCard from './FlashCard';

export default function ChapterSection({ chapter }: { chapter: Chapter }) {
  const [expanded, setExpanded] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);

  return (
    <section id={`ch${chapter.id}`} className="scroll-mt-28">
      {/* Collapsed / Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left flex items-start gap-3 py-3 px-3 -mx-3 rounded-lg hover:bg-[#f9fafb] transition-colors cursor-pointer group"
      >
        <span className="flex-shrink-0 w-7 h-7 rounded bg-[#f3f4f6] group-hover:bg-[#e5e7eb] flex items-center justify-center text-xs text-[#6b7280] font-mono transition-colors">
          {expanded ? '\u2212' : '+'}
        </span>
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-[#9ca3af] font-mono">L{chapter.id}</span>
            <h2 className="text-[15px] font-medium text-[#111827] leading-snug">
              {chapter.title}
            </h2>
          </div>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            {chapter.topics.length} topics · {chapter.flashcards.length} flashcards
          </p>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="pl-10 pb-6 pt-2">
          {/* Topics */}
          <div className="space-y-5">
            {chapter.topics.map((topic, i) => (
              <div key={i}>
                <h3 className="text-sm font-semibold text-[#111827] mb-1.5">
                  {topic.title}
                </h3>
                <div className="text-sm text-[#374151] leading-relaxed whitespace-pre-line">
                  {topic.content}
                </div>
                {topic.formulas && topic.formulas.length > 0 && (
                  <div className="mt-3 bg-[#f9fafb] border border-[#e5e7eb] rounded px-4 py-3">
                    <div className="text-[11px] text-[#9ca3af] uppercase tracking-wide mb-1.5 font-mono">
                      Key Formulas
                    </div>
                    {topic.formulas.map((f, fi) => (
                      <BlockMath key={fi} math={f} />
                    ))}
                  </div>
                )}
                {i < chapter.topics.length - 1 && (
                  <div className="border-b border-[#f3f4f6] mt-5" />
                )}
              </div>
            ))}
          </div>

          {/* Flashcards toggle */}
          <div className="mt-6 pt-4 border-t border-[#e5e7eb]">
            <button
              onClick={() => {
                setShowCards(!showCards);
                setCardIndex(0);
              }}
              className="text-sm text-[#2563eb] hover:text-[#1d4ed8] font-medium cursor-pointer"
            >
              {showCards ? 'Hide' : 'Practice'} flashcards ({chapter.flashcards.length})
            </button>
          </div>

          {/* Flashcards */}
          {showCards && (
            <div className="mt-4">
              <FlashCard
                card={chapter.flashcards[cardIndex]}
                index={cardIndex}
                total={chapter.flashcards.length}
              />
              <div className="flex justify-between mt-3">
                <button
                  onClick={() =>
                    setCardIndex(
                      (cardIndex - 1 + chapter.flashcards.length) %
                        chapter.flashcards.length
                    )
                  }
                  className="px-3 py-1.5 rounded text-sm text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] transition-colors cursor-pointer"
                >
                  &larr; Prev
                </button>
                <span className="text-xs text-[#9ca3af] self-center font-mono">
                  {cardIndex + 1} / {chapter.flashcards.length}
                </span>
                <button
                  onClick={() =>
                    setCardIndex(
                      (cardIndex + 1) % chapter.flashcards.length
                    )
                  }
                  className="px-3 py-1.5 rounded text-sm text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] transition-colors cursor-pointer"
                >
                  Next &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Divider between chapters */}
      {!expanded && <div className="border-b border-[#f3f4f6]" />}
    </section>
  );
}
