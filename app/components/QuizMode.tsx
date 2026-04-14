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
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold text-[#e2e8f0] mb-4">
          Quiz Mode
        </h3>
        <p className="text-[#94a3b8] mb-6">
          Test yourself with {allCards.length} randomized questions from all chapters.
        </p>
        <button
          onClick={startQuiz}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#06b6d4] text-[#0f172a] font-bold text-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (finished) {
    const total = score.correct + score.incorrect;
    const pct = Math.round((score.correct / total) * 100);
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold text-[#e2e8f0] mb-4">
          Quiz Complete!
        </h3>
        <div className="text-6xl font-bold mb-4" style={{ color: pct >= 70 ? '#22c55e' : pct >= 50 ? '#eab308' : '#ef4444' }}>
          {pct}%
        </div>
        <p className="text-[#94a3b8] mb-2">
          {score.correct} correct / {total} total
        </p>
        <div className="w-64 mx-auto bg-[#334155] rounded-full h-3 mt-4 mb-8">
          <div
            className="h-3 rounded-full progress-bar"
            style={{
              width: `${pct}%`,
              backgroundColor: pct >= 70 ? '#22c55e' : pct >= 50 ? '#eab308' : '#ef4444',
            }}
          />
        </div>
        <button
          onClick={startQuiz}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#06b6d4] text-[#0f172a] font-semibold hover:opacity-90 transition-opacity cursor-pointer mr-4"
        >
          Try Again
        </button>
        <button
          onClick={() => setActive(false)}
          className="px-6 py-2.5 rounded-xl bg-[#334155] text-[#e2e8f0] font-semibold hover:bg-[#475569] transition-colors cursor-pointer"
        >
          Exit Quiz
        </button>
      </div>
    );
  }

  const q = shuffled[current];
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-[#64748b] font-mono">
          Question {current + 1}/{shuffled.length}
        </span>
        <span className="text-sm font-mono">
          <span className="text-[#22c55e]">{score.correct}</span>
          {' / '}
          <span className="text-[#ef4444]">{score.incorrect}</span>
        </span>
      </div>
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
        <div className="text-xs text-[#38bdf8] mb-2 font-mono">
          Chapter {q.chapterId}
        </div>
        <p className="text-[#e2e8f0] text-lg mb-6">{q.question}</p>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="w-full py-3 rounded-xl bg-[#334155] text-[#e2e8f0] font-semibold hover:bg-[#475569] transition-colors cursor-pointer"
          >
            Reveal Answer
          </button>
        ) : (
          <>
            <div className="bg-[#0f172a] rounded-lg p-4 border border-[#22c55e]/20 mb-6">
              <p className="text-[#cbd5e1] text-sm leading-relaxed whitespace-pre-line">
                {q.answer}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => markAnswer(true)}
                className="flex-1 py-3 rounded-xl bg-[#22c55e]/20 text-[#22c55e] font-semibold border border-[#22c55e]/30 hover:bg-[#22c55e]/30 transition-colors cursor-pointer"
              >
                Got it right
              </button>
              <button
                onClick={() => markAnswer(false)}
                className="flex-1 py-3 rounded-xl bg-[#ef4444]/20 text-[#ef4444] font-semibold border border-[#ef4444]/30 hover:bg-[#ef4444]/30 transition-colors cursor-pointer"
              >
                Got it wrong
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
