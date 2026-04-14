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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-[#e5e5e5] flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="px-5 pt-5 pb-3 border-b border-[#f0f0f0]">
          <h1 className="text-sm font-semibold text-[#1a1a1a] tracking-tight leading-tight">
            BME 872
          </h1>
          <p className="text-[11px] text-[#999] mt-0.5">Biomedical Image Analysis</p>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 bg-[#f0f0f0] rounded-full h-1">
              <div
                className="h-1 rounded-full bg-[#16a34a] transition-all duration-300"
                style={{ width: `${(completed.size / chapters.length) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-[#999] font-mono">
              {completed.size}/{chapters.length}
            </span>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="px-3 pt-3 pb-1">
          {(['lectures', 'flashcards', 'mock'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setSidebarOpen(false); }}
              className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors cursor-pointer mb-0.5 ${
                tab === t
                  ? 'bg-[#f5f5f5] text-[#1a1a1a] font-medium'
                  : 'text-[#999] hover:text-[#555] hover:bg-[#fafafa]'
              }`}
            >
              {t === 'lectures' ? 'Lectures' : t === 'flashcards' ? 'Flashcards' : 'Mock Exam'}
            </button>
          ))}
        </div>

        {/* Lecture list */}
        <div className="flex-1 overflow-y-auto px-3 pt-2 pb-4">
          <p className="text-[10px] text-[#ccc] uppercase tracking-wider font-mono px-3 mb-2">
            Lectures
          </p>
          <nav className="space-y-0.5">
            {chapters.map((ch) => (
              <a
                key={ch.id}
                href={`#ch${ch.id}`}
                onClick={() => { setTab('lectures'); setSidebarOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 rounded text-xs transition-colors group ${
                  completed.has(ch.id)
                    ? 'text-[#16a34a]'
                    : 'text-[#666] hover:text-[#1a1a1a] hover:bg-[#fafafa]'
                }`}
              >
                <span className={`flex-shrink-0 w-4 h-4 rounded border text-[9px] flex items-center justify-center ${
                  completed.has(ch.id)
                    ? 'bg-[#16a34a] border-[#16a34a] text-white'
                    : 'border-[#ddd] text-transparent group-hover:border-[#bbb]'
                }`}>
                  {completed.has(ch.id) ? '\u2713' : ''}
                </span>
                <span className="font-mono text-[10px] text-[#bbb] w-5">L{ch.id}</span>
                <span className="truncate leading-tight">{ch.title}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="px-5 py-3 border-t border-[#f0f0f0] text-[10px] text-[#ccc]">
          {totalCards} flashcards total
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar (mobile only shows hamburger, desktop shows minimal bar) */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#e5e5e5] lg:hidden">
          <div className="flex items-center justify-between h-11 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-[#555] text-base cursor-pointer"
              aria-label="Open navigation"
            >
              &#9776;
            </button>
            <h1 className="text-xs font-semibold text-[#1a1a1a]">
              BME 872
            </h1>
            <span className="text-[10px] text-[#999] font-mono">
              {completed.size}/{chapters.length}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 max-w-3xl w-full mx-auto px-5 py-6">
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
      </div>
    </div>
  );
}
