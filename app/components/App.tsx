'use client';

import { useState, useEffect } from 'react';
import { chapters } from '../courseData';
import ChapterSection from './ChapterSection';
import QuizMode from './QuizMode';
import FlashCardDeck from './FlashCardDeck';

type Tab = 'lectures' | 'flashcards' | 'mock';

export default function App() {
  const [tab, setTab] = useState<Tab>('lectures');
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('bme872-completed');
    if (saved) setCompleted(new Set(JSON.parse(saved)));
  }, []);

  function toggleComplete(id: number) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem('bme872-completed', JSON.stringify([...next]));
      return next;
    });
  }

  const totalCards = chapters.reduce((s, c) => s + c.flashcards.length, 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#e5e5e5]">
        <div className="max-w-2xl mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between h-12">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden text-[#555] text-lg cursor-pointer px-1"
              aria-label="Toggle navigation"
            >
              {menuOpen ? '\u2715' : '\u2630'}
            </button>
            <h1 className="text-sm font-semibold text-[#1a1a1a] tracking-tight">
              BME 872
              <span className="hidden sm:inline font-normal text-[#999]">
                {' '}Biomedical Image Analysis
              </span>
            </h1>
            <span className="text-xs text-[#999] font-mono">
              {completed.size}/{chapters.length}
            </span>
          </div>

          {/* Lecture nav - desktop always, mobile when menu open */}
          <div className={`${menuOpen ? 'flex' : 'hidden'} sm:flex overflow-x-auto gap-0.5 pb-2 -mx-1`}>
            {chapters.map((ch) => (
              <a
                key={ch.id}
                href={`#ch${ch.id}`}
                onClick={() => { setTab('lectures'); setMenuOpen(false); }}
                className={`flex-shrink-0 px-2 py-0.5 rounded text-xs transition-colors whitespace-nowrap ${
                  completed.has(ch.id)
                    ? 'text-[#16a34a]'
                    : 'text-[#999] hover:text-[#1a1a1a]'
                }`}
              >
                L{ch.id}{completed.has(ch.id) ? ' \u2713' : ''}
              </a>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex border-t border-[#f0f0f0]">
            {(['lectures', 'flashcards', 'mock'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer ${
                  tab === t
                    ? 'text-[#1a1a1a] border-b-2 border-[#1a1a1a]'
                    : 'text-[#999] hover:text-[#555]'
                }`}
              >
                {t === 'lectures' ? 'Lectures' : t === 'flashcards' ? `Flashcards` : 'Mock Exam'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {tab === 'lectures' && (
          <div>
            <p className="text-xs text-[#999] mb-5">
              {chapters.length} lectures · {chapters.reduce((s, c) => s + c.topics.length, 0)} topics · {totalCards} review cards
            </p>
            <div className="divide-y divide-[#f0f0f0]">
              {chapters.map((ch) => (
                <ChapterSection
                  key={ch.id}
                  chapter={ch}
                  isCompleted={completed.has(ch.id)}
                  onToggleComplete={() => toggleComplete(ch.id)}
                />
              ))}
            </div>
          </div>
        )}
        {tab === 'flashcards' && <FlashCardDeck />}
        {tab === 'mock' && <QuizMode />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#f0f0f0] py-3 text-center text-[11px] text-[#ccc]">
        BME 872 Exam Review
      </footer>
    </div>
  );
}
