import { useLocalStorage } from './useLocalStorage';

export interface DailyAccountability {
  date: string;
  
  // الصلوات
  prayers: {
    fajr: { prayed: boolean; onTime: boolean; inMosque: boolean };
    dhuhr: { prayed: boolean; onTime: boolean; inMosque: boolean };
    asr: { prayed: boolean; onTime: boolean; inMosque: boolean };
    maghrib: { prayed: boolean; onTime: boolean; inMosque: boolean };
    isha: { prayed: boolean; onTime: boolean; inMosque: boolean };
  };
  
  // النوافل
  sunnah: {
    fajrSunnah: boolean;
    dhuhrBefore: boolean;
    dhuhrAfter: boolean;
    asrBefore: boolean;
    maghribAfter: boolean;
    ishaAfter: boolean;
    witr: boolean;
    tahajjud: boolean;
    duha: boolean;
  };
  
  // القرآن
  quran: {
    readToday: boolean;
    pagesRead: number;
    completedWird: boolean;
    memorization: boolean;
    revision: boolean;
  };
  
  // الأذكار
  adhkar: {
    morning: boolean;
    evening: boolean;
    afterPrayer: boolean;
    sleep: boolean;
  };
  
  // الصيام
  fasting: {
    fasted: boolean;
    suhoor: boolean;
    iftar: boolean;
    avoidedHaram: boolean;
  };
  
  // الأخلاق
  character: {
    controlledAnger: boolean;
    avoidedBackbiting: boolean;
    wasPatient: boolean;
    wasKind: boolean;
    helpedOthers: boolean;
  };
  
  // الصدقة
  charity: {
    gaveSadaqah: boolean;
    amount?: number;
    type?: string;
  };
  
  // ملاحظات
  notes: string;
  gratitude: string[];
  dua: string[];
  
  // التقييم الذاتي
  selfRating: number; // 1-10
  mood: 'excellent' | 'good' | 'average' | 'low' | 'struggling';
}

const getDefaultAccountability = (date: string): DailyAccountability => ({
  date,
  prayers: {
    fajr: { prayed: false, onTime: false, inMosque: false },
    dhuhr: { prayed: false, onTime: false, inMosque: false },
    asr: { prayed: false, onTime: false, inMosque: false },
    maghrib: { prayed: false, onTime: false, inMosque: false },
    isha: { prayed: false, onTime: false, inMosque: false },
  },
  sunnah: {
    fajrSunnah: false,
    dhuhrBefore: false,
    dhuhrAfter: false,
    asrBefore: false,
    maghribAfter: false,
    ishaAfter: false,
    witr: false,
    tahajjud: false,
    duha: false,
  },
  quran: {
    readToday: false,
    pagesRead: 0,
    completedWird: false,
    memorization: false,
    revision: false,
  },
  adhkar: {
    morning: false,
    evening: false,
    afterPrayer: false,
    sleep: false,
  },
  fasting: {
    fasted: false,
    suhoor: false,
    iftar: false,
    avoidedHaram: false,
  },
  character: {
    controlledAnger: false,
    avoidedBackbiting: false,
    wasPatient: false,
    wasKind: false,
    helpedOthers: false,
  },
  charity: {
    gaveSadaqah: false,
  },
  notes: '',
  gratitude: [],
  dua: [],
  selfRating: 5,
  mood: 'average',
});

