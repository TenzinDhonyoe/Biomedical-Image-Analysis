'use client';

import { useState, useMemo } from 'react';
import { chapters } from '../courseData';

export default function FlashCardDeck() {
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = useMemo(() => {
    if (selectedChapter === null) {
      return chapters.flatMap((ch) =>
        ch.flashcards.map((fc) => ({ ...fc, chapterId: ch.id }))
      );
    }
    const ch = chapters.find((c) => c.id === selectedChapter);
    return ch ? ch.flashcards.map((fc) => ({ ...fc, chapterId: ch.id })) : [];
  }, [selectedChapter]);

  const [shuffled, setShuffled] = useState(false);
  const displayCards = useMemo(() => {
    if (!shuffled) return cards;
    return [...cards].sort(() => Math.random() - 0.5);
  }, [cards, shuffled]);

  function next() {
    setFlipped(false);
    setIndex((i) => (i + 1) % displayCards.length);
  }
  function prev() {
    setFlipped(false);
    setIndex((i) => (i - 1 + displayCards.length) % displayCards.length);
  }

  if (displayCards.length === 0) {
    return <p className="text-sm text-[#999] py-8 text-center">No flashcards available.</p>;
  }

  const card = displayCards[index];

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
          className="text-xs border border-[#e5e5e5] rounded px-2 py-1.5 text-[#555] bg-white cursor-pointer"
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
              ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
              : 'border-[#e5e5e5] text-[#999] hover:text-[#555]'
          }`}
        >
          Shuffle {shuffled ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Card */}
      <div
        className={`cursor-pointer perspective-1000 h-48 ${flipped ? 'flashcard-flipped' : ''}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="flashcard-inner relative w-full h-full">
          <div className="flashcard-front absolute inset-0 rounded-md border border-[#e5e5e5] bg-white p-5 flex flex-col justify-between">
            <div>
              <p className="text-[10px] text-[#ccc] font-mono mb-2">
                L{card.chapterId} · Card {index + 1}/{displayCards.length} · tap to flip
              </p>
              <p className="text-[13px] text-[#1a1a1a] leading-relaxed">{card.question}</p>
            </div>
          </div>
          <div className="flashcard-back absolute inset-0 rounded-md border border-[#d1fae5] bg-[#f0fdf4] p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <p className="text-[10px] text-[#16a34a] font-mono mb-2">Answer</p>
              <p className="text-[12px] text-[#374151] leading-relaxed whitespace-pre-line">
                {card.answer}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between items-center mt-3">
        <button
          onClick={prev}
          className="text-xs text-[#999] hover:text-[#1a1a1a] cursor-pointer px-2 py-1"
        >
          &larr; Prev
        </button>
        <span className="text-[11px] text-[#ccc] font-mono">
          {index + 1} / {displayCards.length}
        </span>
        <button
          onClick={next}
          className="text-xs text-[#999] hover:text-[#1a1a1a] cursor-pointer px-2 py-1"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
