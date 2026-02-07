import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Dhikr, DhikrProgress, DhikrCategory } from '@/types/ramadan';
import { allAdhkar, adhkarCategories } from '@/data/adhkar';

interface AdhkarState {
  [date: string]: {
    [dhikrId: string]: DhikrProgress;
  };
}

export function useAdhkar() {
  const [adhkarProgress, setAdhkarProgress] = useLocalStorage<AdhkarState>('adhkar-progress', {});
  const today = new Date().toISOString().split('T')[0];

  const getAdhkarByCategory = useCallback((category: DhikrCategory): Dhikr[] => {
    return allAdhkar[category as keyof typeof allAdhkar] || [];
  }, []);

  const getDhikrProgress = useCallback((dhikrId: string): DhikrProgress | null => {
    return adhkarProgress[today]?.[dhikrId] || null;
  }, [adhkarProgress, today]);

  const incrementDhikr = useCallback((dhikr: Dhikr) => {
    setAdhkarProgress(prev => {
      const todayProgress = prev[today] || {};
      const currentProgress = todayProgress[dhikr.id] || {
        date: today,
        dhikrId: dhikr.id,
        currentCount: 0,
        isCompleted: false,
      };

      const newCount = Math.min(currentProgress.currentCount + 1, dhikr.count);
      const isCompleted = newCount >= dhikr.count;

      return {
        ...prev,
        [today]: {
          ...todayProgress,
          [dhikr.id]: {
            ...currentProgress,
            currentCount: newCount,
            isCompleted,
          },
        },
      };
    });
  }, [setAdhkarProgress, today]);

  const resetDhikr = useCallback((dhikrId: string) => {
    setAdhkarProgress(prev => {
      const todayProgress = prev[today] || {};
      return {
        ...prev,
        [today]: {
          ...todayProgress,
          [dhikrId]: {
            date: today,
            dhikrId,
            currentCount: 0,
            isCompleted: false,
          },
        },
      };
    });
  }, [setAdhkarProgress, today]);

  const getCategoryProgress = useCallback((category: DhikrCategory) => {
    const categoryAdhkar = getAdhkarByCategory(category);
    const completed = categoryAdhkar.filter(d => getDhikrProgress(d.id)?.isCompleted).length;
    return {
      completed,
      total: categoryAdhkar.length,
      percentage: categoryAdhkar.length > 0 ? Math.round((completed / categoryAdhkar.length) * 100) : 0,
    };
  }, [getAdhkarByCategory, getDhikrProgress]);

  const getTotalDailyProgress = useCallback(() => {
    let totalCompleted = 0;
    let totalAdhkar = 0;
    
    Object.keys(allAdhkar).forEach(category => {
      const progress = getCategoryProgress(category as DhikrCategory);
      totalCompleted += progress.completed;
      totalAdhkar += progress.total;
    });

    return {
      completed: totalCompleted,
      total: totalAdhkar,
      percentage: totalAdhkar > 0 ? Math.round((totalCompleted / totalAdhkar) * 100) : 0,
    };
  }, [getCategoryProgress]);

  return {
    adhkarCategories,
    getAdhkarByCategory,
    getDhikrProgress,
    incrementDhikr,
    resetDhikr,
    getCategoryProgress,
    getTotalDailyProgress,
  };
}
