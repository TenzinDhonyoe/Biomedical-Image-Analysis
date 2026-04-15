'use client';

import { useState, useRef, useMemo, useEffect, ReactNode } from 'react';
import {
  generateExam,
  MCQuestion,
  ShortAnswerQuestion,
  LongAnswerQuestion,
  CalculationQuestion,
} from '../examQuestions';
import { InlineMath, BlockMath } from './MathDisplay';

// --- Utility: render text with inline $...$ math ---
function renderMathText(text: string): ReactNode[] {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, i) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const math = part.slice(1, -1);
      return <InlineMath key={i} math={math} />;
    }
    return <span key={i}>{part}</span>;
  });
}

type Phase = 'start' | 'active' | 'submitted' | 'review';

interface ExamData {
  mc: MCQuestion[];
  sa: ShortAnswerQuestion[];
  long: LongAnswerQuestion;
  calc: CalculationQuestion;
}

export default function QuizMode() {
  const [phase, setPhase] = useState<Phase>('start');
  const [exam, setExam] = useState<ExamData | null>(null);

  // User answers
  const [mcAnswers, setMcAnswers] = useState<(number | null)[]>([]);
  const [saAnswers, setSaAnswers] = useState<string[]>([]);
  const [longAnswers, setLongAnswers] = useState<string[]>([]);
  const [calcAnswers, setCalcAnswers] = useState<string[]>([]);

  // Scoring
  const [mcScore, setMcScore] = useState(0);

  // Section refs for jump nav
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Timer
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (phase !== 'active') return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, startTime]);

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function startExam() {
    const { selectedMC, selectedSA, selectedLong, selectedCalc } = generateExam();
    setExam({ mc: selectedMC, sa: selectedSA, long: selectedLong, calc: selectedCalc });
    setMcAnswers(new Array(10).fill(null));
    setSaAnswers(new Array(2).fill(''));
    setLongAnswers(new Array(selectedLong.subParts.length).fill(''));
    setCalcAnswers(new Array(selectedCalc.subParts.length).fill(''));
    setMcScore(0);
    setPhase('active');
    setStartTime(Date.now());
    setElapsed(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function submitExam() {
    if (!exam) return;
    let correct = 0;
    exam.mc.forEach((q, i) => {
      if (mcAnswers[i] === q.correctIndex) correct++;
    });
    setMcScore(correct * 2);
    setPhase('submitted');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function scrollToSection(idx: number) {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ===== START SCREEN =====
  if (phase === 'start') {
    return (
      <div className="py-8 max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-1 text-center">Practice Final Exam</h2>
        <p className="text-xs text-[var(--text-3)] mb-1 text-center">BME 872: Biomedical Image Analysis</p>
        <p className="text-xs text-[var(--text-3)] mb-6 text-center">Duration: 90 minutes</p>

        <div className="border border-[var(--border)] rounded-lg overflow-hidden mb-6">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[var(--surface)] border-b border-[var(--border)]">
                <th className="text-left px-4 py-2 font-medium text-[var(--text)]">Section</th>
                <th className="text-center px-4 py-2 font-medium text-[var(--text)]">Questions</th>
                <th className="text-center px-4 py-2 font-medium text-[var(--text)]">Marks</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-2)]">
              <tr className="border-b border-[var(--border-light)]">
                <td className="px-4 py-2">Multiple Choice</td>
                <td className="px-4 py-2 text-center">10</td>
                <td className="px-4 py-2 text-center">20</td>
              </tr>
              <tr className="border-b border-[var(--border-light)]">
                <td className="px-4 py-2">Short Answers</td>
                <td className="px-4 py-2 text-center">2</td>
                <td className="px-4 py-2 text-center">5</td>
              </tr>
              <tr className="border-b border-[var(--border-light)]">
                <td className="px-4 py-2">Long Answer</td>
                <td className="px-4 py-2 text-center">1</td>
                <td className="px-4 py-2 text-center">10</td>
              </tr>
              <tr className="border-b border-[var(--border-light)]">
                <td className="px-4 py-2">Calculations</td>
                <td className="px-4 py-2 text-center">1</td>
                <td className="px-4 py-2 text-center">10</td>
              </tr>
              <tr className="bg-[var(--surface)] font-semibold text-[var(--text)]">
                <td className="px-4 py-2">Total</td>
                <td className="px-4 py-2 text-center">14</td>
                <td className="px-4 py-2 text-center">45</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border-light)] rounded-lg px-4 py-3 mb-6 text-xs text-[var(--text-2)] space-y-1">
          <p className="font-medium text-[var(--text)]">Instructions:</p>
          <p>1. Multiple choice is auto-graded. Other sections are self-assessed against model answers.</p>
          <p>2. Questions are randomized from a question bank — each attempt is different.</p>
          <p>3. No formula sheet is provided. A timer tracks your elapsed time.</p>
          <p>4. Click &quot;Submit Exam&quot; when finished to see results and model answers.</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={startExam}
            className="px-6 py-2.5 rounded-lg bg-[var(--text)] text-[var(--bg)] text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
          >
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  if (!exam) return null;

  // ===== RESULTS SCREEN =====
  if (phase === 'submitted') {
    const mcCorrect = mcScore / 2;
    const pct = Math.round((mcCorrect / 10) * 100);
    const color = pct >= 70 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)';

    return (
      <div className="py-8 max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-1 text-center">Exam Results</h2>
        <p className="text-xs text-[var(--text-3)] mb-6 text-center">
          Completed in {formatTime(elapsed)}
        </p>

        <div className="border border-[var(--border)] rounded-lg overflow-hidden mb-6">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[var(--surface)] border-b border-[var(--border)]">
                <th className="text-left px-4 py-2 font-medium text-[var(--text)]">Section</th>
                <th className="text-center px-4 py-2 font-medium text-[var(--text)]">Score</th>
                <th className="text-center px-4 py-2 font-medium text-[var(--text)]">Marks</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-2)]">
              <tr className="border-b border-[var(--border-light)]">
                <td className="px-4 py-2">Multiple Choice</td>
                <td className="px-4 py-2 text-center font-mono" style={{ color }}>
                  {mcCorrect}/10 correct
                </td>
                <td className="px-4 py-2 text-center font-mono" style={{ color }}>
                  {mcScore}/20
                </td>
              </tr>
              <tr className="border-b border-[var(--border-light)]">
                <td className="px-4 py-2">Short Answers</td>
                <td className="px-4 py-2 text-center text-[var(--text-3)]">Self-assess</td>
                <td className="px-4 py-2 text-center text-[var(--text-3)]">/5</td>
              </tr>
              <tr className="border-b border-[var(--border-light)]">
                <td className="px-4 py-2">Long Answer</td>
                <td className="px-4 py-2 text-center text-[var(--text-3)]">Self-assess</td>
                <td className="px-4 py-2 text-center text-[var(--text-3)]">/10</td>
              </tr>
              <tr className="border-b border-[var(--border-light)]">
                <td className="px-4 py-2">Calculations</td>
                <td className="px-4 py-2 text-center text-[var(--text-3)]">Self-assess</td>
                <td className="px-4 py-2 text-center text-[var(--text-3)]">/10</td>
              </tr>
              <tr className="bg-[var(--surface)] font-semibold text-[var(--text)]">
                <td className="px-4 py-2">Total (auto-scored)</td>
                <td className="px-4 py-2 text-center"></td>
                <td className="px-4 py-2 text-center font-mono">{mcScore} + ___/45</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => { setPhase('review'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="px-5 py-2 rounded-lg bg-[var(--text)] text-[var(--bg)] text-xs font-medium hover:opacity-80 cursor-pointer"
          >
            Review All Answers
          </button>
          <button
            onClick={startExam}
            className="px-5 py-2 rounded-lg border border-[var(--border)] text-xs text-[var(--text-2)] hover:text-[var(--text)] cursor-pointer"
          >
            New Exam
          </button>
          <button
            onClick={() => setPhase('start')}
            className="px-5 py-2 rounded-lg border border-[var(--border)] text-xs text-[var(--text-3)] hover:text-[var(--text-2)] cursor-pointer"
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  // ===== REVIEW MODE =====
  if (phase === 'review') {
    return (
      <div className="max-w-3xl mx-auto pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-[var(--text)]">Answer Review</h2>
          <div className="flex gap-2">
            <button
              onClick={startExam}
              className="px-4 py-1.5 rounded border border-[var(--border)] text-xs text-[var(--text-2)] hover:text-[var(--text)] cursor-pointer"
            >
              New Exam
            </button>
            <button
              onClick={() => setPhase('start')}
              className="px-4 py-1.5 rounded border border-[var(--border)] text-xs text-[var(--text-3)] hover:text-[var(--text-2)] cursor-pointer"
            >
              Exit
            </button>
          </div>
        </div>

        {/* MC Review */}
        <h3 className="text-sm font-semibold text-[var(--text)] mb-3 mt-6">Section 1: Multiple Choice ({mcScore}/20)</h3>
        <div className="space-y-4 mb-8">
          {exam.mc.map((q, qi) => {
            const userAnswer = mcAnswers[qi];
            const isCorrect = userAnswer === q.correctIndex;
            return (
              <div key={q.id} className="border border-[var(--border)] rounded-lg p-4">
                <div className="flex items-start gap-2 mb-2">
                  <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${isCorrect ? 'bg-[var(--green)]' : 'bg-[var(--red)]'}`}>
                    {isCorrect ? '\u2713' : '\u2717'}
                  </span>
                  <p className="text-[13px] text-[var(--text)] leading-relaxed flex-1">
                    <span className="font-mono text-[var(--text-3)] mr-1">Q{qi + 1}.</span>
                    {renderMathText(q.question)}
                  </p>
                </div>
                {q.formula && (
                  <div className="ml-7 mb-2">
                    <BlockMath math={q.formula} />
                  </div>
                )}
                <div className="ml-7 space-y-1">
                  {q.options.map((opt, oi) => {
                    const letter = ['A', 'B', 'C', 'D'][oi];
                    const isUserChoice = userAnswer === oi;
                    const isCorrectOpt = q.correctIndex === oi;
                    let optClass = 'text-[var(--text-2)]';
                    if (isCorrectOpt) optClass = 'text-[var(--green)] font-medium';
                    if (isUserChoice && !isCorrect) optClass = 'text-[var(--red)] line-through';
                    if (isUserChoice && isCorrect) optClass = 'text-[var(--green)] font-medium';
                    return (
                      <div key={oi} className={`text-xs flex items-start gap-1.5 ${optClass}`}>
                        <span className="font-mono flex-shrink-0">({letter})</span>
                        <span>{renderMathText(opt)}</span>
                        {isCorrectOpt && <span className="text-[var(--green)]">&larr; correct</span>}
                      </div>
                    );
                  })}
                </div>
                {q.explanation && (
                  <div className="ml-7 mt-2 text-[11px] text-[var(--text-3)] italic">
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SA Review */}
        <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Section 2: Short Answers (/5)</h3>
        <div className="space-y-4 mb-8">
          {exam.sa.map((q, qi) => (
            <div key={q.id} className="border border-[var(--border)] rounded-lg p-4">
              <p className="text-[13px] text-[var(--text)] leading-relaxed mb-3">
                <span className="font-mono text-[var(--text-3)] mr-1">Q{qi + 1}.</span>
                {renderMathText(q.question)}
                <span className="text-[var(--text-3)] text-[10px] ml-2">({q.marks} marks)</span>
              </p>
              {saAnswers[qi] && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 mb-3">
                  <p className="text-[10px] text-[var(--text-3)] font-mono mb-1">Your Answer</p>
                  <p className="text-xs text-[var(--text-2)] whitespace-pre-wrap">{saAnswers[qi]}</p>
                </div>
              )}
              <div className="bg-[#f0fdf4] dark:bg-[#052e16] border border-[#d1fae5] dark:border-[#065f46] rounded px-3 py-2">
                <p className="text-[10px] text-[var(--green)] font-mono mb-1">Model Answer</p>
                <p className="text-xs text-[#374151] dark:text-[#d1fae5] leading-relaxed whitespace-pre-wrap">{q.modelAnswer}</p>
              </div>
              {q.formula && (
                <div className="mt-2">
                  <BlockMath math={q.formula} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Long Answer Review */}
        <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Section 3: Long Answer (/10)</h3>
        <div className="border border-[var(--border)] rounded-lg p-4 mb-8">
          <p className="text-[13px] text-[var(--text)] leading-relaxed mb-4 whitespace-pre-wrap">
            {renderMathText(exam.long.scenario)}
          </p>
          <div className="space-y-4">
            {exam.long.subParts.map((sp, si) => (
              <div key={si} className="border-t border-[var(--border-light)] pt-3">
                <p className="text-[13px] text-[var(--text)] mb-2">
                  <span className="font-semibold">({sp.label})</span>{' '}
                  {renderMathText(sp.question)}
                  <span className="text-[var(--text-3)] text-[10px] ml-2">({sp.marks} marks)</span>
                </p>
                {sp.formula && <div className="mb-2"><BlockMath math={sp.formula} /></div>}
                {longAnswers[si] && (
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 mb-2">
                    <p className="text-[10px] text-[var(--text-3)] font-mono mb-1">Your Answer</p>
                    <p className="text-xs text-[var(--text-2)] whitespace-pre-wrap">{longAnswers[si]}</p>
                  </div>
                )}
                <div className="bg-[#f0fdf4] dark:bg-[#052e16] border border-[#d1fae5] dark:border-[#065f46] rounded px-3 py-2">
                  <p className="text-[10px] text-[var(--green)] font-mono mb-1">Model Answer</p>
                  <p className="text-xs text-[#374151] dark:text-[#d1fae5] leading-relaxed whitespace-pre-wrap">{sp.modelAnswer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calc Review */}
        <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Section 4: Calculations (/10)</h3>
        <div className="border border-[var(--border)] rounded-lg p-4 mb-8">
          <p className="text-[13px] text-[var(--text)] leading-relaxed mb-3 whitespace-pre-wrap">
            {renderMathText(exam.calc.setup)}
          </p>
          {exam.calc.setupFormulas.map((f, fi) => (
            <div key={fi} className="mb-1"><BlockMath math={f} /></div>
          ))}
          <div className="space-y-4 mt-4">
            {exam.calc.subParts.map((sp, si) => (
              <div key={si} className="border-t border-[var(--border-light)] pt-3">
                <p className="text-[13px] text-[var(--text)] mb-2">
                  <span className="font-semibold">({sp.label})</span>{' '}
                  {renderMathText(sp.question)}
                  <span className="text-[var(--text-3)] text-[10px] ml-2">({sp.marks} marks)</span>
                </p>
                {calcAnswers[si] && (
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 mb-2">
                    <p className="text-[10px] text-[var(--text-3)] font-mono mb-1">Your Answer</p>
                    <p className="text-xs text-[var(--text-2)] whitespace-pre-wrap">{calcAnswers[si]}</p>
                  </div>
                )}
                <div className="bg-[#f0fdf4] dark:bg-[#052e16] border border-[#d1fae5] dark:border-[#065f46] rounded px-3 py-2">
                  <p className="text-[10px] text-[var(--green)] font-mono mb-1">Model Answer</p>
                  <p className="text-xs text-[#374151] dark:text-[#d1fae5] leading-relaxed whitespace-pre-wrap">{sp.modelAnswer}</p>
                  {sp.modelAnswerFormulas?.map((f, fi) => (
                    <div key={fi} className="mt-1"><BlockMath math={f} /></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===== ACTIVE EXAM =====
  const answeredMC = mcAnswers.filter((a) => a !== null).length;
  const answeredSA = saAnswers.filter((a) => a.trim().length > 0).length;
  const answeredLong = longAnswers.filter((a) => a.trim().length > 0).length;
  const answeredCalc = calcAnswers.filter((a) => a.trim().length > 0).length;

  const sectionLabels = [
    `MC (${answeredMC}/10)`,
    `Short (${answeredSA}/2)`,
    `Long (${answeredLong}/${exam.long.subParts.length})`,
    `Calc (${answeredCalc}/${exam.calc.subParts.length})`,
  ];

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* Sticky nav bar */}
      <div className="sticky top-0 z-20 bg-[var(--bg)] border-b border-[var(--border-light)] -mx-6 lg:-mx-10 px-6 lg:px-10 py-2 flex items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-1 overflow-x-auto">
          {sectionLabels.map((label, i) => (
            <button
              key={i}
              onClick={() => scrollToSection(i)}
              className="px-2.5 py-1 rounded text-[10px] font-mono bg-[var(--surface)] text-[var(--text-2)] hover:text-[var(--text)] cursor-pointer whitespace-nowrap border border-[var(--border-light)] hover:border-[var(--border)]"
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-[11px] font-mono text-[var(--text-3)] flex-shrink-0">
          {formatTime(elapsed)}
        </span>
      </div>

      {/* Section 1: Multiple Choice */}
      <div ref={(el) => { sectionRefs.current[0] = el; }}>
        <h3 className="text-sm font-semibold text-[var(--text)] mb-1">Section 1: Multiple Choice</h3>
        <p className="text-[10px] text-[var(--text-3)] mb-4">10 questions &middot; 2 marks each &middot; 20 marks total</p>

        <div className="space-y-5">
          {exam.mc.map((q, qi) => (
            <div key={q.id} className="border border-[var(--border)] rounded-lg p-4">
              <p className="text-[13px] text-[var(--text)] leading-relaxed mb-2">
                <span className="font-mono text-[var(--text-3)] mr-1">{qi + 1}.</span>
                {renderMathText(q.question)}
              </p>
              {q.formula && (
                <div className="mb-2">
                  <BlockMath math={q.formula} />
                </div>
              )}
              <div className="space-y-1.5">
                {q.options.map((opt, oi) => {
                  const letter = ['A', 'B', 'C', 'D'][oi];
                  const selected = mcAnswers[qi] === oi;
                  return (
                    <label
                      key={oi}
                      className={`flex items-start gap-2 px-3 py-2 rounded cursor-pointer transition-colors text-xs ${
                        selected
                          ? 'bg-[var(--accent)] bg-opacity-10 border border-[var(--accent)]'
                          : 'hover:bg-[var(--surface)] border border-transparent'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`mc-${qi}`}
                        checked={selected}
                        onChange={() => {
                          const next = [...mcAnswers];
                          next[qi] = oi;
                          setMcAnswers(next);
                        }}
                        className="mt-0.5 accent-[var(--accent)]"
                      />
                      <span className="font-mono text-[var(--text-3)] flex-shrink-0">({letter})</span>
                      <span className={`${selected ? 'text-[var(--text)] font-medium' : 'text-[var(--text-2)]'}`}>
                        {renderMathText(opt)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Short Answers */}
      <div ref={(el) => { sectionRefs.current[1] = el; }} className="mt-10">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-1">Section 2: Short Answers</h3>
        <p className="text-[10px] text-[var(--text-3)] mb-4">2 questions &middot; 2.5 marks each &middot; 5 marks total</p>

        <div className="space-y-5">
          {exam.sa.map((q, qi) => (
            <div key={q.id} className="border border-[var(--border)] rounded-lg p-4">
              <p className="text-[13px] text-[var(--text)] leading-relaxed mb-3">
                <span className="font-mono text-[var(--text-3)] mr-1">{qi + 1}.</span>
                {renderMathText(q.question)}
                <span className="text-[var(--text-3)] text-[10px] ml-2">({q.marks} marks)</span>
              </p>
              {q.formula && (
                <div className="mb-2">
                  <BlockMath math={q.formula} />
                </div>
              )}
              <textarea
                value={saAnswers[qi]}
                onChange={(e) => {
                  const next = [...saAnswers];
                  next[qi] = e.target.value;
                  setSaAnswers(next);
                }}
                rows={4}
                placeholder="Write your answer here..."
                className="w-full text-xs border border-[var(--border)] rounded-md px-3 py-2 bg-[var(--bg)] text-[var(--text)] placeholder-[var(--text-3)] resize-y focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Long Answer */}
      <div ref={(el) => { sectionRefs.current[2] = el; }} className="mt-10">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-1">Section 3: Long Answer</h3>
        <p className="text-[10px] text-[var(--text-3)] mb-4">1 question &middot; 10 marks total</p>

        <div className="border border-[var(--border)] rounded-lg p-4">
          <p className="text-[13px] text-[var(--text)] leading-relaxed mb-4 whitespace-pre-wrap">
            {renderMathText(exam.long.scenario)}
          </p>
          <div className="space-y-4">
            {exam.long.subParts.map((sp, si) => (
              <div key={si} className="border-t border-[var(--border-light)] pt-3">
                <p className="text-[13px] text-[var(--text)] mb-2">
                  <span className="font-semibold">({sp.label})</span>{' '}
                  {renderMathText(sp.question)}
                  <span className="text-[var(--text-3)] text-[10px] ml-2">({sp.marks} marks)</span>
                </p>
                {sp.formula && <div className="mb-2"><BlockMath math={sp.formula} /></div>}
                <textarea
                  value={longAnswers[si]}
                  onChange={(e) => {
                    const next = [...longAnswers];
                    next[si] = e.target.value;
                    setLongAnswers(next);
                  }}
                  rows={5}
                  placeholder="Write your answer here..."
                  className="w-full text-xs border border-[var(--border)] rounded-md px-3 py-2 bg-[var(--bg)] text-[var(--text)] placeholder-[var(--text-3)] resize-y focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: Calculations */}
      <div ref={(el) => { sectionRefs.current[3] = el; }} className="mt-10">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-1">Section 4: Calculations</h3>
        <p className="text-[10px] text-[var(--text-3)] mb-4">1 question &middot; 10 marks total</p>

        <div className="border border-[var(--border)] rounded-lg p-4">
          <p className="text-[13px] text-[var(--text)] leading-relaxed mb-3 whitespace-pre-wrap">
            {renderMathText(exam.calc.setup)}
          </p>
          {exam.calc.setupFormulas.map((f, fi) => (
            <div key={fi} className="mb-1"><BlockMath math={f} /></div>
          ))}
          <div className="space-y-4 mt-4">
            {exam.calc.subParts.map((sp, si) => (
              <div key={si} className="border-t border-[var(--border-light)] pt-3">
                <p className="text-[13px] text-[var(--text)] mb-2">
                  <span className="font-semibold">({sp.label})</span>{' '}
                  {renderMathText(sp.question)}
                  <span className="text-[var(--text-3)] text-[10px] ml-2">({sp.marks} marks)</span>
                </p>
                <textarea
                  value={calcAnswers[si]}
                  onChange={(e) => {
                    const next = [...calcAnswers];
                    next[si] = e.target.value;
                    setCalcAnswers(next);
                  }}
                  rows={4}
                  placeholder="Show your work here..."
                  className="w-full text-xs border border-[var(--border)] rounded-md px-3 py-2 bg-[var(--bg)] text-[var(--text)] placeholder-[var(--text-3)] resize-y focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={submitExam}
          className="px-8 py-3 rounded-lg bg-[var(--text)] text-[var(--bg)] text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
        >
          Submit Exam
        </button>
      </div>
    </div>
  );
}
