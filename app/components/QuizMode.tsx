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

  const [count, setCount] = useState(20);
  const [shuffled, setShuffled] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);

  function startQuiz() {
    const s = [...allCards].sort(() => Math.random() - 0.5).slice(0, count);
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
      <div className="py-12 text-center">
        <h2 className="text-base font-semibold text-[#1a1a1a] mb-1">Mock Exam</h2>
        <p className="text-xs text-[#999] mb-6">
          Randomized questions from all lectures. Self-graded.
        </p>
        <div className="flex items-center justify-center gap-3 mb-6">
          <label className="text-xs text-[#555]">Questions:</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="text-xs border border-[#e5e5e5] rounded px-2 py-1.5 bg-white cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={allCards.length}>All ({allCards.length})</option>
          </select>
        </div>
        <button
          onClick={startQuiz}
          className="px-5 py-2 rounded bg-[#1a1a1a] text-white text-xs font-medium hover:bg-[#333] transition-colors cursor-pointer"
        >
          Start
        </button>
      </div>
    );
  }

  if (finished) {
    const total = score.correct + score.incorrect;
    const pct = Math.round((score.correct / total) * 100);
    const color = pct >= 70 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626';
    return (
      <div className="py-12 text-center">
        <h2 className="text-base font-semibold text-[#1a1a1a] mb-4">Results</h2>
        <div className="text-4xl font-bold mb-1" style={{ color }}>
          {pct}%
        </div>
        <p className="text-xs text-[#999] mb-1">
          {score.correct} / {total} correct
        </p>
        <div className="w-40 mx-auto bg-[#f0f0f0] rounded-full h-1 mt-3 mb-6">
          <div
            className="h-1 rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
        <div className="flex gap-2 justify-center">
          <button
            onClick={startQuiz}
            className="px-4 py-1.5 rounded bg-[#1a1a1a] text-white text-xs font-medium cursor-pointer hover:bg-[#333]"
          >
            Retry
          </button>
          <button
            onClick={() => setActive(false)}
            className="px-4 py-1.5 rounded border border-[#e5e5e5] text-xs text-[#999] cursor-pointer hover:text-[#555]"
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  const q = shuffled[current];
  const progress = ((current + 1) / shuffled.length) * 100;

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress bar */}
      <div className="w-full bg-[#f0f0f0] rounded-full h-0.5 mb-4">
        <div
          className="h-0.5 rounded-full bg-[#1a1a1a] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-[11px] text-[#999] font-mono">
          Q{current + 1}/{shuffled.length}
        </span>
        <span className="text-[11px] font-mono">
          <span className="text-[#16a34a]">{score.correct}</span>
          <span className="text-[#ddd] mx-0.5">/</span>
          <span className="text-[#dc2626]">{score.incorrect}</span>
        </span>
      </div>

      <div className="border border-[#e5e5e5] rounded-md p-4">
        <p className="text-[10px] text-[#ccc] font-mono mb-2">
          Lecture {q.chapterId}
        </p>
        <p className="text-[13px] text-[#1a1a1a] leading-relaxed mb-4">
          {q.question}
        </p>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="w-full py-2 rounded border border-[#e5e5e5] text-xs text-[#999] hover:bg-[#fafafa] transition-colors cursor-pointer"
          >
            Reveal Answer
          </button>
        ) : (
          <>
            <div className="bg-[#fafafa] border border-[#e5e5e5] rounded px-3 py-2.5 mb-4">
              <p className="text-[12px] text-[#444] leading-relaxed whitespace-pre-line">
                {q.answer}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => markAnswer(true)}
                className="flex-1 py-2 rounded border border-[#d1fae5] bg-[#f0fdf4] text-xs text-[#16a34a] font-medium hover:bg-[#dcfce7] cursor-pointer"
              >
                Correct
              </button>
              <button
                onClick={() => markAnswer(false)}
                className="flex-1 py-2 rounded border border-[#fecaca] bg-[#fef2f2] text-xs text-[#dc2626] font-medium hover:bg-[#fee2e2] cursor-pointer"
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
