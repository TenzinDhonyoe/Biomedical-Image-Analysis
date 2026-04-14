'use client';

import { useState } from 'react';
import { chapters } from '../courseData';
import ChapterSection from './ChapterSection';
import QuizMode from './QuizMode';

type Tab = 'chapters' | 'quiz';

export default function App() {
  const [tab, setTab] = useState<Tab>('chapters');

  const totalCards = chapters.reduce((s, c) => s + c.flashcards.length, 0);
  const totalTopics = chapters.reduce((s, c) => s + c.topics.length, 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#e5e7eb]">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[#111827] tracking-tight">
            BME 872 <span className="hidden sm:inline font-normal text-[#6b7280]">— Biomedical Image Analysis Course Review</span>
          </h1>
          <div className="flex gap-1">
            <button
              onClick={() => setTab('chapters')}
              className={`px-3 py-1.5 rounded text-sm transition-colors cursor-pointer ${
                tab === 'chapters'
                  ? 'bg-[#111827] text-white'
                  : 'text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6]'
              }`}
            >
              Lectures
            </button>
            <button
              onClick={() => setTab('quiz')}
              className={`px-3 py-1.5 rounded text-sm transition-colors cursor-pointer ${
                tab === 'quiz'
                  ? 'bg-[#111827] text-white'
                  : 'text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6]'
              }`}
            >
              Quiz
            </button>
          </div>
        </div>
      </header>

      {/* Lecture nav pills */}
      {tab === 'chapters' && (
        <nav className="sticky top-[57px] z-40 bg-white/95 backdrop-blur-sm border-b border-[#e5e7eb] overflow-x-auto">
          <div className="max-w-3xl mx-auto px-5 py-2 flex gap-1.5">
            {chapters.map((ch) => (
              <a
                key={ch.id}
                href={`#ch${ch.id}`}
                className="flex-shrink-0 px-2.5 py-1 rounded text-xs text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] transition-colors font-mono"
              >
                L{ch.id}
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* Main */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-5 py-8">
        {tab === 'chapters' ? (
          <div>
            {/* Summary line */}
            <p className="text-sm text-[#9ca3af] mb-8">
              {chapters.length} lectures · {totalTopics} topics · {totalCards} flashcards
            </p>

            <div className="space-y-3">
              {chapters.map((ch) => (
                <ChapterSection key={ch.id} chapter={ch} />
              ))}
            </div>
          </div>
        ) : (
          <QuizMode />
        )}
      </main>
    </div>
  );
}
