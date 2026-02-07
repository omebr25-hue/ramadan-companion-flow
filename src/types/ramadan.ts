// Quran Types
export interface QuranPage {
  pageNumber: number;
  juzNumber: number;
  surahName: string;
  surahNumber: number;
}

export interface DailyWird {
  date: string;
  startPage: number;
  endPage: number;
  totalPages: number;
  readPages: number;
  isCompleted: boolean;
  currentPage: number;
}

export interface WirdSettings {
  type: 'pages' | 'juz' | 'khatma' | 'custom';
  dailyPages: number;
  targetJuz: number;
  startDate: string;
  energyLevel: 'low' | 'medium' | 'high';
}

// Adhkar Types
export interface Dhikr {
  id: string;
  category: DhikrCategory;
  text: string;
  translation?: string;
  count: number;
  source: string;
  hadithGrade?: 'صحيح' | 'حسن' | 'ضعيف';
}

export type DhikrCategory = 
  | 'morning'
  | 'evening'
  | 'afterPrayer'
  | 'sleep'
  | 'wakeUp'
  | 'enterHome'
  | 'leaveHome'
  | 'food'
  | 'anxiety';

export interface DhikrProgress {
  date: string;
  dhikrId: string;
  currentCount: number;
  isCompleted: boolean;
}

// Prayer Times
export interface PrayerTime {
  name: string;
  arabicName: string;
  time: string;
  icon: string;
}

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

// Worship Tracker
export interface DailyWorship {
  date: string;
  prayers: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  taraweeh: boolean;
  tahajjud: boolean;
  sadaqah: boolean;
  dailyIntention: string;
}

// Energy & Mood
export type EnergyLevel = 'low' | 'medium' | 'high';

export interface DailyStatus {
  date: string;
  energyLevel: EnergyLevel;
  mood: string;
}
