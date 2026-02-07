import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DailyWorship } from '@/types/ramadan';

interface WorshipHistory {
  [date: string]: DailyWorship;
}

const getEmptyWorship = (date: string): DailyWorship => ({
  date,
  prayers: {
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
  },
  taraweeh: false,
  tahajjud: false,
  sadaqah: false,
  dailyIntention: '',
});

export function useWorshipTracker() {
  const [worshipHistory, setWorshipHistory] = useLocalStorage<WorshipHistory>('worship-history', {});
  const today = new Date().toISOString().split('T')[0];

  const getTodayWorship = useCallback((): DailyWorship => {
    return worshipHistory[today] || getEmptyWorship(today);
  }, [worshipHistory, today]);

  const togglePrayer = useCallback((prayer: keyof DailyWorship['prayers']) => {
    setWorshipHistory(prev => {
      const current = prev[today] || getEmptyWorship(today);
      return {
        ...prev,
        [today]: {
          ...current,
          prayers: {
            ...current.prayers,
            [prayer]: !current.prayers[prayer],
          },
        },
      };
    });
  }, [setWorshipHistory, today]);

  const toggleWorship = useCallback((worship: 'taraweeh' | 'tahajjud' | 'sadaqah') => {
    setWorshipHistory(prev => {
      const current = prev[today] || getEmptyWorship(today);
      return {
        ...prev,
        [today]: {
          ...current,
          [worship]: !current[worship],
        },
      };
    });
  }, [setWorshipHistory, today]);

  const setIntention = useCallback((intention: string) => {
    setWorshipHistory(prev => {
      const current = prev[today] || getEmptyWorship(today);
      return {
        ...prev,
        [today]: {
          ...current,
          dailyIntention: intention,
        },
      };
    });
  }, [setWorshipHistory, today]);

  const getDailyProgress = useCallback(() => {
    const worship = getTodayWorship();
    const prayers = Object.values(worship.prayers).filter(Boolean).length;
    const extras = [worship.taraweeh, worship.tahajjud, worship.sadaqah].filter(Boolean).length;
    const total = 5 + 3; // 5 prayers + 3 extras
    const completed = prayers + extras;
    return {
      prayers,
      extras,
      total,
      completed,
      percentage: Math.round((completed / total) * 100),
    };
  }, [getTodayWorship]);

  return {
    todayWorship: getTodayWorship(),
    togglePrayer,
    toggleWorship,
    setIntention,
    getDailyProgress,
    worshipHistory,
  };
}
