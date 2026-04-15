'use client';

import { useState, useEffect } from 'react';
import type { Chapter } from '../courseData';
import { BlockMath } from './MathDisplay';
import ContentRenderer from './ContentRenderer';

export default function ChapterSection({
  chapter,
  isCompleted,
  onToggleComplete,
  autoExpand,
  onAutoExpandHandled,
}: {
  chapter: Chapter;
  isCompleted: boolean;
  onToggleComplete: () => void;
  autoExpand?: { chapterId: number; topicIndex?: number };
  onAutoExpandHandled?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [openTopics, setOpenTopics] = useState<Set<number>>(new Set());
  const [revealedChecks, setRevealedChecks] = useState<Set<number>>(new Set());

  // Auto-expand from search navigation
  useEffect(() => {
    if (autoExpand && autoExpand.chapterId === chapter.id) {
      setExpanded(true);
      if (autoExpand.topicIndex != null) {
        setOpenTopics((prev) => new Set(prev).add(autoExpand.topicIndex!));
      }
      onAutoExpandHandled?.();
    }
  }, [autoExpand, chapter.id, onAutoExpandHandled]);

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
          <span className="flex-shrink-0 mt-0.5 text-[var(--text-3)] text-xs font-mono w-4 text-center">
            {expanded ? '\u2212' : '+'}
          </span>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-[11px] text-[var(--text-3)] font-mono uppercase">L{chapter.id}</span>
              <h2 className="text-[14px] font-medium text-[var(--text)] leading-snug">
                {chapter.title}
              </h2>
            </div>
            <p className="text-[11px] text-[var(--text-3)] mt-0.5">
              {chapter.topics.length} topics &middot; {chapter.flashcards.length} cards
            </p>
          </div>
        </button>
        <button
          onClick={onToggleComplete}
          className={`flex-shrink-0 w-5 h-5 rounded border text-xs flex items-center justify-center cursor-pointer transition-colors ${
            isCompleted
              ? 'bg-[var(--green)] border-[var(--green)] text-white'
              : 'border-[var(--border)] text-transparent hover:border-[var(--text-3)]'
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
                <span className="text-[10px] text-[var(--text-3)] font-mono">
                  {openTopics.has(i) ? '\u2212' : '+'}
                </span>
                <span className="text-[13px] font-medium text-[var(--text-2)] group-hover:text-[var(--text)]">
                  {topic.title}
                </span>
              </button>

              {/* Topic content */}
              {openTopics.has(i) && (
                <div className="pl-5 pb-3">
                  <ContentRenderer content={topic.content} />

                  {topic.formulas && topic.formulas.length > 0 && (
                    <div className="formula-block">
                      <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">
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
              <div className="text-[11px] text-[var(--text-3)] uppercase tracking-wider font-mono mb-3">
                Quick Check — {chapter.flashcards.length} questions
              </div>
              {chapter.flashcards.map((fc, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <p className="text-[13px] text-[var(--text-2)] font-medium mb-1">
                    {i + 1}. {fc.question}
                  </p>
                  {revealedChecks.has(i) ? (
                    <p className="text-[12px] text-[var(--text-2)] bg-[var(--bg)] rounded px-3 py-2 border border-[var(--border)] leading-relaxed whitespace-pre-line">
                      {fc.answer}
                    </p>
                  ) : (
                    <button
                      onClick={() => revealCheck(i)}
                      className="text-[12px] text-[var(--accent)] hover:underline cursor-pointer"
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
