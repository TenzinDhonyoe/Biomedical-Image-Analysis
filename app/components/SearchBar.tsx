'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { chapters } from '../courseData';

function KbdShortcut() {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(/Mac/.test(navigator.userAgent));
  }, []);
  return <>{isMac ? '\u2318' : 'Ctrl+'}K</>;
}

interface SearchResult {
  type: 'topic' | 'flashcard' | 'formula';
  chapterId: number;
  chapterTitle: string;
  title: string;
  snippet: string;
  topicIndex?: number;
}

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = [];
  for (const ch of chapters) {
    for (let ti = 0; ti < ch.topics.length; ti++) {
      const topic = ch.topics[ti];
      results.push({
        type: 'topic',
        chapterId: ch.id,
        chapterTitle: ch.title,
        title: topic.title,
        snippet: topic.content.slice(0, 120),
        topicIndex: ti,
      });
      if (topic.examTip) {
        results.push({
          type: 'topic',
          chapterId: ch.id,
          chapterTitle: ch.title,
          title: `${topic.title} (Exam Tip)`,
          snippet: topic.examTip.slice(0, 120),
          topicIndex: ti,
        });
      }
      if (topic.formulas) {
        for (const f of topic.formulas) {
          results.push({
            type: 'formula',
            chapterId: ch.id,
            chapterTitle: ch.title,
            title: topic.title,
            snippet: f,
            topicIndex: ti,
          });
        }
      }
    }
    for (const fc of ch.flashcards) {
      results.push({
        type: 'flashcard',
        chapterId: ch.id,
        chapterTitle: ch.title,
        title: fc.question.slice(0, 80),
        snippet: fc.answer.slice(0, 100),
      });
    }
  }
  return results;
}

export default function SearchBar({
  onNavigate,
}: {
  onNavigate: (chapterId: number, topicIndex?: number) => void;
}) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const index = useMemo(() => buildIndex(), []);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    return index
      .filter((r) => {
        const text = `${r.title} ${r.snippet} ${r.chapterTitle}`.toLowerCase();
        return terms.every((t) => text.includes(t));
      })
      .slice(0, 12);
  }, [query, index]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setFocused(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  function handleSelect(r: SearchResult) {
    setQuery('');
    setFocused(false);
    onNavigate(r.chapterId, r.topicIndex);
  }

  const typeLabel = (t: string) =>
    t === 'topic' ? 'Topic' : t === 'flashcard' ? 'Card' : 'Formula';
  const typeColor = (t: string) =>
    t === 'topic'
      ? 'bg-blue-50 text-blue-600'
      : t === 'flashcard'
        ? 'bg-green-50 text-green-600'
        : 'bg-purple-50 text-purple-600';

  return (
    <div ref={containerRef} className="relative mb-5">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search topics, formulas, flashcards..."
          className="w-full text-[13px] pl-8 pr-16 py-2 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-3)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-3)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-3)] border border-[var(--border)] rounded px-1.5 py-0.5 font-mono hidden sm:inline">
          <KbdShortcut />
        </kbd>
      </div>

      {/* Results dropdown */}
      {focused && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => handleSelect(r)}
              className="w-full text-left px-3 py-2.5 hover:bg-[var(--surface)] transition-colors cursor-pointer border-b border-[var(--border-light)] last:border-b-0 flex items-start gap-2"
            >
              <span
                className={`flex-shrink-0 text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ${typeColor(r.type)}`}
              >
                {typeLabel(r.type)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium text-[var(--text)] truncate">{r.title}</p>
                <p className="text-[11px] text-[var(--text-3)] truncate">
                  L{r.chapterId} &middot; {r.snippet}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {focused && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-md shadow-lg z-50 px-3 py-4 text-center">
          <p className="text-[12px] text-[var(--text-3)]">No results for &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
