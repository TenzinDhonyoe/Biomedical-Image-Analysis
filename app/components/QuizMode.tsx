'use client';

import { useState, useMemo } from 'react';
import { chapters } from '../courseData';
import { useCardStats, cardKey } from './useCardStats';

interface QuizQuestion {
  chapterId: number;
  question: string;
  answer: string;
}

export default function QuizMode() {
  const { recordResult, getWeakCards } = useCardStats();

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
  const [wrongAnswers, setWrongAnswers] = useState<QuizQuestion[]>([]);
  const [reviewing, setReviewing] = useState(false);
  const [retryWeak, setRetryWeak] = useState(false);

  function startQuiz(cardsPool?: QuizQuestion[]) {
    const pool = cardsPool || allCards;
    const s = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
    setShuffled(s);
    setCurrent(0);
    setRevealed(false);
    setScore({ correct: 0, incorrect: 0 });
    setActive(true);
    setFinished(false);
    setWrongAnswers([]);
    setReviewing(false);
    setRetryWeak(false);
  }

  function startWeakQuiz() {
    const weakKeys = new Set(getWeakCards().map(([key]) => key));
    const weakCards = allCards.filter((c) => weakKeys.has(cardKey(c.chapterId, c.question)));
    if (weakCards.length === 0) {
      startQuiz();
      return;
    }
    setRetryWeak(true);
    startQuiz(weakCards);
  }

  function retryWrongOnly() {
    if (wrongAnswers.length === 0) return;
    const s = [...wrongAnswers].sort(() => Math.random() - 0.5);
    setShuffled(s);
    setCurrent(0);
    setRevealed(false);
    setScore({ correct: 0, incorrect: 0 });
    setFinished(false);
    setWrongAnswers([]);
    setReviewing(false);
  }

  function markAnswer(correct: boolean) {
    const q = shuffled[current];
    const key = cardKey(q.chapterId, q.question);
    recordResult(key, correct);

    if (!correct) {
      setWrongAnswers((prev) => [...prev, q]);
    }

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

  // Start screen
  if (!active) {
    const weakCount = getWeakCards().length;
    return (
      <div className="py-12 text-center">
        <h2 className="text-base font-semibold text-[var(--text)] mb-1">Mock Exam</h2>
        <p className="text-xs text-[var(--text-3)] mb-6">
          Randomized questions from all lectures. Self-graded.
        </p>
        <div className="flex items-center justify-center gap-3 mb-6">
          <label className="text-xs text-[var(--text-2)]">Questions:</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="text-xs border border-[var(--border)] rounded px-2 py-1.5 bg-[var(--bg)] cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={allCards.length}>All ({allCards.length})</option>
          </select>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => startQuiz()}
            className="px-5 py-2 rounded bg-[var(--text)] text-[var(--bg)] text-xs font-medium hover:opacity-80 transition-opacity cursor-pointer"
          >
            Start Exam
          </button>
          {weakCount > 0 && (
            <button
              onClick={startWeakQuiz}
              className="px-5 py-2 rounded border border-[var(--red)] text-[var(--red)] text-xs font-medium hover:bg-red-50 transition-colors cursor-pointer"
            >
              Quiz Weak Cards Only ({weakCount})
            </button>
          )}
        </div>
      </div>
    );
  }

  // Review wrong answers
  if (reviewing) {
    return (
      <div className="max-w-xl mx-auto">
        <h2 className="text-base font-semibold text-[var(--text)] mb-1">Review Mistakes</h2>
        <p className="text-xs text-[var(--text-3)] mb-5">
          {wrongAnswers.length} question{wrongAnswers.length !== 1 ? 's' : ''} to review
        </p>

        <div className="space-y-4">
          {wrongAnswers.map((q, i) => (
            <div key={i} className="border border-[var(--border)] rounded-md p-4">
              <p className="text-[10px] text-[var(--text-3)] font-mono mb-1">
                L{q.chapterId} &middot; Question {i + 1}
              </p>
              <p className="text-[13px] text-[var(--text)] font-medium mb-2">{q.question}</p>
              <div className="bg-[#f0fdf4] border border-[#d1fae5] rounded px-3 py-2">
                <p className="text-[10px] text-[var(--green)] font-mono mb-1">Correct Answer</p>
                <p className="text-[12px] text-[#374151] leading-relaxed whitespace-pre-line">
                  {q.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 justify-center mt-6">
          <button
            onClick={retryWrongOnly}
            className="px-4 py-1.5 rounded bg-[var(--text)] text-[var(--bg)] text-xs font-medium cursor-pointer hover:opacity-80"
          >
            Retry These ({wrongAnswers.length})
          </button>
          <button
            onClick={() => startQuiz()}
            className="px-4 py-1.5 rounded border border-[var(--border)] text-xs text-[var(--text-2)] cursor-pointer hover:text-[var(--text)]"
          >
            New Exam
          </button>
          <button
            onClick={() => setActive(false)}
            className="px-4 py-1.5 rounded border border-[var(--border)] text-xs text-[var(--text-3)] cursor-pointer hover:text-[var(--text-2)]"
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  // Results screen
  if (finished) {
    const total = score.correct + score.incorrect;
    const pct = Math.round((score.correct / total) * 100);
    const color = pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)';
    return (
      <div className="py-12 text-center">
        <h2 className="text-base font-semibold text-[var(--text)] mb-4">
          {retryWeak ? 'Weak Cards Results' : 'Results'}
        </h2>
        <div className="text-4xl font-bold mb-1" style={{ color }}>
          {pct}%
        </div>
        <p className="text-xs text-[var(--text-3)] mb-1">
          {score.correct} / {total} correct
        </p>
        <div className="w-40 mx-auto bg-[var(--border-light)] rounded-full h-1 mt-3 mb-6">
          <div
            className="h-1 rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {wrongAnswers.length > 0 && (
            <button
              onClick={() => setReviewing(true)}
              className="px-4 py-1.5 rounded bg-[var(--red)] text-white text-xs font-medium cursor-pointer hover:opacity-80"
            >
              Review Mistakes ({wrongAnswers.length})
            </button>
          )}
          <button
            onClick={() => startQuiz()}
            className="px-4 py-1.5 rounded bg-[var(--text)] text-[var(--bg)] text-xs font-medium cursor-pointer hover:opacity-80"
          >
            Retry
          </button>
          <button
            onClick={() => setActive(false)}
            className="px-4 py-1.5 rounded border border-[var(--border)] text-xs text-[var(--text-3)] cursor-pointer hover:text-[var(--text-2)]"
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  // Active quiz
  const q = shuffled[current];
  const progress = ((current + 1) / shuffled.length) * 100;

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress bar */}
      <div className="w-full bg-[var(--border-light)] rounded-full h-0.5 mb-4">
        <div
          className="h-0.5 rounded-full bg-[var(--text)] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-[11px] text-[var(--text-3)] font-mono">
          Q{current + 1}/{shuffled.length}
          {retryWeak && <span className="ml-1 text-[var(--red)]">(weak)</span>}
        </span>
        <span className="text-[11px] font-mono">
          <span className="text-[var(--green)]">{score.correct}</span>
          <span className="text-[var(--text-3)] mx-0.5">/</span>
          <span className="text-[var(--red)]">{score.incorrect}</span>
        </span>
      </div>

      <div className="border border-[var(--border)] rounded-md p-4">
        <p className="text-[10px] text-[var(--text-3)] font-mono mb-2">
          Lecture {q.chapterId}
        </p>
        <p className="text-[13px] text-[var(--text)] leading-relaxed mb-4">
          {q.question}
        </p>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="w-full py-2 rounded border border-[var(--border)] text-xs text-[var(--text-3)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
          >
            Reveal Answer
          </button>
        ) : (
          <>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2.5 mb-4">
              <p className="text-[12px] text-[var(--text-2)] leading-relaxed whitespace-pre-line">
                {q.answer}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => markAnswer(true)}
                className="flex-1 py-2 rounded border border-[#d1fae5] bg-[#f0fdf4] text-xs text-[var(--green)] font-medium hover:bg-[#dcfce7] cursor-pointer"
              >
                Correct
              </button>
              <button
                onClick={() => markAnswer(false)}
                className="flex-1 py-2 rounded border border-[#fecaca] bg-[#fef2f2] text-xs text-[var(--red)] font-medium hover:bg-[#fee2e2] cursor-pointer"
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
