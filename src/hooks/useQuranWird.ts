import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DailyWird, WirdSettings, EnergyLevel } from '@/types/ramadan';
import { TOTAL_PAGES, RAMADAN_DAYS, calculateDailyWird, getPageInfo } from '@/data/quran';

const DEFAULT_SETTINGS: WirdSettings = {
  type: 'khatma',
  dailyPages: 20,
  targetJuz: 30,
  startDate: new Date().toISOString().split('T')[0],
  energyLevel: 'medium',
};

export function useQuranWird() {
  const [settings, setSettings] = useLocalStorage<WirdSettings>('quran-wird-settings', DEFAULT_SETTINGS);
  const [currentPage, setCurrentPage] = useLocalStorage<number>('quran-current-page', 1);
  const [completedPages, setCompletedPages] = useLocalStorage<number[]>('quran-completed-pages', []);

  // Calculate today's wird
  const getTodayWird = useCallback((): DailyWird => {
    const today = new Date().toISOString().split('T')[0];
    const startDate = new Date(settings.startDate);
    const todayDate = new Date(today);
    const daysPassed = Math.floor((todayDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(1, RAMADAN_DAYS - daysPassed);

    let targetPages = TOTAL_PAGES;
    if (settings.type === 'pages') {
      targetPages = settings.dailyPages * RAMADAN_DAYS;
    } else if (settings.type === 'juz') {
      targetPages = settings.targetJuz * 20;
    }

    const readPages = completedPages.length;
    const dailyPagesCount = calculateDailyWird(remainingDays, targetPages, readPages, settings.energyLevel);
    
    const startPage = Math.min(currentPage, TOTAL_PAGES);
    const endPage = Math.min(startPage + dailyPagesCount - 1, TOTAL_PAGES);

    return {
      date: today,
      startPage,
      endPage,
      totalPages: dailyPagesCount,
      readPages: completedPages.filter(p => p >= startPage && p <= endPage).length,
      isCompleted: completedPages.filter(p => p >= startPage && p <= endPage).length >= dailyPagesCount,
      currentPage,
    };
  }, [settings, currentPage, completedPages]);

  const markPageAsRead = useCallback((page: number) => {
    if (!completedPages.includes(page)) {
      setCompletedPages(prev => [...prev, page]);
    }
    if (page >= currentPage) {
      setCurrentPage(page + 1);
    }
  }, [completedPages, currentPage, setCompletedPages, setCurrentPage]);

  const markWirdAsComplete = useCallback(() => {
    const wird = getTodayWird();
    const pagesToMark: number[] = [];
    for (let p = wird.startPage; p <= wird.endPage; p++) {
      pagesToMark.push(p);
    }
    setCompletedPages(prev => [...new Set([...prev, ...pagesToMark])]);
    setCurrentPage(wird.endPage + 1);
  }, [getTodayWird, setCompletedPages, setCurrentPage]);

  const updateEnergyLevel = useCallback((level: EnergyLevel) => {
    setSettings(prev => ({ ...prev, energyLevel: level }));
  }, [setSettings]);

  const resetProgress = useCallback(() => {
    setCurrentPage(1);
    setCompletedPages([]);
    setSettings(prev => ({ ...prev, startDate: new Date().toISOString().split('T')[0] }));
  }, [setCurrentPage, setCompletedPages, setSettings]);

  const getProgress = useCallback(() => {
    const totalToRead = settings.type === 'khatma' ? TOTAL_PAGES : 
                        settings.type === 'juz' ? settings.targetJuz * 20 : 
                        settings.dailyPages * RAMADAN_DAYS;
    return {
      read: completedPages.length,
      total: totalToRead,
      percentage: Math.round((completedPages.length / totalToRead) * 100),
    };
  }, [completedPages, settings]);

  return {
    settings,
    setSettings,
    currentPage,
    completedPages,
    todayWird: getTodayWird(),
    markPageAsRead,
    markWirdAsComplete,
    updateEnergyLevel,
    resetProgress,
    getProgress,
    getPageInfo,
  };
}