export function useAccountability() {
  const [records, setRecords] = useLocalStorage<Record<string, DailyAccountability>>(
    'accountability-records',
    {}
  );

  const getToday = () => new Date().toISOString().split('T')[0];

  const getTodayRecord = (): DailyAccountability => {
    const today = getToday();
    return records[today] || getDefaultAccountability(today);
  };

  const getRecord = (date: string): DailyAccountability => {
    return records[date] || getDefaultAccountability(date);
  };

  const updateRecord = (date: string, updates: Partial<DailyAccountability>) => {
    setRecords(prev => ({
      ...prev,
      [date]: { ...getRecord(date), ...updates },
    }));
  };

  const updatePrayer = (
    date: string,
    prayer: keyof DailyAccountability['prayers'],
    field: 'prayed' | 'onTime' | 'inMosque',
    value: boolean
  ) => {
    const record = getRecord(date);
    setRecords(prev => ({
      ...prev,
      [date]: {
        ...record,
        prayers: {
          ...record.prayers,
          [prayer]: {
            ...record.prayers[prayer],
            [field]: value,
          },
        },
      },
    }));
  };

  const updateSunnah = (date: string, field: keyof DailyAccountability['sunnah'], value: boolean) => {
    const record = getRecord(date);
    setRecords(prev => ({
      ...prev,
      [date]: {
        ...record,
        sunnah: { ...record.sunnah, [field]: value },
      },
    }));
  };

  const updateQuran = (date: string, updates: Partial<DailyAccountability['quran']>) => {
    const record = getRecord(date);
    setRecords(prev => ({
      ...prev,
      [date]: {
        ...record,
        quran: { ...record.quran, ...updates },
      },
    }));
  };

  const updateAdhkar = (date: string, field: keyof DailyAccountability['adhkar'], value: boolean) => {
    const record = getRecord(date);
    setRecords(prev => ({
      ...prev,
      [date]: {
        ...record,
        adhkar: { ...record.adhkar, [field]: value },
      },
    }));
  };

  const updateFasting = (date: string, updates: Partial<DailyAccountability['fasting']>) => {
    const record = getRecord(date);
    setRecords(prev => ({
      ...prev,
      [date]: {
        ...record,
        fasting: { ...record.fasting, ...updates },
      },
    }));
  };

  const updateCharacter = (date: string, field: keyof DailyAccountability['character'], value: boolean) => {
    const record = getRecord(date);
    setRecords(prev => ({
      ...prev,
      [date]: {
        ...record,
        character: { ...record.character, [field]: value },
      },
    }));
  };

  const updateCharity = (date: string, updates: Partial<DailyAccountability['charity']>) => {
    const record = getRecord(date);
    setRecords(prev => ({
      ...prev,
      [date]: {
        ...record,
        charity: { ...record.charity, ...updates },
      },
    }));
  };

  const addGratitude = (date: string, item: string) => {
    const record = getRecord(date);
    setRecords(prev => ({
      ...prev,
      [date]: {
        ...record,
        gratitude: [...record.gratitude, item],
      },
    }));
  };

  const addDua = (date: string, item: string) => {
    const record = getRecord(date);
    setRecords(prev => ({
      ...prev,
      [date]: {
        ...record,
        dua: [...record.dua, item],
      },
    }));
  };

  const calculateDailyScore = (date: string): number => {
    const record = getRecord(date);
    let score = 0;
    const maxScore = 100;

    // الصلوات - 40%
    const prayers = Object.values(record.prayers);
    const prayedCount = prayers.filter(p => p.prayed).length;
    const onTimeCount = prayers.filter(p => p.onTime).length;
    score += (prayedCount / 5) * 25 + (onTimeCount / 5) * 15;

    // القرآن - 20%
    if (record.quran.completedWird) score += 15;
    else if (record.quran.readToday) score += 10;
    if (record.quran.memorization) score += 3;
    if (record.quran.revision) score += 2;

    // الأذكار - 15%
    const adhkarCount = Object.values(record.adhkar).filter(Boolean).length;
    score += (adhkarCount / 4) * 15;

    // الصيام - 10%
    if (record.fasting.fasted) score += 5;
    if (record.fasting.avoidedHaram) score += 5;

    // الأخلاق - 10%
    const characterCount = Object.values(record.character).filter(Boolean).length;
    score += (characterCount / 5) * 10;

    // الصدقة - 5%
    if (record.charity.gaveSadaqah) score += 5;

    return Math.min(Math.round(score), maxScore);
  };

  const getWeeklyStats = () => {
    const today = new Date();
    const stats: { date: string; score: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      stats.push({
        date: dateStr,
        score: calculateDailyScore(dateStr),
      });
    }

    return stats;
  };

  const getMonthlyStats = () => {
    const today = new Date();
    const stats: { date: string; score: number }[] = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      stats.push({
        date: dateStr,
        score: calculateDailyScore(dateStr),
      });
    }

    return stats;
  };

  return {
    records,
    getTodayRecord,
    getRecord,
    updateRecord,
    updatePrayer,
    updateSunnah,
    updateQuran,
    updateAdhkar,
    updateFasting,
    updateCharacter,
    updateCharity,
    addGratitude,
    addDua,
    calculateDailyScore,
    getWeeklyStats,
    getMonthlyStats,
  };
}
