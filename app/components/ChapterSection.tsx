'use client';

import { useState } from 'react';
import type { Chapter } from '../courseData';
import { BlockMath } from './MathDisplay';

export default function ChapterSection({
  chapter,
  isCompleted,
  onToggleComplete,
}: {
  chapter: Chapter;
  isCompleted: boolean;
  onToggleComplete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [openTopics, setOpenTopics] = useState<Set<number>>(new Set());
  const [revealedChecks, setRevealedChecks] = useState<Set<number>>(new Set());

  function toggleTopic(i: number) {
    setOpenTopics((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function revealCheck(i: number) {
    setRevealedChecks((prev) => new Set(prev).add(i));
  }

  return (
    <section id={`ch${chapter.id}`} className="scroll-mt-32">
      {/* Header row */}
      <div className="flex items-center gap-2 py-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 flex items-start gap-2.5 text-left cursor-pointer group min-w-0"
        >
          <span className="flex-shrink-0 mt-0.5 text-[#999] text-xs font-mono w-4 text-center">
            {expanded ? '\u2212' : '+'}
          </span>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-[11px] text-[#999] font-mono uppercase">L{chapter.id}</span>
              <h2 className="text-[14px] font-medium text-[#1a1a1a] leading-snug">
                {chapter.title}
              </h2>
            </div>
            <p className="text-[11px] text-[#bbb] mt-0.5">
              {chapter.topics.length} topics · {chapter.flashcards.length} cards
            </p>
          </div>
        </button>
        <button
          onClick={onToggleComplete}
          className={`flex-shrink-0 w-5 h-5 rounded border text-xs flex items-center justify-center cursor-pointer transition-colors ${
            isCompleted
              ? 'bg-[#16a34a] border-[#16a34a] text-white'
              : 'border-[#ddd] text-transparent hover:border-[#999]'
          }`}
          title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          {isCompleted ? '\u2713' : ''}
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="pl-6 pb-5">
          {chapter.topics.map((topic, i) => (
            <div key={i} className="mb-1">
              {/* Topic toggle */}
              <button
                onClick={() => toggleTopic(i)}
                className="w-full text-left flex items-baseline gap-2 py-1.5 cursor-pointer group"
              >
                <span className="text-[10px] text-[#ccc] font-mono">
                  {openTopics.has(i) ? '\u2212' : '+'}
                </span>
                <span className="text-[13px] font-medium text-[#333] group-hover:text-[#1a1a1a]">
                  {topic.title}
                </span>
              </button>

              {/* Topic content */}
              {openTopics.has(i) && (
                <div className="pl-5 pb-3">
                  <div className="text-[13px] text-[#444] leading-relaxed whitespace-pre-line">
                    {topic.content}
                  </div>

                  {topic.formulas && topic.formulas.length > 0 && (
                    <div className="formula-block">
                      <div className="text-[10px] text-[#999] uppercase tracking-wider mb-1 font-mono">
                        Key Formulas
                      </div>
                      {topic.formulas.map((f, fi) => (
                        <BlockMath key={fi} math={f} />
                      ))}
                    </div>
                  )}

                  {topic.examTip && (
                    <div className="exam-tip">
                      <strong>Exam Tip:</strong> {topic.examTip}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Quick Check section */}
          {chapter.flashcards.length > 0 && (
            <div className="quick-check mt-4">
              <div className="text-[11px] text-[#999] uppercase tracking-wider font-mono mb-3">
                Quick Check — {chapter.flashcards.length} questions
              </div>
              {chapter.flashcards.map((fc, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <p className="text-[13px] text-[#333] font-medium mb-1">
                    {i + 1}. {fc.question}
                  </p>
                  {revealedChecks.has(i) ? (
                    <p className="text-[12px] text-[#555] bg-white rounded px-3 py-2 border border-[#e5e5e5] leading-relaxed whitespace-pre-line">
                      {fc.answer}
                    </p>
                  ) : (
                    <button
                      onClick={() => revealCheck(i)}
                      className="text-[12px] text-[#2563eb] hover:underline cursor-pointer"
                    >
                      Show answer
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
