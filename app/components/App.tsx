'use client';

import { useState } from 'react';
import { chapters } from '../courseData';
import ChapterSection from './ChapterSection';
import QuizMode from './QuizMode';

type Tab = 'chapters' | 'quiz';

export default function App() {
  const [tab, setTab] = useState<Tab>('chapters');

  const totalCards = chapters.reduce((sum, ch) => sum + ch.flashcards.length, 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur border-b border-[#1e293b]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#38bdf8] to-[#06b6d4] bg-clip-text text-transparent">
                BME 872
              </h1>
              <p className="text-xs text-[#64748b]">
                Biomedical Image Analysis Review
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTab('chapters')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  tab === 'chapters'
                    ? 'bg-[#38bdf8] text-[#0f172a]'
                    : 'bg-[#1e293b] text-[#94a3b8] hover:text-[#e2e8f0]'
                }`}
              >
                Chapters
              </button>
              <button
                onClick={() => setTab('quiz')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  tab === 'quiz'
                    ? 'bg-[#38bdf8] text-[#0f172a]'
                    : 'bg-[#1e293b] text-[#94a3b8] hover:text-[#e2e8f0]'
                }`}
              >
                Quiz ({totalCards})
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Nav (chapters quick links) */}
      {tab === 'chapters' && (
        <nav className="sticky top-[73px] z-40 bg-[#0f172a]/90 backdrop-blur border-b border-[#1e293b] overflow-x-auto">
          <div className="max-w-4xl mx-auto px-4 py-2 flex gap-2">
            {chapters.map((ch) => (
              <a
                key={ch.id}
                href={`#ch${ch.id}`}
                className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#1e293b] hover:bg-[#334155] flex items-center justify-center text-xs text-[#94a3b8] hover:text-[#38bdf8] transition-colors font-mono"
              >
                {ch.id}
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* Main */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {tab === 'chapters' ? (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-[#1e293b] rounded-xl p-4 border border-[#334155] text-center">
                <div className="text-2xl font-bold text-[#38bdf8]">10</div>
                <div className="text-xs text-[#64748b]">Chapters</div>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-4 border border-[#334155] text-center">
                <div className="text-2xl font-bold text-[#06b6d4]">
                  {chapters.reduce((s, c) => s + c.topics.length, 0)}
                </div>
                <div className="text-xs text-[#64748b]">Topics</div>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-4 border border-[#334155] text-center">
                <div className="text-2xl font-bold text-[#22c55e]">
                  {totalCards}
                </div>
                <div className="text-xs text-[#64748b]">Flashcards</div>
              </div>
            </div>

            {chapters.map((ch) => (
              <ChapterSection key={ch.id} chapter={ch} />
            ))}
          </div>
        ) : (
          <QuizMode />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e293b] py-4 text-center text-xs text-[#475569]">
        BME 872 Exam Review -- Good luck!
      </footer>
    </div>
  );
}
