import { useMemo } from 'react';

export type AppMode = 'ramadan' | 'islamic';

function isRamadan(): boolean {
  const now = new Date();
  const year = now.getFullYear();
  
  const ramadanRanges: Record<number, [Date, Date]> = {
    2025: [new Date(2025, 1, 28), new Date(2025, 2, 30)],
    2026: [new Date(2026, 1, 17), new Date(2026, 2, 19)],
    2027: [new Date(2027, 1, 7), new Date(2027, 2, 8)],
  };
  
  const range = ramadanRanges[year];
  if (range) {
    return now >= range[0] && now <= range[1];
  }
  
  return false;
}

export function useAppMode(): { mode: AppMode; appName: string; greeting: string } {
  return useMemo(() => {
    const ramadan = isRamadan();
    return {
      mode: ramadan ? 'ramadan' : 'islamic',
      appName: 'رفيق المسلم',
      greeting: ramadan ? 'رمضان كريم' : 'السلام عليكم',
    };
  }, []);
}
