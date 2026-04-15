'use client';

import { useState, useCallback, useEffect } from 'react';

export interface CardStat {
  correct: number;
  wrong: number;
  lastSeen: string; // ISO date
}

type StatsMap = Record<string, CardStat>;

const STORAGE_KEY = 'bme872-card-stats';

function loadStats(): StatsMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStats(stats: StatsMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

/** Generate a stable key for a flashcard based on chapter + question text */
export function cardKey(chapterId: number, question: string): string {
  return `${chapterId}::${question.slice(0, 60)}`;
}

export function useCardStats() {
  const [stats, setStats] = useState<StatsMap>({});

  useEffect(() => {
    setStats(loadStats());
  }, []);

  const recordResult = useCallback((key: string, correct: boolean) => {
    setStats((prev) => {
      const existing = prev[key] || { correct: 0, wrong: 0, lastSeen: '' };
      const next: StatsMap = {
        ...prev,
        [key]: {
          correct: existing.correct + (correct ? 1 : 0),
          wrong: existing.wrong + (correct ? 0 : 1),
          lastSeen: new Date().toISOString(),
        },
      };
      saveStats(next);
      return next;
    });
  }, []);

  const getWeakCards = useCallback(
    (chapterId?: number | null) => {
      return Object.entries(stats).filter(([key, stat]) => {
        if (chapterId != null && !key.startsWith(`${chapterId}::`)) return false;
        const total = stat.correct + stat.wrong;
        if (total < 1) return false;
        return stat.wrong / total > 0.4; // 40%+ wrong rate = weak
      });
    },
    [stats]
  );

  const getStatForCard = useCallback(
    (key: string): CardStat | undefined => stats[key],
    [stats]
  );

  const weakCountByChapter = useCallback(
    (chapterId: number): number => {
      return getWeakCards(chapterId).length;
    },
    [getWeakCards]
  );

  return { stats, recordResult, getWeakCards, getStatForCard, weakCountByChapter };
}
