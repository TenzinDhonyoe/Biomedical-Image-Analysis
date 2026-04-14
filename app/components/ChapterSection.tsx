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
    <section id={`ch${chapter.id}`} className="scroll-mt-20">
      <div
        className="bg-[#1e293b] border border-[#334155] rounded-2xl overflow-hidden transition-all duration-300"
      >
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left p-6 flex items-start gap-4 hover:bg-[#253348] transition-colors cursor-pointer"
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#06b6d4] flex items-center justify-center text-[#0f172a] font-bold text-lg">
            {chapter.id}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-[#e2e8f0]">
              {chapter.title}
            </h2>
            <p className="text-sm text-[#94a3b8] mt-1">{chapter.subtitle}</p>
          </div>
          <div className="flex-shrink-0 text-[#64748b] text-2xl mt-1">
            {expanded ? '\u2212' : '+'}
          </div>
        </button>

        {/* Content */}
        {expanded && (
          <div className="px-6 pb-6">
            {/* Topics */}
            <div className="space-y-6">
              {chapter.topics.map((topic, i) => (
                <div
                  key={i}
                  className="bg-[#0f172a] rounded-xl p-5 border border-[#1e3a5f]"
                >
                  <h3 className="text-lg font-semibold text-[#38bdf8] mb-3">
                    {topic.title}
                  </h3>
                  <div className="text-[#cbd5e1] text-sm leading-relaxed whitespace-pre-line">
                    {topic.content}
                  </div>
                  {topic.formulas && topic.formulas.length > 0 && (
                    <div className="mt-4 bg-[#1e293b] rounded-lg p-4 border border-[#334155]">
                      <div className="text-xs text-[#64748b] mb-2 font-mono">
                        Key Formulas
                      </div>
                      {topic.formulas.map((f, fi) => (
                        <BlockMath key={fi} math={f} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Flashcards Toggle */}
            <div className="mt-6">
              <button
                onClick={() => {
                  setShowCards(!showCards);
                  setCardIndex(0);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#06b6d4] text-[#0f172a] font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                {showCards ? 'Hide' : 'Show'} Flashcards ({chapter.flashcards.length})
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
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() =>
                      setCardIndex(
                        (cardIndex - 1 + chapter.flashcards.length) %
                          chapter.flashcards.length
                      )
                    }
                    className="px-4 py-2 rounded-lg bg-[#334155] text-[#e2e8f0] text-sm hover:bg-[#475569] transition-colors cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCardIndex(
                        (cardIndex + 1) % chapter.flashcards.length
                      )
                    }
                    className="px-4 py-2 rounded-lg bg-[#334155] text-[#e2e8f0] text-sm hover:bg-[#475569] transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
