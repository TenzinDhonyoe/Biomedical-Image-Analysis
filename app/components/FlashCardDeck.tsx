'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { chapters } from '../courseData';
import { useCardStats, cardKey } from './useCardStats';

type FilterMode = 'all' | 'weak';

export default function FlashCardDeck() {
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const { stats, recordResult, getWeakCards } = useCardStats();

  const allCards = useMemo(() => {
    if (selectedChapter === null) {
      return chapters.flatMap((ch) =>
        ch.flashcards.map((fc) => ({ ...fc, chapterId: ch.id }))
      );
    }
    const ch = chapters.find((c) => c.id === selectedChapter);
    return ch ? ch.flashcards.map((fc) => ({ ...fc, chapterId: ch.id })) : [];
  }, [selectedChapter]);

  const weakCardKeys = useMemo(() => {
    return new Set(getWeakCards(selectedChapter).map(([key]) => key));
  }, [getWeakCards, selectedChapter]);

  const cards = useMemo(() => {
    if (filterMode === 'weak') {
      return allCards.filter((c) => weakCardKeys.has(cardKey(c.chapterId, c.question)));
    }
    return allCards;
  }, [allCards, filterMode, weakCardKeys]);

  const [shuffled, setShuffled] = useState(false);
  const displayCards = useMemo(() => {
    if (!shuffled) return cards;
    return [...cards].sort(() => Math.random() - 0.5);
  }, [cards, shuffled]);

  // Reset index when cards change
  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [displayCards.length]);

  const next = useCallback(() => {
    if (displayCards.length === 0) return;
    setFlipped(false);
    setIndex((i) => (i + 1) % displayCards.length);
  }, [displayCards.length]);

  const prev = useCallback(() => {
    if (displayCards.length === 0) return;
    setFlipped(false);
    setIndex((i) => (i - 1 + displayCards.length) % displayCards.length);
  }, [displayCards.length]);

  const flip = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Don't capture when typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prev();
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          flip();
          break;
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [next, prev, flip]);

  if (displayCards.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-[var(--text-3)]">
          {filterMode === 'weak'
            ? 'No weak cards yet! Take a mock exam first to identify areas to review.'
            : 'No flashcards available.'}
        </p>
        {filterMode === 'weak' && (
          <button
            onClick={() => setFilterMode('all')}
            className="mt-3 text-xs text-[var(--accent)] hover:underline cursor-pointer"
          >
            Show all cards
          </button>
        )}
      </div>
    );
  }

  const card = displayCards[index];
  const key = cardKey(card.chapterId, card.question);
  const stat = stats[key];

  function markCard(correct: boolean) {
    recordResult(key, correct);
    next();
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <select
          value={selectedChapter ?? ''}
          onChange={(e) => {
            const v = e.target.value;
            setSelectedChapter(v === '' ? null : Number(v));
            setIndex(0);
            setFlipped(false);
          }}
          className="text-xs border border-[var(--border)] rounded px-2 py-1.5 text-[var(--text-2)] bg-[var(--bg)] cursor-pointer"
        >
          <option value="">All lectures ({chapters.reduce((s, c) => s + c.flashcards.length, 0)})</option>
          {chapters.map((ch) => (
            <option key={ch.id} value={ch.id}>
              L{ch.id} — {ch.title} ({ch.flashcards.length})
            </option>
          ))}
        </select>
        <button
          onClick={() => { setShuffled(!shuffled); setIndex(0); setFlipped(false); }}
          className={`text-xs px-2 py-1.5 rounded border cursor-pointer transition-colors ${
            shuffled
              ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
              : 'border-[var(--border)] text-[var(--text-3)] hover:text-[var(--text-2)]'
          }`}
        >
          Shuffle {shuffled ? 'ON' : 'OFF'}
        </button>
        <button
          onClick={() => { setFilterMode(filterMode === 'weak' ? 'all' : 'weak'); setIndex(0); setFlipped(false); }}
          className={`text-xs px-2 py-1.5 rounded border cursor-pointer transition-colors ${
            filterMode === 'weak'
              ? 'bg-[var(--red)] text-white border-[var(--red)]'
              : 'border-[var(--border)] text-[var(--text-3)] hover:text-[var(--text-2)]'
          }`}
        >
          Weak Cards {filterMode === 'weak' ? 'ON' : 'OFF'}
          {filterMode === 'all' && weakCardKeys.size > 0 && (
            <span className="ml-1 text-[var(--red)]">({weakCardKeys.size})</span>
          )}
        </button>
      </div>

      {/* Card */}
      <div
        className={`cursor-pointer perspective-1000 h-52 ${flipped ? 'flashcard-flipped' : ''}`}
        onClick={flip}
      >
        <div className="flashcard-inner relative w-full h-full">
          <div className="flashcard-front absolute inset-0 rounded-md border border-[var(--border)] bg-[var(--bg)] p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-[var(--text-3)] font-mono">
                  L{card.chapterId} &middot; Card {index + 1}/{displayCards.length}
                </p>
                {stat && (
                  <span className="text-[10px] font-mono">
                    <span className="text-[var(--green)]">{stat.correct}</span>
                    <span className="text-[var(--text-3)]">/</span>
                    <span className="text-[var(--red)]">{stat.wrong}</span>
                  </span>
                )}
              </div>
              <p className="text-[13px] text-[var(--text)] leading-relaxed">{card.question}</p>
            </div>
            <p className="text-[10px] text-[var(--text-3)] text-center">
              Space to flip &middot; &larr; &rarr; to navigate
            </p>
          </div>
          <div className="flashcard-back absolute inset-0 rounded-md border border-[#d1fae5] bg-[#f0fdf4] p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <p className="text-[10px] text-[var(--green)] font-mono mb-2">Answer</p>
              <p className="text-[12px] text-[#374151] leading-relaxed whitespace-pre-line">
                {card.answer}
              </p>
            </div>
            {/* Self-grade buttons on back of card */}
            <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => markCard(true)}
                className="flex-1 py-1.5 rounded border border-[#d1fae5] bg-white text-xs text-[var(--green)] font-medium hover:bg-[#dcfce7] cursor-pointer"
              >
                Got it
              </button>
              <button
                onClick={() => markCard(false)}
                className="flex-1 py-1.5 rounded border border-[#fecaca] bg-white text-xs text-[var(--red)] font-medium hover:bg-[#fee2e2] cursor-pointer"
              >
                Missed it
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between items-center mt-3">
        <button
          onClick={prev}
          className="text-xs text-[var(--text-3)] hover:text-[var(--text)] cursor-pointer px-2 py-1"
        >
          &larr; Prev
        </button>
        <span className="text-[11px] text-[var(--text-3)] font-mono">
          {index + 1} / {displayCards.length}
        </span>
        <button
          onClick={next}
          className="text-xs text-[var(--text-3)] hover:text-[var(--text)] cursor-pointer px-2 py-1"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
