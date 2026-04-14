'use client';

import { useState, useMemo } from 'react';
import { chapters } from '../courseData';

interface QuizQuestion {
  chapterId: number;
  question: string;
  answer: string;
}

export default function QuizMode() {
  const allCards = useMemo(() => {
    const cards: QuizQuestion[] = [];
    chapters.forEach((ch) => {
      ch.flashcards.forEach((fc) => {
        cards.push({ chapterId: ch.id, question: fc.question, answer: fc.answer });
      });
    });
    return cards;
  }, []);

  const [shuffled, setShuffled] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);

  function startQuiz() {
    const s = [...allCards].sort(() => Math.random() - 0.5);
    setShuffled(s);
    setCurrent(0);
    setRevealed(false);
    setScore({ correct: 0, incorrect: 0 });
    setActive(true);
    setFinished(false);
  }

  function markAnswer(correct: boolean) {
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
    }));
    if (current + 1 >= shuffled.length) {
      setFinished(true);
    } else {
      setCurrent(current + 1);
      setRevealed(false);
    }
  }

  if (!active) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-xl font-semibold text-[#111827] mb-2">Quiz Mode</h2>
        <p className="text-sm text-[#6b7280] mb-8">
          {allCards.length} randomized questions from all lectures.
        </p>
        <button
          onClick={startQuiz}
          className="px-5 py-2 rounded bg-[#111827] text-white text-sm font-medium hover:bg-[#374151] transition-colors cursor-pointer"
        >
          Start
        </button>
      </div>
    );
  }

  if (finished) {
    const total = score.correct + score.incorrect;
    const pct = Math.round((score.correct / total) * 100);
    return (
      <div className="py-16 text-center">
        <h2 className="text-xl font-semibold text-[#111827] mb-6">Done</h2>
        <div
          className="text-5xl font-bold mb-2"
          style={{ color: pct >= 70 ? '#16a34a' : pct >= 50 ? '#ca8a04' : '#dc2626' }}
        >
          {pct}%
        </div>
        <p className="text-sm text-[#6b7280] mb-1">
          {score.correct} correct out of {total}
        </p>
        <div className="w-48 mx-auto bg-[#f3f4f6] rounded-full h-1.5 mt-4 mb-8">
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              backgroundColor: pct >= 70 ? '#16a34a' : pct >= 50 ? '#ca8a04' : '#dc2626',
            }}
          />
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={startQuiz}
            className="px-4 py-2 rounded bg-[#111827] text-white text-sm font-medium hover:bg-[#374151] transition-colors cursor-pointer"
          >
            Retry
          </button>
          <button
            onClick={() => setActive(false)}
            className="px-4 py-2 rounded border border-[#e5e7eb] text-sm text-[#6b7280] hover:bg-[#f9fafb] transition-colors cursor-pointer"
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  const q = shuffled[current];
  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="flex justify-between items-center mb-5">
        <span className="text-xs text-[#9ca3af] font-mono">
          {current + 1} / {shuffled.length}
        </span>
        <span className="text-xs font-mono">
          <span className="text-[#16a34a]">{score.correct}</span>
          <span className="text-[#d1d5db] mx-1">/</span>
          <span className="text-[#dc2626]">{score.incorrect}</span>
        </span>
      </div>

      <div className="border border-[#e5e7eb] rounded p-5">
        <p className="text-[11px] text-[#9ca3af] font-mono mb-3">
          Lecture {q.chapterId}
        </p>
        <p className="text-sm text-[#111827] leading-relaxed mb-5">
          {q.question}
        </p>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="w-full py-2.5 rounded border border-[#e5e7eb] text-sm text-[#6b7280] hover:bg-[#f9fafb] transition-colors cursor-pointer"
          >
            Reveal Answer
          </button>
        ) : (
          <>
            <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded p-4 mb-5">
              <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-line">
                {q.answer}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => markAnswer(true)}
                className="flex-1 py-2.5 rounded border border-[#d1fae5] bg-[#f0fdf4] text-sm text-[#16a34a] font-medium hover:bg-[#dcfce7] transition-colors cursor-pointer"
              >
                Correct
              </button>
              <button
                onClick={() => markAnswer(false)}
                className="flex-1 py-2.5 rounded border border-[#fecaca] bg-[#fef2f2] text-sm text-[#dc2626] font-medium hover:bg-[#fee2e2] transition-colors cursor-pointer"
              >
                Wrong
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
