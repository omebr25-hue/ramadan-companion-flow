import { useMemo } from 'react';

export type AppMode = 'ramadan' | 'islamic';

// Approximate Hijri month detection
// Ramadan 1446 ≈ March 1 - March 30, 2025
// Shawwal 1446 starts ≈ March 31, 2025
function isRamadan(): boolean {
  const now = new Date();
  const year = now.getFullYear();
  
  // Approximate Ramadan dates for common years
  // In production, use a proper Hijri calendar library
  const ramadanRanges: Record<number, [Date, Date]> = {
    2025: [new Date(2025, 1, 28), new Date(2025, 2, 30)], // Feb 28 - Mar 30
    2026: [new Date(2026, 1, 17), new Date(2026, 2, 19)], // Feb 17 - Mar 19
    2027: [new Date(2027, 1, 7), new Date(2027, 2, 8)],
  };
  
  const range = ramadanRanges[year];
  if (range) {
    return now >= range[0] && now <= range[1];
  }
  
  return false; // Default to Islamic mode outside known ranges
}

export function useAppMode(): { mode: AppMode; appName: string; greeting: string } {
  return useMemo(() => {
    const ramadan = isRamadan();
    return {
      mode: ramadan ? 'ramadan' : 'islamic',
      appName: ramadan ? 'المرافق الرمضاني' : 'المرافق الإسلامي',
      greeting: ramadan ? 'رمضان كريم' : 'السلام عليكم',
    };
  }, []);
}
