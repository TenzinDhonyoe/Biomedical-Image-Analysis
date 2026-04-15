'use client';

import { useState, useEffect, useCallback } from 'react';
import { chapters } from '../courseData';
import LectureView from './LectureView';
import QuizMode from './QuizMode';
import FlashCardDeck from './FlashCardDeck';
import FormulaSheet from './FormulaSheet';
import SearchBar from './SearchBar';
import { useCardStats } from './useCardStats';

type Tab = 'lectures' | 'flashcards' | 'mock' | 'formulas';

export default function App() {
  const [tab, setTab] = useState<Tab>('lectures');
  const [selectedLecture, setSelectedLecture] = useState(1);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { weakCountByChapter } = useCardStats();

  useEffect(() => {
    const saved = localStorage.getItem('bme872-completed');
    if (saved) setCompleted(new Set(JSON.parse(saved)));
    const savedDark = localStorage.getItem('bme872-dark');
    if (savedDark === '1') setDark(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('bme872-dark', dark ? '1' : '0');
  }, [dark]);

  function toggleComplete(id: number) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem('bme872-completed', JSON.stringify([...next]));
      return next;
    });
  }

  const handleSearchNavigate = useCallback((chapterId: number) => {
    setTab('lectures');
    setSelectedLecture(chapterId);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  function selectLecture(id: number) {
    setSelectedLecture(id);
    setTab('lectures');
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const totalCards = chapters.reduce((s, c) => s + c.flashcards.length, 0);
  const currentChapter = chapters.find((c) => c.id === selectedLecture) || chapters[0];

  const tabLabels: Record<Tab, string> = {
    lectures: 'Lectures',
    flashcards: 'Flashcards',
    formulas: 'Formulas',
    mock: 'Mock Exam',
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[var(--bg)] border-r border-[var(--border)] flex flex-col transition-transform duration-200 lg:translate-x-0 lg:sticky lg:z-auto lg:h-screen lg:top-0 lg:flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="px-5 pt-5 pb-3 border-b border-[var(--border-light)]">
          <h1 className="text-sm font-semibold text-[var(--text)] tracking-tight leading-tight">
            BME 872
          </h1>
          <p className="text-[11px] text-[var(--text-3)] mt-0.5">Biomedical Image Analysis</p>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 bg-[var(--border-light)] rounded-full h-1">
              <div
                className="h-1 rounded-full bg-[var(--green)] transition-all duration-300"
                style={{ width: `${(completed.size / chapters.length) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-[var(--text-3)] font-mono">
              {completed.size}/{chapters.length}
            </span>
          </div>
        </div>

        {/* Lecture list */}
        <div className="flex-1 overflow-y-auto px-3 pt-3 pb-4">
          <nav className="space-y-0.5">
            {chapters.map((ch) => {
              const weakCount = weakCountByChapter(ch.id);
              const isActive = tab === 'lectures' && selectedLecture === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => selectLecture(ch.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-xs transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'sidebar-active'
                      : completed.has(ch.id)
                        ? 'text-[var(--green)]'
                        : 'text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface)]'
                  }`}
                >
                  <span className={`flex-shrink-0 w-6 h-6 rounded-md text-[10px] font-mono font-semibold flex items-center justify-center ${
                    isActive
                      ? 'bg-[var(--accent)] text-white'
                      : completed.has(ch.id)
                        ? 'bg-[var(--green)] text-white'
                        : 'bg-[var(--surface)] text-[var(--text-3)] border border-[var(--border)]'
                  }`}>
                    L{ch.id}
                  </span>
                  <span className="truncate leading-tight flex-1">{ch.title}</span>
                  {completed.has(ch.id) && !isActive && (
                    <span className="text-[var(--green)] text-[11px]">{'\u2713'}</span>
                  )}
                  {weakCount > 0 && (
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[var(--red)]" title={`${weakCount} weak card${weakCount !== 1 ? 's' : ''}`} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mode links */}
          <div className="mt-4 pt-4 border-t border-[var(--border-light)] space-y-0.5">
            {(['flashcards', 'formulas', 'mock'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors cursor-pointer text-left ${
                  tab === t
                    ? 'sidebar-active'
                    : 'text-[var(--text-3)] hover:text-[var(--text-2)] hover:bg-[var(--surface)]'
                }`}
              >
                <span className="w-6 text-center text-[13px]">
                  {t === 'flashcards' ? '\uD83C\uDCCF' : t === 'formulas' ? '\u0192' : '\uD83C\uDFAF'}
                </span>
                {tabLabels[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar footer */}
        <div className="px-5 py-3 border-t border-[var(--border-light)] flex items-center justify-between">
          <span className="text-[10px] text-[var(--text-3)]">
            {totalCards} flashcards
          </span>
          <button
            onClick={() => setDark(!dark)}
            className="text-sm cursor-pointer hover:opacity-70 transition-opacity"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? '\u2600\uFE0F' : '\uD83C\uDF19'}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar (mobile only) */}
        <header className="sticky top-0 z-30 bg-[var(--bg)] border-b border-[var(--border)] lg:hidden">
          <div className="flex items-center justify-between h-11 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-[var(--text-2)] text-base cursor-pointer"
              aria-label="Open navigation"
            >
              &#9776;
            </button>
            <h1 className="text-xs font-semibold text-[var(--text)]">
              BME 872
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDark(!dark)}
                className="text-sm cursor-pointer"
              >
                {dark ? '\u2600\uFE0F' : '\uD83C\uDF19'}
              </button>
              <span className="text-[10px] text-[var(--text-3)] font-mono">
                {completed.size}/{chapters.length}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 w-full mx-auto px-6 lg:px-10 py-6 max-w-5xl">
          {/* Search bar */}
          <SearchBar onNavigate={handleSearchNavigate} />

          {tab === 'lectures' && (
            <LectureView
              key={currentChapter.id}
              chapter={currentChapter}
              isCompleted={completed.has(currentChapter.id)}
              onToggleComplete={() => toggleComplete(currentChapter.id)}
            />
          )}
          {tab === 'flashcards' && <FlashCardDeck />}
          {tab === 'formulas' && <FormulaSheet />}
          {tab === 'mock' && <QuizMode />}
        </main>

        {/* Lecture navigation footer */}
        {tab === 'lectures' && (
          <div className="border-t border-[var(--border-light)] px-6 lg:px-10 py-4 max-w-5xl mx-auto w-full">
            <div className="flex justify-between items-center">
              <button
                onClick={() => { if (selectedLecture > 1) selectLecture(selectedLecture - 1); }}
                disabled={selectedLecture <= 1}
                className={`text-xs px-3 py-1.5 rounded border cursor-pointer transition-colors ${
                  selectedLecture <= 1
                    ? 'border-[var(--border-light)] text-[var(--text-3)] cursor-not-allowed opacity-40'
                    : 'border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface)]'
                }`}
              >
                &larr; L{selectedLecture - 1}: {chapters.find((c) => c.id === selectedLecture - 1)?.title || 'Prev'}
              </button>
              <button
                onClick={() => { if (selectedLecture < chapters.length) selectLecture(selectedLecture + 1); }}
                disabled={selectedLecture >= chapters.length}
                className={`text-xs px-3 py-1.5 rounded border cursor-pointer transition-colors ${
                  selectedLecture >= chapters.length
                    ? 'border-[var(--border-light)] text-[var(--text-3)] cursor-not-allowed opacity-40'
                    : 'border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface)]'
                }`}
              >
                L{selectedLecture + 1}: {chapters.find((c) => c.id === selectedLecture + 1)?.title || 'Next'} &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
