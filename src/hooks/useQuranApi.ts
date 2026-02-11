import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { surahs, surahTexts, getSurahFromPage, getJuzFromPage, juzNames } from '@/data/quranText';

interface CachedPage {
  ayahs: { number: number; text: string; numberInSurah: number; surahNumber: number; surahName: string }[];
  fetchedAt: number;
}

const API_BASE = 'https://api.alquran.cloud/v1';

export function useQuranApi() {
  const [cachedPages, setCachedPages] = useLocalStorage<Record<number, CachedPage>>('quran-cache', {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async (pageNumber: number): Promise<CachedPage | null> => {
    // Check cache first
    if (cachedPages[pageNumber]) {
      return cachedPages[pageNumber];
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/page/${pageNumber}/quran-uthmani`);
      if (!response.ok) throw new Error('فشل في تحميل الصفحة');
      
      const data = await response.json();
      
      if (data.code === 200 && data.data?.ayahs) {
        const pageData: CachedPage = {
          ayahs: data.data.ayahs.map((a: any) => ({
            number: a.number,
            text: a.text,
            numberInSurah: a.numberInSurah,
            surahNumber: a.surah.number,
            surahName: a.surah.name,
          })),
          fetchedAt: Date.now(),
        };

        setCachedPages(prev => ({ ...prev, [pageNumber]: pageData }));
        return pageData;
      }
      throw new Error('بيانات غير صالحة');
    } catch (err: any) {
      setError(err.message || 'خطأ في التحميل');
      
      // Fallback to local data
      const surah = getSurahFromPage(pageNumber);
      if (surah && surahTexts[surah.number]) {
        return {
          ayahs: surahTexts[surah.number].map((text, i) => ({
            number: i,
            text,
            numberInSurah: i,
            surahNumber: surah.number,
            surahName: surah.name,
          })),
          fetchedAt: Date.now(),
        };
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [cachedPages, setCachedPages]);

  const fetchSurah = useCallback(async (surahNumber: number): Promise<CachedPage | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/surah/${surahNumber}/quran-uthmani`);
      if (!response.ok) throw new Error('فشل في تحميل السورة');
      
      const data = await response.json();
      
      if (data.code === 200 && data.data?.ayahs) {
        const pageData: CachedPage = {
          ayahs: data.data.ayahs.map((a: any) => ({
            number: a.number,
            text: a.text,
            numberInSurah: a.numberInSurah,
            surahNumber: a.surah.number,
            surahName: a.surah.name,
          })),
          fetchedAt: Date.now(),
        };
        return pageData;
      }
      throw new Error('بيانات غير صالحة');
    } catch (err: any) {
      setError(err.message || 'خطأ في التحميل');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Prefetch adjacent pages
  const prefetchPages = useCallback(async (currentPage: number) => {
    const pagesToFetch = [currentPage - 1, currentPage + 1].filter(
      p => p >= 1 && p <= 604 && !cachedPages[p]
    );
    pagesToFetch.forEach(p => fetchPage(p));
  }, [cachedPages, fetchPage]);

  const getCachedPageCount = useCallback(() => {
    return Object.keys(cachedPages).length;
  }, [cachedPages]);

  const clearCache = useCallback(() => {
    setCachedPages({});
  }, [setCachedPages]);

  return {
    fetchPage,
    fetchSurah,
    prefetchPages,
    loading,
    error,
    getCachedPageCount,
    clearCache,
    surahs,
    getSurahFromPage,
    getJuzFromPage,
    juzNames,
  };
}
