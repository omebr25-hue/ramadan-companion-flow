import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface TasbeehSession {
  count: number;
  target: number;
  dhikr: string;
  startedAt: string;
}

const defaultDhikrs = [
  'سُبْحَانَ اللهِ',
  'الْحَمْدُ لِلَّهِ',
  'اللهُ أَكْبَرُ',
  'لَا إِلَهَ إِلَّا اللهُ',
  'أَسْتَغْفِرُ اللهَ',
  'سُبْحَانَ اللهِ وَبِحَمْدِهِ',
  'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ',
];

const defaultTargets = [33, 100, 1000];

export function useTasbeeh() {
  const [session, setSession] = useLocalStorage<TasbeehSession | null>('tasbeeh-session', null);
  const [savedDhikrs] = useLocalStorage<string[]>('tasbeeh-saved-dhikrs', defaultDhikrs);
  const [totalCounts, setTotalCounts] = useLocalStorage<number>('tasbeeh-total-counts', 0);

  const startSession = useCallback((dhikr: string, target: number = 33) => {
    setSession({
      count: 0,
      target,
      dhikr,
      startedAt: new Date().toISOString(),
    });
  }, [setSession]);

  const increment = useCallback(() => {
    if (!session) return;

    setSession(prev => {
      if (!prev) return prev;
      return { ...prev, count: prev.count + 1 };
    });
    setTotalCounts(prev => prev + 1);
  }, [session, setSession, setTotalCounts]);

  const reset = useCallback(() => {
    if (!session) return;
    setSession(prev => {
      if (!prev) return prev;
      return { ...prev, count: 0 };
    });
  }, [session, setSession]);

  const endSession = useCallback(() => {
    setSession(null);
  }, [setSession]);

  const isComplete = session ? session.count >= session.target : false;

  return {
    session,
    savedDhikrs,
    defaultTargets,
    totalCounts,
    startSession,
    increment,
    reset,
    endSession,
    isComplete,
  };
}
