'use client';

import { useState } from 'react';
import type { Chapter } from '../courseData';
import { BlockMath } from './MathDisplay';
import ContentRenderer from './ContentRenderer';
import InteractiveHost from './interactives/InteractiveHost';

export default function LectureView({
  chapter,
  isCompleted,
  onToggleComplete,
}: {
  chapter: Chapter;
  isCompleted: boolean;
  onToggleComplete: () => void;
}) {
  const [revealedChecks, setRevealedChecks] = useState<Set<string>>(new Set());

  function revealCheck(key: string) {
    setRevealedChecks((prev) => new Set(prev).add(key));
  }

  // Split flashcards into per-topic groups (roughly: distribute evenly)
  // Each topic gets its "quick checks" shown inline after the content
  const cardsPerTopic = Math.max(1, Math.floor(chapter.flashcards.length / chapter.topics.length));

  return (
    <div>
      {/* Sticky lecture header */}
      <div className="sticky top-0 z-20 bg-[var(--bg)] pt-4 pb-3 border-b border-[var(--border-light)] mb-6">
        <div className="flex items-center gap-3">
          <span className="lecture-badge">Lecture {chapter.id}</span>
          <h1 className="text-xl font-bold text-[var(--text)] leading-tight">
            {chapter.title}
          </h1>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <p className="text-xs text-[var(--text-3)]">
            {chapter.topics.length} topics &middot; {chapter.flashcards.length} review cards
          </p>
          <button
            onClick={onToggleComplete}
            className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer transition-colors ${
              isCompleted
                ? 'bg-[var(--green)] border-[var(--green)] text-white'
                : 'border-[var(--border)] text-[var(--text-3)] hover:border-[var(--green)] hover:text-[var(--green)]'
            }`}
          >
            {isCompleted ? '\u2713 Completed' : 'Mark complete'}
          </button>
        </div>
      </div>

      {/* All topics rendered openly */}
      {chapter.topics.map((topic, ti) => {
        // Get the inline quick checks for this topic
        const startCard = ti * cardsPerTopic;
        const endCard = ti === chapter.topics.length - 1
          ? chapter.flashcards.length
          : startCard + cardsPerTopic;
        const topicCards = chapter.flashcards.slice(startCard, endCard);

        return (
          <section key={ti} className="mb-8">
            {/* Topic heading */}
            <h2 className="topic-heading">{topic.title}</h2>

            {/* Topic content */}
            <div className="mt-3">
              <ContentRenderer content={topic.content} />
            </div>

            {/* Interactive demo */}
            {topic.interactive && (
              <InteractiveHost id={topic.interactive} />
            )}

            {/* Formulas */}
            {topic.formulas && topic.formulas.length > 0 && (
              <div className="formula-block mt-4">
                <div className="text-[10px] text-[var(--text-3)] uppercase tracking-wider mb-1 font-mono">
                  Key Formulas
                </div>
                {topic.formulas.map((f, fi) => (
                  <BlockMath key={fi} math={f} />
                ))}
              </div>
            )}

            {/* Exam tip */}
            {topic.examTip && (
              <div className="exam-tip mt-3">
                <strong>Exam Tip:</strong> {topic.examTip}
              </div>
            )}

            {/* Inline quick checks */}
            {topicCards.length > 0 && (
              <div className="quick-check-inline mt-4">
                <div className="text-[11px] text-[var(--accent)] uppercase tracking-wider font-semibold mb-3">
                  Quick Check
                </div>
                {topicCards.map((fc, i) => {
                  const key = `${ti}-${i}`;
                  return (
                    <div key={key} className="mb-3 last:mb-0">
                      <p className="text-[13px] text-[var(--text)] font-medium mb-1.5">
                        {fc.question}
                      </p>
                      {revealedChecks.has(key) ? (
                        <div className="quick-check-answer">
                          <p className="text-[13px] text-[var(--text-2)] leading-relaxed whitespace-pre-line">
                            {fc.answer}
                          </p>
                        </div>
                      ) : (
                        <button
                          onClick={() => revealCheck(key)}
                          className="text-[12px] text-[var(--accent)] hover:underline cursor-pointer font-medium"
                        >
                          Show answer &rarr;
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Divider between topics */}
            {ti < chapter.topics.length - 1 && (
              <hr className="border-[var(--border-light)] mt-8" />
            )}
          </section>
        );
      })}
    </div>
  );
}
